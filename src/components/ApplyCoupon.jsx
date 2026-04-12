import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { couponAPI } from '../services/api.jsx';
import { formatUSD, formatINR, calculateDiscountInfo, getDiscountText } from '../utils/currency.js';

const ApplyCoupon = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    code: searchParams.get('code') || '',
    orderAmount: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationResult, setValidationResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === 'orderAmount' ? parseFloat(value) || '' : value;
    
    setFormData({
      ...formData,
      [name]: processedValue,
    });
    
    // Clear previous results when form changes
    setResult(null);
    setError('');
    setValidationResult(null);
  };

  const validateCoupon = async () => {
    if (!formData.code || !formData.orderAmount) return;
    
    try {
      const response = await couponAPI.validateCoupon(formData.code, formData.orderAmount);
      setValidationResult(response.data);
    } catch (err) {
      setValidationResult(null);
    }
  };

  useEffect(() => {
    // Temporarily disabled automatic coupon validation
    // if (formData.code && formData.orderAmount) {
    //   const timer = setTimeout(() => {
    //     validateCoupon();
    //   }, 500);
    //   return () => clearTimeout(timer);
    // }
  }, [formData.code, formData.orderAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await couponAPI.applyCoupon(formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to apply coupon');
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Apply Coupon</h1>
          <p className="text-secondary">Enter your coupon code to save on your order</p>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="form-group">
                    <label htmlFor="code" className="form-label">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      required
                      value={formData.code}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter coupon code"
                    />
                  </div>
                </div>

                <div>
                  <div className="form-group">
                    <label htmlFor="orderAmount" className="form-label">
                      Order Amount ($)
                    </label>
                    <input
                      type="number"
                      id="orderAmount"
                      name="orderAmount"
                      required
                      min="0"
                      step="0.01"
                      value={formData.orderAmount}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Live Validation Preview */}
              {validationResult && (
                <div className="alert alert-success mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">Coupon Valid!</span>
                    <span className="badge badge-success">
                      {getDiscountText(validationResult)}
                    </span>
                  </div>
                  
                  {/* Enhanced pricing display */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-primary mb-2">Pricing Details:</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-secondary">Original Amount:</span>
                        <div className="font-medium">{formatUSD(formData.orderAmount)}</div>
                        <div className="text-xs text-gray-500">{formatINR(formData.orderAmount)}</div>
                      </div>
                      <div>
                        <span className="text-secondary">Discount Amount:</span>
                        <div className="font-medium text-success">{formatUSD(validationResult.discountAmount)}</div>
                        <div className="text-xs text-gray-500">{formatINR(validationResult.discountAmount)}</div>
                      </div>
                      <div className="col-span-2 border-t pt-2">
                        <span className="text-secondary">Final Amount:</span>
                        <div className="font-bold text-lg text-primary">{formatUSD(validationResult.finalAmount)}</div>
                        <div className="text-sm text-gray-500">{formatINR(validationResult.finalAmount)}</div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span className="text-secondary">You Save:</span>
                      <span className="font-bold text-success">
                        {formatUSD(validationResult.discountAmount)} ({formatINR(validationResult.discountAmount)})
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="loading mr-2"></span>
                    Applying...
                  </span>
                ) : (
                  'Apply Coupon'
                )}
              </button>
            </form>

            {error && (
              <div className="alert alert-error mt-6">
                {error}
              </div>
            )}

            {result && (
              <div className="alert alert-success mt-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold mb-2">Coupon Applied Successfully!</h3>
                  <p>You've saved on your order</p>
                </div>

                {/* Enhanced pricing breakdown */}
                <div className="space-y-4">
                  <div className="text-sm font-medium text-primary mb-3">Order Summary:</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-secondary">Original Amount:</span>
                        <div>
                          <div className="font-medium">{formatUSD(result.originalAmount)}</div>
                          <div className="text-xs text-gray-500">{formatINR(result.originalAmount)}</div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary">Discount:</span>
                        <div className="text-success">
                          <div className="font-medium">-{formatUSD(result.discountAmount)}</div>
                          <div className="text-xs text-gray-500">-{formatINR(result.discountAmount)}</div>
                        </div>
                      </div>
                    </div>
                    <div className="border-l pl-4 space-y-2">
                      <div className="text-sm text-secondary mb-1">You Save:</div>
                      <div className="text-lg font-bold text-success">
                        {formatUSD(result.discountAmount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatINR(result.discountAmount)}
                      </div>
                      <div className="text-xs text-primary mt-1">
                        ({((result.discountAmount / result.originalAmount) * 100).toFixed(1)}% off)
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Final Amount:</span>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">{formatUSD(result.finalAmount)}</div>
                        <div className="text-sm text-gray-500">{formatINR(result.finalAmount)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      setResult(null);
                      setFormData({ code: '', orderAmount: '' });
                      setValidationResult(null);
                    }}
                    className="btn btn-secondary flex-1"
                  >
                    Apply Another
                  </button>
                  <button
                    onClick={() => navigate('/coupons')}
                    className="btn btn-primary flex-1"
                  >
                    View More Coupons
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/coupons')}
                className="btn btn-secondary"
              >
                Browse Available Coupons
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyCoupon;
