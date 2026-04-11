import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api.jsx';
import { formatUSD, formatINR, getDiscountText } from '../utils/currency.js';

const AdminDashboard = () => {
  const [coupons, setCoupons] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minimumOrderAmount: '',
    maxUsage: '',
    expiryDate: '',
  });

  useEffect(() => {
    fetchCoupons();
  }, [activeTab]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      let response;
      switch (activeTab) {
        case 'active':
          response = await adminAPI.getActiveCoupons();
          break;
        case 'expired':
          response = await adminAPI.getExpiredCoupons();
          break;
        case 'inactive':
          response = await adminAPI.getInactiveCoupons();
          break;
        default:
          response = await adminAPI.getAllCoupons();
      }
      setCoupons(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch coupons');
      console.error('Error fetching coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCoupon) {
        await adminAPI.updateCoupon(editingCoupon.id, formData);
      } else {
        await adminAPI.createCoupon(formData);
      }
      
      setShowForm(false);
      setEditingCoupon(null);
      setFormData({
        code: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        minimumOrderAmount: '',
        maxUsage: '',
        expiryDate: '',
      });
      fetchCoupons();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save coupon');
      console.error('Error saving coupon:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await adminAPI.deleteCoupon(id);
        fetchCoupons();
      } catch (err) {
        setError('Failed to delete coupon');
        console.error('Error deleting coupon:', err);
      }
    }
  };

  const handleActivate = async (id) => {
    try {
      await adminAPI.activateCoupon(id);
      fetchCoupons();
    } catch (err) {
      setError('Failed to activate coupon');
      console.error('Error activating coupon:', err);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await adminAPI.deactivateCoupon(id);
      fetchCoupons();
    } catch (err) {
      setError('Failed to deactivate coupon');
      console.error('Error deactivating coupon:', err);
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minimumOrderAmount: coupon.minimumOrderAmount,
      maxUsage: coupon.maxUsage,
      expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0],
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCoupon(null);
    setFormData({
      code: '',
      description: '',
      discountType: 'PERCENTAGE',
      discountValue: '',
      minimumOrderAmount: '',
      maxUsage: '',
      expiryDate: '',
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  
  const getStatusBadge = (coupon) => {
    const today = new Date();
    const expiryDate = new Date(coupon.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 0) return 'badge-error';
    if (daysUntilExpiry <= 7) return 'badge-warning';
    if (coupon.usedCount >= coupon.maxUsage) return 'badge-error';
    return 'badge-success';
  };

  const getStatusText = (coupon) => {
    const today = new Date();
    const expiryDate = new Date(coupon.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 0) return 'Expired';
    if (daysUntilExpiry <= 7) return 'Expiring Soon';
    if (coupon.usedCount >= coupon.maxUsage) return 'Used Up';
    return 'Active';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="loading mx-auto mb-4"></div>
          <p className="text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Admin Dashboard</h1>
          <p className="text-secondary">Manage coupons and monitor usage</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          Create Coupon
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="card-body">
            <div className="text-2xl font-bold text-primary mb-1">{coupons.length}</div>
            <div className="text-sm text-secondary">Total Coupons</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="text-2xl font-bold text-success mb-1">
              {coupons.filter(c => c.status === 'ACTIVE' && new Date(c.expiryDate) > new Date()).length}
            </div>
            <div className="text-sm text-secondary">Active Coupons</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="text-2xl font-bold text-warning mb-1">
              {coupons.reduce((sum, c) => sum + c.usedCount, 0)}
            </div>
            <div className="text-sm text-secondary">Total Uses</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="text-2xl font-bold text-error mb-1">
              {coupons.filter(c => new Date(c.expiryDate) <= new Date() || c.status === 'INACTIVE').length}
            </div>
            <div className="text-sm text-secondary">Inactive/Expired</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          {error}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="card mb-6">
          <div className="card-header">
            <h3 className="text-lg font-semibold">
              {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
            </h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="code" className="form-label">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter coupon code"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter description"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="discountType" className="form-label">
                    Discount Type
                  </label>
                  <select
                    id="discountType"
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FLAT">Flat Amount</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="discountValue" className="form-label">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    id="discountValue"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter discount value"
                    min="0"
                    max={formData.discountType === 'PERCENTAGE' ? 100 : undefined}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="minimumOrderAmount" className="form-label">
                    Minimum Order Amount ($)
                  </label>
                  <input
                    type="number"
                    id="minimumOrderAmount"
                    name="minimumOrderAmount"
                    value={formData.minimumOrderAmount}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter minimum order amount"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="maxUsage" className="form-label">
                    Maximum Usage
                  </label>
                  <input
                    type="number"
                    id="maxUsage"
                    name="maxUsage"
                    value={formData.maxUsage}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter maximum usage"
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="expiryDate" className="form-label">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="form-input"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['all', 'active', 'expired', 'inactive'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-secondary hover:text-primary'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({coupons.length})
            </button>
          ))}
        </nav>
      </div>

      {/* Coupons Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Coupons
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
                <th>Discount</th>
                <th>Min Order</th>
                <th>Usage</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-secondary">
                    No coupons found
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td className="font-medium">{coupon.code}</td>
                    <td className="text-sm">{coupon.description}</td>
                    <td>
                      <span className="badge badge-info">
                        {getDiscountText(coupon)}
                      </span>
                    </td>
                    <td>
                      <div>{formatUSD(coupon.minimumOrderAmount)}</div>
                      <div className="text-xs text-gray-500">{formatINR(coupon.minimumOrderAmount)}</div>
                    </td>
                    <td>
                      <div className="text-sm">
                        {coupon.usedCount} / {coupon.maxUsage}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div 
                          className="h-1 rounded-full bg-primary"
                          style={{ width: `${(coupon.usedCount / coupon.maxUsage) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="text-sm">{formatDate(coupon.expiryDate)}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(coupon)}`}>
                        {getStatusText(coupon)}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="btn btn-secondary btn-sm"
                        >
                          Edit
                        </button>
                        {coupon.status === 'ACTIVE' ? (
                          <button
                            onClick={() => handleDeactivate(coupon.id)}
                            className="btn btn-warning btn-sm"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivate(coupon.id)}
                            className="btn btn-success btn-sm"
                          >
                            Activate
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
