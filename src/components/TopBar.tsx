import React, { useState } from 'react';
import { Search, Bell, CheckCircle2, RefreshCw } from 'lucide-react';
import { NavigationTab, SubTab } from '../types';

interface TopBarProps {
  activeTab: NavigationTab;
  activeSubTab: SubTab;
  setActiveSubTab: (tab: SubTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSyncData: () => void;
  isSyncing: boolean;
  pendingSyncCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  activeSubTab,
  setActiveSubTab,
  searchQuery,
  setSearchQuery,
  onSyncData,
  isSyncing,
  pendingSyncCount,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Artisanal Scoop Ledger';
      case 'ingredients':
        return 'Ingredients Management';
      case 'recipes':
        return 'Artisanal Scoop Ledger';
      case 'pricing':
        return 'Pricing & Profitability';
      case 'reports':
        return 'Profitability Analysis';
      default:
        return 'Scoop Ledger';
    }
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case 'ingredients':
        return 'Search ingredients...';
      case 'recipes':
        return 'Search recipes...';
      case 'pricing':
        return 'Search batches...';
      case 'reports':
        return 'Search flavor...';
      default:
        return 'Search data...';
    }
  };

  return (
    <header className="fixed top-0 left-[240px] right-0 h-16 bg-[#0D0D0F] border-b border-white/5 flex justify-between items-center px-6 z-40">
      <div className="flex items-center gap-8">
        <h2 className="font-sans text-xl font-light italic text-white tracking-tight">
          {getTitle()}
        </h2>

        {/* Sub Navigation */}
        <nav className="hidden md:flex gap-6">
          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`text-xs font-bold py-1 border-b-2 transition-colors ${
              activeSubTab === 'inventory'
                ? 'text-indigo-400 border-indigo-500'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            Inventory
          </button>
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`text-xs font-bold py-1 border-b-2 transition-colors ${
              activeSubTab === 'orders'
                ? 'text-indigo-400 border-indigo-500'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            Orders
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative hidden sm:block">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getPlaceholder()}
            className="pl-9 pr-4 py-1.5 bg-[#161619] border border-white/10 rounded-full text-white text-xs w-60 outline-none focus:border-indigo-500/50 transition-all placeholder-slate-500"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#0D0D0F]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#141417] border border-white/10 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in duration-150 text-white">
              <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                <span className="font-bold text-xs text-white">Notifications</span>
                <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">2 New</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-300">
                  <p className="font-bold text-rose-200">Milk Cost Alert</p>
                  <p className="text-slate-300 mt-0.5 text-[11px]">Whole Milk prices rose 15% this month. Review recipe margins.</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-slate-300">
                  <p className="font-bold text-indigo-300">Low Stock Warning</p>
                  <p className="text-slate-400 mt-0.5 text-[11px]">Madagascar Vanilla Beans at 0.50 kg (Low Stock threshold).</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sync Data Button */}
        <button
          onClick={onSyncData}
          disabled={isSyncing}
          className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-4 py-1.5 rounded-full font-bold text-xs hover:bg-indigo-500/20 transition-all active:scale-95 disabled:opacity-60"
        >
          {isSyncing ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
          )}
          <span>{isSyncing ? 'Syncing...' : pendingSyncCount > 0 ? `Sync ${pendingSyncCount} Pending` : 'Sync Data'}</span>
        </button>

        {/* Profile Avatar */}
        <div 
          className="h-8 w-8 rounded-full overflow-hidden border-2 border-indigo-500/60 cursor-pointer hover:border-indigo-400 transition-all shadow-md"
          title="Operational Manager Profile"
          onClick={() => alert('Operational Manager Profile: Authenticated session for Scoop Ledger Creamery #104.')}
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAtc4FCAOOQjn6AuZNyBeTsCjB37pqjgwbUxjm0xBCz0NRlvlmUboQlayLvSS78-GA_LOpzw8pMGgc-mtMOQbfxcSYilHCPuhLB1W1_3BspvFIDSL-mNovvs1W9xj_ETFsmXsLNGnXZg_57DtIsNuu2iEhnAcy7OyhRO2A-YHJvsrRTl4dmOIKbGpA5rlk6ax2u5v-f001Wi73-ebBKxgca9DJZKWr8ZLjxNMPjpJUZF5nteks4_jd"
            alt="Operational Manager"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};
