import React, { useState } from 'react';
import { Plus, Edit, Trash2, Copy, Download, Package, BarChart3, Settings, Eye, CheckCircle, Clock, AlertCircle, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';

export default function BevelientAdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [products] = useState([
    { id: 1, name: 'Linea 24', price: 2000000, warranty: '18 months' },
    { id: 2, name: 'Heritage Crossbody', price: 1500000, warranty: '12 months' },
    { id: 3, name: 'Classic Clutch', price: 950000, warranty: '12 months' }
  ]);

  const [orders, setOrders] = useState([
    { 
      id: 'BVL-001', 
      product: 'Linea 24', 
      price: 2000000, 
      shipping: 25000, 
      status: 'link_sent',
      createdAt: '2024-07-01 14:30',
      customer: null
    },
    { 
      id: 'BVL-002', 
      product: 'Heritage Crossbody', 
      price: 1500000, 
      shipping: 20000, 
      status: 'completed',
      createdAt: '2024-07-01 10:15',
      customer: { name: 'Sari Wijaya', email: 'sari@email.com', phone: '+62 811 1234 5678' }
    },
    { 
      id: 'BVL-003', 
      product: 'Classic Clutch', 
      price: 950000, 
      shipping: 15000, 
      status: 'shipped',
      createdAt: '2024-06-30 16:45',
      customer: { name: 'Maya Putri', email: 'maya@email.com', phone: '+62 812 9876 5432' }
    }
  ]);

  const [statusOptions] = useState([
    { id: 'link_sent', name: 'Link Sent', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
    { id: 'confirmed', name: 'Confirmed', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
    { id: 'in_production', name: 'In Production', bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
    { id: 'shipped', name: 'Shipped', bgColor: 'bg-indigo-100', textColor: 'text-indigo-800' },
    { id: 'delivered', name: 'Delivered', bgColor: 'bg-green-100', textColor: 'text-green-800' },
    { id: 'completed', name: 'Completed', bgColor: 'bg-emerald-100', textColor: 'text-emerald-800' },
    { id: 'cancelled', name: 'Cancelled', bgColor: 'bg-red-100', textColor: 'text-red-800' }
  ]);

  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusDisplay = (statusId) => {
    const status = statusOptions.find(s => s.id === statusId);
    if (!status) return { name: statusId, bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
    return status;
  };

  const updateOrderStatus = (orderId, newStatusId) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatusId }
        : order
    ));
    setEditingOrder(null);
  };

  const getAnalytics = () => {
    const completedOrders = orders.filter(order => order.status === 'completed' || order.status === 'delivered');
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.price + order.shipping, 0);
    const totalOrders = completedOrders.length;
    const pendingOrders = orders.filter(order => order.status === 'link_sent').length;
    const conversionRate = orders.length > 0 ? (completedOrders.length / orders.length) * 100 : 0;
    
    return { totalRevenue, totalOrders, pendingOrders, conversionRate };
  };

  const analytics = getAnalytics();

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert('🦄 Customer link copied!');
  };

  const printShippingLabel = () => {
    if (!viewingOrder) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Shipping Label - ${viewingOrder.id}</title>
          <style>
            @page { size: 10cm 15cm; margin: 0; }
            body { font-family: Arial, sans-serif; margin: 0; padding: 8mm; width: 10cm; height: 15cm; font-size: 11px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 4mm; margin-bottom: 4mm; }
            .section { margin-bottom: 4mm; }
            .barcode { text-align: center; font-family: monospace; font-size: 14px; border: 1px solid #000; padding: 2mm; }
          </style>
        </head>
        <body>
          <div class="header">
            <div style="font-size: 18px; font-weight: bold;">🦄 BEVELIENT</div>
            <div style="font-size: 10px;">Artisan Handbags</div>
          </div>
          <div class="section">
            <strong>Order ID:</strong> ${viewingOrder.id}<br>
            <strong>Product:</strong> ${viewingOrder.product}<br>
            <strong>Value:</strong> ${formatCurrency(viewingOrder.price + viewingOrder.shipping)}
          </div>
          <div class="barcode">|||| ${viewingOrder.id} ||||</div>
          <div class="section">
            <strong>FROM:</strong><br>
            Bevelient<br>
            Jakarta, Indonesia
          </div>
          <div class="section">
            <strong>TO:</strong><br>
            ${viewingOrder.customer ? viewingOrder.customer.name : 'Customer Pending'}<br>
            ${viewingOrder.customer ? viewingOrder.customer.phone : ''}
          </div>
          <div style="border-top: 1px solid #000; padding-top: 2mm; margin-top: 4mm;">
            <strong>HANDLE WITH CARE - Handcrafted Product</strong>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🦄</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Bevelient Admin</h1>
                <p className="text-xs text-orange-600">Order Management Dashboard</p>
              </div>
            </div>
            
            <button className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm">
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-orange-100 mb-6">
          <div className="flex space-x-1 p-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'dashboard' 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-600 hover:bg-orange-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'orders' 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-600 hover:bg-orange-50'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Orders</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'products' 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-600 hover:bg-orange-50'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Products</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
              <p className="text-gray-600">Track your business performance</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Completed Orders</p>
                    <p className="text-2xl font-bold">{analytics.totalOrders}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Pending Orders</p>
                    <p className="text-2xl font-bold">{analytics.pendingOrders}</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Conversion Rate</p>
                    <p className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-200" />
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-orange-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${order.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <div>
                        <p className="font-medium text-gray-800">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.product}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">{formatCurrency(order.price + order.shipping)}</p>
                      <p className="text-xs text-gray-500">{order.createdAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Orders Management</h2>
                <p className="text-gray-600">Create and manage customer orders</p>
              </div>
              <button className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all">
                <Plus className="w-5 h-5" />
                <span>Create New Order</span>
              </button>
            </div>

            {/* Orders Table */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-orange-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-800">Order ID</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-800">Product</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-800">Total</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-800">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-800">Customer</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-orange-100 hover:bg-orange-25">
                        <td className="py-4 px-6 font-medium text-gray-800">{order.id}</td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-gray-800">{order.product}</p>
                            <p className="text-sm text-gray-600">{formatCurrency(order.price)}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-gray-800">{formatCurrency(order.price + order.shipping)}</p>
                            <p className="text-sm text-gray-600">+{formatCurrency(order.shipping)} shipping</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="relative">
                            {editingOrder === order.id ? (
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                className="w-full p-2 border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:outline-none"
                                onBlur={() => setEditingOrder(null)}
                                autoFocus
                              >
                                {statusOptions.map(status => (
                                  <option key={status.id} value={status.id}>
                                    {status.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <button
                                onClick={() => setEditingOrder(order.id)}
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors hover:opacity-80 ${
                                  getStatusDisplay(order.status).bgColor
                                } ${
                                  getStatusDisplay(order.status).textColor
                                }`}
                              >
                                {getStatusDisplay(order.status).name}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {order.customer ? (
                            <div>
                              <p className="font-medium text-gray-800">{order.customer.name}</p>
                              <p className="text-sm text-gray-600">{order.customer.email}</p>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">Waiting for customer</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => copyLink(`https://bevelient.com/order/${order.id}`)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                              title="Copy customer link"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingOrder(order.id)}
                              className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
                              title="Edit status"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setViewingOrder(order)}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              title="View shipping label"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Products Management</h2>
                <p className="text-gray-600">Manage your handbag collection</p>
              </div>
              <button className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all">
                <Plus className="w-5 h-5" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white/90 backdrop-blur-sm rounded-xl border border-orange-100 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                      <p className="text-2xl font-bold text-orange-600">{formatCurrency(product.price)}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {product.warranty} warranty
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shipping Label Modal */}
        {viewingOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Shipping Label - {viewingOrder.id}
                  </h3>
                  <div className="flex space-x-3">
                    <button
                      onClick={printShippingLabel}
                      className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Print Label</span>
                    </button>
                    <button
                      onClick={() => setViewingOrder(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-center mb-6">
                  <div className="border-2 border-gray-300 border-dashed p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2 text-center">
                      Preview (10cm × 15cm)
                    </p>
                    
                    <div 
                      className="bg-white border-2 border-black p-3"
                      style={{
                        width: '283px',
                        height: '425px',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '11px',
                        lineHeight: '1.3'
                      }}
                    >
                      {/* Header */}
                      <div className="text-center border-b-2 border-black pb-2 mb-3">
                        <div className="flex items-center justify-center mb-1">
                          <div className="w-6 h-6 bg-black rounded flex items-center justify-center mr-2">
                            <span className="text-white text-sm">🦄</span>
                          </div>
                          <div className="text-lg font-bold">BEVELIENT</div>
                        </div>
                        <div className="text-xs text-gray-600">Artisan Handbags</div>
                      </div>

                      {/* Order Details */}
                      <div className="mb-3">
                        <div className="text-xs font-bold border-b border-gray-300 mb-1">ORDER DETAILS</div>
                        <div>
                          <strong>ID:</strong> {viewingOrder.id}<br/>
                          <strong>Product:</strong> {viewingOrder.product}<br/>
                          <strong>Value:</strong> {formatCurrency(viewingOrder.price + viewingOrder.shipping)}
                        </div>
                      </div>

                      {/* Barcode */}
                      <div className="text-center my-3">
                        <div className="border border-black px-2 py-1 font-mono text-sm font-bold tracking-wider">
                          |||| {viewingOrder.id} ||||
                        </div>
                      </div>

                      {/* Addresses */}
                      <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                        <div>
                          <div className="font-bold border-b border-gray-300 mb-1">FROM</div>
                          <div>
                            Bevelient<br/>
                            Jakarta, Indonesia<br/>
                            +62 811 xxxx xxxx
                          </div>
                        </div>
                        
                        <div>
                          <div className="font-bold border-b border-gray-300 mb-1">TO</div>
                          <div>
                            {viewingOrder.customer ? (
                              <>
                                {viewingOrder.customer.name}<br/>
                                {viewingOrder.customer.phone}<br/>
                                [Address Pending]
                              </>
                            ) : (
                              'Customer Pending'
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="mb-3">
                        <div className="text-xs font-bold border-b border-gray-300 mb-1">STATUS</div>
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                          getStatusDisplay(viewingOrder.status).bgColor
                        } ${
                          getStatusDisplay(viewingOrder.status).textColor
                        }`}>
                          {getStatusDisplay(viewingOrder.status).name}
                        </span>
                      </div>

                      {/* Footer */}
                      <div className="border-t border-black pt-2 mt-4 text-xs">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-bold">HANDLE WITH CARE</div>
                            <div>Handcrafted Product</div>
                          </div>
                          <div className="w-12 h-12 border border-black flex items-center justify-center text-xs">
                            QR<br/>CODE
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
