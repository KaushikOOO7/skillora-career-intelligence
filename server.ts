import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const PORT = 3000;
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Skillora Career Intelligence API',
      timestamp: new Date().toISOString()
    });
  });

  // Server-side AI endpoint for Skill Extraction
  app.post('/api/gemini/extract-skills', async (req: Request, res: Response) => {
    try {
      const { text, jobTitles } = req.body;
      const ai = getAiClient();

      if (!ai) {
        return res.json({
          source: 'local_rule_engine',
          skills: ['Python', 'Java', 'TypeScript', 'C++', 'SQL', 'AWS', 'Docker', 'System Design']
        });
      }

      const prompt = `Analyze the following job descriptions / tech roles and extract a clean deduplicated JSON list of exact technical skills, frameworks, databases, and required competencies.
Roles/Text:
${text || (jobTitles || []).join(', ')}

Return ONLY a valid JSON array of strings without markdown fences or code blocks. Example: ["TypeScript", "React", "PostgreSQL", "System Design"]`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const responseText = response.text || '';
      const cleanJson = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const skills = JSON.parse(cleanJson);
      res.json({ source: 'gemini-2.5-flash', skills });
    } catch (error: any) {
      console.warn('Fallback on skill extraction:', error?.message);
      res.json({
        source: 'local_rule_engine',
        skills: ['Python', 'TypeScript', 'React', 'Node.js', 'SQL', 'Git', 'System Design']
      });
    }
  });

  // Server-side AI endpoint for Career Requirement Coverage analysis
  app.post('/api/gemini/coverage', async (req: Request, res: Response) => {
    try {
      const { userSkills, targetRole, requiredSkills } = req.body;
      const ai = getAiClient();

      if (!ai) {
        // Deterministic matching calculation
        const userSet = new Set((userSkills || []).map((s: string) => s.toLowerCase()));
        const reqList: string[] = requiredSkills || ['Data Structures & Algorithms', 'System Design', 'TypeScript', 'SQL'];
        const matched = reqList.filter((s: string) => userSet.has(s.toLowerCase()));
        const missing = reqList.filter((s: string) => !userSet.has(s.toLowerCase()));
        const score = Math.round((matched.length / Math.max(reqList.length, 1)) * 100);

        return res.json({
          matchScore: score,
          matched,
          missing,
          recommendation: `Strengthen hands-on projects in ${missing.slice(0, 2).join(' and ')} to improve hiring alignment for ${targetRole || 'your target role'}.`
        });
      }

      const prompt = `Analyze a candidate's readiness for the target role: "${targetRole || 'Software Engineer'}".
Candidate skills: ${(userSkills || []).join(', ')}
Company required skills: ${(requiredSkills || []).join(', ')}

Return a JSON object with:
- matchScore (number between 0 and 100)
- matched (array of skill names candidate has)
- missing (array of skill names candidate should learn)
- recommendation (one clear actionable sentence)

Output ONLY valid JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const responseText = response.text || '';
      const cleanJson = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const analysis = JSON.parse(cleanJson);
      res.json(analysis);
    } catch (error: any) {
      const userSet = new Set(((req.body.userSkills as string[]) || []).map((s: string) => s.toLowerCase()));
      const reqList: string[] = (req.body.requiredSkills as string[]) || ['Data Structures & Algorithms', 'System Design'];
      const matched = reqList.filter((s) => userSet.has(s.toLowerCase()));
      const missing = reqList.filter((s) => !userSet.has(s.toLowerCase()));
      const score = Math.round((matched.length / Math.max(reqList.length, 1)) * 100);

      res.json({
        matchScore: score,
        matched,
        missing,
        recommendation: `Prioritize deep-dive implementations in ${missing.slice(0, 2).join(', ')}.`
      });
    }
  });

  // Vite middleware in dev or static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Skillora server running on http://localhost:${PORT}`);
  });
}

startServer();
