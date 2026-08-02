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
import { useSettings } from '../contexts/SettingsContext';

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
  const { t, formatCurrency } = useSettings();

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
    <div className="view-container">
      {/* Summary Bento Grid */}
      <div className="stats-grid mb-8">
        {/* Net Profit / Average Margin Card */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">
              Average Margin
            </span>
            <div className="stat-icon-wrapper emerald">
              <TrendingUp className="stat-icon" />
            </div>
          </div>
          <h3 className="stat-value">
            68.4%
          </h3>
          <p className="stat-subtext mt-1">+{formatCurrency(2.40)} net/scoop average</p>
          <div className="metric-progress-bar mt-4">
            <div className="metric-progress-fill" style={{ width: '68.4%' }} />
          </div>
        </div>

        {/* Operating Costs / Ingredient COGS Card */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">
              Ingredient COGS
            </span>
            <div className="stat-icon-wrapper indigo">
              <ShoppingBasket className="stat-icon" />
            </div>
          </div>
          <h3 className="stat-value">
            {formatCurrency(1248.50)}
          </h3>
          <p className="stat-subtext mt-1">Month-to-date expenditure</p>
          <div className="segment-bar mt-4">
            <div className="segment filled" />
            <div className="segment filled" />
            <div className="segment filled" />
            <div className="segment empty" />
          </div>
        </div>

        {/* Best Seller Card */}
        <div className="highlight-card group overflow-hidden relative">
          <div className="relative z-10">
            <span className="highlight-card-label">
              Top Performer
            </span>
            <h3 className="highlight-card-title mt-2 mb-1">
              Salted Mint Crisp
            </h3>
            <p className="highlight-card-subtitle">
              840 scoops sold this week
            </p>
            <div className="mt-4 flex-row items-center gap-2">
              <span className="highlight-card-badge">
                82% Profit
              </span>
              <span className="highlight-card-subbadge">Supabase Synced</span>
            </div>
          </div>
          <Gift className="highlight-card-icon-bg" />
        </div>
      </div>

      {/* Detailed Flavor Profitability Matrix Table */}
      <div className="table-card mb-8">
        <div className="table-header-alt flex-row-responsive">
          <div>
            <h2 className="view-title">
              {t('reports.title').split(' ')[0]} <span>{t('reports.title').split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="view-subtitle mt-0.5">
              {t('reports.subtitle')}
            </p>
          </div>

          <div className="view-actions">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Batches</option>
              <option value="Premium Batch">Premium Batch</option>
              <option value="Seasonal">Seasonal</option>
              <option value="Everyday">Everyday</option>
              <option value="Specialty">Specialty</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="action-btn-secondary"
            >
              <Download className="icon-sm" />
              <span>{t('reports.exportReportBtn')}</span>
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr className="header-row">
                <th>FLAVOR NAME</th>
                <th>SYNC STATUS</th>
                <th className="text-right">TOTAL COST</th>
                <th className="text-right">SELLING PRICE</th>
                <th className="text-right">NET PROFIT</th>
                <th className="w-48">MARGIN HEALTH</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filteredFlavors.map((flavor) => (
                <tr key={flavor.id}>
                  <td>
                    <div className="flex-row items-center gap-3">
                      <div className="icon-wrapper indigo-outline">
                        <Gift className="icon-sm" />
                      </div>
                      <div>
                        <div className="font-bold text-white">{flavor.name}</div>
                        <div className="flavor-type-tag">
                          {flavor.type}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    {flavor.syncStatus === 'Supabase' ? (
                      <span className="status-badge-outline emerald">
                        <span className="status-dot emerald animate-pulse" />
                        Supabase
                      </span>
                    ) : (
                      <span className="status-badge-outline neutral">
                        <Smartphone className="icon-xs" />
                        Local
                      </span>
                    )}
                  </td>

                  <td className={`text-right ${flavor.totalCost > 3 ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>
                    {formatCurrency(flavor.totalCost)}
                  </td>
                  <td className="text-right text-slate-300">{formatCurrency(flavor.sellingPrice)}</td>
                  <td className="text-right font-bold text-emerald-400">
                    +{formatCurrency(flavor.netProfit)}
                  </td>

                  <td>
                    <div className="metric-progress-bar">
                      <div
                        className={`metric-progress-fill ${
                          flavor.marginHealthPercent >= 65
                            ? 'health'
                            : flavor.marginHealthPercent >= 40
                            ? 'moderate'
                            : 'warning'
                        }`}
                        style={{ width: `${flavor.marginHealthPercent}%` }}
                      />
                    </div>
                  </td>

                  <td className="text-right relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === flavor.id ? null : flavor.id)}
                      className="menu-toggle-btn"
                    >
                      <MoreVertical className="icon-sm" />
                    </button>

                    {activeMenuId === flavor.id && (
                      <div className="dropdown-menu">
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            alert(`Flavor Options for ${flavor.name}: Unit cost breakdown calculated.`);
                          }}
                          className="dropdown-item"
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
        <div className="pagination-footer">
          <span className="pagination-info">
            SHOWING 1-{filteredFlavors.length} OF {flavors.length} FLAVORS
          </span>
          <div className="pagination-controls">
            <button className="page-btn disabled" disabled>
              <ChevronLeft className="icon-sm" />
            </button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">
              <ChevronRight className="icon-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Actionable Insights Bento Grid */}
      <div className="insights-grid">
        {/* AI Advisory Card */}
        {advisory.status === 'active' ? (
          <div className="advisory-card relative group">
            <div className="relative z-10 flex-col h-full justify-between">
              <div>
                <span className="status-badge-outline indigo mb-4 inline-flex">
                  {t('reports.aiAdvisory')}
                </span>
                <h3 className="advisory-title mb-2">
                  {advisory.title}
                </h3>
                <p className="advisory-desc mb-6">
                  {advisory.body}
                </p>
              </div>

              <div className="advisory-actions">
                <button
                  onClick={onUpdateRecipeFromAdvisory}
                  className="action-btn-primary"
                >
                  {t('reports.applyOptimization')}
                </button>
                <button
                  onClick={onDismissAdvisory}
                  className="action-btn-secondary"
                >
                  {t('reports.dismiss')}
                </button>
              </div>
            </div>

            {/* Decorative Graphic */}
            <div className="advisory-icon-bg">
              <Lightbulb className="icon-hero" />
            </div>
          </div>
        ) : (
          <div className="advisory-card-resolved">
            <CheckCircle2 className="icon-lg emerald shrink-0" />
            <div>
              <h3 className="advisory-title-small emerald">Advisory Resolved</h3>
              <p className="advisory-desc mt-0.5">
                Double Dark Cocoa recipe updated with Bulk Cocoa supplier Natura ({formatCurrency(0.45)}/scoop savings applied).
              </p>
            </div>
          </div>
        )}

        {/* Supabase Sync Action Card */}
        <div className="sync-card">
          <div className="sync-icon-wrapper mb-2 mt-2">
            <CloudUpload className="icon-lg" />
          </div>
          <div>
            <h3 className="sync-title mb-2">
              {t('reports.databaseSync')}
            </h3>
            <p className="sync-desc mb-6">
              {pendingSyncCount > 0 
                ? `${pendingSyncCount} flavors have local changes that haven't been pushed to the main database.`
                : 'All flavor profitability models are fully synchronized with Cloud database.'}
            </p>
          </div>
          <button
            onClick={onSyncData}
            disabled={pendingSyncCount === 0}
            className={`action-btn-primary full-width ${pendingSyncCount === 0 ? 'disabled' : ''}`}
          >
            <CloudUpload className="icon-sm" />
            <span>{pendingSyncCount > 0 ? `Sync ${pendingSyncCount} Pending Changes` : 'All Synced'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
