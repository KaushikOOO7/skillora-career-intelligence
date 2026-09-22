import React, { useState } from 'react';
import { X, User, Lock, Mail, CheckCircle2 } from 'lucide-react';
import { UserAuth } from '../types';

interface AuthModalProps {
  auth: UserAuth;
  onUpdateAuth: (auth: UserAuth) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ auth, onUpdateAuth, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState(auth.email || '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(auth.displayName || '');

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onUpdateAuth({
      isLoggedIn: true,
      email: email.trim(),
      displayName: name.trim() || email.split('@')[0],
      userId: `usr-${Date.now()}`
    });
    onClose();
  };

  const handleGoogleSignIn = () => {
    onUpdateAuth({
      isLoggedIn: true,
      email: email.trim() || 'kaushikpoojari0007@gmail.com',
      displayName: name.trim() || 'Kaushik Poojari',
      userId: 'usr-google-verified'
    });
    onClose();
  };

  const handleSignOut = () => {
    onUpdateAuth({
      isLoggedIn: false,
      userId: undefined,
      email: undefined,
      displayName: undefined
    });
    onClose();
  };

  return (
    <div id="auth-modal-dialog" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl w-full max-w-sm p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#00F0FF]" />
            <h3 className="font-display font-bold text-white text-base">
              {auth.isLoggedIn ? 'Account Status' : isSignUp ? 'Create Skillora Account' : 'Sign In to Skillora'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded bg-[#1E293B] text-[#94A3B8] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {auth.isLoggedIn ? (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-[#0F172A] border border-[#1E293B] rounded-lg space-y-1">
              <div className="text-[10px] font-mono text-[#64748B]">AUTHENTICATED AS</div>
              <div className="text-white font-medium text-sm">{auth.displayName}</div>
              <div className="text-[#94A3B8] font-mono">{auth.email}</div>
            </div>

            <p className="text-[#94A3B8] text-xs">
              Your profile, saved companies, alerts, and application pipeline items are synchronized across sessions.
            </p>

            <button
              onClick={handleSignOut}
              className="w-full py-2 rounded-lg border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              Sign Out (Switch to Guest Mode)
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            {/* Google Sign In Button */}
            <button
              id="google-signin-btn"
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 rounded-lg bg-[#0F172A] border border-[#1E293B] hover:border-[#00F0FF] text-white font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-[#1E293B]"></div>
              <span className="flex-shrink mx-2 text-[10px] font-mono text-[#64748B]">OR</span>
              <div className="flex-grow border-t border-[#1E293B]"></div>
            </div>

            {/* Email form */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {isSignUp && (
                <div>
                  <label className="text-[#94A3B8] block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              )}

              <div>
                <label className="text-[#94A3B8] block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#00F0FF] text-black font-semibold hover:bg-[#00F0FF]/90 transition-colors shadow-md"
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[11px] text-[#38BDF8] hover:underline"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
