import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShoppingBasket, 
  Gift, 
  Filter, 
  Download, 
  MoreVertical, 
  Lightbulb, 
  CloudUpload,
  Smartphone,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { FlavorProfitability, AIAdvisoryAlert } from '../types';

interface ReportsViewProps {
  flavors: FlavorProfitability[];
  advisory: AIAdvisoryAlert;
  searchQuery: string;
  onSyncData: () => void;
  onUpdateRecipeFromAdvisory: () => void;
  onDismissAdvisory: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  flavors,
  advisory,
  searchQuery,
  onSyncData,
  onUpdateRecipeFromAdvisory,
  onDismissAdvisory,
}) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredFlavors = flavors.filter((f) => {
    const matchesQuery = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'All') return matchesQuery;
    return matchesQuery && f.type === filterType;
  });

  const handleExportCSV = () => {
    const header = "Flavor Name,Type,Sync Status,Total Cost,Selling Price,Net Profit,Margin Health %\n";
    const rows = flavors.map(f => 
      `"${f.name}","${f.type}","${f.syncStatus}",${f.totalCost},${f.sellingPrice},${f.netProfit},${f.marginHealthPercent}`
    ).join("\n");

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + header + rows);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Scoop_Ledger_Flavor_Profitability_Matrix.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pendingSyncCount = flavors.filter(f => f.syncStatus === 'Local').length;

  return (
    <div className="p-6 max-w-[1280px] mx-auto w-full">
      {/* Summary Bento Grid */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Net Profit / Average Margin Card */}
        <div className="col-span-12 md:col-span-4 bg-[#141417] border border-white/5 p-6 rounded-3xl card-shadow hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">
              Average Margin
            </span>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <h3 className="font-sans text-3xl font-light text-white mb-1">
            68.4%
          </h3>
          <p className="text-xs text-slate-400">+$2.40 net/scoop average</p>
          <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div className="h-full bg-emerald-400" style={{ width: '68.4%' }} />
          </div>
        </div>

        {/* Operating Costs / Ingredient COGS Card */}
        <div className="col-span-12 md:col-span-4 bg-[#141417] border border-white/5 p-6 rounded-3xl card-shadow hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">
              Ingredient COGS
            </span>
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <ShoppingBasket className="w-5 h-5" />
            </div>
          </div>
          <h3 className="font-sans text-3xl font-light text-white mb-1">
            $1,248.50
          </h3>
          <p className="text-xs text-slate-400">Month-to-date expenditure</p>
          <div className="mt-4 flex gap-1.5">
            <div className="h-1 bg-indigo-500 flex-1 rounded-full" />
            <div className="h-1 bg-indigo-500 flex-1 rounded-full" />
            <div className="h-1 bg-indigo-500 flex-1 rounded-full" />
            <div className="h-1 bg-white/10 flex-1 rounded-full" />
          </div>
        </div>

        {/* Best Seller Card */}
        <div className="col-span-12 md:col-span-4 bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-indigo-500/20 text-white p-6 rounded-3xl card-shadow hover:-translate-y-0.5 transition-all overflow-hidden relative">
          <div className="relative z-10">
            <span className="text-indigo-300 font-bold text-[10px] uppercase tracking-wider">
              Top Performer
            </span>
            <h3 className="font-sans text-2xl font-bold mt-2 mb-1">
              Salted Mint Crisp
            </h3>
            <p className="text-indigo-200/80 text-xs">
              840 scoops sold this week
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="bg-indigo-400 text-slate-950 px-3 py-1 rounded-full text-xs font-bold">
                82% Profit
              </span>
              <span className="text-[11px] text-indigo-200/70">Supabase Synced</span>
            </div>
          </div>
          <Gift className="w-28 h-28 absolute -bottom-4 -right-4 opacity-10 rotate-12 text-indigo-300" />
        </div>
      </div>

      {/* Detailed Flavor Profitability Matrix Table */}
      <div className="bg-[#141417] border border-white/5 rounded-3xl card-shadow overflow-hidden mb-8">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-sans text-2xl font-light text-white tracking-tight italic">
              Flavor Profitability <span className="font-semibold text-indigo-400 not-italic">Matrix</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time unit economics per scoop (4oz base)
            </p>
          </div>

          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-[#161619] border border-white/10 text-white rounded-xl font-bold text-xs outline-none focus:border-indigo-500/50"
            >
              <option value="All" className="bg-[#141417]">All Batches</option>
              <option value="Premium Batch" className="bg-[#141417]">Premium Batch</option>
              <option value="Seasonal" className="bg-[#141417]">Seasonal</option>
              <option value="Everyday" className="bg-[#141417]">Everyday</option>
              <option value="Specialty" className="bg-[#141417]">Specialty</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-[#161619] border border-white/10 text-slate-300 rounded-xl font-bold text-xs hover:bg-white/5 hover:text-white transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#161619] border-b border-white/5">
                <th className="px-6 py-3.5 font-bold text-[10px] text-slate-500 uppercase">FLAVOR NAME</th>
                <th className="px-6 py-3.5 font-bold text-[10px] text-slate-500 uppercase">SYNC STATUS</th>
                <th className="px-6 py-3.5 font-bold text-[10px] text-slate-500 uppercase text-right">TOTAL COST</th>
                <th className="px-6 py-3.5 font-bold text-[10px] text-slate-500 uppercase text-right">SELLING PRICE</th>
                <th className="px-6 py-3.5 font-bold text-[10px] text-slate-500 uppercase text-right">NET PROFIT</th>
                <th className="px-6 py-3.5 font-bold text-[10px] text-slate-500 uppercase w-48">MARGIN HEALTH</th>
                <th className="px-6 py-3.5 w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-data-tabular text-xs">
              {filteredFlavors.map((flavor) => (
                <tr key={flavor.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                        <Gift className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white">{flavor.name}</div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                          {flavor.type}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {flavor.syncStatus === 'Supabase' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Supabase
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-slate-400">
                        <Smartphone className="w-3.5 h-3.5" />
                        Local
                      </span>
                    )}
                  </td>

                  <td className={`px-6 py-4 text-right ${flavor.totalCost > 3 ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>
                    ${flavor.totalCost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-300">${flavor.sellingPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-400">
                    +${flavor.netProfit.toFixed(2)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="w-full bg-white/5 rounded-full h-2 border border-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          flavor.marginHealthPercent >= 65
                            ? 'bg-emerald-400'
                            : flavor.marginHealthPercent >= 40
                            ? 'bg-indigo-400'
                            : 'bg-rose-400'
                        }`}
                        style={{ width: `${flavor.marginHealthPercent}%` }}
                      />
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === flavor.id ? null : flavor.id)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === flavor.id && (
                      <div className="absolute right-6 top-12 bg-[#141417] border border-white/10 rounded-xl shadow-2xl py-1.5 text-xs text-left w-40 z-30 text-white">
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            alert(`Flavor Options for ${flavor.name}: Unit cost breakdown calculated.`);
                          }}
                          className="w-full px-3 py-1.5 hover:bg-white/5 text-slate-300 hover:text-white"
                        >
                          View Unit Economics
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-[#161619] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            SHOWING 1-{filteredFlavors.length} OF {flavors.length} FLAVORS
          </span>
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 bg-[#141417] border border-white/10 rounded-lg text-slate-500 disabled:opacity-30" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-bold text-xs">1</button>
            <button className="w-8 h-8 hover:bg-white/5 text-slate-400 rounded-lg font-bold text-xs">2</button>
            <button className="w-8 h-8 hover:bg-white/5 text-slate-400 rounded-lg font-bold text-xs">3</button>
            <button className="p-1.5 bg-[#141417] border border-white/10 rounded-lg text-slate-300 hover:bg-white/5">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Actionable Insights Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* AI Advisory Card */}
        {advisory.status === 'active' ? (
          <div className="col-span-12 md:col-span-8 bg-[#141417] p-8 rounded-3xl border border-white/5 relative overflow-hidden group card-shadow">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <span className="inline-flex px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                  AI Advisory
                </span>
                <h3 className="font-sans text-2xl font-bold text-white mb-2">
                  {advisory.title}
                </h3>
                <p className="text-xs text-slate-300 max-w-xl mb-6 leading-relaxed">
                  {advisory.body}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={onUpdateRecipeFromAdvisory}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-xs hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-950/50 active:scale-95"
                >
                  Update Recipe Ingredients
                </button>
                <button
                  onClick={onDismissAdvisory}
                  className="bg-[#161619] border border-white/10 text-slate-300 px-6 py-3 rounded-xl font-bold text-xs hover:bg-white/5 hover:text-white transition-all"
                >
                  Dismiss Alert
                </button>
              </div>
            </div>

            {/* Decorative Graphic */}
            <div className="absolute right-6 bottom-6 opacity-10 pointer-events-none">
              <Lightbulb className="w-40 h-40 text-indigo-400" />
            </div>
          </div>
        ) : (
          <div className="col-span-12 md:col-span-8 bg-emerald-500/10 p-8 rounded-3xl border border-emerald-500/20 flex items-center gap-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <h3 className="font-bold text-sm text-emerald-400">Advisory Resolved</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Double Dark Cocoa recipe updated with Bulk Cocoa supplier Natura ($0.45/scoop savings applied).
              </p>
            </div>
          </div>
        )}

        {/* Supabase Sync Action Card */}
        <div className="col-span-12 md:col-span-4 bg-[#141417] border border-white/5 p-6 rounded-3xl card-shadow flex flex-col items-center text-center justify-between">
          <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-2 mt-2">
            <CloudUpload className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-sans text-xl font-bold text-white mb-2">
              Supabase Sync
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {pendingSyncCount > 0 
                ? `${pendingSyncCount} flavors have local changes that haven't been pushed to the main database.`
                : 'All flavor profitability models are fully synchronized with Cloud database.'}
            </p>
          </div>
          <button
            onClick={onSyncData}
            disabled={pendingSyncCount === 0}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-xs hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-950/50 active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
          >
            <CloudUpload className="w-4 h-4" />
            <span>{pendingSyncCount > 0 ? `Sync ${pendingSyncCount} Pending Changes` : 'All Synced'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
