import React, { useState } from 'react';
import { X, Calculator } from 'lucide-react';
import { IngredientItem } from '../types';
import { useSettings } from '../contexts/SettingsContext';

interface AddIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIngredient: (ingredient: IngredientItem) => void;
}

export const AddIngredientModal: React.FC<AddIngredientModalProps> = ({
  isOpen,
  onClose,
  onAddIngredient,
}) => {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('Liters');
  const [purchaseQty, setPurchaseQty] = useState<string>('');
  const [totalCost, setTotalCost] = useState<string>('');
  const [category, setCategory] = useState<'Ice Cream Tubs' | 'Toppings' | 'Syrups & Sauces' | 'Fresh Produce' | 'Packaging'>('Ice Cream Tubs');
  const [supplier, setSupplier] = useState('');
  const { t, formatCurrency, currency } = useSettings();

  if (!isOpen) return null;

  const qtyNum = parseFloat(purchaseQty) || 0;
  const costNum = parseFloat(totalCost) || 0;
  const calculatedUnitCost = qtyNum > 0 && costNum >= 0 ? costNum / qtyNum : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter an ingredient name.');
      return;
    }
    if (qtyNum <= 0) {
      alert('Please enter a purchase quantity greater than 0.');
      return;
    }

    const newIngredient: IngredientItem = {
      id: 'ing-' + Date.now(),
      name: name.trim(),
      unit,
      purchaseQty: qtyNum,
      totalCost: costNum,
      unitCost: calculatedUnitCost,
      status: 'In Stock',
      category,
      supplier: supplier.trim() || 'Local Artisanal Supplier',
      lastUpdated: 'Just now',
    };

    onAddIngredient(newIngredient);
    setName('');
    setPurchaseQty('');
    setTotalCost('');
    setSupplier('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Modal Header */}
        <div className="modal-header">
          <h3 className="modal-title">
            {t('modals.addIngredient').split(' ').slice(0, -1).join(' ')} <span>{t('modals.addIngredient').split(' ').pop()}</span>
          </h3>
          <button
            onClick={onClose}
            className="modal-close-btn"
          >
            <X className="icon-sm" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid-2">
            <div className="form-group full-width">
              <label className="form-label">
                {t('modals.name')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Organic Strawberries"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {t('modals.category')}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="form-select"
              >
                <option value="Ice Cream Tubs">{t('ingredients.iceCreamTubs')}</option>
                <option value="Toppings">{t('ingredients.toppings')}</option>
                <option value="Syrups & Sauces">{t('ingredients.syrupsSauces')}</option>
                <option value="Fresh Produce">{t('ingredients.freshProduce')}</option>
                <option value="Packaging">{t('ingredients.packaging')}</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                {t('modals.unit')}
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="form-select"
              >
                <option value="Liters">Liters (L)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="ct">Units (ct)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Purchase Qty
              </label>
              <input
                type="number"
                step="0.01"
                value={purchaseQty}
                onChange={(e) => setPurchaseQty(e.target.value)}
                placeholder="0.00"
                className="form-input font-data-tabular"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Total Cost ({currency === 'NIO' ? 'C$' : '$'})
              </label>
              <input
                type="number"
                step="0.01"
                value={totalCost}
                onChange={(e) => setTotalCost(e.target.value)}
                placeholder="0.00"
                className="form-input font-data-tabular"
                required
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">
                {t('modals.supplier')} (Optional)
              </label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="e.g. Local Artisanal Dairy Co."
                className="form-input"
              />
            </div>

            <div className="form-group full-width">
              <div className="calc-result-box">
                <div className="calc-result-label">
                  <Calculator className="icon-sm indigo" />
                  <span>Calculated Unit Cost</span>
                </div>
                <div className="calc-result-value emerald">
                  {formatCurrency(calculatedUnitCost)} / {unit.toLowerCase().includes('liter') ? 'L' : unit}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="action-btn-secondary flex-1"
            >
              {t('modals.cancel')}
            </button>
            <button
              type="submit"
              className="action-btn-primary flex-1"
            >
              {t('modals.add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
