import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { IngredientsView } from './components/IngredientsView';
import { RecipesView } from './components/RecipesView';
import { PricingView } from './components/PricingView';
import { ReportsView } from './components/ReportsView';

import { AddIngredientModal } from './components/AddIngredientModal';
import { RecipeLabelModal } from './components/RecipeLabelModal';
import { OrdersModal } from './components/OrdersModal';

import { 
  INITIAL_INGREDIENTS, 
  INITIAL_RECIPES, 
  INITIAL_FLAVORS, 
  INITIAL_ADVISORY, 
  INITIAL_ORDERS 
} from './data/initialData';

import { 
  NavigationTab, 
  SubTab, 
  IngredientItem, 
  RecipeItem, 
  FlavorProfitability, 
  AIAdvisoryAlert, 
  OrderItem 
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('inventory');
  const [searchQuery, setSearchQuery] = useState('');

  // Data Collections State
  const [ingredients, setIngredients] = useState<IngredientItem[]>(INITIAL_INGREDIENTS);
  const [recipes, setRecipes] = useState<RecipeItem[]>(INITIAL_RECIPES);
  const [flavors, setFlavors] = useState<FlavorProfitability[]>(INITIAL_FLAVORS);
  const [advisory, setAdvisory] = useState<AIAdvisoryAlert>(INITIAL_ADVISORY);
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);

  // Sync & UI States
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isAddIngredientOpen, setIsAddIngredientOpen] = useState(false);
  const [selectedRecipeForLabel, setSelectedRecipeForLabel] = useState<RecipeItem | null>(null);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);

  // Trigger toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // SubTab Handler (If orders tab clicked, open orders modal)
  const handleSetSubTab = (tab: SubTab) => {
    setActiveSubTab(tab);
    if (tab === 'orders') {
      setIsOrdersModalOpen(true);
    }
  };

  // Add new ingredient
  const handleAddIngredient = (newIng: IngredientItem) => {
    setIngredients((prev) => [newIng, ...prev]);
    showToast(`Added ingredient: "${newIng.name}" ($${newIng.unitCost.toFixed(2)}/${newIng.unit})`);
  };

  // Delete ingredient
  const handleDeleteIngredient = (id: string) => {
    const item = ingredients.find((i) => i.id === id);
    setIngredients((prev) => prev.filter((i) => i.id !== id));
    if (item) {
      showToast(`Removed SKU: "${item.name}" from ledger.`);
    }
  };

  // Save Recipe
  const handleSaveRecipe = (newRecipe: RecipeItem) => {
    setRecipes((prev) => [newRecipe, ...prev]);
    showToast(`Recipe saved: "${newRecipe.name}"`);
  };

  // Sync with Cloud / Supabase
  const handleSyncData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setFlavors((prev) =>
        prev.map((f) => ({ ...f, syncStatus: 'Supabase' as const }))
      );
      showToast('Cloud Database Synchronized! All flavor economics pushed.');
    }, 1200);
  };

  // Advisory update
  const handleUpdateRecipeFromAdvisory = () => {
    setFlavors((prev) =>
      prev.map((f) =>
        f.name === 'Double Dark Cocoa'
          ? {
              ...f,
              totalCost: 2.95,
              netProfit: 2.55,
              marginHealthPercent: 46,
              syncStatus: 'Supabase' as const,
            }
          : f
      )
    );
    setAdvisory((prev) => ({ ...prev, status: 'dismissed' }));
    showToast('Applied Natura Bulk Cocoa supplier rates to Double Dark Cocoa ($0.45/scoop saved).');
  };

  const handleDismissAdvisory = () => {
    setAdvisory((prev) => ({ ...prev, status: 'dismissed' }));
    showToast('AI Advisory alert dismissed.');
  };

  // Wholesale Orders Handlers
  const handleAddOrder = (newOrder: OrderItem) => {
    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Wholesale Tub Order registered: ${newOrder.orderNumber}`);
  };

  const handleUpdateOrderStatus = (id: string, status: 'In Production' | 'Pending' | 'Delivered') => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    showToast(`Order status updated to "${status}".`);
  };

  const pendingSyncCount = flavors.filter((f) => f.syncStatus === 'Local').length;

  return (
    <div className="min-h-screen bg-[#f8fafb] text-[#161d1f] font-sans flex flex-col selection:bg-[#a8e6cf] selection:text-[#2c6957]">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewRecipeModal={() => {
          setActiveTab('recipes');
        }}
      />

      {/* Top Header Navigation */}
      <TopBar
        activeTab={activeTab}
        activeSubTab={activeSubTab}
        setActiveSubTab={handleSetSubTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSyncData={handleSyncData}
        isSyncing={isSyncing}
        pendingSyncCount={pendingSyncCount}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[120] bg-[#161d1f] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-200 text-xs font-medium border border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#a8e6cf] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main View Area (Offset by 240px sidebar and 64px header) */}
      <main className="ml-[240px] pt-16 flex-1 pb-16">
        {activeTab === 'dashboard' && (
          <DashboardView
            ingredients={ingredients}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAddIngredientModal={() => setIsAddIngredientOpen(true)}
            onOpenOrders={() => setIsOrdersModalOpen(true)}
          />
        )}

        {activeTab === 'ingredients' && (
          <IngredientsView
            ingredients={ingredients}
            searchQuery={searchQuery}
            onOpenAddIngredientModal={() => setIsAddIngredientOpen(true)}
            onDeleteIngredient={handleDeleteIngredient}
          />
        )}

        {activeTab === 'recipes' && (
          <RecipesView
            ingredients={ingredients}
            recipes={recipes}
            onSaveRecipe={handleSaveRecipe}
            onOpenLabelModal={(rec) => setSelectedRecipeForLabel(rec)}
          />
        )}

        {activeTab === 'pricing' && (
          <PricingView recipes={recipes} />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            flavors={flavors}
            advisory={advisory}
            searchQuery={searchQuery}
            onSyncData={handleSyncData}
            onUpdateRecipeFromAdvisory={handleUpdateRecipeFromAdvisory}
            onDismissAdvisory={handleDismissAdvisory}
          />
        )}
      </main>

      {/* Modals & Dialogs */}
      <AddIngredientModal
        isOpen={isAddIngredientOpen}
        onClose={() => setIsAddIngredientOpen(false)}
        onAddIngredient={handleAddIngredient}
      />

      <RecipeLabelModal
        recipe={selectedRecipeForLabel}
        onClose={() => setSelectedRecipeForLabel(null)}
      />

      <OrdersModal
        isOpen={isOrdersModalOpen}
        onClose={() => {
          setIsOrdersModalOpen(false);
          setActiveSubTab('inventory');
        }}
        orders={orders}
        onAddOrder={handleAddOrder}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />
    </div>
  );
}
