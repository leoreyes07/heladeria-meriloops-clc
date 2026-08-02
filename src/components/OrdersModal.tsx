import React, { useState } from 'react';
import { X, ShoppingBag, Plus, CheckCircle2, Clock, Truck } from 'lucide-react';
import { OrderItem } from '../types';

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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#141417] rounded-3xl shadow-2xl w-full max-w-3xl border border-white/10 overflow-hidden flex flex-col max-h-[85vh] text-white">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#161619]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans text-xl font-light tracking-tight text-white">
                Wholesale Orders <span className="font-semibold text-indigo-400">Ledger</span>
              </h3>
              <p className="text-xs text-slate-400">
                Manage client fulfillment & wholesale tubs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-400 transition-colors p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="flex justify-between items-center">
            <span className="font-bold text-[10px] uppercase text-slate-400 tracking-wider">
              Recent Wholesale Tub Requests ({orders.length})
            </span>
            <button
              onClick={() => setShowNewOrderForm(!showNewOrderForm)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-xs hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-950/50"
            >
              <Plus className="w-4 h-4" />
              <span>{showNewOrderForm ? 'Cancel Form' : 'New Wholesale Order'}</span>
            </button>
          </div>

          {/* New Order Form */}
          {showNewOrderForm && (
            <form onSubmit={handleCreateOrder} className="bg-[#161619] p-4 rounded-2xl border border-white/10 space-y-3 animate-in fade-in">
              <h4 className="font-bold text-xs text-white uppercase">Add Wholesale Tub Order</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">CUSTOMER NAME</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Grand Hotel Bakery"
                    className="w-full px-3 py-2 border border-white/10 rounded-xl text-xs bg-[#141417] text-white outline-none focus:border-indigo-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">FLAVOR & TUB SPEC</label>
                  <input
                    type="text"
                    value={flavorName}
                    onChange={(e) => setFlavorName(e.target.value)}
                    placeholder="e.g. Salted Caramel (20L Tub)"
                    className="w-full px-3 py-2 border border-white/10 rounded-xl text-xs bg-[#141417] text-white outline-none focus:border-indigo-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">BATCH LITERS</label>
                  <input
                    type="number"
                    value={batchLiters}
                    onChange={(e) => setBatchLiters(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-white/10 rounded-xl text-xs bg-[#141417] text-white outline-none focus:border-indigo-500/50 font-data-tabular"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">TOTAL PRICE ($)</label>
                  <input
                    type="number"
                    value={totalPrice}
                    onChange={(e) => setTotalPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-white/10 rounded-xl text-xs bg-[#141417] text-white outline-none focus:border-indigo-500/50 font-data-tabular"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold text-xs rounded-xl hover:bg-indigo-500/30 transition-all"
              >
                Save Wholesale Order
              </button>
            </form>
          )}

          {/* Orders Table */}
          <div className="bg-[#141417] border border-white/5 rounded-2xl overflow-hidden card-shadow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#161619] border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase">
                  <th className="px-4 py-3">Order #</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Flavor Specifications</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-data-tabular">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-bold text-indigo-400">{ord.orderNumber}</td>
                    <td className="px-4 py-3 font-semibold text-white">{ord.customerName}</td>
                    <td className="px-4 py-3 text-slate-400">
                      {ord.flavorName} ({ord.batchLiters}L)
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-white">
                      ${ord.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => onUpdateOrderStatus(ord.id, 'In Production')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            ord.status === 'In Production'
                              ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300'
                              : 'bg-white/5 text-slate-400 hover:bg-white/10'
                          }`}
                        >
                          Production
                        </button>
                        <button
                          onClick={() => onUpdateOrderStatus(ord.id, 'Pending')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            ord.status === 'Pending'
                              ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300'
                              : 'bg-white/5 text-slate-400 hover:bg-white/10'
                          }`}
                        >
                          Pending
                        </button>
                        <button
                          onClick={() => onUpdateOrderStatus(ord.id, 'Delivered')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                              : 'bg-white/5 text-slate-400 hover:bg-white/10'
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
        <div className="p-4 border-t border-white/5 bg-[#161619] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
