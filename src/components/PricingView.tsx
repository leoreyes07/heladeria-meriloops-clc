import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  Plus
} from 'lucide-react';
import { RecipeItem } from '../types';

interface PricingViewProps {
  recipes: RecipeItem[];
}

export const PricingView: React.FC<PricingViewProps> = ({ recipes }) => {
  const [activeMode, setActiveMode] = useState<'recipe' | 'global'>('recipe');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(recipes[0]?.id || 'rec-2');

  // Interactive Calculator State
  const [targetMargin, setTargetMargin] = useState<number>(65);
  const [desiredSellingPrice, setDesiredSellingPrice] = useState<number>(6.50);

  // Overhead Presets
  const [laborAllocation, setLaborAllocation] = useState<number>(1.10);
  const [rentUtilities, setRentUtilities] = useState<number>(0.45);
  const [packagingLogistics, setPackagingLogistics] = useState<number>(0.25);

  const selectedRecipe = recipes.find(r => r.id === selectedRecipeId) || recipes[0];
  
  // Calculate ingredient cost per unit (per 4oz scoop)
  const totalBatchCost = selectedRecipe ? selectedRecipe.ingredients.reduce((sum, i) => sum + i.cost, 0) : 13.10;
  const batchLiters = selectedRecipe ? selectedRecipe.batchSizeLiters : 5;
  const scoopsPerBatch = batchLiters * 10; // 10 scoops per liter (4oz / 100ml)
  const ingredientUnitCost = scoopsPerBatch > 0 ? (totalBatchCost / scoopsPerBatch) : 1.85;

  const totalOverhead = laborAllocation + rentUtilities + packagingLogistics;
  const totalUnitCost = ingredientUnitCost + totalOverhead;
  const actualUnitProfit = desiredSellingPrice - totalUnitCost;
  const actualMarginPercent = desiredSellingPrice > 0 ? (actualUnitProfit / desiredSellingPrice) * 100 : 0;

  // Monthly fixed overhead total (e.g. $4,500 monthly rent + utilities)
  const monthlyFixedCost = 4526;
  const breakEvenUnits = actualUnitProfit > 0 ? Math.ceil(monthlyFixedCost / actualUnitProfit) : 0;

  // Cost % of Selling Price
  const ingredientPercent = desiredSellingPrice > 0 ? (ingredientUnitCost / desiredSellingPrice) * 100 : 0;
  const laborPercent = desiredSellingPrice > 0 ? (laborAllocation / desiredSellingPrice) * 100 : 0;
  const overheadPercent = desiredSellingPrice > 0 ? (rentUtilities + packagingLogistics) / desiredSellingPrice * 100 : 0;
  const totalCostPercent = desiredSellingPrice > 0 ? (totalUnitCost / desiredSellingPrice) * 100 : 0;
  const profitMarginPercent = 100 - totalCostPercent;

  return (
    <div className="p-6 max-w-[1280px] mx-auto w-full">
      {/* Header Section */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h3 className="font-sans text-3xl font-light text-white tracking-tight italic">
              Batch Profit <span className="font-semibold text-indigo-400 not-italic">Analysis</span>
            </h3>
            <p className="text-slate-400 max-w-xl text-xs mt-1 leading-relaxed">
              Adjust your target margins or selling prices to understand the impact on your bottom line. All calculations include automated overhead allocations.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#141417] p-1.5 rounded-2xl border border-white/5 shadow-md">
            <button
              onClick={() => setActiveMode('recipe')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors ${
                activeMode === 'recipe'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Recipe View
            </button>
            <button
              onClick={() => setActiveMode('global')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors ${
                activeMode === 'global'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Global Benchmarks
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Inputs & Controls */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-[#141417] border border-white/5 p-6 rounded-3xl card-shadow">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                <Calculator className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-500">
                Pricing Model
              </h4>
            </div>

            <div className="space-y-6">
              {/* Recipe Selector */}
              <div className="space-y-2">
                <label className="font-bold text-xs text-slate-300">Select Recipe</label>
                <select
                  value={selectedRecipeId}
                  onChange={(e) => setSelectedRecipeId(e.target.value)}
                  className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-sans focus:border-indigo-500/50 outline-none"
                >
                  {recipes.map((r) => (
                    <option key={r.id} value={r.id} className="bg-[#141417]">
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Margin & Desired Selling Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-bold text-xs text-slate-300">Target Margin %</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={targetMargin}
                      onChange={(e) => setTargetMargin(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#161619] border border-white/10 rounded-xl pl-3 pr-8 py-2.5 font-data-tabular text-xs text-white focus:border-indigo-500/50 outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-xs text-slate-300">Desired Selling Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">$</span>
                    <input
                      type="number"
                      step="0.25"
                      value={desiredSellingPrice}
                      onChange={(e) => setDesiredSellingPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#161619] border border-white/10 rounded-xl pl-7 pr-3 py-2.5 font-data-tabular text-xs text-white focus:border-indigo-500/50 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Overhead Presets */}
              <div className="p-4 bg-[#161619] rounded-2xl border border-white/10">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Overhead Presets (Per Unit)
                </h5>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Labor Allocation</span>
                    <input
                      type="number"
                      step="0.05"
                      value={laborAllocation}
                      onChange={(e) => setLaborAllocation(parseFloat(e.target.value) || 0)}
                      className="w-20 text-right bg-[#141417] border border-white/10 rounded-lg px-2 py-1 font-data-tabular text-white outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Rent & Utilities</span>
                    <input
                      type="number"
                      step="0.05"
                      value={rentUtilities}
                      onChange={(e) => setRentUtilities(parseFloat(e.target.value) || 0)}
                      className="w-20 text-right bg-[#141417] border border-white/10 rounded-lg px-2 py-1 font-data-tabular text-white outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Packaging & Logistics</span>
                    <input
                      type="number"
                      step="0.05"
                      value={packagingLogistics}
                      onChange={(e) => setPackagingLogistics(parseFloat(e.target.value) || 0)}
                      className="w-20 text-right bg-[#141417] border border-white/10 rounded-lg px-2 py-1 font-data-tabular text-white outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Bestseller Card */}
          <div className="bg-[#141417] border border-white/5 overflow-hidden rounded-3xl h-64 relative card-shadow group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBc4Nw8O1DHkLRVEL8OQWhc6X_xS0Q1IFNYxOy2vqCRPshe22BfVapGe64U7VfUGf7hWeuQHZd8wno7iNMhjw_6d78ka6reW7e-4kMKx9oz7SHaDjTsN7yP8R1-X_6yiuoH6iS3c_-_MtDb2-STpy-IYTRMiiGsJIqVjppQCJe-PHzPQryOeTgmaGbBfvu61Az_9F-k2iXQO2ugl2QoUjSPV6qz2wpyO4hM5_iC8g8ASxbRwNk6K-l"
              alt="Vanilla Bean Ice Cream"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/40 to-transparent flex items-end p-6">
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  Current Bestseller
                </p>
                <h4 className="text-white font-sans text-xl font-bold mt-0.5">
                  {selectedRecipe ? selectedRecipe.name : 'Vanilla Bean Performance'}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Breakdown & Visuals */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Large Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#141417] border border-white/5 p-6 rounded-3xl card-shadow flex flex-col justify-between">
              <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                Unit Profit
              </span>
              <div className="mt-4">
                <span className="text-3xl font-sans font-light text-emerald-400">
                  ${actualUnitProfit.toFixed(2)}
                </span>
                <div className="mt-2 flex items-center gap-1 text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold">
                    {actualMarginPercent >= targetMargin ? 'Target met' : 'Below target'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#141417] border border-white/5 p-6 rounded-3xl card-shadow flex flex-col justify-between">
              <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                Actual Margin
              </span>
              <div className="mt-4">
                <span className="text-3xl font-sans font-light text-white">
                  {actualMarginPercent.toFixed(1)}%
                </span>
                <div className="mt-2 flex items-center gap-1 text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-bold">
                    {actualMarginPercent < 50 ? 'High COGS risk' : 'Close to threshold'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#141417] border border-white/5 p-6 rounded-3xl card-shadow flex flex-col justify-between">
              <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                Break-even Units
              </span>
              <div className="mt-4">
                <span className="text-3xl font-sans font-light text-indigo-400">
                  {breakEvenUnits.toLocaleString()}
                </span>
                <p className="text-xs text-slate-500 mt-1 italic">
                  Scoops/month to cover overhead
                </p>
              </div>
            </div>
          </div>

          {/* Main Breakdown Table */}
          <div className="bg-[#141417] border border-white/5 rounded-3xl overflow-hidden card-shadow">
            <div className="bg-[#161619] px-6 py-4 border-b border-white/5 flex justify-between items-center">
              <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                Cost Breakdown per Unit (4oz Scoop)
              </h4>
              <span className="text-xs text-slate-500">Effective Date: Aug 2026</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-500 font-bold text-[10px] uppercase tracking-wider border-b border-white/5 bg-[#161619]">
                    <th className="px-6 py-3.5 font-semibold">Category</th>
                    <th className="px-6 py-3.5 font-semibold">Details</th>
                    <th className="px-6 py-3.5 font-semibold text-right">Cost</th>
                    <th className="px-6 py-3.5 font-semibold text-right">% of Price</th>
                  </tr>
                </thead>
                <tbody className="font-data-tabular text-xs divide-y divide-white/5">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3 font-semibold text-white">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Ingredients
                    </td>
                    <td className="px-6 py-4 text-slate-400">Cream, Sugar, Vanilla, Inclusions</td>
                    <td className="px-6 py-4 text-right font-bold text-white">${ingredientUnitCost.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-slate-400">{ingredientPercent.toFixed(1)}%</td>
                  </tr>

                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3 font-semibold text-white">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Direct Labor
                    </td>
                    <td className="px-6 py-4 text-slate-400">Production (12 min/batch allocation)</td>
                    <td className="px-6 py-4 text-right font-bold text-white">${laborAllocation.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-slate-400">{laborPercent.toFixed(1)}%</td>
                  </tr>

                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3 font-semibold text-white">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Fixed Overhead
                    </td>
                    <td className="px-6 py-4 text-slate-400">Rent, Electricity, POS Fees, Packaging</td>
                    <td className="px-6 py-4 text-right font-bold text-white">${(rentUtilities + packagingLogistics).toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-slate-400">{overheadPercent.toFixed(1)}%</td>
                  </tr>

                  <tr className="bg-[#161619] font-bold">
                    <td className="px-6 py-4 text-white">Total Unit Cost</td>
                    <td className="px-6 py-4" />
                    <td className="px-6 py-4 text-right text-white">${totalUnitCost.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-slate-300">{totalCostPercent.toFixed(1)}%</td>
                  </tr>

                  <tr className="bg-emerald-500/10 font-bold text-xs border-t border-emerald-500/20">
                    <td className="px-6 py-5 font-sans text-emerald-400">Profit Margin</td>
                    <td className="px-6 py-5" />
                    <td className="px-6 py-5 text-right font-sans text-emerald-400">
                      ${actualUnitProfit.toFixed(2)}
                    </td>
                    <td className="px-6 py-5 text-right font-sans text-emerald-400">
                      {profitMarginPercent.toFixed(1)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Margin Health Gauge */}
          <div className="bg-[#141417] border border-white/5 p-6 rounded-3xl card-shadow">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h4 className="font-bold text-[10px] uppercase text-slate-500 mb-1 tracking-wider">
                  Margin Health Gauge
                </h4>
                <p className="text-xs text-slate-400">
                  Based on current industry standards for premium creameries.
                </p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
                {actualMarginPercent >= 60 ? 'HEALTHY' : actualMarginPercent >= 40 ? 'MODERATE' : 'HIGH RISK'}
              </div>
            </div>

            <div className="relative h-3 bg-[#161619] rounded-full overflow-hidden flex border border-white/5">
              <div className="h-full bg-rose-500/60" style={{ width: '30%' }} />
              <div className="h-full bg-amber-500/60" style={{ width: '20%' }} />
              <div className="h-full bg-emerald-500/60" style={{ width: '50%' }} />

              {/* Indicator needle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-xl z-10 transition-all duration-300"
                style={{ left: `${Math.min(98, Math.max(2, actualMarginPercent))}%` }}
              >
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45" />
              </div>
            </div>

            <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span>High Risk (0-30%)</span>
              <span>Industry Avg (50%)</span>
              <span>Premium (60%+)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
