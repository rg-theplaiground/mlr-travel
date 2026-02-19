import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import { TravelerProfile, Passport, UserData } from '../../types';

interface TravelerInfoProps {
  initialData: UserData;
}

export const TravelerInfo: React.FC<TravelerInfoProps> = ({ initialData }) => {
  const [isDirty, setIsDirty] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // Form State - Defaults to empty to force user entry, except known names
  const [profile, setProfile] = useState<TravelerProfile>({
    legalFirstName: initialData.firstName || '',
    legalMiddleName: '',
    legalLastName: initialData.lastName || '',
    suffix: '',
    gender: '',
    birthdate: '',
    mobileCountryCode: 'US',
    mobileNumber: '',
    ktnNumber: '',
    redressNumber: '',
    seatPreference: '',
    specialMeal: '',
    specialAssistance: '',
    homeAirport: '',
    passports: []
  });

  const handleChange = (field: keyof TravelerProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handlePassportChange = (id: string, field: keyof Passport, value: string) => {
    setProfile(prev => ({
      ...prev,
      passports: prev.passports.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
    setIsDirty(true);
  };

  const addPassport = () => {
    setProfile(prev => ({
      ...prev,
      passports: [
        ...prev.passports, 
        { 
          id: Math.random().toString(36).substr(2, 9), 
          issuingCountry: '', 
          citizenshipCountry: '', 
          number: '', 
          issueDate: '', 
          expirationDate: '' 
        }
      ]
    }));
    setIsDirty(true);
  };

  const removePassport = (id: string) => {
    setProfile(prev => ({
      ...prev,
      passports: prev.passports.filter(p => p.id !== id)
    }));
    setIsDirty(true);
  };

  const handleSave = () => {
    // Simulate API save
    setTimeout(() => {
      setIsDirty(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 800);
  };

  const handleRevert = () => {
    // Reset to initial state (in a real app this would refetch)
    setProfile({
      legalFirstName: initialData.firstName || '',
      legalMiddleName: '',
      legalLastName: initialData.lastName || '',
      suffix: '',
      gender: '',
      birthdate: '',
      mobileCountryCode: 'US',
      mobileNumber: '',
      ktnNumber: '',
      redressNumber: '',
      seatPreference: '',
      specialMeal: '',
      specialAssistance: '',
      homeAirport: '',
      passports: []
    });
    setIsDirty(false);
  };

  return (
    <div className="space-y-10 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-6 z-50 animate-slide-up">
          <div className="bg-stone-900 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4">
             <CheckCircle size={20} className="text-green-400" />
             <div>
               <p className="font-semibold">Success</p>
               <p className="text-sm text-stone-300">Your traveler information was successfully updated.</p>
             </div>
             <button onClick={() => setShowToast(false)} className="ml-4 text-stone-500 hover:text-white">
               <X size={18} />
             </button>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-stone-900 mb-6">Traveler information</h2>
        
        <div className="flex items-start gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-100 mb-8">
          <AlertCircle size={20} className="text-stone-400 mt-0.5" />
          <p className="text-sm text-stone-600 leading-relaxed">
            Your name needs to match the machine-readable name on your passport. <span className="font-semibold text-stone-900 underline cursor-pointer">View example</span>
          </p>
        </div>

        {/* Personal Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Input 
            label="Legal first name" 
            value={profile.legalFirstName}
            onChange={(e) => handleChange('legalFirstName', e.target.value)}
          />
          <Input 
            label="Legal middle name" 
            value={profile.legalMiddleName}
            onChange={(e) => handleChange('legalMiddleName', e.target.value)}
          />
          <Input 
            label="Legal last name" 
            value={profile.legalLastName}
            onChange={(e) => handleChange('legalLastName', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Select
            label="Suffix"
            value={profile.suffix}
            onChange={(e) => handleChange('suffix', e.target.value)}
            options={[
              { value: '', label: 'Select' },
              { value: 'none', label: 'None' },
              { value: 'jr', label: 'Jr.' },
              { value: 'sr', label: 'Sr.' },
              { value: 'ii', label: 'II' },
            ]}
          />
          <Select
            label="Gender"
            value={profile.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            options={[
              { value: '', label: 'Select' },
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'non-binary', label: 'Non-binary' },
            ]}
          />
          <Input 
            label="Birthdate" 
            type="date"
            value={profile.birthdate}
            onChange={(e) => handleChange('birthdate', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10 border-b border-stone-100">
           <div className="w-full">
              <label className="block text-sm font-medium text-camina-secondary ml-1 mb-2">Mobile number</label>
              <div className="flex gap-3">
                 <div className="w-24">
                   <Select 
                     options={[{value: 'US', label: '🇺🇸 +1'}]} 
                     value={profile.mobileCountryCode}
                     onChange={(e) => handleChange('mobileCountryCode', e.target.value)}
                   />
                 </div>
                 <Input 
                    placeholder="Mobile number" 
                    value={profile.mobileNumber}
                    onChange={(e) => handleChange('mobileNumber', e.target.value)}
                 />
              </div>
           </div>
        </div>
      </div>

      {/* Travel Documents */}
      <div className="pb-10 border-b border-stone-100">
        <h3 className="text-lg font-bold text-stone-900 mb-6">Travel Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="KTN/TSA-Precheck number" 
            placeholder="Unknown"
            value={profile.ktnNumber}
            onChange={(e) => handleChange('ktnNumber', e.target.value)}
          />
          <Input 
            label="Redress number" 
            placeholder="Unknown"
            value={profile.redressNumber}
            onChange={(e) => handleChange('redressNumber', e.target.value)}
          />
        </div>
      </div>

      {/* Preferences */}
      <div className="pb-10 border-b border-stone-100">
        <h3 className="text-lg font-bold text-stone-900 mb-6">Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Select
            label="Seat preference"
            value={profile.seatPreference}
            onChange={(e) => handleChange('seatPreference', e.target.value)}
            options={[
              { value: '', label: 'Any' },
              { value: 'window', label: 'Window' },
              { value: 'aisle', label: 'Aisle' },
            ]}
          />
          <Select
            label="Special meal types"
            value={profile.specialMeal}
            onChange={(e) => handleChange('specialMeal', e.target.value)}
            options={[
              { value: '', label: 'None' },
              { value: 'standard', label: 'Standard' },
              { value: 'vegetarian', label: 'Vegetarian' },
              { value: 'vegan', label: 'Vegan' },
              { value: 'gluten-free', label: 'Gluten Free' },
            ]}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Select
            label="Special assistance"
            value={profile.specialAssistance}
            onChange={(e) => handleChange('specialAssistance', e.target.value)}
            options={[
              { value: '', label: 'None' },
              { value: 'wheelchair', label: 'Wheelchair' },
            ]}
          />
          <Input 
            label="Home airport" 
            placeholder="e.g. SFO, LHR"
            value={profile.homeAirport}
            onChange={(e) => handleChange('homeAirport', e.target.value)}
          />
        </div>
      </div>

      {/* Passports */}
      <div>
         <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-stone-900">Passport information</h3>
            {profile.passports.length > 0 && (
               <button onClick={addPassport} className="text-sm font-semibold text-camina-primary hover:underline">
                 + Add another
               </button>
            )}
         </div>

         {profile.passports.length === 0 ? (
           <div className="text-center py-8 bg-stone-50 rounded-2xl border border-stone-100 border-dashed">
             <p className="text-stone-500 mb-4">No passports added yet.</p>
             <Button variant="secondary" onClick={addPassport} size="sm">
               <Plus size={16} className="mr-2" />
               Add Passport
             </Button>
           </div>
         ) : (
           <div className="space-y-8">
             {profile.passports.map((passport, index) => (
               <div key={passport.id} className="bg-stone-50 p-6 rounded-3xl border border-stone-200 animate-slide-up">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-stone-700">Passport #{index + 1}</h4>
                    <button onClick={() => removePassport(passport.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <Input 
                      label="Issuing country"
                      placeholder="Select country"
                      value={passport.issuingCountry}
                      onChange={(e) => handlePassportChange(passport.id, 'issuingCountry', e.target.value)}
                    />
                    <Input 
                      label="Country of citizenship"
                      placeholder="Select country"
                      value={passport.citizenshipCountry}
                      onChange={(e) => handlePassportChange(passport.id, 'citizenshipCountry', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                     <Input 
                      label="Issue date"
                      type="date"
                      value={passport.issueDate}
                      onChange={(e) => handlePassportChange(passport.id, 'issueDate', e.target.value)}
                    />
                    <Input 
                      label="Expiration date"
                      type="date"
                      value={passport.expirationDate}
                      onChange={(e) => handlePassportChange(passport.id, 'expirationDate', e.target.value)}
                    />
                  </div>
                  <Input 
                      label="Passport number"
                      value={passport.number}
                      onChange={(e) => handlePassportChange(passport.id, 'number', e.target.value)}
                    />
               </div>
             ))}
             
             <button onClick={addPassport} className="flex items-center gap-2 text-stone-500 font-medium hover:text-stone-900 transition-colors px-2">
               <Plus size={20} />
               <span>Add second passport</span>
             </button>
           </div>
         )}
      </div>

      {/* Sticky Bottom Bar for Unsaved Changes */}
      <div className={`
        fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-2xl
        bg-stone-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between
        transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
        ${isDirty ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0 pointer-events-none'}
      `}>
         <span className="font-medium ml-2">You have unsaved changes</span>
         <div className="flex gap-3">
            <button 
              onClick={handleRevert}
              className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
            >
              Revert
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2 rounded-xl text-sm font-bold bg-white text-stone-900 hover:bg-stone-100 transition-colors shadow-lg"
            >
              Save changes
            </button>
         </div>
      </div>

    </div>
  );
};