import React, { useState, useEffect } from 'react';
import { couponAPI } from '../services/api.jsx';
import { formatUSD, formatINR, calculateDiscountInfo, getDiscountText } from '../utils/currency.js';

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await couponAPI.getActiveCoupons();
      setCoupons(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch coupons');
      console.error('Error fetching coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  
  const getUsagePercentage = (coupon) => {
    return Math.min((coupon.usedCount / coupon.maxUsage) * 100, 100);
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryBadge = (days) => {
    if (days <= 7) return 'badge-error';
    if (days <= 30) return 'badge-warning';
    return 'badge-success';
  };

  const filteredAndSortedCoupons = coupons
    .filter(coupon => 
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'expiry') return new Date(a.expiryDate) - new Date(b.expiryDate);
      if (sortBy === 'discount') return b.discountValue - a.discountValue;
      return 0;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="loading mx-auto mb-4"></div>
          <p className="text-secondary">Loading coupons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="card max-w-md mx-auto">
          <div className="card-body">
            <h3 className="text-lg font-semibold text-error mb-2">Error</h3>
            <p className="text-secondary mb-4">{error}</p>
            <button
              onClick={fetchCoupons}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Available Coupons</h1>
        <p className="text-secondary">Discover exclusive deals and save money</p>
      </div>

      {/* Search and Filter */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
            >
              <option value="newest">Newest First</option>
              <option value="expiry">Expiring Soon</option>
              <option value="discount">Best Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Coupons Grid */}
      {filteredAndSortedCoupons.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2">No coupons found</h3>
          <p className="text-secondary">
            {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new deals!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCoupons.map((coupon) => {
            const daysUntilExpiry = getDaysUntilExpiry(coupon.expiryDate);
            const usagePercentage = getUsagePercentage(coupon);
            
            return (
              <div key={coupon.id} className="card hover:shadow-md transition-shadow">
                <div className="card-body">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-1">{coupon.code}</h3>
                      <p className="text-sm text-secondary">{coupon.description}</p>
                    </div>
                    <div className="badge badge-info">
                      {getDiscountText(coupon)}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary">Min Order</span>
                      <div className="text-right">
                        <span className="font-medium">{formatUSD(coupon.minimumOrderAmount)}</span>
                        <div className="text-xs text-gray-500">{formatINR(coupon.minimumOrderAmount)}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary">Expires</span>
                      <span className="font-medium">{formatDate(coupon.expiryDate)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary">Days Left</span>
                      <span className={`badge ${getExpiryBadge(daysUntilExpiry)}`}>
                        {daysUntilExpiry} days
                      </span>
                    </div>
                    
                    {/* Enhanced discount calculation preview */}
                    <div className="border-t pt-3">
                      <div className="text-sm font-medium text-primary mb-3">Sample Savings:</div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-secondary">Min Order:</span>
                            <div className="text-right">
                              <div className="font-medium">{formatUSD(coupon.minimumOrderAmount)}</div>
                              <div className="text-xs text-gray-500">{formatINR(coupon.minimumOrderAmount)}</div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-secondary">You Save:</span>
                            <div className="text-right">
                              <div className="font-medium text-success">
                                {(() => {
                                  const discountInfo = calculateDiscountInfo(coupon, coupon.minimumOrderAmount);
                                  return discountInfo.savings.usd;
                                })()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {(() => {
                                  const discountInfo = calculateDiscountInfo(coupon, coupon.minimumOrderAmount);
                                  return discountInfo.savings.inr;
                                })()}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-secondary">Final Price:</span>
                            <div className="text-right">
                              <div className="font-bold text-primary">
                                {(() => {
                                  const discountInfo = calculateDiscountInfo(coupon, coupon.minimumOrderAmount);
                                  return discountInfo.pricing.final.usd;
                                })()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {(() => {
                                  const discountInfo = calculateDiscountInfo(coupon, coupon.minimumOrderAmount);
                                  return discountInfo.pricing.final.inr;
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-secondary">Usage</span>
                      <span className="font-medium">{coupon.usedCount} / {coupon.maxUsage}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          usagePercentage > 80 ? 'bg-error' : 
                          usagePercentage > 50 ? 'bg-warning' : 'bg-success'
                        }`}
                        style={{ width: `${usagePercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <button
                      onClick={() => window.location.href = `/apply-coupon?code=${coupon.code}`}
                      className="btn btn-primary flex-1"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-primary mb-1">{coupons.length}</div>
            <div className="text-sm text-secondary">Active Coupons</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-success mb-1">
              {coupons.reduce((sum, c) => sum + c.maxUsage - c.usedCount, 0)}
            </div>
            <div className="text-sm text-secondary">Available Uses</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-warning mb-1">
              {Math.max(...coupons.map(c => c.discountValue), 0)}%
            </div>
            <div className="text-sm text-secondary">Max Discount</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponList;
