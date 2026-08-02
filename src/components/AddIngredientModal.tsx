import React, { useState } from 'react';
import { X, Calculator } from 'lucide-react';
import { IngredientItem } from '../types';

interface AddIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIngredient: (ingredient: IngredientItem) => void;
}

export const AddIngredientModal: React.FC<AddIngredientModalProps> = ({
  isOpen,
  onClose,
  onAddIngredient,
}) => {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('Liters');
  const [purchaseQty, setPurchaseQty] = useState<string>('');
  const [totalCost, setTotalCost] = useState<string>('');
  const [category, setCategory] = useState<'Dairy' | 'Bases' | 'Inclusions' | 'Flavorings'>('Dairy');
  const [supplier, setSupplier] = useState('');

  if (!isOpen) return null;

  const qtyNum = parseFloat(purchaseQty) || 0;
  const costNum = parseFloat(totalCost) || 0;
  const calculatedUnitCost = qtyNum > 0 && costNum >= 0 ? costNum / qtyNum : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter an ingredient name.');
      return;
    }
    if (qtyNum <= 0) {
      alert('Please enter a purchase quantity greater than 0.');
      return;
    }

    const newIngredient: IngredientItem = {
      id: 'ing-' + Date.now(),
      name: name.trim(),
      unit,
      purchaseQty: qtyNum,
      totalCost: costNum,
      unitCost: calculatedUnitCost,
      status: 'In Stock',
      category,
      supplier: supplier.trim() || 'Local Artisanal Supplier',
      lastUpdated: 'Just now',
    };

    onAddIngredient(newIngredient);
    setName('');
    setPurchaseQty('');
    setTotalCost('');
    setSupplier('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#141417] rounded-3xl shadow-2xl w-full max-w-lg border border-white/10 overflow-hidden text-white">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#161619]">
          <h3 className="font-sans text-xl font-light tracking-tight text-white">
            New <span className="font-semibold text-indigo-400">Ingredient</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-400 transition-colors p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block font-bold text-[10px] text-slate-400 mb-1.5 uppercase tracking-wider">
                Ingredient Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Organic Strawberries"
                className="w-full px-4 py-2.5 rounded-xl bg-[#161619] border border-white/10 focus:border-indigo-500/50 outline-none text-xs text-white placeholder-slate-600"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[10px] text-slate-400 mb-1.5 uppercase tracking-wider">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#161619] border border-white/10 focus:border-indigo-500/50 outline-none text-xs text-white"
              >
                <option value="Dairy" className="bg-[#141417]">Dairy</option>
                <option value="Bases" className="bg-[#141417]">Bases</option>
                <option value="Inclusions" className="bg-[#141417]">Inclusions</option>
                <option value="Flavorings" className="bg-[#141417]">Flavorings</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[10px] text-slate-400 mb-1.5 uppercase tracking-wider">
                Unit Type
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#161619] border border-white/10 focus:border-indigo-500/50 outline-none text-xs text-white"
              >
                <option value="Liters" className="bg-[#141417]">Liters (L)</option>
                <option value="kg" className="bg-[#141417]">Kilograms (kg)</option>
                <option value="g" className="bg-[#141417]">Grams (g)</option>
                <option value="ml" className="bg-[#141417]">Milliliters (ml)</option>
                <option value="ct" className="bg-[#141417]">Units (ct)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[10px] text-slate-400 mb-1.5 uppercase tracking-wider">
                Purchase Qty
              </label>
              <input
                type="number"
                step="0.01"
                value={purchaseQty}
                onChange={(e) => setPurchaseQty(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 rounded-xl bg-[#161619] border border-white/10 focus:border-indigo-500/50 outline-none text-xs font-data-tabular text-white placeholder-slate-600"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[10px] text-slate-400 mb-1.5 uppercase tracking-wider">
                Total Cost ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={totalCost}
                onChange={(e) => setTotalCost(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 rounded-xl bg-[#161619] border border-white/10 focus:border-indigo-500/50 outline-none text-xs font-data-tabular text-white placeholder-slate-600"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block font-bold text-[10px] text-slate-400 mb-1.5 uppercase tracking-wider">
                Supplier / Vendor (Optional)
              </label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="e.g. Local Artisanal Dairy Co."
                className="w-full px-4 py-2.5 rounded-xl bg-[#161619] border border-white/10 focus:border-indigo-500/50 outline-none text-xs text-white placeholder-slate-600"
              />
            </div>

            <div className="col-span-2">
              <div className="bg-[#161619] p-3.5 rounded-2xl border border-dashed border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <Calculator className="w-4 h-4 text-indigo-400" />
                  <span>Calculated Unit Cost</span>
                </div>
                <div className="text-emerald-400 font-bold text-lg font-data-tabular">
                  ${calculatedUnitCost.toFixed(2)} / {unit.toLowerCase().includes('liter') ? 'L' : unit}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-white/10 text-slate-300 font-bold rounded-xl hover:bg-white/5 transition-colors text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition-all text-xs shadow-lg shadow-indigo-950/50"
            >
              Save Ingredient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
