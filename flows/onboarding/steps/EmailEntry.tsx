import React, { useState } from 'react';
import { Mail, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';

interface EmailEntryProps {
  onBack: () => void;
  onNext: (email: string) => void;
  initialEmail: string;
}

export const EmailEntry: React.FC<EmailEntryProps> = ({ onBack, onNext, initialEmail }) => {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid work email address.');
      return;
    }
    onNext(email);
  };

  return (
    <div className="w-full max-w-md mx-auto animate-slide-up">
      <button 
        onClick={onBack}
        className="mb-8 p-2 -ml-2 rounded-full hover:bg-stone-100 text-camina-secondary transition-colors"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="space-y-2 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-camina-primary tracking-tight">
          Get started in minutes
        </h1>
        <p className="text-camina-secondary text-lg">
          No credit card needed. Just your work email.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white border border-stone-200 hover:bg-stone-50 hover:border-stone-300 text-stone-800 font-medium h-12 rounded-2xl transition-all duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google Work
          </button>
          
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink-0 mx-4 text-stone-400 text-sm">Or use email</span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          <Input
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            error={error}
            icon={<Mail size={20} />}
            autoFocus
          />
        </div>

        <Button fullWidth size="lg" type="submit" className="group">
          Continue with Email
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
        </Button>
      </form>

      <div className="mt-8 flex items-start gap-3 p-4 bg-stone-100 rounded-2xl">
        <ShieldCheck className="text-camina-secondary flex-shrink-0" size={20} />
        <p className="text-xs text-camina-secondary leading-relaxed">
          By proceeding, you agree to Camina's Terms of Service. We use enterprise-grade security to protect your data.
        </p>
      </div>
    </div>
  );
};