import React, { useState } from 'react';
import { CreditCard, Lock, ChevronDown } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Select } from '../../../components/Select';

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (paymentDetails: any) => void;
}

export const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({ 
  isOpen, 
  onClose,
  onSave
}) => {
  const [paymentType, setPaymentType] = useState<'personal' | 'company'>('company');
  const [formData, setFormData] = useState({
    nickname: 'JSMobbin',
    nameOnCard: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvv: '',
    country: 'United States',
    address1: '',
    address2: '',
    city: 'Singapore',
    state: '',
    zip: ''
  });

  const handleSave = () => {
    // Mock save logic
    onSave({
      ...formData,
      last4: formData.cardNumber.slice(-4) || '8888',
      brand: 'visa',
      type: paymentType
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add payment method" size="lg">
      <div className="space-y-8">
        
        {/* Card Type Selection */}
        <div className="bg-stone-100/50 p-1 rounded-xl flex gap-1">
           {/* Custom Radio-like toggle based on screenshot */}
           <div className="flex items-center gap-6 w-full px-4 py-3 bg-stone-100/50 rounded-xl">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentType === 'personal' ? 'border-purple-600' : 'border-stone-300'}`}>
                   {paymentType === 'personal' && <div className="w-2.5 h-2.5 bg-purple-600 rounded-full" />}
                </div>
                <input type="radio" className="hidden" checked={paymentType === 'personal'} onChange={() => setPaymentType('personal')} />
                <span className="text-stone-700 font-medium">This is my own personal card</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentType === 'company' ? 'border-purple-600' : 'border-stone-300'}`}>
                   {paymentType === 'company' && <div className="w-2.5 h-2.5 bg-purple-600 rounded-full" />}
                </div>
                <input type="radio" className="hidden" checked={paymentType === 'company'} onChange={() => setPaymentType('company')} />
                <span className="text-stone-700 font-medium">My company gave me this card</span>
              </label>
           </div>
        </div>

        {/* Card Details */}
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Card nickname"
                value={formData.nickname}
                onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                required
              />
              <Input 
                label="Name on card"
                value={formData.nameOnCard}
                onChange={(e) => setFormData({...formData, nameOnCard: e.target.value})}
                required
              />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Card number"
                icon={<CreditCard size={20} />}
                placeholder="0000 0000 0000 0000"
                value={formData.cardNumber}
                onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="block text-sm font-medium text-stone-500 ml-1">Card expiration</label>
                    <div className="flex gap-2">
                       <div className="relative flex-1">
                          <select 
                            className="w-full bg-white rounded-2xl border-2 border-stone-100 px-3 py-3.5 outline-none appearance-none text-stone-700"
                            value={formData.expMonth}
                            onChange={(e) => setFormData({...formData, expMonth: e.target.value})}
                          >
                            <option value="">Month</option>
                            <option value="01">01</option>
                            <option value="05">05</option>
                            <option value="12">12</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                       </div>
                       <div className="relative flex-1">
                          <select 
                            className="w-full bg-white rounded-2xl border-2 border-stone-100 px-3 py-3.5 outline-none appearance-none text-stone-700"
                            value={formData.expYear}
                            onChange={(e) => setFormData({...formData, expYear: e.target.value})}
                          >
                            <option value="">Year</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                       </div>
                    </div>
                 </div>
                 <Input 
                   label="CVV"
                   type="password"
                   maxLength={4}
                   value={formData.cvv}
                   onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                   required
                 />
              </div>
           </div>
        </div>

        <div className="h-px bg-stone-100 w-full"></div>

        {/* Billing Address */}
        <div className="space-y-6">
           <h3 className="text-lg font-bold text-stone-900">Billing address</h3>
           
           <div className="space-y-2">
              <label className="block text-sm font-medium text-stone-500 ml-1">Country</label>
              <div className="relative">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🇺🇸</div>
                 <select 
                    className="w-full bg-white rounded-2xl border-2 border-stone-100 pl-12 pr-10 py-3.5 outline-none appearance-none text-stone-900 font-medium"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                 >
                   <option value="United States">United States</option>
                   <option value="United Kingdom">United Kingdom</option>
                   <option value="Singapore">Singapore</option>
                 </select>
                 <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Address line 1"
                value={formData.address1}
                onChange={(e) => setFormData({...formData, address1: e.target.value})}
              />
              <Input 
                label="Address line 2"
                value={formData.address2}
                onChange={(e) => setFormData({...formData, address2: e.target.value})}
              />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input 
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
              <div className="space-y-2">
                 <label className="block text-sm font-medium text-stone-500 ml-1">State/Province</label>
                 <div className="relative">
                    <select 
                        className="w-full bg-white rounded-2xl border-2 border-stone-100 px-4 py-3.5 outline-none appearance-none text-stone-900"
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                    >
                      <option value="">Select state</option>
                      <option value="CA">California</option>
                      <option value="NY">New York</option>
                    </select>
                    <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                 </div>
              </div>
              <Input 
                label="Postal code"
                value={formData.zip}
                onChange={(e) => setFormData({...formData, zip: e.target.value})}
              />
           </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
           <Button variant="ghost" onClick={onClose}>
             Cancel
           </Button>
           <Button 
             className="bg-purple-700 hover:bg-purple-800 shadow-purple-200 px-8"
             onClick={handleSave}
           >
             Save payment
           </Button>
        </div>

      </div>
    </Modal>
  );
};