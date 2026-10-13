import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, School, Hash, Cpu, Calendar, Sparkles, Check } from 'lucide-react';
import { supabase, isSupabaseConfigured } from './supabase';

interface RegisterCardProps {
  onSuccess: (data: any) => void;
  onNavigateToLogin: () => void;
}

export const RegisterCard: React.FC<RegisterCardProps> = ({
  onSuccess,
  onNavigateToLogin,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [studyYear, setStudyYear] = useState('4th Year');
  const [studentId, setStudentId] = useState('');
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password Strength Logic
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const strengthScore = [hasLength, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  const strengthLabels = ['None', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-slate-700', 'bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) return setErrorMsg('Full Name is required.');
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErrorMsg('Valid student email required.');
    if (password.length < 8) return setErrorMsg('Password must be at least 8 characters.');
    if (password !== confPassword) return setErrorMsg('Passwords do not match.');
    if (!college.trim()) return setErrorMsg('College / University name is required.');
    if (!studentId.trim()) return setErrorMsg('Student ID or Roll Number is required.');
    if (!terms) return setErrorMsg('Please accept Terms of Service & Privacy Policy.');

    setIsLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              college_name: college,
              department,
              study_year: studyYear,
              student_id: studentId,
            },
          },
        });
        if (error) throw error;
      } else {
        await new Promise((r) => setTimeout(r, 800));
      }

      setIsLoading(false);
      onSuccess({
        fullName,
        email,
        college,
        department,
        studyYear,
        studentId,
      });
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="relative w-full max-w-[580px] p-8 md:p-10 rounded-3xl bg-[#0b142a]/80 backdrop-blur-2xl border border-blue-500/20 shadow-2xl">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Your Student Account</h2>
        <p className="text-slate-400 text-sm mt-1">Build your path to academic and career success.</p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">Full Name *</label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aditya Verma"
                className="w-full pl-10 pr-4 py-2.5 bg-[#080e1e]/80 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">Student Email *</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@campus.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-[#080e1e]/80 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">Create Password *</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full pl-10 pr-10 py-2.5 bg-[#080e1e]/80 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500"
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

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">Confirm Password *</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <input
                type={showConfPassword ? 'text' : 'password'}
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full pl-10 pr-10 py-2.5 bg-[#080e1e]/80 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfPassword(!showConfPassword)}
                className="absolute right-3.5 text-slate-500 hover:text-white"
              >
                {showConfPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Password Strength Meter */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Password Strength:</span>
            <span className="font-bold text-white">{strengthLabels[strengthScore]}</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 h-1.5">
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className={`rounded-full h-full transition-all ${
                  strengthScore >= bar ? strengthColors[strengthScore] : 'bg-white/10'
                }`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
            <span className={`px-2 py-0.5 rounded border ${hasLength ? 'border-emerald-500/40 text-emerald-300' : 'border-white/10 text-slate-500'}`}>8+ Chars</span>
            <span className={`px-2 py-0.5 rounded border ${hasUpper ? 'border-emerald-500/40 text-emerald-300' : 'border-white/10 text-slate-500'}`}>Uppercase</span>
            <span className={`px-2 py-0.5 rounded border ${hasNumber ? 'border-emerald-500/40 text-emerald-300' : 'border-white/10 text-slate-500'}`}>Number</span>
            <span className={`px-2 py-0.5 rounded border ${hasSpecial ? 'border-emerald-500/40 text-emerald-300' : 'border-white/10 text-slate-500'}`}>Symbol</span>
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">College / University *</label>
            <div className="relative flex items-center">
              <School className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="National Tech Institute"
                className="w-full pl-10 pr-4 py-2.5 bg-[#080e1e]/80 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">Student ID / Roll No. *</label>
            <div className="relative flex items-center">
              <Hash className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="CSE-2023-042"
                className="w-full pl-10 pr-4 py-2.5 bg-[#080e1e]/80 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">Department *</label>
            <div className="relative flex items-center">
              <Cpu className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#080e1e]/80 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500"
              >
                <option value="CSE">Computer Science (CSE)</option>
                <option value="ECE">Electronics (ECE)</option>
                <option value="EEE">Electrical (EEE)</option>
                <option value="IT">Information Tech (IT)</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">Study Year *</label>
            <div className="relative flex items-center">
              <Calendar className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <select
                value={studyYear}
                onChange={(e) => setStudyYear(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#080e1e]/80 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year (Senior)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="rounded bg-slate-900 border-white/20 text-cyan-400"
              required
            />
            <span>I agree to the Terms of Service and Privacy Policy</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-60"
        >
          {isLoading ? (
            <span>Creating Student Account...</span>
          ) : (
            <>
              <span>Create My Account</span>
              <Sparkles className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="text-center text-xs text-slate-400 pt-2">
          <span>Already have an account?</span>
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="ml-1 text-cyan-400 font-bold hover:underline"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};
