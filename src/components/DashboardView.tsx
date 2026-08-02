import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Star, 
  Calendar, 
  Download, 
  PlusCircle, 
  Calculator, 
  FileText, 
  AlertTriangle, 
  Info,
  IceCream
} from 'lucide-react';
import { IngredientItem } from '../types';

interface DashboardViewProps {
  ingredients: IngredientItem[];
  onNavigateTab: (tab: 'ingredients' | 'recipes' | 'pricing' | 'reports') => void;
  onOpenAddIngredientModal: () => void;
  onOpenOrders: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  ingredients,
  onNavigateTab,
  onOpenAddIngredientModal,
  onOpenOrders,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');

  // Chart data for Profit vs Loss Summary
  const daysData = [
    { day: 'Mon', profit: 7.2, loss: 4.1 },
    { day: 'Tue', profit: 8.5, loss: 3.2 },
    { day: 'Wed', profit: 9.1, loss: 2.8 },
    { day: 'Thu', profit: 6.4, loss: 4.5 },
    { day: 'Fri', profit: 11.2, loss: 3.9 },
    { day: 'Sat', profit: 14.8, loss: 4.2 },
    { day: 'Sun', profit: 12.3, loss: 3.5 },
  ];

  const handleExportDashboardReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value,Note\n"
      + "Total Monthly Cost,$12450.80,+4.2% YoY\n"
      + "Current Profit Margin,64.2%,Healthy\n"
      + "Top Selling Product,Sea Salt Caramel,$5.20 margin/scoop\n"
      + "Total Active SKUs," + ingredients.length + ",Active Inventory\n";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Scoop_Ledger_Dashboard_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-[1280px] mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h2 className="font-sans text-3xl font-light text-white tracking-tight italic">
            Dashboard <span className="font-semibold text-indigo-400 not-italic">Overview</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1 font-sans">
            Real-time profitability tracking for August 2026
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setSelectedPeriod(selectedPeriod === 'This Month' ? 'Last Month' : 'This Month')}
            className="bg-[#161619] border border-white/10 px-4 py-2 rounded-xl font-bold text-xs text-slate-300 hover:bg-white/5 transition-all flex items-center gap-2 shadow-lg"
          >
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{selectedPeriod}</span>
          </button>
          <button 
            onClick={handleExportDashboardReport}
            className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-4 py-2 rounded-xl font-bold text-xs hover:bg-indigo-500/20 transition-all flex items-center gap-2 shadow-lg active:scale-95"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Metric Card 1 */}
        <div 
          onClick={() => onNavigateTab('ingredients')}
          className="col-span-12 md:col-span-4 bg-[#141417] border border-white/5 p-6 rounded-2xl card-shadow hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="p-2.5 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20">
              <DollarSign className="w-5 h-5" />
            </span>
            <span className="bg-rose-500/10 text-rose-400 text-xs font-bold px-3 py-1 rounded-full border border-rose-500/20">
              +4.2%
            </span>
          </div>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">
            Total Monthly Cost
          </p>
          <h3 className="font-sans text-3xl font-light text-white">
            $12,450.80
          </h3>
          <p className="text-slate-400 text-xs mt-2 font-sans">
            Primary driver: Madagascar Vanilla import price
          </p>
        </div>

        {/* Metric Card 2 */}
        <div 
          onClick={() => onNavigateTab('reports')}
          className="col-span-12 md:col-span-4 bg-[#141417] border border-white/5 p-6 rounded-2xl card-shadow hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/20">
              Healthy
            </span>
          </div>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">
            Current Profit Margin
          </p>
          <h3 className="font-sans text-3xl font-light text-white">
            64.2%
          </h3>
          <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden border border-white/5">
            <div className="bg-emerald-400 h-full w-[64.2%] rounded-full shadow-sm" />
          </div>
        </div>

        {/* Metric Card 3 */}
        <div 
          onClick={() => onNavigateTab('pricing')}
          className="col-span-12 md:col-span-4 bg-[#141417] border border-white/5 p-6 rounded-2xl card-shadow hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden group bg-gradient-to-br from-indigo-900/10 to-transparent"
        >
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
              <Star className="w-5 h-5 fill-current" />
            </span>
            <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider">
              High Demand
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">
              Top Selling Product
            </p>
            <h3 className="font-sans text-2xl font-light text-white truncate">
              Sea Salt Caramel
            </h3>
            <p className="text-indigo-300/80 text-xs mt-2 font-sans">
              $5.20 margin per scoop
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
            <IceCream className="w-32 h-32 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Main Grid: Chart & Actions */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Profit vs Loss Summary Chart */}
        <div className="col-span-12 lg:col-span-8 bg-[#141417] border border-white/5 p-6 rounded-3xl card-shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-sans text-sm font-bold text-white uppercase tracking-wider">
              Profit vs Loss Summary
            </h3>
            <div className="flex gap-4 text-xs font-medium">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                <span className="text-slate-400">Profit</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-purple-500 rounded-full" />
                <span className="text-slate-400">Loss / COGS</span>
              </div>
            </div>
          </div>

          <div className="h-[260px] flex items-end justify-between gap-3 px-2 pt-8 border-b border-white/5">
            {daysData.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div className="absolute -top-10 bg-[#161619] border border-white/10 text-white text-[10px] px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none whitespace-nowrap shadow-xl">
                  Profit: ${item.profit}k | Loss: ${item.loss}k
                </div>

                <div className="w-full flex justify-center items-end gap-1.5 h-full">
                  {/* Profit bar */}
                  <div
                    style={{ height: `${(item.profit / 16) * 100}%` }}
                    className="w-1/2 bg-indigo-500/80 rounded-t-lg group-hover:bg-indigo-400 transition-all"
                  />
                  {/* Loss bar */}
                  <div
                    style={{ height: `${(item.loss / 16) * 100}%` }}
                    className="w-1/2 bg-purple-500/40 rounded-t-lg group-hover:bg-purple-500/70 transition-all"
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase mt-3">
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Critical Alerts */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <div className="bg-[#141417] border border-white/5 p-6 rounded-3xl card-shadow">
            <h3 className="font-sans text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={onOpenAddIngredientModal}
                className="flex items-center gap-4 bg-[#161619] p-3.5 rounded-2xl border border-white/10 hover:border-indigo-500/40 hover:bg-white/5 transition-all text-left group"
              >
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs text-white">Add New Ingredient</p>
                  <p className="text-[11px] text-slate-400">Update inventory costs</p>
                </div>
              </button>

              <button
                onClick={() => onNavigateTab('pricing')}
                className="flex items-center gap-4 bg-[#161619] p-3.5 rounded-2xl border border-white/10 hover:border-indigo-500/40 hover:bg-white/5 transition-all text-left group"
              >
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs text-white">Check Recipe Cost</p>
                  <p className="text-[11px] text-slate-400">Calculate scoop margin</p>
                </div>
              </button>

              <button
                onClick={onOpenOrders}
                className="flex items-center gap-4 bg-[#161619] p-3.5 rounded-2xl border border-white/10 hover:border-indigo-500/40 hover:bg-white/5 transition-all text-left group"
              >
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs text-white">Review Wholesale Orders</p>
                  <p className="text-[11px] text-slate-400">Recent wholesale batches</p>
                </div>
              </button>
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="bg-[#141417] border border-white/5 p-6 rounded-3xl card-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider">
                Critical Alerts
              </h3>
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            </div>
            <ul className="space-y-3">
              <li className="flex gap-3 items-start p-3 rounded-2xl bg-rose-500/5 border border-rose-500/20">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">Milk cost increased by 15%</p>
                  <p className="text-[10px] text-rose-300">Suggest recipe optimization</p>
                </div>
              </li>
              <li className="flex gap-3 items-start p-3 rounded-2xl bg-white/5 border border-white/10">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">Stock low: Heavy Cream</p>
                  <p className="text-[10px] text-slate-400">Order needed in 2 days</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-[#141417] border border-white/5 rounded-3xl overflow-hidden card-shadow">
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-sans text-sm font-bold text-white uppercase tracking-wider">
            Recent Ingredient Adjustments
          </h3>
          <button
            onClick={() => onNavigateTab('ingredients')}
            className="text-indigo-400 font-bold text-xs hover:underline"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#161619] border-b border-white/5">
                <th className="px-6 py-3.5 font-bold text-[10px] text-slate-500 uppercase tracking-wider">Ingredient</th>
                <th className="px-6 py-3.5 font-bold text-[10px] text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3.5 font-bold text-[10px] text-slate-500 uppercase tracking-wider text-right">Unit Price</th>
                <th className="px-6 py-3.5 font-bold text-[10px] text-slate-500 uppercase tracking-wider text-right">Change</th>
                <th className="px-6 py-3.5 font-bold text-[10px] text-slate-500 uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-data-tabular text-xs">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-semibold text-white">Tahitian Vanilla Beans</td>
                <td className="px-6 py-4">
                  <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded text-[11px] text-slate-300">Flavorings</span>
                </td>
                <td className="px-6 py-4 text-right text-slate-300">$45.00/lb</td>
                <td className="px-6 py-4 text-right font-bold text-rose-400">+$3.50</td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase">
                    Price Spike
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-semibold text-white">Cane Sugar (Organic)</td>
                <td className="px-6 py-4">
                  <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded text-[11px] text-slate-300">Bases</span>
                </td>
                <td className="px-6 py-4 text-right text-slate-300">$1.20/lb</td>
                <td className="px-6 py-4 text-right font-bold text-emerald-400">-$0.10</td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase">
                    Optimized
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-semibold text-white">Pistachio Paste (Bronte)</td>
                <td className="px-6 py-4">
                  <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded text-[11px] text-slate-300">Inclusions</span>
                </td>
                <td className="px-6 py-4 text-right text-slate-300">$82.00/lb</td>
                <td className="px-6 py-4 text-right text-slate-500">---</td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-white/5 text-slate-400 border border-white/10 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase">
                    Stable
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
