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
import { useSettings } from '../contexts/SettingsContext';

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
  const { t, formatCurrency } = useSettings();

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
      + `Metric,Value,Note\n`
      + `${t('dashboard.totalCost')},${formatCurrency(12450.80)},+4.2% YoY\n`
      + `${t('dashboard.profitMargin')},64.2%,${t('dashboard.healthy')}\n`
      + `${t('dashboard.topSelling')},Sea Salt Caramel,${formatCurrency(5.20)} margin/scoop\n`
      + `Total Active SKUs,${ingredients.length},Active Inventory\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Scoop_Ledger_Dashboard_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">
            {t('dashboard.title')}
          </h2>
          <p className="dashboard-subtitle">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <div className="dashboard-header-actions">
          <button 
            onClick={() => setSelectedPeriod(selectedPeriod === 'This Month' ? 'Last Month' : 'This Month')}
            className="dashboard-btn"
          >
            <Calendar className="dashboard-icon" />
            <span>{selectedPeriod}</span>
          </button>
          <button 
            onClick={handleExportDashboardReport}
            className="dashboard-btn primary"
          >
            <Download className="dashboard-icon" />
            <span>{t('reports.exportReportBtn')}</span>
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="dashboard-grid top-metrics">
        {/* Metric Card 1 */}
        <div 
          onClick={() => onNavigateTab('ingredients')}
          className="dashboard-card clickable group"
        >
          <div className="dashboard-card-header">
            <span className="metric-icon-wrapper rose">
              <DollarSign className="metric-icon" />
            </span>
            <span className="metric-badge rose">
              +4.2%
            </span>
          </div>
          <p className="metric-label">
            {t('dashboard.totalCost')}
          </p>
          <h3 className="metric-value">
            {formatCurrency(12450.80)}
          </h3>
          <p className="metric-subtext">
            Primary driver: Madagascar Vanilla import price
          </p>
        </div>

        {/* Metric Card 2 */}
        <div 
          onClick={() => onNavigateTab('reports')}
          className="dashboard-card clickable group"
        >
          <div className="dashboard-card-header">
            <span className="metric-icon-wrapper emerald">
              <TrendingUp className="metric-icon" />
            </span>
            <span className="metric-badge emerald">
              {t('dashboard.healthy')}
            </span>
          </div>
          <p className="metric-label">
            {t('dashboard.profitMargin')}
          </p>
          <h3 className="metric-value">
            64.2%
          </h3>
          <div className="metric-progress-bar">
            <div className="metric-progress-fill" style={{ width: '64.2%' }} />
          </div>
        </div>

        {/* Metric Card 3 */}
        <div 
          onClick={() => onNavigateTab('pricing')}
          className="dashboard-card clickable group highlight-bg"
        >
          <div className="dashboard-card-header relative z-10">
            <span className="metric-icon-wrapper indigo">
              <Star className="metric-icon fill-current" />
            </span>
            <span className="metric-badge outline-indigo">
              High Demand
            </span>
          </div>
          <div className="relative z-10">
            <p className="metric-label">
              {t('dashboard.topSelling')}
            </p>
            <h3 className="metric-value truncate">
              Sea Salt Caramel
            </h3>
            <p className="metric-subtext highlight">
              {formatCurrency(5.20)} margin per scoop
            </p>
          </div>
          <div className="card-bg-icon">
            <IceCream />
          </div>
        </div>
      </div>

      {/* Main Grid: Chart & Actions */}
      <div className="dashboard-grid main-content-grid">
        {/* Profit vs Loss Summary Chart */}
        <div className="dashboard-chart-card">
          <div className="chart-header">
            <h3 className="section-title">
              {t('dashboard.profitVsLoss')}
            </h3>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot indigo" />
                <span>{t('dashboard.profit')}</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot purple" />
                <span>{t('dashboard.loss')}</span>
              </div>
            </div>
          </div>

          <div className="chart-area">
            {daysData.map((item, idx) => (
              <div key={idx} className="chart-col group relative">
                <div className="chart-tooltip">
                  {t('dashboard.profit')}: {formatCurrency(item.profit * 1000)} | {t('dashboard.loss')}: {formatCurrency(item.loss * 1000)}
                </div>

                <div className="chart-bars">
                  {/* Profit bar */}
                  <div
                    style={{ height: `${(item.profit / 16) * 100}%` }}
                    className="bar profit-bar"
                  />
                  {/* Loss bar */}
                  <div
                    style={{ height: `${(item.loss / 16) * 100}%` }}
                    className="bar loss-bar"
                  />
                </div>
                <span className="chart-label">
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Critical Alerts */}
        <div className="dashboard-side-grid">
          {/* Quick Actions */}
          <div className="dashboard-card">
            <h3 className="section-title mb-4">
              {t('dashboard.quickActions')}
            </h3>
            <div className="action-buttons-list">
              <button
                onClick={onOpenAddIngredientModal}
                className="action-btn group"
              >
                <div className="action-btn-icon-wrapper">
                  <PlusCircle className="action-icon" />
                </div>
                <div className="action-btn-content">
                  <p className="action-btn-title">{t('dashboard.addIngredientTitle')}</p>
                  <p className="action-btn-desc">{t('dashboard.addIngredientDesc')}</p>
                </div>
              </button>

              <button
                onClick={() => onNavigateTab('pricing')}
                className="action-btn group"
              >
                <div className="action-btn-icon-wrapper">
                  <Calculator className="action-icon" />
                </div>
                <div className="action-btn-content">
                  <p className="action-btn-title">{t('dashboard.checkRecipeTitle')}</p>
                  <p className="action-btn-desc">{t('dashboard.checkRecipeDesc')}</p>
                </div>
              </button>

              <button
                onClick={onOpenOrders}
                className="action-btn group"
              >
                <div className="action-btn-icon-wrapper">
                  <FileText className="action-icon" />
                </div>
                <div className="action-btn-content">
                  <p className="action-btn-title">{t('dashboard.reviewOrdersTitle')}</p>
                  <p className="action-btn-desc">{t('dashboard.reviewOrdersDesc')}</p>
                </div>
              </button>
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="dashboard-card">
            <div className="alert-header">
              <h3 className="section-title m-0">
                {t('dashboard.criticalAlerts')}
              </h3>
              <span className="alert-pulse-dot" />
            </div>
            <ul className="alert-list">
              <li className="alert-item critical">
                <AlertTriangle className="alert-icon" />
                <div className="alert-content">
                  <p className="alert-title">Milk cost increased by 15%</p>
                  <p className="alert-desc">Suggest recipe optimization</p>
                </div>
              </li>
              <li className="alert-item warning">
                <Info className="alert-icon" />
                <div className="alert-content">
                  <p className="alert-title">Stock low: Heavy Cream</p>
                  <p className="alert-desc">Order needed in 2 days</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="dashboard-table-card">
        <div className="table-header">
          <h3 className="section-title m-0">
            Recent Ingredient Adjustments
          </h3>
          <button
            onClick={() => onNavigateTab('ingredients')}
            className="table-link"
          >
            View All
          </button>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('ingredients.tableItem')}</th>
                <th>{t('ingredients.tableCategory')}</th>
                <th className="text-right">{t('ingredients.tableUnitCost')}</th>
                <th className="text-right">Change</th>
                <th className="text-center">{t('ingredients.tableStatus')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-semibold text-white">Tahitian Vanilla Beans</td>
                <td>
                  <span className="tag">Flavorings</span>
                </td>
                <td className="text-right text-slate-300">{formatCurrency(45.00)}/lb</td>
                <td className="text-right font-bold text-rose-400">+{formatCurrency(3.50)}</td>
                <td className="text-center">
                  <span className="status-badge rose">
                    Price Spike
                  </span>
                </td>
              </tr>
              <tr>
                <td className="font-semibold text-white">Cane Sugar (Organic)</td>
                <td>
                  <span className="tag">Bases</span>
                </td>
                <td className="text-right text-slate-300">{formatCurrency(1.20)}/lb</td>
                <td className="text-right font-bold text-emerald-400">-{formatCurrency(0.10)}</td>
                <td className="text-center">
                  <span className="status-badge emerald">
                    Optimized
                  </span>
                </td>
              </tr>
              <tr>
                <td className="font-semibold text-white">Pistachio Paste (Bronte)</td>
                <td>
                  <span className="tag">Inclusions</span>
                </td>
                <td className="text-right text-slate-300">{formatCurrency(82.00)}/lb</td>
                <td className="text-right text-slate-500">---</td>
                <td className="text-center">
                  <span className="status-badge neutral">
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
