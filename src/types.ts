export type NavigationTab = 'dashboard' | 'ingredients' | 'recipes' | 'pricing' | 'reports';
export type SubTab = 'inventory' | 'orders';

export interface IngredientItem {
  id: string;
  name: string;
  unit: string; // 'Liters' | 'kg' | 'g' | 'ml' | 'ct'
  purchaseQty: number;
  totalCost: number;
  unitCost: number; // totalCost / purchaseQty
  status: 'In Stock' | 'Low Stock' | 'Ordered';
  category: 'Dairy' | 'Bases' | 'Inclusions' | 'Flavorings' | 'Packaging';
  supplier?: string;
  lastUpdated?: string;
}

export interface RecipeIngredient {
  ingredientId: string;
  name: string;
  qty: number; // in unit
  unit: string;
  cost: number;
}

export interface RecipeItem {
  id: string;
  name: string;
  batchSizeLiters: number;
  baseType: string; // 'Premium Cream' | 'Vegan Oat' | 'Fruit Sorbet'
  ingredients: RecipeIngredient[];
  suggestedRetail: number;
  createdDate: string;
}

export interface FlavorProfitability {
  id: string;
  name: string;
  type: 'Premium Batch' | 'Seasonal' | 'Everyday' | 'Specialty';
  syncStatus: 'Supabase' | 'Local';
  totalCost: number;
  sellingPrice: number;
  netProfit: number; // sellingPrice - totalCost
  marginHealthPercent: number; // (netProfit / sellingPrice) * 100
  scoopsSoldThisWeek: number;
  isTopPerformer?: boolean;
}

export interface PricingModelConfig {
  recipeId: string;
  targetMargin: number; // e.g., 65
  desiredSellingPrice: number; // e.g., 6.50
  laborAllocation: number; // $1.10
  rentUtilities: number; // $0.45
  packagingLogistics: number; // $0.25
}

export interface AIAdvisoryAlert {
  id: string;
  title: string;
  flavorName: string;
  costIncreasePercent: number;
  recommendedSupplier: string;
  potentialSavingsPerScoop: number;
  body: string;
  status: 'active' | 'dismissed' | 'applied';
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  flavorName: string;
  batchLiters: number;
  status: 'Pending' | 'In Production' | 'Delivered';
  orderDate: string;
  totalPrice: number;
}
