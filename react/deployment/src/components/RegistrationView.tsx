import React, { useState } from 'react';
import { useCursor } from '../context/CursorContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldCheck, Heart, Sparkles, Check } from 'lucide-react';

interface RegistrationViewProps {
  onTriggerLog: (type: 'info' | 'success' | 'warning' | 'error', msg: string) => void;
  onCompleteRegistration: () => void;
}

export const RegistrationView = ({
  onTriggerLog,
  onCompleteRegistration,
}: RegistrationViewProps) => {
  const { setCursorType, setCursorLabel } = useCursor();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    age: '',
    skinType: 'Normal',
    concerns: [] as string[],
    allergies: '',
  });

  const skinConcernsList = [
    'Acme/Pimples',
    'Hyperpigmentation',
    'Dry Flakes',
    'Eczema/Redness',
    'Fine Lines/Wrinkles',
    'Sun Damage',
  ];

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleConcern = (concern: string) => {
    setFormData((prev) => {
      const alreadyChecked = prev.concerns.includes(concern);
      const newConcerns = alreadyChecked
        ? prev.concerns.filter((c) => c !== concern)
        : [...prev.concerns, concern];
      return { ...prev, concerns: newConcerns };
    });
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.age || !formData.password) {
        onTriggerLog('error', 'Please fill out all personal profile inputs including password.');
        return;
      }
      onTriggerLog('info', 'Patient profile validated. Proceeding to Skin Diagnosis profile.');
    }
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onTriggerLog('info', 'Saving patient registration record to database...');
    setSaving(true);
    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        age: formData.age,
        skinType: formData.skinType,
        concerns: formData.concerns,
        allergies: formData.allergies,
      });
      onTriggerLog('success', `Medical chart registered! Welcome, Patient: ${formData.fullName}`);
      onCompleteRegistration();
    } catch (err) {
      onTriggerLog('error', err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setSaving(false);
    }
  };

  const handleMouseEnter = (label: string) => {
    setCursorType('hover');
    setCursorLabel(label);
  };

  const handleMouseLeave = () => {
    setCursorType('default');
    setCursorLabel(null);
  };

  return (
    <div className="w-full max-w-xl mx-auto py-8">
      <div className="glass-panel p-8 rounded-3xl border border-white/20 shadow-xl relative overflow-hidden">

        {/* Step Indicator Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100/60">
          <div className="flex gap-2.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === s
                  ? 'bg-indigo-600 text-white shadow-md'
                  : step > s
                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                    : 'bg-slate-50 text-slate-400 border border-slate-100'
                  }`}
              >
                {step > s ? <Check size={14} /> : s}
              </div>
            ))}
          </div>
          <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
            Step {step} of 3
          </span>
        </div>

        {/* Wizard Form Pages */}
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-4 text-slate-800">
                  <User size={18} className="text-indigo-600" />
                  <h3 className="font-extrabold text-lg">Personal Clinical Profile</h3>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Full Patient Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleTextChange}
                    onFocus={() => handleMouseEnter('Name')}
                    onBlur={handleMouseLeave}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleTextChange}
                    onFocus={() => handleMouseEnter('Email')}
                    onBlur={handleMouseLeave}
                    placeholder="name@domain.com"
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleTextChange}
                    onFocus={() => handleMouseEnter('Password')}
                    onBlur={handleMouseLeave}
                    placeholder="Create a secure password"
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Patient Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleTextChange}
                    onFocus={() => handleMouseEnter('Age')}
                    onBlur={handleMouseLeave}
                    placeholder="Years"
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                    required
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-4 text-slate-800">
                  <Heart size={18} className="text-indigo-600" />
                  <h3 className="font-extrabold text-lg">Skin Diagnosis Profile</h3>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Primary Skin Classification</label>
                  <select
                    name="skinType"
                    value={formData.skinType}
                    onChange={handleTextChange}
                    onMouseEnter={() => handleMouseEnter('Select skin type')}
                    onMouseLeave={handleMouseLeave}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs bg-white/40"
                  >
                    <option>Normal</option>
                    <option>Oily</option>
                    <option>Dry & Dehydrated</option>
                    <option>Sensitive / Rosacea</option>
                    <option>Combination</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Active Skin Concerns (Select all)</label>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    {skinConcernsList.map((concern) => {
                      const isChecked = formData.concerns.includes(concern);
                      return (
                        <button
                          key={concern}
                          type="button"
                          onClick={() => toggleConcern(concern)}
                          onMouseEnter={() => handleMouseEnter(`Tag ${concern}`)}
                          onMouseLeave={handleMouseLeave}
                          className={`px-3 py-2 rounded-xl text-left text-xs transition-all border ${isChecked
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                            : 'bg-white/40 border-slate-100 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                          {concern}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Allergies (If any)</label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleTextChange}
                    onFocus={() => handleMouseEnter('Specify drug/skin allergies')}
                    onBlur={handleMouseLeave}
                    placeholder="e.g. Salicylic acid, Peanuts, None"
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4 text-center"
              >
                <div className="flex justify-center mb-2">
                  <div className="p-4 bg-emerald-50 rounded-full text-emerald-600 border border-emerald-100 animate-pulse">
                    <ShieldCheck size={36} />
                  </div>
                </div>

                <h3 className="font-extrabold text-xl text-slate-800">Review & Consent</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  By completing registration, you consent to secure charting storage in accordance with standard clinical privacy regulations.
                </p>

                <div className="glass-panel p-4 rounded-2xl bg-slate-50/50 border border-slate-100 text-left space-y-2 mt-4 max-w-sm mx-auto">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400 font-semibold">Patient:</span>
                    <span className="font-bold text-slate-700">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400 font-semibold">Classification:</span>
                    <span className="font-bold text-slate-700">{formData.skinType}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400 font-semibold">Concerns:</span>
                    <span className="font-bold text-slate-700">
                      {formData.concerns.length > 0 ? formData.concerns.join(', ') : 'None selected'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Controls */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-100/60">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                onMouseEnter={() => handleMouseEnter('Go back')}
                onMouseLeave={handleMouseLeave}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-all"
              >
                Previous
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                onMouseEnter={() => handleMouseEnter('Continue registration')}
                onMouseLeave={handleMouseLeave}
                className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-1.5"
              >
                Next Step
                <Sparkles size={12} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={saving}
                onMouseEnter={() => handleMouseEnter('Confirm Chart Integration')}
                onMouseLeave={handleMouseLeave}
                className="px-6 py-2.5 bg-emerald-600 disabled:opacity-60 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-all"
              >
                {saving ? 'Saving...' : 'Complete Onboarding'}
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
};
