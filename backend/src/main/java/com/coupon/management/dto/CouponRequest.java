package com.coupon.management.dto;

import com.coupon.management.entity.DiscountType;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class CouponRequest {
    
    @NotBlank
    @Size(min = 3, max = 20)
    private String code;
    
    @NotBlank
    @Size(max = 200)
    private String description;
    
    @NotNull
    private DiscountType discountType;
    
    @NotNull
    @Positive
    private Double discountValue;
    
    @Positive
    private Double minimumOrderAmount;
    
    @NotBlank
    private String expiryDate;
    
    @NotNull
    @Positive
    private Integer maxUsage;
    
    public CouponRequest() {}
    
    // Getters and Setters
    public String getCode() {
        return code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public DiscountType getDiscountType() {
        return discountType;
    }
    
    public void setDiscountType(DiscountType discountType) {
        this.discountType = discountType;
    }
    
    public Double getDiscountValue() {
        return discountValue;
    }
    
    public void setDiscountValue(Double discountValue) {
        this.discountValue = discountValue;
    }
    
    public Double getMinimumOrderAmount() {
        return minimumOrderAmount;
    }
    
    public void setMinimumOrderAmount(Double minimumOrderAmount) {
        this.minimumOrderAmount = minimumOrderAmount;
    }
    
    public String getExpiryDate() {
        return expiryDate;
    }
    
    public void setExpiryDate(String expiryDate) {
        this.expiryDate = expiryDate;
    }
    
    public Integer getMaxUsage() {
        return maxUsage;
    }
    
    public void setMaxUsage(Integer maxUsage) {
        this.maxUsage = maxUsage;
    }
}
