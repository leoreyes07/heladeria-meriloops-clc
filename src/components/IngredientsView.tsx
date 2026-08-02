import React, { useState } from 'react';
import { 
  ShoppingBasket, 
  DollarSign, 
  Package, 
  TrendingUp, 
  Download, 
  Plus, 
  MoreVertical,
  Trash2,
  Edit2
} from 'lucide-react';
import { IngredientItem } from '../types';
import { useSettings } from '../contexts/SettingsContext';

interface IngredientsViewProps {
  ingredients: IngredientItem[];
  searchQuery: string;
  onOpenAddIngredientModal: () => void;
  onDeleteIngredient: (id: string) => void;
}

export const IngredientsView: React.FC<IngredientsViewProps> = ({
  ingredients,
  searchQuery,
  onOpenAddIngredientModal,
  onDeleteIngredient,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const { t, formatCurrency } = useSettings();

  const filteredIngredients = ingredients.filter((item) => {
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (categoryFilter === 'All') return matchesQuery;
    return matchesQuery && item.category === categoryFilter;
  });

  const totalValue = ingredients.reduce((sum, item) => sum + item.totalCost, 0);

  const handleExportCSV = () => {
    const header = "Ingredient Name,Category,Unit,Purchase Qty,Total Cost,Unit Cost,Status,Supplier\n";
    const rows = ingredients.map(i => 
      `"${i.name}","${i.category}","${i.unit}",${i.purchaseQty},${i.totalCost},${i.unitCost},"${i.status}","${i.supplier || ''}"`
    ).join("\n");

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + header + rows);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Scoop_Ledger_Ingredient_Ledger.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="view-container">
      {/* Dashboard Stats Summary */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">
              Total SKUs
            </span>
            <div className="stat-icon-wrapper indigo">
              <ShoppingBasket className="stat-icon" />
            </div>
          </div>
          <div className="stat-value">
            {ingredients.length}
          </div>
          <div className="stat-subtext flex-row items-center">
            <TrendingUp className="stat-trend-icon indigo" />
            <span className="stat-trend-value indigo">+3</span> this month
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">
              Avg Margin
            </span>
            <div className="stat-icon-wrapper emerald">
              <DollarSign className="stat-icon" />
            </div>
          </div>
          <div className="stat-value">
            68.4%
          </div>
          <div className="metric-progress-bar mt-3">
            <div className="metric-progress-fill" style={{ width: '68.4%' }} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">
              Inventory Value
            </span>
            <div className="stat-icon-wrapper rose">
              <Package className="stat-icon" />
            </div>
          </div>
          <div className="stat-value">
            {formatCurrency(totalValue)}
          </div>
          <div className="stat-subtext mt-2">
            Updated 2h ago
          </div>
        </div>
      </div>

      {/* Header & Actions */}
      <div className="view-header">
        <div>
          <h3 className="view-title">
            {t('ingredients.title').split(' ')[0]} <span>{t('ingredients.title').split(' ').slice(1).join(' ')}</span>
          </h3>
          <p className="view-subtitle">
            {t('ingredients.subtitle')}
          </p>
        </div>

        <div className="view-actions">
          {/* Category Filter dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">{t('ingredients.allCategories')}</option>
            <option value="Dairy">{t('ingredients.dairy')}</option>
            <option value="Bases">{t('ingredients.bases')}</option>
            <option value="Inclusions">Inclusions</option>
            <option value="Flavorings">{t('ingredients.flavorings')}</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="action-btn-secondary"
          >
            <Download className="btn-icon" /> {t('reports.exportReportBtn')}
          </button>
          
          <button
            onClick={onOpenAddIngredientModal}
            className="action-btn-primary"
          >
            <Plus className="btn-icon" /> {t('ingredients.addIngredientBtn')}
          </button>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('ingredients.tableItem')}</th>
                <th>Unit</th>
                <th className="text-right">Purchase Qty</th>
                <th className="text-right">Total Cost</th>
                <th className="text-right">{t('ingredients.tableUnitCost')}</th>
                <th className="text-center">{t('ingredients.tableStatus')}</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filteredIngredients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-state-cell">
                    No ingredients found matching your search.
                  </td>
                </tr>
              ) : (
                filteredIngredients.map((item) => (
                  <tr key={item.id}>
                    <td className="font-semibold text-white">
                      <div>
                        <span>{item.name}</span>
                        {item.supplier && (
                          <div className="supplier-subtext">
                            {item.supplier}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="text-slate-400">{item.unit}</td>
                    <td className="text-right font-medium text-slate-300">
                      {item.purchaseQty.toFixed(2)}
                    </td>
                    <td className="text-right font-medium text-white">
                      {formatCurrency(item.totalCost)}
                    </td>
                    <td className="text-right text-indigo-400 font-bold">
                      {formatCurrency(item.unitCost)}/{item.unit.toLowerCase().includes('liter') ? 'L' : item.unit}
                    </td>
                    <td>
                      <div className="flex justify-center">
                        <span
                          className={`status-badge ${
                            item.status === 'In Stock'
                              ? 'emerald'
                              : item.status === 'Low Stock'
                              ? 'rose'
                              : 'neutral'
                          }`}
                        >
                          {item.status === 'In Stock' ? t('ingredients.inStock') : item.status === 'Low Stock' ? t('ingredients.lowStock') : item.status}
                        </span>
                      </div>
                    </td>
                    <td className="text-right relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                        className="menu-toggle-btn"
                      >
                        <MoreVertical className="menu-icon" />
                      </button>

                      {activeMenuId === item.id && (
                        <div className="dropdown-menu">
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              alert(`Editing ingredient: ${item.name}`);
                            }}
                            className="dropdown-item"
                          >
                            <Edit2 className="dropdown-icon indigo" />
                            <span>Edit Details</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onDeleteIngredient(item.id);
                            }}
                            className="dropdown-item danger"
                          >
                            <Trash2 className="dropdown-icon" />
                            <span>Delete SKU</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="pagination-footer">
          <span className="pagination-info">
            Showing {filteredIngredients.length} of {ingredients.length} ingredients
          </span>
          <div className="pagination-controls">
            <button className="page-btn disabled" disabled>
              Prev
            </button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Visual Context - Inventory Insights & Cost Tip */}
      <div className="insights-grid mt-8">
        <div className="image-card group">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDbKom_Pd4yet4fvpd1ejgj2TwfO_UmEw9F7y-pb1JtgjWt1jwzOhRRX1QSEPKzOLpxbJD7O9jURn6FZ42JxPJJ6kYLX4jDJAfnZMw2nGpvrIDf4XMUOdKzoBJeQWOGLdu8fJu1EkXlBQ7aZZmeilejtKNPaz6MksTKOWq3Zx4-AjxOhZmwKjs-gW6ujFbjJBUTVIP3eWYJGe6r2YVjHLv2Vcn3_N8YVL_G9bVwbK2YZr3MKk2zFO5"
            alt="Artisanal ice cream ingredients"
            className="image-card-img"
          />
          <div className="image-card-overlay">
            <h4 className="image-card-title">
              Inventory Insights
            </h4>
            <p className="image-card-desc">
              Premium ingredients currently account for 64% of your COGS. Consider seasonal bulk purchasing for Vanilla and Pistachios.
            </p>
          </div>
        </div>

        <div className="tip-card">
          <h4 className="tip-card-title">
            Cost Optimization Tip
          </h4>
          <p className="tip-card-desc">
            Your unit cost for <span className="font-bold text-white">Whole Cream</span> has increased by 12% since last month. Check the vendor dashboard for alternative local artisanal suppliers to maintain your 68% profit margin goal.
          </p>
          <button 
            onClick={() => alert(`Market Rates Comparison: Local Creamery Co (${formatCurrency(7.90)}/L) vs Artisanal Dairy (${formatCurrency(8.50)}/L). Switching yields +${formatCurrency(0.60)}/L savings.`)}
            className="action-btn-secondary"
          >
            View Market Rates
          </button>
        </div>
      </div>
    </div>
  );
};
