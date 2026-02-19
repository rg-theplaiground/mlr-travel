import React from 'react';
import { User, Briefcase, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UserRoleOption } from '../../../types';

interface RoleSelectionProps {
  onSelect: (roleId: string) => void;
  selectedRole: string | null;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelect, selectedRole }) => {
  const roles: UserRoleOption[] = [
    {
      id: 'traveler',
      title: 'Book for myself',
      description: 'I need to book a flight or hotel for my next work trip.',
      icon: User,
      colorClass: 'bg-blue-50 text-blue-600'
    },
    {
      id: 'admin',
      title: 'Manage company',
      description: 'I want to set up policies, cards, and manage expenses.',
      icon: Briefcase,
      colorClass: 'bg-orange-50 text-orange-600'
    },
    {
      id: 'group',
      title: 'Arrange group travel',
      description: 'I am organizing an offsite or event for the team.',
      icon: Users,
      colorClass: 'bg-emerald-50 text-emerald-600'
    }
  ];

  return (
    <div className="space-y-6 w-full max-w-md mx-auto animate-slide-up">
      <div className="text-center space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-camina-primary tracking-tight">
          Welcome to Camina
        </h1>
        <p className="text-camina-secondary text-lg">
          How will you be using the platform today?
        </p>
      </div>

      <div className="grid gap-4">
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;
          const Icon = role.icon;

          return (
            <button
              key={role.id}
              onClick={() => onSelect(role.id)}
              className={`
                group relative flex items-start p-5 rounded-3xl border-2 text-left transition-all duration-300
                ${isSelected 
                  ? 'border-camina-primary bg-stone-50 shadow-md scale-[1.02]' 
                  : 'border-transparent bg-white hover:border-stone-200 shadow-sm hover:shadow-md hover:scale-[1.01]'
                }
              `}
            >
              <div className={`
                p-3 rounded-2xl mr-5 transition-colors duration-300
                ${isSelected ? 'bg-camina-primary text-white' : role.colorClass}
              `}>
                <Icon size={24} strokeWidth={2} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-camina-primary mb-1 group-hover:text-black transition-colors">
                  {role.title}
                </h3>
                <p className="text-camina-secondary text-sm leading-relaxed">
                  {role.description}
                </p>
              </div>

              <div className={`
                absolute top-5 right-5 transition-all duration-300
                ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
              `}>
                <CheckCircle2 className="text-camina-primary fill-stone-100" size={24} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-8 text-center">
        <p className="text-sm text-camina-secondary">
          Already have an account? <a href="#" className="text-camina-primary font-semibold hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
};