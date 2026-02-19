import React, { useState } from 'react';
import { ArrowLeft, User, Building2, Check, Lock } from 'lucide-react';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { UserData } from '../../../types';

interface AccountDetailsProps {
  onBack: () => void;
  onComplete: (data: Partial<UserData>) => void;
  role: string | null;
}

export const AccountDetails: React.FC<AccountDetailsProps> = ({ onBack, onComplete, role }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onComplete(formData);
    }, 1500);
  };

  const isAdmin = role === 'admin';

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
          Create your account
        </h1>
        <p className="text-camina-secondary text-lg">
          Finalize your details to access your dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="First name"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            required
          />
          <Input
            placeholder="Last name"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            required
          />
        </div>

        {isAdmin && (
          <Input
            placeholder="Company name"
            icon={<Building2 size={20} />}
            value={formData.companyName}
            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
            required
          />
        )}

        <Input
          type="password"
          placeholder="Create password"
          icon={<Lock size={20} />}
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
          label="Must be at least 8 characters"
        />

        <div className="pt-4">
          <Button fullWidth size="lg" type="submit" isLoading={isLoading}>
            Create Account
          </Button>
        </div>
      </form>

      <div className="mt-8 space-y-3">
        <div className="flex items-center gap-3 text-sm text-camina-secondary">
           <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
             <Check size={12} className="text-green-600" />
           </div>
           <span>Access to exclusive corporate rates</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-camina-secondary">
           <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
             <Check size={12} className="text-green-600" />
           </div>
           <span>24/7 global travel support</span>
        </div>
      </div>
    </div>
  );
};