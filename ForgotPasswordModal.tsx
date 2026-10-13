import React, { useState } from 'react';
import { Mail, Send, X } from 'lucide-react';
import { supabase, isSupabaseConfigured } from './supabase';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatusMsg('Please enter a valid registered campus email address.');
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setStatusMsg('');

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
      } else {
        await new Promise((r) => setTimeout(r, 600));
      }

      setIsSuccess(true);
      setStatusMsg(`✓ Password reset instructions dispatched to ${email}. Check your inbox.`);
      setTimeout(() => {
        setIsLoading(false);
        onClose();
      }, 2500);
    } catch (err: any) {
      setIsLoading(false);
      setIsSuccess(false);
      setStatusMsg(err.message || 'Failed to dispatch reset link.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md p-6 rounded-2xl bg-[#0b1329] border border-blue-500/20 shadow-2xl text-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Reset Your Password</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Enter your registered student or faculty email address to receive password recovery instructions.
        </p>

        {statusMsg && (
          <div
            className={`p-3 rounded-xl text-xs mb-4 ${
              isSuccess
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Campus Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@campus.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-[#080e1e] border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? <span>Sending...</span> : <span>Send Reset Link</span>}
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
