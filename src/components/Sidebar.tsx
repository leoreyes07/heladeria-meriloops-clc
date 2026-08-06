import React from 'react';
import { HelpCircle, Settings, Plus, BarChart3, CreditCard, BookOpen, Package, LayoutDashboard } from 'lucide-react';
import { NavigationTab } from '../types';
import { useSettings } from '../contexts/SettingsContext';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onOpenNewRecipeModal: () => void;
  onOpenSettingsModal: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewRecipeModal,
  onOpenSettingsModal,
  isOpen,
  onClose
}) => {
  const { t } = useSettings();

  const navItems = [
    { id: 'dashboard' as NavigationTab, label: t('sidebar.dashboard'), icon: LayoutDashboard },
    { id: 'ingredients' as NavigationTab, label: t('sidebar.ingredients'), icon: Package },
    { id: 'recipes' as NavigationTab, label: t('sidebar.recipes'), icon: BookOpen },
    { id: 'pricing' as NavigationTab, label: t('sidebar.pricing'), icon: CreditCard },
    { id: 'reports' as NavigationTab, label: t('sidebar.reports'), icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="sidebar-mobile-overlay"
          onClick={onClose}
        />
      )}
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand-header">
        <div className="sidebar-brand-logo-container">
          <div className="sidebar-brand-logo">
            <img src="/logo.png" alt="Meriloops Logo" className="sidebar-brand-img" />
          </div>
          <div>
            <h1 className="sidebar-brand-title">
              {t('sidebar.brandTitle')}
            </h1>
            <p className="sidebar-brand-subtitle">
              {t('sidebar.brandSubtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-title">
          {t('sidebar.coreSystems')}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                onClose();
              }}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className={`sidebar-nav-icon ${isActive ? 'active' : ''}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="sidebar-bottom-actions">
        <button
          onClick={() => {
            setActiveTab('recipes');
            onOpenNewRecipeModal();
          }}
          className="sidebar-new-recipe-btn"
        >
          <Plus className="sidebar-icon" />
          <span>{t('sidebar.newRecipe')}</span>
        </button>

        <a
          href="#settings"
          onClick={(e) => { e.preventDefault(); onOpenSettingsModal(); }}
          className="sidebar-bottom-link"
        >
          <Settings className="sidebar-icon" />
          <span>{t('sidebar.settings')}</span>
        </a>
        <a
          href="#support"
          onClick={(e) => { e.preventDefault(); }}
          className="sidebar-bottom-link"
        >
          <HelpCircle className="sidebar-icon" />
          <span>{t('sidebar.support')}</span>
        </a>
      </div>
    </aside>
    </>
  );
};
