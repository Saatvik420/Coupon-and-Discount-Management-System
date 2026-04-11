// Currency conversion utilities
export const USD_TO_INR_RATE = 83.12; // Current exchange rate (can be updated)

// Convert USD to INR
export const convertToINR = (usdAmount) => {
  return Math.round(usdAmount * USD_TO_INR_RATE);
};

// Format currency with proper symbol
export const formatUSD = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format both currencies together
export const formatDualCurrency = (usdAmount) => {
  return {
    usd: formatUSD(usdAmount),
    inr: formatINR(convertToINR(usdAmount))
  };
};

// Calculate discount information
export const calculateDiscountInfo = (coupon, orderAmount) => {
  let discountAmount = 0;
  let discountPercentage = 0;
  
  if (coupon.discountType === 'PERCENTAGE') {
    discountAmount = orderAmount * (coupon.discountValue / 100);
    discountPercentage = coupon.discountValue;
  } else {
    discountAmount = Math.min(coupon.discountValue, orderAmount);
    discountPercentage = (discountAmount / orderAmount) * 100;
  }
  
  const finalAmount = orderAmount - discountAmount;
  
  return {
    discountAmount,
    discountPercentage: Math.round(discountPercentage * 10) / 10,
    finalAmount,
    originalAmount: orderAmount,
    savings: {
      usd: formatUSD(discountAmount),
      inr: formatINR(convertToINR(discountAmount)),
      percentage: `${Math.round(discountPercentage * 10) / 10}%`
    },
    pricing: {
      original: formatDualCurrency(orderAmount),
      discount: formatDualCurrency(discountAmount),
      final: formatDualCurrency(finalAmount)
    }
  };
};

// Get discount text for display
export const getDiscountText = (coupon) => {
  if (coupon.discountType === 'PERCENTAGE') {
    return `${coupon.discountValue}% OFF`;
  } else {
    return `${formatUSD(coupon.discountValue)} OFF`;
  }
};
