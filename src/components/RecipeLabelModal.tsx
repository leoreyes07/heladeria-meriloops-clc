import React from 'react';
import { X, Printer, CheckCircle, FileCheck2, Sparkles } from 'lucide-react';
import { RecipeItem } from '../types';
import { useSettings } from '../contexts/SettingsContext';

interface RecipeLabelModalProps {
  recipe: RecipeItem | null;
  onClose: () => void;
}

export const RecipeLabelModal: React.FC<RecipeLabelModalProps> = ({
  recipe,
  onClose,
}) => {
  const { t, formatCurrency } = useSettings();

  if (!recipe) return null;

  const totalCost = recipe.ingredients.reduce((sum, i) => sum + i.cost, 0);
  const servings = recipe.batchSizeLiters * 10;
  const costPerScoop = totalCost / (servings || 1);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content medium">
        {/* Header */}
        <div className="modal-header">
          <div className="flex-row items-center gap-2">
            <FileCheck2 className="icon-sm indigo" />
            <h3 className="modal-title">
              {t('modals.recipeLabelTitle').split(' ').slice(0, -1).join(' ')} <span>{t('modals.recipeLabelTitle').split(' ').pop()}</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
          >
            <X className="icon-sm" />
          </button>
        </div>

        {/* Label Printable Content */}
        <div className="modal-body p-8">
          <div className="label-preview">
            {/* Brand Header */}
            <div className="label-header">
              <div>
                <span className="label-brand">
                  {t('sidebar.brandTitle')} <span>Creamery</span>
                </span>
                <span className="label-meta">
                  Batch Specification & COGS Tag
                </span>
              </div>
              <div className="label-details">
                <p className="label-id">ID: #{recipe.id.toUpperCase()}</p>
                <p className="label-date">Date: {recipe.createdDate}</p>
              </div>
            </div>

            {/* Flavor Title */}
            <div className="label-flavor">
              <span className="label-badge">
                {recipe.baseType}
              </span>
              <h2 className="label-flavor-name">
                {recipe.name}
              </h2>
              <p className="label-flavor-yield">
                Yield: <span className="highlight-white">{recipe.batchSizeLiters} Liters</span> ({servings} Standard Scoops)
              </p>
            </div>

            {/* Ingredients Listing */}
            <div className="label-ingredients">
              <span className="label-ingredients-title">
                Formulation Breakdown
              </span>
              <p className="label-ingredients-list">
                {recipe.ingredients.map(i => `${i.name} (${i.qty}${i.unit})`).join(', ')}
              </p>
            </div>

            {/* Cost & Retail Metrics */}
            <div className="label-metrics">
              <div className="label-metric-box">
                <span className="metric-title">BATCH COST</span>
                <span className="metric-val emerald">{formatCurrency(totalCost)}</span>
              </div>
              <div className="label-metric-box">
                <span className="metric-title">SCOOP COST</span>
                <span className="metric-val white">{formatCurrency(costPerScoop)}</span>
              </div>
              <div className="label-metric-box indigo">
                <span className="metric-title indigo">SUGGESTED RETAIL</span>
                <span className="metric-val indigo-light">{formatCurrency(recipe.suggestedRetail)}</span>
              </div>
            </div>

            {/* Badge Watermark */}
            <div className="label-footer">
              <span className="label-cert emerald">
                <CheckCircle className="icon-xs" /> Margin Verified: {(((recipe.suggestedRetail - costPerScoop) / recipe.suggestedRetail) * 100).toFixed(0)}%
              </span>
              <span className="label-cert slate">
                <Sparkles className="icon-xs indigo" /> Scoop Ledger Certified
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-footer">
          <button
            onClick={onClose}
            className="action-btn-secondary flex-1"
          >
            {t('modals.close')}
          </button>
          <button
            onClick={handlePrint}
            className="action-btn-primary flex-1 print-btn"
          >
            <Printer className="icon-xs" />
            <span>Print Batch Label</span>
          </button>
        </div>
      </div>
    </div>
  );
};
