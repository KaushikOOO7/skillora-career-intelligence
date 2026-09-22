import { Opportunity, SkillStat, CommonRequirement } from '../types';

export interface OpportunityProvider {
  name: string;
  isLive: boolean;
  getOpportunities(companyId?: string, companyName?: string): Promise<Opportunity[]>;
  searchOpportunities(query: string): Promise<Opportunity[]>;
}

// Built-in Demo Opportunity Provider (Active when no external job API key or license is connected)
export class DemoOpportunityProvider implements OpportunityProvider {
  name = 'Skillora Demo Provider';
  isLive = false;

  private demoOpportunities: Opportunity[] = [
    {
      id: 'opp-msft-1',
      companyId: 'comp-msft',
      companyName: 'Microsoft',
      title: 'Software Engineer Intern — Cloud & AI',
      location: 'Bengaluru / Redmond (Hybrid)',
      type: 'Internship',
      experience: 'Students / Freshers graduating in 2026 or 2027',
      skills: ['C#', 'TypeScript', 'Azure', 'Data Structures & Algorithms', 'Distributed Systems'],
      postedDate: '2026-09-15',
      deadline: '2026-10-31',
      applicationUrl: 'https://careers.microsoft.com',
      source: 'DEMO DATA (Connect a live jobs provider to replace demo data)',
      lastVerified: '2026-09-22',
      isDemoData: true,
      description: 'Design and deliver high-scale microservices, evaluate telemetry, and implement low-latency backend APIs on Azure platform.'
    },
    {
      id: 'opp-msft-2',
      companyId: 'comp-msft',
      companyName: 'Microsoft',
      title: 'Full Stack Engineer (L61)',
      location: 'Bengaluru / Remote Eligible',
      type: 'Full-time',
      experience: '2-4 years',
      skills: ['TypeScript', 'React', 'Node.js', 'SQL', 'System Design'],
      postedDate: '2026-09-18',
      applicationUrl: 'https://careers.microsoft.com',
      source: 'DEMO DATA (Connect a live jobs provider to replace demo data)',
      lastVerified: '2026-09-22',
      isDemoData: true,
      description: 'Develop responsive client interfaces and performant GraphQL microservices powering enterprise collaboration platforms.'
    },
    {
      id: 'opp-msft-3',
      companyId: 'comp-msft',
      companyName: 'Microsoft',
      title: 'AI Research Scientist Intern',
      location: 'Bengaluru',
      type: 'Internship',
      experience: 'PhD / Masters candidate in CS / AI',
      skills: ['Python', 'PyTorch', 'Large Language Models', 'Mathematical Optimization'],
      postedDate: '2026-09-10',
      deadline: '2026-11-15',
      applicationUrl: 'https://careers.microsoft.com',
      source: 'DEMO DATA (Connect a live jobs provider to replace demo data)',
      lastVerified: '2026-09-22',
      isDemoData: true,
      description: 'Investigate multimodal generative modeling, test emergent capabilities, and author novel benchmark evaluations.'
    },
    {
      id: 'opp-goog-1',
      companyId: 'comp-goog',
      companyName: 'Google',
      title: 'Associate Software Engineer (Fresher)',
      location: 'Bengaluru / Hyderabad',
      type: 'Fresher',
      experience: '0-1 year / University Graduate 2026',
      skills: ['Java', 'C++', 'Python', 'Data Structures & Algorithms', 'Linux'],
      postedDate: '2026-09-12',
      applicationUrl: 'https://careers.google.com',
      source: 'DEMO DATA (Connect a live jobs provider to replace demo data)',
      lastVerified: '2026-09-22',
      isDemoData: true,
      description: 'Work on core infrastructure, planetary-scale distributed indexing, and resilient backends handling billions of queries.'
    },
    {
      id: 'opp-goog-2',
      companyId: 'comp-goog',
      companyName: 'Google',
      title: 'Software Engineering Intern — Summer 2027',
      location: 'Bengaluru',
      type: 'Internship',
      experience: 'Current CS Bachelor / Master student',
      skills: ['Python', 'Java', 'SQL', 'Git', 'Algorithms'],
      postedDate: '2026-09-08',
      deadline: '2026-10-15',
      applicationUrl: 'https://careers.google.com',
      source: 'DEMO DATA (Connect a live jobs provider to replace demo data)',
      lastVerified: '2026-09-22',
      isDemoData: true,
      description: '12-week intensive internship tackling real user-facing problems within Google Cloud, Search, or Android engineering.'
    },
    {
      id: 'opp-amzn-1',
      companyId: 'comp-amzn',
      companyName: 'Amazon',
      title: 'SDE I (Software Development Engineer)',
      location: 'Bengaluru / Chennai',
      type: 'Full-time',
      experience: '1-3 years',
      skills: ['Java', 'AWS', 'DynamoDB', 'Microservices', 'Object-Oriented Design'],
      postedDate: '2026-09-17',
      applicationUrl: 'https://amazon.jobs',
      source: 'DEMO DATA (Connect a live jobs provider to replace demo data)',
      lastVerified: '2026-09-22',
      isDemoData: true,
      description: 'Architect resilient event-driven pipelines on AWS infrastructure powering seamless automated fulfillment logistics.'
    },
    {
      id: 'opp-amzn-2',
      companyId: 'comp-amzn',
      companyName: 'Amazon',
      title: 'Applied Scientist Intern',
      location: 'Bengaluru',
      type: 'Internship',
      experience: 'Graduate level research',
      skills: ['Python', 'TensorFlow', 'NLP', 'Computer Vision'],
      postedDate: '2026-09-14',
      applicationUrl: 'https://amazon.jobs',
      source: 'DEMO DATA (Connect a live jobs provider to replace demo data)',
      lastVerified: '2026-09-22',
      isDemoData: true,
      description: 'Formulate predictive machine learning models and semantic algorithms for dynamic catalog classification.'
    },
    {
      id: 'opp-bosch-1',
      companyId: 'comp-bosch',
      companyName: 'Bosch Global Software Technologies',
      title: 'Embedded Software Engineer — Automotive Tech',
      location: 'Bengaluru',
      type: 'Experienced',
      experience: '3-6 years',
      skills: ['Embedded C', 'AUTOSAR', 'CAN Protocol', 'RTOS', 'Automotive Safety ISO 26262'],
      postedDate: '2026-09-05',
      applicationUrl: 'https://www.bosch.in/careers',
      source: 'DEMO DATA (Connect a live jobs provider to replace demo data)',
      lastVerified: '2026-09-22',
      isDemoData: true,
      description: 'Implement safety-critical firmware for electric vehicle drive controllers, sensor fusion networks, and radar perception.'
    },
    {
      id: 'opp-bosch-2',
      companyId: 'comp-bosch',
      companyName: 'Bosch Global Software Technologies',
      title: 'Graduate Apprentice Trainee (Mobility)',
      location: 'Bengaluru',
      type: 'Fresher',
      experience: '0-1 year',
      skills: ['C++', 'Python', 'MATLAB / Simulink', 'Embedded Systems'],
      postedDate: '2026-09-11',
      applicationUrl: 'https://www.bosch.in/careers',
      source: 'DEMO DATA (Connect a live jobs provider to replace demo data)',
      lastVerified: '2026-09-22',
      isDemoData: true,
      description: 'Join the next-generation autonomous driver assistance simulation testbed team for automated hardware-in-the-loop verification.'
    },
    {
      id: 'opp-nvidia-1',
      companyId: 'comp-nvda',
      companyName: 'NVIDIA',
      title: 'System Software Engineer — CUDA & GPU Compute',
      location: 'Bengaluru',
      type: 'Experienced',
      experience: '2-5 years',
      skills: ['C++', 'CUDA', 'GPU Architecture', 'Linux Kernel', 'Performance Tuning'],
      postedDate: '2026-09-19',
      applicationUrl: 'https://www.nvidia.com/en-us/about-nvidia/careers',
      source: 'DEMO DATA (Connect a live jobs provider to replace demo data)',
      lastVerified: '2026-09-22',
      isDemoData: true,
      description: 'Accelerate deep learning operators and low-level drivers powering the next generation AI supercomputing architectures.'
    },
    {
      id: 'opp-nvidia-2',
      companyId: 'comp-nvda',
      companyName: 'NVIDIA',
      title: 'Robotics Software Intern (Isaac Sim)',
      location: 'Bengaluru',
      type: 'Internship',
      experience: 'Master / PhD student',
      skills: ['Python', 'ROS2', 'Reinforcement Learning', 'Physics Simulation'],
      postedDate: '2026-09-13',
      applicationUrl: 'https://www.nvidia.com/en-us/about-nvidia/careers',
      source: 'DEMO DATA (Connect a live jobs provider to replace demo data)',
      lastVerified: '2026-09-22',
      isDemoData: true,
      description: 'Develop physics-accurate synthetic simulation pipelines for training dexterous manipulation robotic manipulators.'
    },
    {
      id: 'opp-infosys-1',
      companyId: 'comp-infy',
      companyName: 'Infosys',
      title: 'Systems Engineer Specialist',
      location: 'Bengaluru / Electronics City',
      type: 'Fresher',
      experience: '0-2 years',
      skills: ['Java', 'Spring Boot', 'SQL', 'Git', 'REST APIs'],
      postedDate: '2026-09-02',
      applicationUrl: 'https://www.infosys.com/careers',
      source: 'DEMO DATA (Connect a live jobs provider to replace demo data)',
      lastVerified: '2026-09-22',
      isDemoData: true,
      description: 'Build enterprise digital transformation workflows and robust transactional microservices for global banking clients.'
    },
    {
      id: 'opp-wipro-1',
      companyId: 'comp-wipro',
      companyName: 'Wipro',
      title: 'Cloud DevOps Engineer',
      location: 'Bengaluru / Sarjapur',
      type: 'Full-time',
      experience: '2-4 years',
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD Pipelines'],
      postedDate: '2026-09-14',
      applicationUrl: 'https://careers.wipro.com',
      source: 'DEMO DATA (Connect a live jobs provider to replace demo data)',
      lastVerified: '2026-09-22',
      isDemoData: true,
      description: 'Automate multi-region cloud infrastructure deployments, container orchestration, and continuous vulnerability monitoring.'
    },
    {
      id: 'opp-zerodha-1',
      companyId: 'comp-zrdh',
      companyName: 'Zerodha',
      title: 'Fintech Backend Engineer (Golang)',
      location: 'Bengaluru / Remote',
      type: 'Remote',
      experience: '1-4 years',
      skills: ['Go', 'PostgreSQL', 'Redis', 'Kafka', 'High Concurrency'],
      postedDate: '2026-09-16',
      applicationUrl: 'https://zerodha.com/careers',
      source: 'DEMO DATA (Connect a live jobs provider to replace demo data)',
      lastVerified: '2026-09-22',
      isDemoData: true,
      description: 'Maintain sub-millisecond stock exchange order routing gateways handling millions of orders daily.'
    },
    {
      id: 'opp-swiggy-1',
      companyId: 'comp-swig',
      companyName: 'Swiggy',
      title: 'Data Scientist — Real-time Dispatch & Routing',
      location: 'Bengaluru',
      type: 'Experienced',
      experience: '3-5 years',
      skills: ['Python', 'Operations Research', 'Machine Learning', 'Geospatial Analytics'],
      postedDate: '2026-09-15',
      applicationUrl: 'https://careers.swiggy.com',
      source: 'DEMO DATA (Connect a live jobs provider to replace demo data)',
      lastVerified: '2026-09-22',
      isDemoData: true,
      description: 'Optimize dynamic delivery batching algorithms, travel-time prediction matrices, and hyper-local spatial demand surges.'
    }
  ];

  async getOpportunities(companyId?: string, companyName?: string): Promise<Opportunity[]> {
    if (!companyId && !companyName) {
      return [...this.demoOpportunities];
    }
    const query = (companyName || companyId || '').toLowerCase();
    return this.demoOpportunities.filter((opp) => {
      const matchCompany = opp.companyId.toLowerCase().includes(query) ||
        opp.companyName.toLowerCase().includes(query);
      return matchCompany;
    });
  }

  async searchOpportunities(query: string): Promise<Opportunity[]> {
    const q = query.toLowerCase().trim();
    if (!q) return [...this.demoOpportunities];
    return this.demoOpportunities.filter((opp) => {
      return (
        opp.title.toLowerCase().includes(q) ||
        opp.companyName.toLowerCase().includes(q) ||
        opp.skills.some((s) => s.toLowerCase().includes(q)) ||
        opp.type.toLowerCase().includes(q) ||
        opp.location.toLowerCase().includes(q)
      );
    });
  }
}

class OpportunityServiceManager {
  private activeProvider: OpportunityProvider;

  constructor() {
    this.activeProvider = new DemoOpportunityProvider();
  }

  setProvider(provider: OpportunityProvider) {
    this.activeProvider = provider;
  }

  getProvider(): OpportunityProvider {
    return this.activeProvider;
  }

  async getOpportunitiesForCompany(companyId: string, companyName: string): Promise<Opportunity[]> {
    return this.activeProvider.getOpportunities(companyId, companyName);
  }

  async getAllOpportunities(): Promise<Opportunity[]> {
    return this.activeProvider.getOpportunities();
  }

  async searchOpportunities(query: string): Promise<Opportunity[]> {
    return this.activeProvider.searchOpportunities(query);
  }

  // Analyzes skills from actual retrieved job descriptions (Strict Requirement #13 & #14)
  // Does NOT invent numbers; counts occurrences across the provided opportunities list
  extractSkillsFromOpportunities(opportunities: Opportunity[]): {
    skillStats: SkillStat[];
    commonRequirements: CommonRequirement[];
    totalAnalyzed: number;
  } {
    const totalAnalyzed = opportunities.length;
    if (totalAnalyzed === 0) {
      return { skillStats: [], commonRequirements: [], totalAnalyzed: 0 };
    }

    const counts: Record<string, number> = {};
    const skillCategories: Record<string, SkillStat['category']> = {
      'Java': 'languages',
      'Python': 'languages',
      'TypeScript': 'languages',
      'C++': 'languages',
      'C#': 'languages',
      'Go': 'languages',
      'Embedded C': 'languages',
      'React': 'frameworks',
      'Node.js': 'frameworks',
      'Spring Boot': 'frameworks',
      'PyTorch': 'frameworks',
      'TensorFlow': 'frameworks',
      'ROS2': 'frameworks',
      'SQL': 'databases',
      'PostgreSQL': 'databases',
      'DynamoDB': 'databases',
      'Redis': 'databases',
      'AWS': 'cloud',
      'Azure': 'cloud',
      'Docker': 'tools',
      'Kubernetes': 'tools',
      'Terraform': 'tools',
      'Git': 'tools',
      'CUDA': 'tools',
      'Data Structures & Algorithms': 'concepts',
      'System Design': 'concepts',
      'Distributed Systems': 'concepts',
      'Object-Oriented Design': 'concepts',
      'Microservices': 'concepts',
      'High Concurrency': 'concepts',
      'AUTOSAR': 'concepts',
      'CAN Protocol': 'concepts',
      'RTOS': 'concepts',
      'Automotive Safety ISO 26262': 'concepts',
      'NLP': 'concepts',
      'Computer Vision': 'concepts',
      'Large Language Models': 'concepts',
      'Reinforcement Learning': 'concepts',
      'Physics Simulation': 'concepts',
      'Operations Research': 'concepts',
      'Machine Learning': 'concepts',
      'Geospatial Analytics': 'concepts'
    };

    opportunities.forEach((opp) => {
      opp.skills.forEach((skill) => {
        counts[skill] = (counts[skill] || 0) + 1;
      });
    });

    const skillStats: SkillStat[] = Object.entries(counts)
      .map(([skill, count]) => ({
        skill,
        category: skillCategories[skill] || 'languages',
        count,
        postingsCount: count
      }))
      .sort((a, b) => b.count - a.count);

    const commonRequirements: CommonRequirement[] = skillStats
      .slice(0, 8)
      .map((item) => ({
        name: item.skill,
        count: item.count,
        totalAnalyzed,
        category: item.category
      }));

    return {
      skillStats,
      commonRequirements,
      totalAnalyzed
    };
  }
}

export const OpportunityService = new OpportunityServiceManager();
