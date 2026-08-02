import React from 'react';
import { X, Printer, CheckCircle, FileCheck2, Sparkles } from 'lucide-react';
import { RecipeItem } from '../types';

interface RecipeLabelModalProps {
  recipe: RecipeItem | null;
  onClose: () => void;
}

export const RecipeLabelModal: React.FC<RecipeLabelModalProps> = ({
  recipe,
  onClose,
}) => {
  if (!recipe) return null;

  const totalCost = recipe.ingredients.reduce((sum, i) => sum + i.cost, 0);
  const servings = recipe.batchSizeLiters * 10;
  const costPerScoop = totalCost / (servings || 1);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#141417] rounded-3xl shadow-2xl w-full max-w-xl border border-white/10 overflow-hidden text-white">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#161619]">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-indigo-400" />
            <h3 className="font-sans text-xl font-light tracking-tight text-white">
              Artisanal Batch <span className="font-semibold text-indigo-400">Label</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-400 transition-colors p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Label Printable Content */}
        <div className="p-8">
          <div className="border border-indigo-500/30 rounded-2xl p-6 bg-[#161619] relative shadow-inner">
            {/* Brand Header */}
            <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-4">
              <div>
                <span className="font-sans text-xl font-light italic text-white block">
                  Scoop Ledger <span className="font-semibold text-indigo-400 not-italic">Creamery</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                  Batch Specification & COGS Tag
                </span>
              </div>
              <div className="text-right text-[11px] font-data-tabular">
                <p className="font-bold text-white">ID: #{recipe.id.toUpperCase()}</p>
                <p className="text-slate-400">Date: {recipe.createdDate}</p>
              </div>
            </div>

            {/* Flavor Title */}
            <div className="mb-4">
              <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-1">
                {recipe.baseType}
              </span>
              <h2 className="font-sans text-2xl font-bold text-white">
                {recipe.name}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Yield: <span className="font-bold text-white">{recipe.batchSizeLiters} Liters</span> ({servings} Standard Scoops)
              </p>
            </div>

            {/* Ingredients Listing */}
            <div className="mb-4 bg-[#141417] p-3.5 rounded-xl border border-white/5 text-xs">
              <span className="font-bold text-[9px] uppercase text-slate-500 tracking-wider block mb-1">
                Formulation Breakdown
              </span>
              <p className="text-slate-300 leading-relaxed font-sans">
                {recipe.ingredients.map(i => `${i.name} (${i.qty}${i.unit})`).join(', ')}
              </p>
            </div>

            {/* Cost & Retail Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center">
              <div className="bg-[#141417] p-2.5 rounded-xl border border-white/5">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">BATCH COST</span>
                <span className="font-sans font-light text-base text-emerald-400">${totalCost.toFixed(2)}</span>
              </div>
              <div className="bg-[#141417] p-2.5 rounded-xl border border-white/5">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">SCOOP COST</span>
                <span className="font-sans font-light text-base text-white">${costPerScoop.toFixed(2)}</span>
              </div>
              <div className="bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/20">
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider block">SUGGESTED RETAIL</span>
                <span className="font-sans font-semibold text-base text-indigo-300">${recipe.suggestedRetail.toFixed(2)}</span>
              </div>
            </div>

            {/* Badge Watermark */}
            <div className="mt-4 flex justify-between items-center text-[10px] text-slate-400 border-t border-white/5 pt-3">
              <span className="flex items-center gap-1 font-semibold text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Margin Verified: {(((recipe.suggestedRetail - costPerScoop) / recipe.suggestedRetail) * 100).toFixed(0)}%
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Scoop Ledger Certified
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-6 border-t border-white/5 bg-[#161619] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-white/10 text-slate-300 font-bold rounded-xl hover:bg-white/5 transition-colors text-xs"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 text-xs shadow-lg shadow-indigo-950/50 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Batch Label</span>
          </button>
        </div>
      </div>
    </div>
  );
};
