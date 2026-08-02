import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  Plus
} from 'lucide-react';
import { RecipeItem } from '../types';
import { useSettings } from '../contexts/SettingsContext';

interface PricingViewProps {
  recipes: RecipeItem[];
}

export const PricingView: React.FC<PricingViewProps> = ({ recipes }) => {
  const [activeMode, setActiveMode] = useState<'recipe' | 'global'>('recipe');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(recipes[0]?.id || 'rec-2');
  const { t, formatCurrency, currency } = useSettings();

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
    <div className="view-container">
      {/* Header Section */}
      <section className="view-header">
        <div className="view-header-content">
          <div>
            <h3 className="view-title">
              {t('pricing.title').split(' ')[0]} <span>{t('pricing.title').split(' ').slice(1).join(' ')}</span>
            </h3>
            <p className="view-subtitle max-w-xl">
              {t('pricing.subtitle')}
            </p>
          </div>
          <div className="view-mode-tabs">
            <button
              onClick={() => setActiveMode('recipe')}
              className={`view-mode-btn ${activeMode === 'recipe' ? 'active' : ''}`}
            >
              Recipe View
            </button>
            <button
              onClick={() => setActiveMode('global')}
              className={`view-mode-btn ${activeMode === 'global' ? 'active' : ''}`}
            >
              Global Benchmarks
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid Layout */}
      <div className="pricing-grid">
        {/* Left Column: Inputs & Controls */}
        <div className="pricing-sidebar">
          <div className="pricing-card">
            <div className="card-header-icon">
              <div className="icon-wrapper indigo">
                <Calculator className="icon-sm" />
              </div>
              <h4 className="card-subtitle">
                Pricing Model
              </h4>
            </div>

            <div className="form-stack">
              {/* Recipe Selector */}
              <div className="form-group">
                <label className="form-label-light">Select Recipe</label>
                <select
                  value={selectedRecipeId}
                  onChange={(e) => setSelectedRecipeId(e.target.value)}
                  className="form-select"
                >
                  {recipes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Margin & Desired Selling Price */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label-light">Target Margin %</label>
                  <div className="input-with-symbol right">
                    <input
                      type="number"
                      value={targetMargin}
                      onChange={(e) => setTargetMargin(parseFloat(e.target.value) || 0)}
                      className="form-input font-data-tabular"
                    />
                    <span className="symbol">%</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label-light">Desired Selling Price</label>
                  <div className="input-with-symbol">
                    <span className="symbol">{currency === 'NIO' ? 'C$' : '$'}</span>
                    <input
                      type="number"
                      step="0.25"
                      value={desiredSellingPrice}
                      onChange={(e) => setDesiredSellingPrice(parseFloat(e.target.value) || 0)}
                      className="form-input font-data-tabular pl-7"
                    />
                  </div>
                </div>
              </div>

              {/* Overhead Presets */}
              <div className="overhead-presets">
                <h5 className="form-label mb-3">
                  Overhead Presets (Per Unit)
                </h5>
                <div className="preset-list">
                  <div className="preset-item">
                    <span>Labor Allocation</span>
                    <input
                      type="number"
                      step="0.05"
                      value={laborAllocation}
                      onChange={(e) => setLaborAllocation(parseFloat(e.target.value) || 0)}
                      className="inline-input font-data-tabular text-right w-20"
                    />
                  </div>
                  <div className="preset-item">
                    <span>Rent & Utilities</span>
                    <input
                      type="number"
                      step="0.05"
                      value={rentUtilities}
                      onChange={(e) => setRentUtilities(parseFloat(e.target.value) || 0)}
                      className="inline-input font-data-tabular text-right w-20"
                    />
                  </div>
                  <div className="preset-item">
                    <span>Packaging & Logistics</span>
                    <input
                      type="number"
                      step="0.05"
                      value={packagingLogistics}
                      onChange={(e) => setPackagingLogistics(parseFloat(e.target.value) || 0)}
                      className="inline-input font-data-tabular text-right w-20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Bestseller Card */}
          <div className="image-card group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBc4Nw8O1DHkLRVEL8OQWhc6X_xS0Q1IFNYxOy2vqCRPshe22BfVapGe64U7VfUGf7hWeuQHZd8wno7iNMhjw_6d78ka6reW7e-4kMKx9oz7SHaDjTsN7yP8R1-X_6yiuoH6iS3c_-_MtDb2-STpy-IYTRMiiGsJIqVjppQCJe-PHzPQryOeTgmaGbBfvu61Az_9F-k2iXQO2ugl2QoUjSPV6qz2wpyO4hM5_iC8g8ASxbRwNk6K-l"
              alt="Vanilla Bean Ice Cream"
              className="image-card-img"
            />
            <div className="image-card-overlay">
              <div>
                <p className="image-card-subtitle-small">
                  Current Bestseller
                </p>
                <h4 className="image-card-title">
                  {selectedRecipe ? selectedRecipe.name : 'Vanilla Bean Performance'}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Breakdown & Visuals */}
        <div className="pricing-main">
          {/* Large Metrics Row */}
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">
                Unit Profit
              </span>
              <div className="mt-4">
                <span className="stat-value-large emerald">
                  {formatCurrency(actualUnitProfit)}
                </span>
                <div className="stat-subtext flex-row items-center emerald mt-2">
                  <TrendingUp className="icon-sm" />
                  <span className="font-bold">
                    {actualMarginPercent >= targetMargin ? 'Target met' : 'Below target'}
                  </span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-label">
                Actual Margin
              </span>
              <div className="mt-4">
                <span className="stat-value-large white">
                  {actualMarginPercent.toFixed(1)}%
                </span>
                <div className="stat-subtext flex-row items-center rose mt-2">
                  <AlertTriangle className="icon-sm" />
                  <span className="font-bold">
                    {actualMarginPercent < 50 ? 'High COGS risk' : 'Close to threshold'}
                  </span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-label">
                Break-even Units
              </span>
              <div className="mt-4">
                <span className="stat-value-large indigo">
                  {breakEvenUnits.toLocaleString()}
                </span>
                <p className="stat-subtext text-muted italic mt-1">
                  Scoops/month to cover overhead
                </p>
              </div>
            </div>
          </div>

          {/* Main Breakdown Table */}
          <div className="table-card mt-6">
            <div className="table-header-alt">
              <h4 className="form-label">
                Cost Breakdown per Unit (4oz Scoop)
              </h4>
              <span className="text-xs text-slate-500">Effective Date: Aug 2026</span>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr className="header-row">
                    <th>Category</th>
                    <th>Details</th>
                    <th className="text-right">Cost</th>
                    <th className="text-right">% of Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-semibold text-white flex items-center gap-3">
                      <span className="dot indigo" /> Ingredients
                    </td>
                    <td className="text-slate-400">Cream, Sugar, Vanilla, Inclusions</td>
                    <td className="text-right font-bold text-white">{formatCurrency(ingredientUnitCost)}</td>
                    <td className="text-right text-slate-400">{ingredientPercent.toFixed(1)}%</td>
                  </tr>

                  <tr>
                    <td className="font-semibold text-white flex items-center gap-3">
                      <span className="dot rose" /> Direct Labor
                    </td>
                    <td className="text-slate-400">Production (12 min/batch allocation)</td>
                    <td className="text-right font-bold text-white">{formatCurrency(laborAllocation)}</td>
                    <td className="text-right text-slate-400">{laborPercent.toFixed(1)}%</td>
                  </tr>

                  <tr>
                    <td className="font-semibold text-white flex items-center gap-3">
                      <span className="dot gray" /> Fixed Overhead
                    </td>
                    <td className="text-slate-400">Rent, Electricity, POS Fees, Packaging</td>
                    <td className="text-right font-bold text-white">{formatCurrency(rentUtilities + packagingLogistics)}</td>
                    <td className="text-right text-slate-400">{overheadPercent.toFixed(1)}%</td>
                  </tr>

                  <tr className="total-row">
                    <td className="text-white">Total Unit Cost</td>
                    <td></td>
                    <td className="text-right text-white">{formatCurrency(totalUnitCost)}</td>
                    <td className="text-right text-slate-300">{totalCostPercent.toFixed(1)}%</td>
                  </tr>

                  <tr className="profit-row">
                    <td className="text-emerald-400">Profit Margin</td>
                    <td></td>
                    <td className="text-right text-emerald-400">
                      {formatCurrency(actualUnitProfit)}
                    </td>
                    <td className="text-right text-emerald-400">
                      {profitMarginPercent.toFixed(1)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Margin Health Gauge */}
          <div className="pricing-card mt-6">
            <div className="flex-between flex-end mb-6">
              <div>
                <h4 className="form-label mb-1">
                  Margin Health Gauge
                </h4>
                <p className="stat-subtext">
                  Based on current industry standards for premium creameries.
                </p>
              </div>
              <div className="status-badge-outline emerald">
                {actualMarginPercent >= 60 ? 'HEALTHY' : actualMarginPercent >= 40 ? 'MODERATE' : 'HIGH RISK'}
              </div>
            </div>

            <div className="gauge-container">
              <div className="gauge-segment rose" style={{ width: '30%' }} />
              <div className="gauge-segment amber" style={{ width: '20%' }} />
              <div className="gauge-segment emerald" style={{ width: '50%' }} />

              {/* Indicator needle */}
              <div
                className="gauge-needle"
                style={{ left: `${Math.min(98, Math.max(2, actualMarginPercent))}%` }}
              >
                <div className="gauge-needle-head" />
              </div>
            </div>

            <div className="gauge-labels">
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
