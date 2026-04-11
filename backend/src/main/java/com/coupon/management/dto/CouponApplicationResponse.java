package com.coupon.management.dto;

import com.coupon.management.entity.DiscountType;

public class CouponApplicationResponse {
    private boolean success;
    private String message;
    private Double originalAmount;
    private Double discountAmount;
    private Double finalAmount;
    private String couponCode;
    private DiscountType discountType;
    
    public CouponApplicationResponse() {}
    
    public CouponApplicationResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public CouponApplicationResponse(boolean success, String message, Double originalAmount, Double discountAmount, 
                                    Double finalAmount, String couponCode, DiscountType discountType) {
        this.success = success;
        this.message = message;
        this.originalAmount = originalAmount;
        this.discountAmount = discountAmount;
        this.finalAmount = finalAmount;
        this.couponCode = couponCode;
        this.discountType = discountType;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public Double getOriginalAmount() {
        return originalAmount;
    }
    
    public void setOriginalAmount(Double originalAmount) {
        this.originalAmount = originalAmount;
    }
    
    public Double getDiscountAmount() {
        return discountAmount;
    }
    
    public void setDiscountAmount(Double discountAmount) {
        this.discountAmount = discountAmount;
    }
    
    public Double getFinalAmount() {
        return finalAmount;
    }
    
    public void setFinalAmount(Double finalAmount) {
        this.finalAmount = finalAmount;
    }
    
    public String getCouponCode() {
        return couponCode;
    }
    
    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }
    
    public DiscountType getDiscountType() {
        return discountType;
    }
    
    public void setDiscountType(DiscountType discountType) {
        this.discountType = discountType;
    }
}
