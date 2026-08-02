import React, { useState } from 'react';
import { X, ShoppingBag, Plus, CheckCircle2, Clock, Truck } from 'lucide-react';
import { OrderItem } from '../types';
import { useSettings } from '../contexts/SettingsContext';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderItem[];
  onAddOrder: (order: OrderItem) => void;
  onUpdateOrderStatus: (id: string, status: 'In Production' | 'Pending' | 'Delivered') => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  onAddOrder,
  onUpdateOrderStatus,
}) => {
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [flavorName, setFlavorName] = useState('Sicilian Pistachio (20L Tub)');
  const [batchLiters, setBatchLiters] = useState<number>(20);
  const [totalPrice, setTotalPrice] = useState<number>(280.00);
  const { t, formatCurrency, currency } = useSettings();

  if (!isOpen) return null;

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Please enter a customer name.');
      return;
    }

    const newOrder: OrderItem = {
      id: 'ord-' + Date.now(),
      orderNumber: `#SCOOP-${Math.floor(8000 + Math.random() * 1000)}`,
      customerName: customerName.trim(),
      flavorName,
      batchLiters,
      status: 'In Production',
      orderDate: new Date().toISOString().split('T')[0],
      totalPrice,
    };

    onAddOrder(newOrder);
    setCustomerName('');
    setShowNewOrderForm(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        {/* Header */}
        <div className="modal-header">
          <div className="flex-row items-center gap-3">
            <div className="icon-wrapper indigo-outline">
              <ShoppingBag className="icon-sm" />
            </div>
            <div>
              <h3 className="modal-title">
                {t('modals.ordersTitle')} <span>Ledger</span>
              </h3>
              <p className="modal-subtitle">
                Manage client fulfillment & wholesale tubs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
          >
            <X className="icon-sm" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body overflow-y-auto">
          <div className="flex-between mb-6">
            <span className="form-label mb-0">
              Recent Wholesale Tub Requests ({orders.length})
            </span>
            <button
              onClick={() => setShowNewOrderForm(!showNewOrderForm)}
              className="action-btn-primary"
            >
              <Plus className="icon-xs" />
              <span>{showNewOrderForm ? 'Cancel Form' : 'New Wholesale Order'}</span>
            </button>
          </div>

          {/* New Order Form */}
          {showNewOrderForm && (
            <form onSubmit={handleCreateOrder} className="inline-form">
              <h4 className="form-label white">Add Wholesale Tub Order</h4>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label-light">{t('modals.customer').toUpperCase()}</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Grand Hotel Bakery"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label-light">{t('modals.flavor').toUpperCase()} & TUB SPEC</label>
                  <input
                    type="text"
                    value={flavorName}
                    onChange={(e) => setFlavorName(e.target.value)}
                    placeholder="e.g. Salted Caramel (20L Tub)"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label-light">BATCH LITERS</label>
                  <input
                    type="number"
                    value={batchLiters}
                    onChange={(e) => setBatchLiters(parseFloat(e.target.value) || 1)}
                    className="form-input font-data-tabular"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label-light">TOTAL PRICE ({currency === 'NIO' ? 'C$' : '$'})</label>
                  <input
                    type="number"
                    value={totalPrice}
                    onChange={(e) => setTotalPrice(parseFloat(e.target.value) || 0)}
                    className="form-input font-data-tabular"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="action-btn-secondary full-width mt-3"
              >
                Save Wholesale Order
              </button>
            </form>
          )}

          {/* Orders Table */}
          <div className="table-card mt-6">
            <table className="data-table">
              <thead>
                <tr className="header-row">
                  <th>{t('modals.orderNumber')}</th>
                  <th>{t('modals.customer')}</th>
                  <th>Flavor Specifications</th>
                  <th className="text-right">Price</th>
                  <th className="text-center">{t('modals.status')}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord.id}>
                    <td className="font-bold text-indigo-400">{ord.orderNumber}</td>
                    <td className="font-semibold text-white">{ord.customerName}</td>
                    <td className="text-slate-400">
                      {ord.flavorName} ({ord.batchLiters}L)
                    </td>
                    <td className="text-right font-bold text-white">
                      {formatCurrency(ord.totalPrice)}
                    </td>
                    <td>
                      <div className="flex-row justify-center gap-1">
                        <button
                          onClick={() => onUpdateOrderStatus(ord.id, 'In Production')}
                          className={`status-btn ${
                            ord.status === 'In Production'
                              ? 'indigo'
                              : ''
                          }`}
                        >
                          Production
                        </button>
                        <button
                          onClick={() => onUpdateOrderStatus(ord.id, 'Pending')}
                          className={`status-btn ${
                            ord.status === 'Pending'
                              ? 'amber'
                              : ''
                          }`}
                        >
                          Pending
                        </button>
                        <button
                          onClick={() => onUpdateOrderStatus(ord.id, 'Delivered')}
                          className={`status-btn ${
                            ord.status === 'Delivered'
                              ? 'emerald'
                              : ''
                          }`}
                        >
                          Delivered
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer justify-end">
          <button
            onClick={onClose}
            className="action-btn-primary"
          >
            {t('modals.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
