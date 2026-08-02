import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  BookOpen, 
  CreditCard, 
  BarChart3, 
  Plus, 
  Settings, 
  HelpCircle 
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onOpenNewRecipeModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewRecipeModal,
}) => {
  const navItems = [
    { id: 'dashboard' as NavigationTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ingredients' as NavigationTab, label: 'Ingredients', icon: Package },
    { id: 'recipes' as NavigationTab, label: 'Recipes', icon: BookOpen },
    { id: 'pricing' as NavigationTab, label: 'Pricing', icon: CreditCard },
    { id: 'reports' as NavigationTab, label: 'Reports', icon: BarChart3 },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-[#0D0D0F] border-r border-white/5 flex flex-col py-6 z-50 select-none">
      {/* Brand Header */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <div>
            <h1 className="font-sans text-base font-bold text-white tracking-tight leading-none">
              SCOOP LEDGER
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">
              OPERATIONAL MANAGER
            </p>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-3 mb-2">
          Core Systems
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all font-medium text-sm ${
                isActive
                  ? 'bg-white/10 text-white border-l-2 border-indigo-500 shadow-sm'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto px-3 pt-4 space-y-1 border-t border-white/5">
        <button
          onClick={() => {
            setActiveTab('recipes');
            onOpenNewRecipeModal();
          }}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2.5 rounded-xl font-bold hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition-all shadow-md shadow-indigo-950/50 text-xs mb-3"
        >
          <Plus className="w-4 h-4" />
          <span>New Recipe</span>
        </button>

        <a
          href="#settings"
          onClick={(e) => { e.preventDefault(); alert('Scoop Ledger Settings: System preferences & unit defaults saved.'); }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors text-xs font-medium"
        >
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Settings</span>
        </a>
        <a
          href="#support"
          onClick={(e) => { e.preventDefault(); alert('Scoop Ledger Support: Operational documentation & help guide.'); }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors text-xs font-medium"
        >
          <HelpCircle className="w-4 h-4 text-slate-500" />
          <span>Support</span>
        </a>
      </div>
    </aside>
  );
};
