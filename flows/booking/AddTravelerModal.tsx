import * as React from 'react';
import { User, ChevronDown } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Button } from '@/components/Button';

interface AddTravelerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}

export const AddTravelerModal: React.FC<AddTravelerModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = React.useState({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    dob: '',
    gender: '',
    email: '',
    phone: '',
    countryCode: 'US'
  });

  const handleSubmit = () => {
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email) return;

    onAdd(`${formData.firstName} ${formData.lastName}`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add new traveler" size="lg">
      <div className="space-y-8 pb-4">

        {/* Photo Upload Placeholder */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-300">
            <User size={32} />
          </div>
          <button className="text-stone-900 font-semibold hover:text-stone-700 transition-colors">
            Add picture <span className="text-stone-400 font-normal">- Optional</span>
          </button>
        </div>

        {/* Identity Form */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-stone-500">
              These details must match your government-issued ID for ticketing purposes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Legal first name"
              required
              value={formData.firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="Jane"
            />
            <Input
              label="Middle name"
              value={formData.middleName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, middleName: e.target.value })}
            />
            <Input
              label="Legal last name"
              required
              value={formData.lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Doe"
            />
            <Select
              label="Suffix"
              options={[
                { value: '', label: 'Select' },
                { value: 'jr', label: 'Jr.' },
                { value: 'sr', label: 'Sr.' },
              ]}
              value={formData.suffix}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, suffix: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Date of birth"
              type="date"
              required
              value={formData.dob}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, dob: e.target.value })}
            />
            <Select
              label="Gender"
              required
              options={[
                { value: '', label: 'Select' },
                { value: 'female', label: 'Female' },
                { value: 'male', label: 'Male' },
                { value: 'non-binary', label: 'Non-binary' },
              ]}
              value={formData.gender}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, gender: e.target.value })}
            />
          </div>
        </section>

        {/* Contact Form */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Email"
            type="email"
            required
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
            placeholder="name@company.com"
          />
          <div className="w-full space-y-2">
            <label className="block text-sm font-medium text-stone-500 ml-1">Mobile phone</label>
            <div className="flex gap-3">
              <div className="w-24">
                <div className="relative">
                  <select
                    className="w-full bg-white rounded-2xl border-2 border-stone-100 px-3 py-3.5 outline-none appearance-none"
                    value={formData.countryCode}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, countryCode: e.target.value })}
                  >
                    <option value="US">🇺🇸</option>
                    <option value="UK">🇬🇧</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                </div>
              </div>
              <input
                className="flex-1 bg-white rounded-2xl border-2 border-stone-100 px-4 py-3.5 outline-none focus:border-stone-900 transition-all placeholder:text-stone-300"
                placeholder="(555) 000-0000"
                value={formData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Checkboxes/Additional */}
        <div className="space-y-4 pt-2">
          <div>
            <h4 className="font-medium text-stone-900 mb-2">Required information for reporting</h4>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="w-5 h-5 rounded border-2 border-stone-900 bg-stone-900 flex items-center justify-center text-white">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <span className="text-stone-700">Use your information</span>
            </label>
          </div>

          <button className="text-stone-900 font-semibold flex items-center gap-2 hover:text-stone-700 transition-colors">
            Add passport, preferences, and loyalty programs
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-stone-100">
          <Button variant="secondary" onClick={onClose} className="px-8">Cancel</Button>
          <Button
            className="bg-stone-900 hover:bg-black shadow-lg px-8"
            onClick={handleSubmit}
          >
            Add
          </Button>
        </div>

      </div>
    </Modal>
  );
};