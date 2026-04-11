package com.coupon.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class CouponApplicationRequest {
    
    @NotBlank
    private String code;
    
    @Positive
    private Double orderAmount;
    
    public CouponApplicationRequest() {}
    
    public CouponApplicationRequest(String code, Double orderAmount) {
        this.code = code;
        this.orderAmount = orderAmount;
    }
    
    public String getCode() {
        return code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }
    
    public Double getOrderAmount() {
        return orderAmount;
    }
    
    public void setOrderAmount(Double orderAmount) {
        this.orderAmount = orderAmount;
    }
}
