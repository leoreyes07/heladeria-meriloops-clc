import React, { useState } from 'react';
import { Search, Bell, CheckCircle2, RefreshCw, Menu } from 'lucide-react';
import { NavigationTab, SubTab } from '../types';
import { useSettings } from '../contexts/SettingsContext';

interface TopBarProps {
  activeTab: NavigationTab;
  activeSubTab: SubTab;
  setActiveSubTab: (tab: SubTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSyncData: () => void;
  isSyncing: boolean;
  pendingSyncCount: number;
  onMenuToggle: () => void;
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
  onMenuToggle,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { t } = useSettings();

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return t('sidebar.dashboard');
      case 'ingredients': return t('sidebar.ingredients');
      case 'recipes': return t('sidebar.recipes');
      case 'pricing': return t('sidebar.pricing');
      case 'reports': return t('sidebar.reports');
      default: return t('sidebar.brandTitle');
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button 
          className="topbar-menu-btn" 
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu className="topbar-icon" />
        </button>
        <h2 className="topbar-title">
          {getTitle()}
        </h2>

        {/* Sub Navigation */}
        <nav className="topbar-subnav">
          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`topbar-subnav-btn ${activeSubTab === 'inventory' ? 'active' : ''}`}
          >
            Inventory
          </button>
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`topbar-subnav-btn ${activeSubTab === 'orders' ? 'active' : ''}`}
          >
            Orders
          </button>
        </nav>
      </div>

      <div className="topbar-right">
        {/* Search Bar */}
        <div className="topbar-search-container">
          <Search className="topbar-search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('topbar.searchPlaceholder')}
            className="topbar-search-input"
          />
        </div>

        {/* Notifications */}
        <div className="topbar-notifications-container">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="topbar-bell-btn"
            title={t('topbar.notifications')}
          >
            <Bell className="topbar-icon" />
            <span className="topbar-notification-badge" />
          </button>

          {showNotifications && (
            <div className="topbar-notifications-dropdown">
              <div className="topbar-notifications-header">
                <span className="topbar-notifications-title">{t('topbar.notifications')}</span>
                <span className="topbar-notifications-count">2 New</span>
              </div>
              <div className="topbar-notifications-list">
                <div className="topbar-notification-item alert">
                  <p className="topbar-notification-item-title">Milk Cost Alert</p>
                  <p className="topbar-notification-item-desc">Whole Milk prices rose 15% this month. Review recipe margins.</p>
                </div>
                <div className="topbar-notification-item warning">
                  <p className="topbar-notification-item-title">Low Stock Warning</p>
                  <p className="topbar-notification-item-desc">Madagascar Vanilla Beans at 0.50 kg (Low Stock threshold).</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sync Data Button */}
        <button
          onClick={onSyncData}
          disabled={isSyncing}
          className="topbar-sync-btn"
        >
          {isSyncing ? (
            <RefreshCw className="topbar-sync-icon spinning" />
          ) : (
            <CheckCircle2 className="topbar-sync-icon" />
          )}
          <span>{isSyncing ? t('topbar.syncing') : pendingSyncCount > 0 ? t('topbar.syncPending').replace('{count}', pendingSyncCount.toString()) : t('reports.syncNow')}</span>
        </button>

        {/* Profile Avatar */}
        <div 
          className="topbar-avatar"
        >
          <img
            src="https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff"
            alt="Operational Manager"
          />
        </div>
      </div>
    </header>
  );
};
