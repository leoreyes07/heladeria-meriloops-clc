import React, { useState } from 'react';
import { 
  ShoppingBasket, 
  DollarSign, 
  Package, 
  TrendingUp, 
  Download, 
  Plus, 
  MoreVertical,
  Trash2,
  Edit2
} from 'lucide-react';
import { IngredientItem } from '../types';

interface IngredientsViewProps {
  ingredients: IngredientItem[];
  searchQuery: string;
  onOpenAddIngredientModal: () => void;
  onDeleteIngredient: (id: string) => void;
}

export const IngredientsView: React.FC<IngredientsViewProps> = ({
  ingredients,
  searchQuery,
  onOpenAddIngredientModal,
  onDeleteIngredient,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredIngredients = ingredients.filter((item) => {
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (categoryFilter === 'All') return matchesQuery;
    return matchesQuery && item.category === categoryFilter;
  });

  const totalValue = ingredients.reduce((sum, item) => sum + item.totalCost, 0);

  const handleExportCSV = () => {
    const header = "Ingredient Name,Category,Unit,Purchase Qty,Total Cost,Unit Cost,Status,Supplier\n";
    const rows = ingredients.map(i => 
      `"${i.name}","${i.category}","${i.unit}",${i.purchaseQty},${i.totalCost},${i.unitCost},"${i.status}","${i.supplier || ''}"`
    ).join("\n");

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + header + rows);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Scoop_Ledger_Ingredient_Ledger.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-[1280px] mx-auto w-full">
      {/* Dashboard Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#141417] border border-white/5 p-6 rounded-2xl hover:-translate-y-0.5 transition-all duration-200 card-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">
              Total SKUs
            </span>
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <ShoppingBasket className="w-5 h-5" />
            </div>
          </div>
          <div className="font-sans text-3xl font-light text-white">
            {ingredients.length}
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1 text-indigo-400" />
            <span className="text-indigo-400 font-bold mr-1">+3</span> this month
          </div>
        </div>

        <div className="bg-[#141417] border border-white/5 p-6 rounded-2xl hover:-translate-y-0.5 transition-all duration-200 card-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">
              Avg Margin
            </span>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="font-sans text-3xl font-light text-white">
            68.4%
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden border border-white/5">
            <div className="bg-emerald-400 h-full" style={{ width: '68.4%' }} />
          </div>
        </div>

        <div className="bg-[#141417] border border-white/5 p-6 rounded-2xl hover:-translate-y-0.5 transition-all duration-200 card-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">
              Inventory Value
            </span>
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="font-sans text-3xl font-light text-white">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Updated 2h ago
          </div>
        </div>
      </div>

      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="font-sans text-2xl font-light text-white tracking-tight italic">
            Ingredient <span className="font-semibold text-indigo-400 not-italic">Ledger</span>
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">
            Real-time cost tracking and stock monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Category Filter dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-white/10 text-white text-xs font-bold rounded-xl bg-[#161619] outline-none focus:border-indigo-500/50"
          >
            <option value="All" className="bg-[#141417]">All Categories</option>
            <option value="Dairy" className="bg-[#141417]">Dairy</option>
            <option value="Bases" className="bg-[#141417]">Bases</option>
            <option value="Inclusions" className="bg-[#141417]">Inclusions</option>
            <option value="Flavorings" className="bg-[#141417]">Flavorings</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#161619] border border-white/10 text-slate-300 font-bold rounded-xl hover:bg-white/5 hover:text-white transition-colors flex items-center text-xs shadow-md"
          >
            <Download className="mr-1.5 w-4 h-4 text-indigo-400" /> Export CSV
          </button>
          
          <button
            onClick={onOpenAddIngredientModal}
            className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition-all flex items-center text-xs shadow-lg shadow-indigo-950/50"
          >
            <Plus className="mr-1.5 w-4 h-4" /> Add Ingredient
          </button>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-[#141417] border border-white/5 rounded-3xl overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#161619] border-b border-white/5">
                <th className="px-6 py-3.5 font-bold text-[10px] text-slate-500 uppercase tracking-wider">
                  Ingredient Name
                </th>
                <th className="px-6 py-3.5 font-bold text-[10px] text-slate-500 uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-6 py-3.5 font-bold text-[10px] text-slate-500 uppercase tracking-wider text-right">
                  Purchase Qty
                </th>
                <th className="px-6 py-3.5 font-bold text-[10px] text-slate-500 uppercase tracking-wider text-right">
                  Total Cost
                </th>
                <th className="px-6 py-3.5 font-bold text-[10px] text-slate-500 uppercase tracking-wider text-right">
                  Unit Cost
                </th>
                <th className="px-6 py-3.5 font-bold text-[10px] text-slate-500 uppercase tracking-wider text-center">
                  Status
                </th>
                <th className="px-6 py-3.5 font-bold text-[10px] text-slate-500 uppercase tracking-wider w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-data-tabular text-xs">
              {filteredIngredients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No ingredients found matching your search.
                  </td>
                </tr>
              ) : (
                filteredIngredients.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">
                      <div>
                        <span>{item.name}</span>
                        {item.supplier && (
                          <div className="text-[11px] font-normal text-slate-500">
                            {item.supplier}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{item.unit}</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-300">
                      {item.purchaseQty.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-white">
                      ${item.totalCost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right text-indigo-400 font-bold">
                      ${item.unitCost.toFixed(2)}/{item.unit.toLowerCase().includes('liter') ? 'L' : item.unit}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.status === 'In Stock'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : item.status === 'Low Stock'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-white/5 text-slate-400 border border-white/10'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeMenuId === item.id && (
                        <div className="absolute right-6 top-12 bg-[#141417] border border-white/10 rounded-xl shadow-2xl py-1.5 w-36 z-30 text-xs text-left text-white">
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              alert(`Editing ingredient: ${item.name}`);
                            }}
                            className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-white/5 text-slate-300 hover:text-white"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Edit Details</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onDeleteIngredient(item.id);
                            }}
                            className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-rose-500/10 text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete SKU</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-3.5 border-t border-white/5 flex items-center justify-between bg-[#161619]">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Showing {filteredIngredients.length} of {ingredients.length} ingredients
          </span>
          <div className="flex gap-1">
            <button className="px-2 py-1 border border-white/10 rounded-lg text-xs text-slate-500 disabled:opacity-30" disabled>
              Prev
            </button>
            <button className="px-2.5 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-xs font-bold">1</button>
            <button className="px-2.5 py-1 border border-white/10 hover:bg-white/5 rounded-lg text-xs font-medium text-slate-400">2</button>
            <button className="px-2.5 py-1 border border-white/10 hover:bg-white/5 rounded-lg text-xs font-medium text-slate-400">3</button>
            <button className="px-2 py-1 border border-white/10 rounded-lg text-xs text-slate-300 hover:bg-white/5">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Visual Context - Inventory Insights & Cost Tip */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl overflow-hidden relative h-60 group shadow-2xl border border-white/5">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDbKom_Pd4yet4fvpd1ejgj2TwfO_UmEw9F7y-pb1JtgjWt1jwzOhRRX1QSEPKzOLpxbJD7O9jURn6FZ42JxPJJ6kYLX4jDJAfnZMw2nGpvrIDf4XMUOdKzoBJeQWOGLdu8fJu1EkXlBQ7aZZmeilejtKNPaz6MksTKOWq3Zx4-AjxOhZmwKjs-gW6ujFbjJBUTVIP3eWYJGe6r2YVjHLv2Vcn3_N8YVL_G9bVwbK2YZr3MKk2zFO5"
            alt="Artisanal ice cream ingredients"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/40 to-transparent flex flex-col justify-end p-6">
            <h4 className="text-white font-sans text-lg font-bold">
              Inventory Insights
            </h4>
            <p className="text-slate-300 text-xs mt-1 leading-relaxed">
              Premium ingredients currently account for 64% of your COGS. Consider seasonal bulk purchasing for Vanilla and Pistachios.
            </p>
          </div>
        </div>

        <div className="bg-[#141417] rounded-2xl p-6 border border-white/5 flex flex-col justify-center card-shadow">
          <h4 className="font-sans text-lg font-bold text-indigo-400 mb-2">
            Cost Optimization Tip
          </h4>
          <p className="text-slate-300 text-xs leading-relaxed mb-4">
            Your unit cost for <span className="font-bold text-white">Whole Cream</span> has increased by 12% since last month. Check the vendor dashboard for alternative local artisanal suppliers to maintain your 68% profit margin goal.
          </p>
          <button 
            onClick={() => alert('Market Rates Comparison: Local Creamery Co ($7.90/L) vs Artisanal Dairy ($8.50/L). Switching yields +$0.60/L savings.')}
            className="w-fit px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-xl font-bold text-xs hover:bg-indigo-500/20 transition-all active:scale-95 shadow-md"
          >
            View Market Rates
          </button>
        </div>
      </div>
    </div>
  );
};
