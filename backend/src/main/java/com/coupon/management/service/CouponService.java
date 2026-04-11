package com.coupon.management.service;

import com.coupon.management.dto.CouponApplicationRequest;
import com.coupon.management.dto.CouponApplicationResponse;
import com.coupon.management.dto.CouponRequest;
import com.coupon.management.entity.Coupon;
import com.coupon.management.entity.CouponStatus;
import com.coupon.management.entity.DiscountType;
import com.coupon.management.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class CouponService {

    @Autowired
    private CouponRepository couponRepository;

    public Coupon createCoupon(CouponRequest couponRequest) {
        if (couponRepository.existsByCode(couponRequest.getCode())) {
            throw new RuntimeException("Coupon code already exists");
        }

        if (couponRequest.getDiscountType() == DiscountType.PERCENTAGE && couponRequest.getDiscountValue() > 100) {
            throw new RuntimeException("Percentage discount cannot exceed 100%");
        }

        // Parse expiry date string to LocalDateTime
        LocalDateTime expiryDateTime;
        try {
            LocalDate date = LocalDate.parse(couponRequest.getExpiryDate());
            expiryDateTime = date.atTime(LocalTime.MAX); // Set to end of day
        } catch (Exception e) {
            throw new RuntimeException("Invalid expiry date format. Use YYYY-MM-DD");
        }

        Coupon coupon = new Coupon();
        coupon.setCode(couponRequest.getCode());
        coupon.setDescription(couponRequest.getDescription());
        coupon.setDiscountType(couponRequest.getDiscountType());
        coupon.setDiscountValue(couponRequest.getDiscountValue());
        coupon.setMinimumOrderAmount(couponRequest.getMinimumOrderAmount());
        coupon.setExpiryDate(expiryDateTime);
        coupon.setMaxUsage(couponRequest.getMaxUsage());
        coupon.setUsedCount(0);
        coupon.setStatus(CouponStatus.ACTIVE);

        return couponRepository.save(coupon);
    }

    public Coupon updateCoupon(String id, CouponRequest couponRequest) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));

        if (!coupon.getCode().equals(couponRequest.getCode()) && couponRepository.existsByCode(couponRequest.getCode())) {
            throw new RuntimeException("Coupon code already exists");
        }

        if (couponRequest.getDiscountType() == DiscountType.PERCENTAGE && couponRequest.getDiscountValue() > 100) {
            throw new RuntimeException("Percentage discount cannot exceed 100%");
        }

        // Parse expiry date string to LocalDateTime
        LocalDateTime expiryDateTime;
        try {
            LocalDate date = LocalDate.parse(couponRequest.getExpiryDate());
            expiryDateTime = date.atTime(LocalTime.MAX); // Set to end of day
        } catch (Exception e) {
            throw new RuntimeException("Invalid expiry date format. Use YYYY-MM-DD");
        }

        coupon.setCode(couponRequest.getCode());
        coupon.setDescription(couponRequest.getDescription());
        coupon.setDiscountType(couponRequest.getDiscountType());
        coupon.setDiscountValue(couponRequest.getDiscountValue());
        coupon.setMinimumOrderAmount(couponRequest.getMinimumOrderAmount());
        coupon.setExpiryDate(expiryDateTime);
        coupon.setMaxUsage(couponRequest.getMaxUsage());

        return couponRepository.save(coupon);
    }

    public void deleteCoupon(String id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
        couponRepository.delete(coupon);
    }

    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    public List<Coupon> getActiveCoupons() {
        return couponRepository.findActiveCoupons(LocalDateTime.now());
    }

    public List<Coupon> getExpiredCoupons() {
        return couponRepository.findExpiredCoupons();
    }

    public List<Coupon> getInactiveCoupons() {
        return couponRepository.findInactiveCoupons();
    }

    public CouponApplicationResponse applyCoupon(CouponApplicationRequest request) {
        System.out.println("DEBUG: Applying coupon with code: " + request.getCode());
        System.out.println("DEBUG: Order amount: " + request.getOrderAmount());
        
        Coupon coupon = couponRepository.findByCode(request.getCode())
                .orElseThrow(() -> new RuntimeException("Coupon not found"));

        System.out.println("DEBUG: Found coupon - Type: " + coupon.getDiscountType() + ", Value: " + coupon.getDiscountValue());

        // Validate coupon rules
        if (!validateCoupon(coupon, request.getOrderAmount())) {
            System.out.println("DEBUG: Coupon validation failed");
            return new CouponApplicationResponse(false, "Coupon cannot be applied");
        }

        // Calculate discount
        Double discountAmount = calculateDiscount(coupon, request.getOrderAmount());
        Double finalAmount = request.getOrderAmount() - discountAmount;

        System.out.println("DEBUG: Discount calculated: " + discountAmount);
        System.out.println("DEBUG: Final amount: " + finalAmount);

        // Increment used count
        coupon.setUsedCount(coupon.getUsedCount() + 1);
        
        // Check if coupon is fully used
        if (coupon.getUsedCount() >= coupon.getMaxUsage()) {
            coupon.setStatus(CouponStatus.INACTIVE);
        }
        
        couponRepository.save(coupon);

        CouponApplicationResponse response = new CouponApplicationResponse(
            true, 
            "Coupon applied successfully", 
            request.getOrderAmount(), // originalAmount
            discountAmount, 
            finalAmount, 
            coupon.getCode(), 
            coupon.getDiscountType()
        );
        
        System.out.println("DEBUG: Response created - Original: " + response.getOriginalAmount() + 
                          ", Discount: " + response.getDiscountAmount() + 
                          ", Final: " + response.getFinalAmount());
        
        return response;
    }

    public boolean validateCoupon(String code, Double orderAmount) {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
        
        return validateCoupon(coupon, orderAmount);
    }

    private boolean validateCoupon(Coupon coupon, Double orderAmount) {
        System.out.println("DEBUG: Validating coupon - Status: " + coupon.getStatus() + 
                          ", Expiry: " + coupon.getExpiryDate() + 
                          ", Used: " + coupon.getUsedCount() + "/" + coupon.getMaxUsage() +
                          ", Min Order: " + coupon.getMinimumOrderAmount() +
                          ", Order Amount: " + orderAmount);
        
        // Check if coupon is active
        if (coupon.getStatus() != CouponStatus.ACTIVE) {
            System.out.println("DEBUG: Validation failed - Coupon not active");
            return false;
        }

        // Check if coupon is expired
        if (coupon.getExpiryDate().isBefore(LocalDateTime.now())) {
            System.out.println("DEBUG: Validation failed - Coupon expired");
            return false;
        }

        // Check if usage limit is exceeded
        if (coupon.getUsedCount() >= coupon.getMaxUsage()) {
            System.out.println("DEBUG: Validation failed - Usage limit exceeded");
            return false;
        }

        // Check minimum order amount
        if (coupon.getMinimumOrderAmount() != null && orderAmount < coupon.getMinimumOrderAmount()) {
            System.out.println("DEBUG: Validation failed - Order amount " + orderAmount + 
                              " is less than minimum " + coupon.getMinimumOrderAmount());
            return false;
        }

        System.out.println("DEBUG: Validation passed");
        return true;
    }

    private Double calculateDiscount(Coupon coupon, Double orderAmount) {
        if (coupon.getDiscountType() == DiscountType.PERCENTAGE) {
            return orderAmount * (coupon.getDiscountValue() / 100);
        } else {
            return Math.min(coupon.getDiscountValue(), orderAmount);
        }
    }

    public Coupon activateCoupon(String id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
        
        if (coupon.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot activate expired coupon");
        }
        
        coupon.setStatus(CouponStatus.ACTIVE);
        return couponRepository.save(coupon);
    }

    public Coupon deactivateCoupon(String id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
        
        coupon.setStatus(CouponStatus.INACTIVE);
        return couponRepository.save(coupon);
    }
}
