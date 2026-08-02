import React, { useState } from 'react';
import { 
  PlusCircle, 
  Trash2, 
  TrendingUp, 
  Droplets, 
  ChefHat, 
  FileCheck2 
} from 'lucide-react';
import { IngredientItem, RecipeItem, RecipeIngredient } from '../types';
import { useSettings } from '../contexts/SettingsContext';

interface RecipesViewProps {
  ingredients: IngredientItem[];
  recipes: RecipeItem[];
  onSaveRecipe: (recipe: RecipeItem) => void;
  onOpenLabelModal: (recipe: RecipeItem) => void;
}

export const RecipesView: React.FC<RecipesViewProps> = ({
  ingredients,
  recipes,
  onSaveRecipe,
  onOpenLabelModal,
}) => {
  const [activeView, setActiveView] = useState<'builder' | 'list'>('builder');
  const { t, formatCurrency, currency } = useSettings();

  // New Recipe Form State
  const [recipeName, setRecipeName] = useState('Pistachio Cloud Bliss');
  const [batchSize, setBatchSize] = useState<number>(5);
  const [baseType, setBaseType] = useState('Premium Cream');
  const [suggestedRetail, setSuggestedRetail] = useState<number>(4.50);

  // Default ingredient rows matching the prompt layout
  const [selectedIngredients, setSelectedIngredients] = useState<RecipeIngredient[]>([
    { ingredientId: 'ing-7', name: 'Sicilian Pistachio Paste', qty: 0.5, unit: 'kg', cost: 4.10 },
    { ingredientId: 'ing-6', name: 'Heavy Cream (Grade A)', qty: 2.0, unit: 'L', cost: 9.00 },
  ]);

  const [waterQty, setWaterQty] = useState<number>(1.5);

  // Recalculate line costs and totals
  const totalBatchCost = selectedIngredients.reduce((sum, item) => sum + item.cost, 0);
  
  // Servings calculation: 100ml = 0.1L per serving
  const totalServings = (batchSize || 1) / 0.1;
  const costPerServing = totalBatchCost / (totalServings || 1);
  
  // Total Revenue per batch = totalServings * suggestedRetail
  const totalRevenuePerBatch = totalServings * suggestedRetail;
  const estimatedProfitPerBatch = totalRevenuePerBatch - totalBatchCost;
  const marginHealth = totalRevenuePerBatch > 0 
    ? ((totalRevenuePerBatch - totalBatchCost) / totalRevenuePerBatch) * 100 
    : 0;

  // Breakdown calculation
  const dairyCost = selectedIngredients
    .filter(i => i.name.toLowerCase().includes('cream') || i.name.toLowerCase().includes('milk'))
    .reduce((sum, i) => sum + i.cost, 0);
  
  const inclusionsCost = totalBatchCost - dairyCost;

  const handleIngredientChange = (index: number, field: 'ingredientId' | 'qty', value: any) => {
    const updated = [...selectedIngredients];
    if (field === 'ingredientId') {
      const found = ingredients.find(ing => ing.id === value);
      if (found) {
        updated[index].ingredientId = found.id;
        updated[index].name = found.name;
        updated[index].unit = found.unit.toLowerCase().includes('liter') ? 'L' : found.unit;
        updated[index].cost = updated[index].qty * found.unitCost;
      }
    } else if (field === 'qty') {
      const qtyNum = parseFloat(value) || 0;
      updated[index].qty = qtyNum;
      const found = ingredients.find(ing => ing.id === updated[index].ingredientId);
      const unitCost = found ? found.unitCost : 4.50;
      updated[index].cost = qtyNum * unitCost;
    }
    setSelectedIngredients(updated);
  };

  const handleAddRow = () => {
    const defaultIng = ingredients[0] || { id: 'ing-1', name: 'Whole Cream', unitCost: 8.50 };
    setSelectedIngredients([
      ...selectedIngredients,
      {
        ingredientId: defaultIng.id,
        name: defaultIng.name,
        qty: 1.0,
        unit: defaultIng.unit.toLowerCase().includes('liter') ? 'L' : defaultIng.unit,
        cost: defaultIng.unitCost,
      },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    setSelectedIngredients(selectedIngredients.filter((_, idx) => idx !== index));
  };

  const handleSaveDraft = () => {
    if (!recipeName.trim()) {
      alert('Please enter a recipe name.');
      return;
    }

    const newRecipe: RecipeItem = {
      id: 'rec-' + Date.now(),
      name: recipeName,
      batchSizeLiters: batchSize,
      baseType,
      ingredients: [
        { ingredientId: 'water-0', name: 'Water (Primary)', qty: waterQty, unit: 'L', cost: 0.00 },
        ...selectedIngredients,
      ],
      suggestedRetail,
      createdDate: new Date().toISOString().split('T')[0],
    };

    onSaveRecipe(newRecipe);
    alert(`Recipe "${recipeName}" saved successfully! Batch Cost: ${formatCurrency(totalBatchCost)}.`);
  };

  return (
    <div className="view-container">
      {/* Tab Header View Mode */}
      <div className="view-mode-header">
        <div className="view-mode-tabs">
          <button
            onClick={() => setActiveView('builder')}
            className={`view-mode-btn ${activeView === 'builder' ? 'active' : ''}`}
          >
            New Recipe Builder
          </button>
          <button
            onClick={() => setActiveView('list')}
            className={`view-mode-btn ${activeView === 'list' ? 'active' : ''}`}
          >
            Saved Recipe Catalog ({recipes.length})
          </button>
        </div>

        {activeView === 'builder' && (
          <div className="view-mode-actions">
            <button
              onClick={() => {
                setRecipeName('Pistachio Cloud Bliss');
                setBatchSize(5);
                setSelectedIngredients([
                  { ingredientId: 'ing-7', name: 'Sicilian Pistachio Paste', qty: 0.5, unit: 'kg', cost: 4.10 },
                  { ingredientId: 'ing-6', name: 'Heavy Cream (Grade A)', qty: 2.0, unit: 'L', cost: 9.00 },
                ]);
              }}
              className="action-btn-secondary"
            >
              Discard Draft
            </button>
            <button
              onClick={handleSaveDraft}
              className="action-btn-primary"
            >
              Save Recipe
            </button>
          </div>
        )}
      </div>

      {activeView === 'list' ? (
        /* Saved Recipes Catalog View */
        <div className="recipes-grid">
          {recipes.map((rec) => {
            const recipeCost = rec.ingredients.reduce((s, i) => s + i.cost, 0);
            return (
              <div key={rec.id} className="recipe-card group">
                <div className="recipe-card-header">
                  <span className="recipe-card-icon indigo">
                    <ChefHat className="icon" />
                  </span>
                  <span className="recipe-card-badge">
                    {rec.baseType}
                  </span>
                </div>
                <h3 className="recipe-card-title">
                  {rec.name}
                </h3>
                <p className="recipe-card-subtitle">
                  Batch Size: {rec.batchSizeLiters} Liters • Retail: {formatCurrency(rec.suggestedRetail)}
                </p>

                <div className="recipe-card-stats">
                  <div className="stat-row">
                    <span className="stat-label-light">Total Batch Cost</span>
                    <span className="stat-value-indigo">{formatCurrency(recipeCost)}</span>
                  </div>
                  <div className="stat-row text-muted">
                    <span>Cost per 100ml</span>
                    <span>{formatCurrency(recipeCost / ((rec.batchSizeLiters || 1) * 10))}</span>
                  </div>
                </div>

                <div className="recipe-card-actions">
                  <button
                    onClick={() => onOpenLabelModal(rec)}
                    className="generate-label-btn"
                  >
                    <FileCheck2 className="icon-sm" />
                    <span>{t('recipes.generateLabel')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Recipe Builder Workspace */
        <div className="builder-layout">
          {/* Left Column: Recipe Entry */}
          <div className="builder-main">
            {/* Basic Info Card */}
            <section className="builder-section">
              <h3 className="section-title-large">
                Flavor Identity
              </h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">
                    RECIPE NAME
                  </label>
                  <input
                    type="text"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    placeholder="Enter flavor name..."
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    BATCH SIZE (LITERS)
                  </label>
                  <input
                    type="number"
                    value={batchSize}
                    onChange={(e) => setBatchSize(parseFloat(e.target.value) || 1)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    BASE TYPE
                  </label>
                  <select
                    value={baseType}
                    onChange={(e) => setBaseType(e.target.value)}
                    className="form-select"
                  >
                    <option value="Premium Cream">Premium Cream</option>
                    <option value="Vegan Oat">Vegan Oat</option>
                    <option value="Fruit Sorbet">Fruit Sorbet</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Ingredients Base Selection Card */}
            <section className="builder-section">
              <div className="builder-section-header">
                <h3 className="section-title-large">
                  Ingredients Base
                </h3>
                <button
                  onClick={handleAddRow}
                  className="add-ingredient-btn"
                >
                  <PlusCircle className="icon-sm" /> ADD INGREDIENT
                </button>
              </div>

              <div className="ingredients-list">
                {/* Water (Primary/Default) */}
                <div className="ingredient-row locked">
                  <div className="ingredient-col-main">
                    <label className="form-label">
                      INGREDIENT
                    </label>
                    <div className="ingredient-name-locked">
                      <Droplets className="icon-sm indigo" />
                      <span className="text-white">Water (Primary)</span>
                      <span className="status-badge emerald">
                        FREE
                      </span>
                    </div>
                  </div>
                  <div className="ingredient-col-qty">
                    <label className="form-label">
                      QUANTITY (L)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={waterQty}
                      onChange={(e) => setWaterQty(parseFloat(e.target.value) || 0)}
                      className="form-input"
                    />
                  </div>
                  <div className="ingredient-col-cost">
                    <label className="form-label">
                      COST
                    </label>
                    <span className="cost-value">{formatCurrency(0)}</span>
                  </div>
                </div>

                {/* Custom Ingredient Rows */}
                {selectedIngredients.map((item, index) => (
                  <div key={index} className="ingredient-row">
                    <div className="ingredient-col-main">
                      <label className="form-label">
                        INGREDIENT
                      </label>
                      <select
                        value={item.ingredientId}
                        onChange={(e) => handleIngredientChange(index, 'ingredientId', e.target.value)}
                        className="form-select"
                      >
                        {ingredients.map((ing) => (
                          <option key={ing.id} value={ing.id}>
                            {ing.name} ({formatCurrency(ing.unitCost)}/{ing.unit.toLowerCase().includes('liter') ? 'L' : ing.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="ingredient-col-qty">
                      <label className="form-label">
                        QTY ({item.unit.toUpperCase()})
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={item.qty}
                        onChange={(e) => handleIngredientChange(index, 'qty', e.target.value)}
                        className="form-input font-data-tabular"
                      />
                    </div>

                    <div className="ingredient-col-cost flex-between">
                      <div className="text-right">
                        <label className="form-label">
                          COST
                        </label>
                        <span className="cost-value">
                          {formatCurrency(item.cost)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveRow(index)}
                        className="delete-row-btn"
                        title="Delete row"
                      >
                        <Trash2 className="icon-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Real-time Summary */}
          <div className="builder-sidebar">
            <section className="builder-section sticky-panel">
              <h3 className="section-title-large">
                Live Summary
              </h3>

              <div className="summary-stack">
                {/* Big Metric: Total Batch Cost */}
                <div className="summary-hero-metric">
                  <span className="form-label">
                    TOTAL BATCH COST
                  </span>
                  <span className="hero-value indigo">
                    {formatCurrency(totalBatchCost)}
                  </span>
                </div>

                {/* Serving Cost & Suggested Retail */}
                <div className="summary-grid">
                  <div className="summary-box">
                    <span className="form-label">
                      PER SERVING (100ml)
                    </span>
                    <span className="box-value">
                      {formatCurrency(costPerServing)}
                    </span>
                  </div>
                  <div className="summary-box">
                    <span className="form-label">
                      SUGGESTED RETAIL
                    </span>
                    <div className="input-with-symbol">
                      <span className="symbol">{currency === 'NIO' ? 'C$' : '$'}</span>
                      <input
                        type="number"
                        step="0.25"
                        value={suggestedRetail}
                        onChange={(e) => setSuggestedRetail(parseFloat(e.target.value) || 4.50)}
                        className="inline-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Margin Health Bar */}
                <div className="margin-health-section">
                  <div className="margin-health-header">
                    <span className="form-label">
                      MARGIN HEALTH
                    </span>
                    <span className="health-value">
                      {marginHealth.toFixed(1)}%
                    </span>
                  </div>
                  <div className="metric-progress-bar">
                    <div
                      className="metric-progress-fill health"
                      style={{ width: `${Math.min(100, Math.max(0, marginHealth))}%` }}
                    />
                  </div>
                </div>

                {/* Detailed Breakdown List */}
                <div className="cost-breakdown">
                  <h4 className="form-label">
                    COST DISTRIBUTION
                  </h4>
                  <div className="breakdown-list">
                    <div className="breakdown-item">
                      <span className="breakdown-label">
                        <span className="dot indigo" /> Dairy Base
                      </span>
                      <span className="breakdown-val">{formatCurrency(dairyCost)}</span>
                    </div>
                    <div className="breakdown-item">
                      <span className="breakdown-label">
                        <span className="dot purple" /> Flavor Inclusions
                      </span>
                      <span className="breakdown-val">{formatCurrency(inclusionsCost)}</span>
                    </div>
                    <div className="breakdown-item">
                      <span className="breakdown-label">
                        <span className="dot gray" /> Emulsifiers & Water
                      </span>
                      <span className="breakdown-val text-muted">{formatCurrency(0)}</span>
                    </div>
                  </div>
                </div>

                {/* Profit Badge */}
                <div className="profit-badge">
                  <span className="form-label emerald">
                    ESTIMATED PROFIT PER BATCH
                  </span>
                  <span className="profit-val">
                    {formatCurrency(estimatedProfitPerBatch)}
                  </span>
                </div>

                {/* Confirm & Generate Label CTA */}
                <button
                  onClick={() => {
                    const currentRecipe: RecipeItem = {
                      id: 'temp-' + Date.now(),
                      name: recipeName,
                      batchSizeLiters: batchSize,
                      baseType,
                      ingredients: [
                        { ingredientId: 'w-0', name: 'Water (Primary)', qty: waterQty, unit: 'L', cost: 0 },
                        ...selectedIngredients,
                      ],
                      suggestedRetail,
                      createdDate: new Date().toISOString().split('T')[0],
                    };
                    onOpenLabelModal(currentRecipe);
                  }}
                  className="action-btn-primary full-width large"
                >
                  Confirm & Generate Label
                </button>
              </div>
            </section>

            {/* Price Alert Banner */}
            <div className="alert-banner">
              <div className="alert-banner-icon-wrapper">
                <TrendingUp className="icon-md" />
              </div>
              <div className="alert-banner-content">
                <p className="form-label">
                  Price Alert
                </p>
                <p className="alert-banner-desc">
                  Sicilian Pistachio cost has <span className="highlight rose">increased by 8%</span> this month.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
