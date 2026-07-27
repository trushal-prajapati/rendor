import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Lock, Mail, UserCircle, User, Droplets, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { PatientRegisterPayload } from '../api/types';

const SKIN_TYPES = ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive'];
const COMMON_CONCERNS = ['Acne', 'Aging', 'Hyperpigmentation', 'Dryness', 'Redness', 'Sensitivity', 'Texture'];

export const RegisterView: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<PatientRegisterPayload>({
    fullName: '',
    email: '',
    password: '',
    age: '',
    skinType: 'Normal',
    concerns: [],
    allergies: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConcernToggle = (concern: string) => {
    setFormData(prev => {
      if (prev.concerns.includes(concern)) {
        return { ...prev, concerns: prev.concerns.filter(c => c !== concern) };
      } else {
        return { ...prev, concerns: [...prev.concerns, concern] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/'); // redirect to PatientPortal
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafcfb] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-indigo-50 opacity-80" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl glass-panel rounded-3xl p-8 shadow-xl my-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <UserCircle size={20} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-800">Create Account</h1>
            <p className="text-xs text-slate-500 font-medium">Join RenderSkin Clinic as a new patient</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
              <div className="relative mt-1.5">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 glass-input rounded-xl text-sm"
                  placeholder="Jane Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Email</label>
              <div className="relative mt-1.5">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 glass-input rounded-xl text-sm"
                  placeholder="jane@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Password</label>
              <div className="relative mt-1.5">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 glass-input rounded-xl text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Age</label>
              <div className="relative mt-1.5">
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 glass-input rounded-xl text-sm"
                  placeholder="25"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Skin Type</label>
            <div className="relative mt-1.5">
              <Droplets size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                name="skinType"
                value={formData.skinType}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 glass-input rounded-xl text-sm appearance-none"
                required
              >
                {SKIN_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2 block">Skin Concerns</label>
            <div className="flex flex-wrap gap-2">
              {COMMON_CONCERNS.map(concern => {
                const isSelected = formData.concerns.includes(concern);
                return (
                  <button
                    type="button"
                    key={concern}
                    onClick={() => handleConcernToggle(concern)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                      : 'bg-white/60 text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                      }`}
                  >
                    {concern}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Allergies (Optional)</label>
            <div className="relative mt-1.5">
              <AlertTriangle size={14} className="absolute left-3 top-3 text-slate-400" />
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                rows={2}
                className="w-full pl-9 pr-3 py-2.5 glass-input rounded-xl text-sm resize-none"
                placeholder="List any known allergies..."
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Create Patient Account'
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
