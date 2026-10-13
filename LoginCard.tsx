import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap, GraduationCap, UserCheck, Shield } from 'lucide-react';
import { UserRole } from './types';
import { supabase, isSupabaseConfigured } from './supabase';

interface LoginCardProps {
  onSuccess: (role: UserRole) => void;
  onNavigateToRegister: () => void;
  onForgotPassword: () => void;
}

export const LoginCard: React.FC<LoginCardProps> = ({
  onSuccess,
  onNavigateToRegister,
  onForgotPassword,
}) => {
  const [role, setRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'student') {
      setEmail('aditya.verma@campus.edu');
      setPassword('Student@2026');
    } else if (selectedRole === 'faculty') {
      setEmail('prof.sharma@campus.edu');
      setPassword('Faculty@2026');
    } else if (selectedRole === 'admin') {
      setEmail('dean.analytics@campus.edu');
      setPassword('Chancellor@2026');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid academic email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setSuccessMsg('✓ Verified with Supabase. Redirecting...');
      } else {
        // Smart Demo Mode
        await new Promise((r) => setTimeout(r, 600));
        setSuccessMsg(`✓ Access granted as ${role.toUpperCase()} (Demo Mode). Redirecting...`);
      }

      if (rememberMe) {
        localStorage.setItem('sa_remembered_email', email);
      }

      setTimeout(() => {
        setIsLoading(false);
        onSuccess(role);
      }, 700);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="relative w-full max-w-[520px] p-8 md:p-10 rounded-3xl bg-[#0b142a]/80 backdrop-blur-2xl border border-blue-500/20 shadow-2xl overflow-hidden">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
        <p className="text-slate-400 text-sm mt-1">Sign in to unlock your student success insights.</p>
      </div>

      {/* Role Selector Pills */}
      <div className="flex items-center gap-2 p-1.5 bg-[#050816]/80 border border-white/10 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => handleRoleSelect('student')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            role === 'student' ? 'bg-blue-600/30 text-white border border-blue-500/50 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Student</span>
        </button>
        <button
          type="button"
          onClick={() => handleRoleSelect('faculty')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            role === 'faculty' ? 'bg-blue-600/30 text-white border border-blue-500/50 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Faculty / TPO</span>
        </button>
        <button
          type="button"
          onClick={() => handleRoleSelect('admin')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            role === 'admin' ? 'bg-blue-600/30 text-white border border-blue-500/50 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 w-4 h-4 text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aditya.verma@campus.edu"
              className="w-full pl-10 pr-4 py-3 bg-[#080e1e]/80 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-200">
              Password <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs font-medium text-cyan-400 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 w-4 h-4 text-slate-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-10 py-3 bg-[#080e1e]/80 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-slate-500 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded bg-slate-900 border-white/20 text-blue-500"
            />
            <span>Remember me on this campus device</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-60"
        >
          {isLoading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-white/10 w-full"></div>
          <span className="bg-[#0b142a] px-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase absolute">
            Or Continue With
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setEmail('demo.judge@campus.edu');
            setPassword('DemoEvaluator@2026');
            setRole('faculty');
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/10 border border-dashed border-cyan-400/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-cyan-500/20 transition-all"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Judge / Evaluator Instant Access</span>
        </button>

        <div className="text-center text-xs text-slate-400 pt-2">
          <span>New to the platform?</span>
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="ml-1 text-cyan-400 font-bold hover:underline"
          >
            Create an account
          </button>
        </div>
      </form>
    </div>
  );
};
