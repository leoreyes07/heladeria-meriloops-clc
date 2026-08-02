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
    alert(`Recipe "${recipeName}" saved successfully! Batch Cost: $${totalBatchCost.toFixed(2)}.`);
  };

  return (
    <div className="p-6 max-w-[1280px] mx-auto w-full">
      {/* Tab Header View Mode */}
      <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveView('builder')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors ${
              activeView === 'builder'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'bg-[#161619] border border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            New Recipe Builder
          </button>
          <button
            onClick={() => setActiveView('list')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors ${
              activeView === 'list'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'bg-[#161619] border border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Saved Recipe Catalog ({recipes.length})
          </button>
        </div>

        {activeView === 'builder' && (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setRecipeName('Pistachio Cloud Bliss');
                setBatchSize(5);
                setSelectedIngredients([
                  { ingredientId: 'ing-7', name: 'Sicilian Pistachio Paste', qty: 0.5, unit: 'kg', cost: 4.10 },
                  { ingredientId: 'ing-6', name: 'Heavy Cream (Grade A)', qty: 2.0, unit: 'L', cost: 9.00 },
                ]);
              }}
              className="px-5 py-2.5 border border-white/10 rounded-xl font-bold text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              Discard Draft
            </button>
            <button
              onClick={handleSaveDraft}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-xs hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-950/50 active:scale-95"
            >
              Save Recipe
            </button>
          </div>
        )}
      </div>

      {activeView === 'list' ? (
        /* Saved Recipes Catalog View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((rec) => {
            const recipeCost = rec.ingredients.reduce((s, i) => s + i.cost, 0);
            return (
              <div key={rec.id} className="bg-[#141417] border border-white/5 rounded-3xl p-6 card-shadow hover:-translate-y-1 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <span className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                    <ChefHat className="w-5 h-5" />
                  </span>
                  <span className="bg-white/5 border border-white/10 text-slate-300 text-xs font-bold px-2.5 py-1 rounded-full">
                    {rec.baseType}
                  </span>
                </div>
                <h3 className="font-sans text-xl font-bold text-white mb-1">
                  {rec.name}
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Batch Size: {rec.batchSizeLiters} Liters • Retail: ${rec.suggestedRetail.toFixed(2)}
                </p>

                <div className="bg-[#161619] p-3.5 rounded-2xl border border-white/10 mb-4 space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold text-white">
                    <span>Total Batch Cost</span>
                    <span className="text-indigo-400">${recipeCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Cost per 100ml</span>
                    <span>${(recipeCost / ((rec.batchSizeLiters || 1) * 10)).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onOpenLabelModal(rec)}
                    className="flex-1 py-2.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold text-xs rounded-xl hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Generate Label</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Recipe Builder Workspace */
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column: Recipe Entry */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            {/* Basic Info Card */}
            <section className="bg-[#141417] p-6 rounded-3xl border border-white/5 card-shadow">
              <h3 className="font-sans text-xl font-bold text-white mb-4">
                Flavor Identity
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="font-bold text-[10px] text-slate-500 block mb-2 uppercase tracking-wider">
                    RECIPE NAME
                  </label>
                  <input
                    type="text"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    placeholder="Enter flavor name..."
                    className="w-full px-4 py-2.5 bg-[#161619] border border-white/10 rounded-xl text-white font-sans text-xs focus:border-indigo-500/50 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[10px] text-slate-500 block mb-2 uppercase tracking-wider">
                    BATCH SIZE (LITERS)
                  </label>
                  <input
                    type="number"
                    value={batchSize}
                    onChange={(e) => setBatchSize(parseFloat(e.target.value) || 1)}
                    className="w-full px-4 py-2.5 bg-[#161619] border border-white/10 rounded-xl text-white font-sans text-xs focus:border-indigo-500/50 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[10px] text-slate-500 block mb-2 uppercase tracking-wider">
                    BASE TYPE
                  </label>
                  <select
                    value={baseType}
                    onChange={(e) => setBaseType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#161619] border border-white/10 rounded-xl text-white font-sans text-xs focus:border-indigo-500/50 outline-none"
                  >
                    <option value="Premium Cream" className="bg-[#141417]">Premium Cream</option>
                    <option value="Vegan Oat" className="bg-[#141417]">Vegan Oat</option>
                    <option value="Fruit Sorbet" className="bg-[#141417]">Fruit Sorbet</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Ingredients Base Selection Card */}
            <section className="bg-[#141417] p-6 rounded-3xl border border-white/5 card-shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-sans text-xl font-bold text-white">
                  Ingredients Base
                </h3>
                <button
                  onClick={handleAddRow}
                  className="flex items-center gap-1.5 text-indigo-400 font-bold text-xs hover:underline uppercase tracking-wider"
                >
                  <PlusCircle className="w-4 h-4" /> ADD INGREDIENT
                </button>
              </div>

              <div className="space-y-4">
                {/* Water (Primary/Default) */}
                <div className="grid grid-cols-12 gap-4 items-center bg-[#161619] p-3.5 rounded-2xl border border-dashed border-white/10">
                  <div className="col-span-6">
                    <label className="font-bold text-[10px] text-slate-500 block mb-1 uppercase tracking-wider">
                      INGREDIENT
                    </label>
                    <div className="flex items-center gap-2.5">
                      <Droplets className="w-4 h-4 text-indigo-400" />
                      <span className="font-semibold text-xs text-white">Water (Primary)</span>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        FREE
                      </span>
                    </div>
                  </div>
                  <div className="col-span-4">
                    <label className="font-bold text-[10px] text-slate-500 block mb-1 uppercase tracking-wider">
                      QUANTITY (L)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={waterQty}
                      onChange={(e) => setWaterQty(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 bg-[#141417] border border-white/10 rounded-lg text-xs text-white outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div className="col-span-2 text-right">
                    <label className="font-bold text-[10px] text-slate-500 block mb-1 uppercase tracking-wider">
                      COST
                    </label>
                    <span className="text-xs font-data-tabular font-semibold text-white">$0.00</span>
                  </div>
                </div>

                {/* Custom Ingredient Rows */}
                {selectedIngredients.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-center p-3.5 rounded-2xl border border-white/10 bg-[#161619] group hover:border-indigo-500/40 transition-colors">
                    <div className="col-span-6">
                      <label className="font-bold text-[10px] text-slate-500 block mb-1 uppercase tracking-wider">
                        INGREDIENT
                      </label>
                      <select
                        value={item.ingredientId}
                        onChange={(e) => handleIngredientChange(index, 'ingredientId', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#141417] border border-white/10 rounded-lg text-xs text-white outline-none focus:border-indigo-500/50"
                      >
                        {ingredients.map((ing) => (
                          <option key={ing.id} value={ing.id} className="bg-[#141417]">
                            {ing.name} (${ing.unitCost.toFixed(2)}/{ing.unit.toLowerCase().includes('liter') ? 'L' : ing.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-4">
                      <label className="font-bold text-[10px] text-slate-500 block mb-1 uppercase tracking-wider">
                        QTY ({item.unit.toUpperCase()})
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={item.qty}
                        onChange={(e) => handleIngredientChange(index, 'qty', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#141417] border border-white/10 rounded-lg text-xs text-white outline-none focus:border-indigo-500/50 font-data-tabular"
                      />
                    </div>

                    <div className="col-span-2 flex items-center justify-between">
                      <div className="text-right flex-1">
                        <label className="font-bold text-[10px] text-slate-500 block mb-1 uppercase tracking-wider">
                          COST
                        </label>
                        <span className="text-xs font-data-tabular font-bold text-white">
                          ${item.cost.toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveRow(index)}
                        className="text-rose-400 opacity-70 group-hover:opacity-100 hover:scale-110 transition-all ml-2 p-1"
                        title="Delete row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Real-time Summary */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            <section className="bg-[#141417] p-6 rounded-3xl border border-white/5 card-shadow sticky top-20">
              <h3 className="font-sans text-xl font-bold text-white mb-6">
                Live Summary
              </h3>

              <div className="space-y-6">
                {/* Big Metric: Total Batch Cost */}
                <div className="text-center p-4 bg-[#161619] rounded-2xl border border-white/10">
                  <span className="font-bold text-[10px] text-slate-500 block mb-1 uppercase tracking-wider">
                    TOTAL BATCH COST
                  </span>
                  <span className="font-sans text-4xl font-light text-indigo-400">
                    ${totalBatchCost.toFixed(2)}
                  </span>
                </div>

                {/* Serving Cost & Suggested Retail */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 border border-white/10 rounded-2xl text-center bg-[#161619]">
                    <span className="font-bold text-[10px] text-slate-500 block mb-1 uppercase tracking-wider">
                      PER SERVING (100ml)
                    </span>
                    <span className="font-sans text-xl font-bold text-white">
                      ${costPerServing.toFixed(2)}
                    </span>
                  </div>
                  <div className="p-3.5 border border-white/10 rounded-2xl text-center bg-[#161619]">
                    <span className="font-bold text-[10px] text-slate-500 block mb-1 uppercase tracking-wider">
                      SUGGESTED RETAIL
                    </span>
                    <div className="flex justify-center items-center gap-1">
                      <span className="text-xs text-slate-500">$</span>
                      <input
                        type="number"
                        step="0.25"
                        value={suggestedRetail}
                        onChange={(e) => setSuggestedRetail(parseFloat(e.target.value) || 4.50)}
                        className="w-16 font-sans text-xl font-bold text-white text-center border-b border-indigo-500 bg-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Margin Health Bar */}
                <div className="pt-2">
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                      MARGIN HEALTH
                    </span>
                    <span className="font-bold text-xs text-emerald-400">
                      {marginHealth.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all duration-300 shadow-sm"
                      style={{ width: `${Math.min(100, Math.max(0, marginHealth))}%` }}
                    />
                  </div>
                </div>

                {/* Detailed Breakdown List */}
                <div className="border-t border-white/5 pt-4">
                  <h4 className="font-bold text-[10px] text-slate-500 mb-3 uppercase tracking-wider">
                    COST DISTRIBUTION
                  </h4>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Dairy Base
                      </span>
                      <span className="font-data-tabular font-bold text-white">${dairyCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Flavor Inclusions
                      </span>
                      <span className="font-data-tabular font-bold text-white">${inclusionsCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> Emulsifiers & Water
                      </span>
                      <span className="font-data-tabular font-bold text-slate-500">$0.00</span>
                    </div>
                  </div>
                </div>

                {/* Profit Badge */}
                <div className="flex items-center justify-between p-3.5 bg-emerald-500/10 rounded-2xl px-5 border border-emerald-500/20">
                  <span className="font-bold text-[10px] text-emerald-400 uppercase tracking-wider">
                    ESTIMATED PROFIT PER BATCH
                  </span>
                  <span className="font-sans text-2xl font-bold text-emerald-400">
                    ${estimatedProfitPerBatch.toFixed(2)}
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
                  className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold text-xs hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-950/50 active:scale-[0.98]"
                >
                  Confirm & Generate Label
                </button>
              </div>
            </section>

            {/* Price Alert Banner */}
            <div className="bg-[#141417] p-4 rounded-2xl border border-white/5 card-shadow flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <p className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">
                  Price Alert
                </p>
                <p className="text-xs text-slate-300 mt-0.5">
                  Sicilian Pistachio cost has <span className="text-rose-400 font-bold">increased by 8%</span> this month.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
