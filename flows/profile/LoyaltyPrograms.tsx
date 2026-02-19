import React, { useState } from 'react';
import { Plus, Plane, Hotel, Train, Car, Search, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Toast } from '../../components/Toast';

interface Program {
  id: string;
  provider: string;
  number: string;
  category: 'airline' | 'lodging' | 'train' | 'car';
}

const POPULAR_AIRLINES = [
  { name: 'Club Vistara', color: 'bg-indigo-900' },
  { name: 'Safar Flyer', color: 'bg-red-700' },
  { name: 'Island Miles', color: 'bg-sky-600' },
  { name: 'TudoAzul', color: 'bg-blue-600' },
  { name: 'Emirates Skywards', color: 'bg-stone-800' },
  { name: 'Delta SkyMiles', color: 'bg-blue-900' },
];

export const LoyaltyPrograms: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  
  // UI State
  const [modalStep, setModalStep] = useState<'select' | 'input' | null>(null);
  const [deletingProgram, setDeletingProgram] = useState<Program | null>(null);
  const [toast, setToast] = useState({ message: '', visible: false });

  // Form State
  const [selectedCategory, setSelectedCategory] = useState<Program['category']>('airline');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [loyaltyNumber, setLoyaltyNumber] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
  };

  // --- Actions ---

  const openAddModal = (category: Program['category']) => {
    setSelectedCategory(category);
    setSelectedProvider('');
    setLoyaltyNumber('');
    setEditingId(null);
    setModalStep('select');
  };

  const handleEdit = (program: Program) => {
    setSelectedCategory(program.category);
    setSelectedProvider(program.provider);
    setLoyaltyNumber(program.number);
    setEditingId(program.id);
    setModalStep('input');
  };

  const handleDeleteRequest = (program: Program) => {
    setDeletingProgram(program);
  };

  const confirmDelete = () => {
    if (deletingProgram) {
      setPrograms(programs.filter(p => p.id !== deletingProgram.id));
      showToast(`${deletingProgram.provider} was successfully deleted.`);
      setDeletingProgram(null);
    }
  };

  const handleSelectProvider = (name: string) => {
    setSelectedProvider(name);
    setModalStep('input');
    // If we were adding, clear the number. If editing (switching provider?), maybe keep it? 
    // Usually switching provider implies new number, so clearing is safe.
    if (!editingId) setLoyaltyNumber('');
  };

  const handleSave = () => {
    if (!loyaltyNumber || !selectedProvider) return;

    if (editingId) {
      // Update existing
      setPrograms(programs.map(p => 
        p.id === editingId 
          ? { ...p, provider: selectedProvider, number: loyaltyNumber, category: selectedCategory }
          : p
      ));
      showToast(`${selectedProvider} updated successfully.`);
    } else {
      // Create new
      const newProgram: Program = {
        id: Math.random().toString(36).substr(2, 9),
        provider: selectedProvider,
        number: loyaltyNumber,
        category: selectedCategory,
      };
      setPrograms([...programs, newProgram]);
      showToast(`${selectedProvider} added successfully.`);
    }
    setModalStep(null);
    setEditingId(null);
  };

  const getIconForCategory = (cat: string) => {
    switch(cat) {
      case 'airline': return Plane;
      case 'lodging': return Hotel;
      case 'train': return Train;
      case 'car': return Car;
      default: return Plane;
    }
  };

  return (
    <div className="space-y-10 relative">
      <Toast 
        message={toast.message} 
        isVisible={toast.visible} 
        onClose={() => setToast(prev => ({ ...prev, visible: false }))} 
      />
      
      {/* Banner */}
      <div className="bg-stone-50 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-stone-100">
        <div>
          <h2 className="text-xl font-bold text-stone-900 mb-1">Add your personal email</h2>
          <p className="text-stone-500 text-sm max-w-md">
            We keep your personal travel separate from your business travel. We'll use this email address to send you information about your personal trips.
          </p>
        </div>
        <Button className="bg-purple-700 hover:bg-purple-800 text-white shadow-purple-200">
          Add personal email
        </Button>
      </div>

      {/* Categories */}
      <div className="space-y-12">
        <CategorySection 
          title="Airline" 
          icon={Plane}
          programs={programs.filter(p => p.category === 'airline')}
          onAdd={() => openAddModal('airline')}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
          addButtonText="Add flight loyalty"
        />
        <Divider />
        <CategorySection 
          title="Lodging" 
          icon={Hotel}
          programs={programs.filter(p => p.category === 'lodging')}
          onAdd={() => openAddModal('lodging')}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
          addButtonText="Add hotel loyalty"
        />
        <Divider />
        <CategorySection 
          title="Trains" 
          icon={Train}
          programs={programs.filter(p => p.category === 'train')}
          onAdd={() => openAddModal('train')}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
          addButtonText="Add train card"
        />
        <Divider />
        <CategorySection 
          title="Car rentals" 
          icon={Car}
          programs={programs.filter(p => p.category === 'car')}
          onAdd={() => openAddModal('car')}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
          addButtonText="Add car loyalty"
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={modalStep !== null} 
        onClose={() => setModalStep(null)}
        title={
          modalStep === 'select' 
            ? `Add ${selectedCategory} loyalty` 
            : editingId ? 'Edit Loyalty Program' : `Add ${selectedProvider}`
        }
      >
        {modalStep === 'select' && (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-stone-400" size={20} />
              <input 
                type="text" 
                placeholder={`Search ${selectedCategory} loyalty`} 
                className="w-full pl-12 pr-4 py-3 bg-stone-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-purple-500/20 text-stone-900"
              />
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Popular programs</h4>
              <div className="space-y-2">
                {POPULAR_AIRLINES.map((airline) => (
                  <button
                    key={airline.name}
                    onClick={() => handleSelectProvider(airline.name)}
                    className="w-full flex items-center justify-between p-3 hover:bg-stone-50 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-lg ${airline.color} flex items-center justify-center text-white shadow-sm`}>
                         <Plane size={18} />
                       </div>
                       <span className="font-semibold text-stone-900">{airline.name}</span>
                    </div>
                    <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      Add
                    </Button>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {modalStep === 'input' && (
          <div className="space-y-6">
             {/* Large Card Preview */}
             <div className="flex justify-center py-6">
                <div className="w-48 h-32 bg-gradient-to-br from-stone-800 to-black rounded-2xl flex flex-col items-center justify-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-16 bg-white/5 rounded-full blur-xl -mr-8 -mt-8"></div>
                    {React.createElement(getIconForCategory(selectedCategory), { size: 48, className: "mb-2" })}
                </div>
             </div>
             
             <div className="text-center mb-6">
               <h3 className="text-2xl font-bold text-stone-900">
                 {editingId ? 'Edit' : 'Add'} {selectedProvider}
               </h3>
               <p className="text-stone-500">
                 {editingId ? 'Update' : 'Enter'} your membership details below.
               </p>
             </div>

             <div className="space-y-4">
                <Input 
                  label="Loyalty number" 
                  placeholder="e.g. 123456789" 
                  value={loyaltyNumber}
                  onChange={(e) => setLoyaltyNumber(e.target.value)}
                  autoFocus
                />
             </div>

             <div className="flex gap-3 pt-6">
               <Button variant="ghost" fullWidth onClick={() => setModalStep(editingId ? null : 'select')}>
                 Cancel
               </Button>
               <Button 
                 fullWidth 
                 className="bg-purple-700 hover:bg-purple-800 shadow-purple-200"
                 onClick={handleSave}
               >
                 {editingId ? 'Save Changes' : 'Add'}
               </Button>
             </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={deletingProgram !== null} 
        onClose={() => setDeletingProgram(null)}
        title={`Delete ${deletingProgram?.provider}?`}
      >
        <div className="space-y-6">
          <p className="text-stone-600 text-lg leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-stone-900">{deletingProgram?.provider}</span>? 
            It will be permanently deleted from your profile.
          </p>

          <div className="flex gap-3 pt-4">
             <Button 
               variant="outline" 
               fullWidth 
               onClick={() => setDeletingProgram(null)}
             >
               Go back
             </Button>
             <Button 
               fullWidth 
               className="bg-red-600 hover:bg-red-700 text-white shadow-red-200 border-red-600"
               onClick={confirmDelete}
             >
               Delete
             </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

const CategorySection: React.FC<{
  title: string;
  icon: React.ElementType;
  programs: Program[];
  onAdd: () => void;
  onEdit: (program: Program) => void;
  onDelete: (program: Program) => void;
  addButtonText: string;
}> = ({ title, icon: Icon, programs, onAdd, onEdit, onDelete, addButtonText }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 text-stone-900">
      <Icon size={24} className="text-stone-900" />
      <h3 className="text-xl font-bold">{title}</h3>
    </div>

    <div className="space-y-3">
      {programs.map((program) => (
        <div key={program.id} className="flex items-center justify-between p-5 bg-white border border-stone-200 rounded-2xl shadow-sm animate-slide-up group">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-stone-900 rounded-xl flex items-center justify-center text-white">
                <Icon size={20} />
             </div>
             <div>
               <h4 className="font-bold text-stone-900">{program.provider}</h4>
               <p className="text-stone-500 text-sm font-mono">{program.number}</p>
             </div>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onEdit(program)}
              className="p-2 text-stone-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
            >
              <Edit2 size={18} />
            </button>
            <button 
              onClick={() => onDelete(program)} 
              className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}

      <button 
        onClick={onAdd}
        className="w-full flex items-center gap-3 p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium transition-colors border border-purple-100 border-dashed"
      >
        <div className="w-8 h-8 rounded-lg bg-purple-200 flex items-center justify-center">
          <Plus size={18} />
        </div>
        {addButtonText}
      </button>
    </div>
  </div>
);

const Divider = () => <div className="h-px bg-stone-100 w-full" />;
