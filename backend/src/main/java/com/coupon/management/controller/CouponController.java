package com.coupon.management.controller;

import com.coupon.management.dto.CouponApplicationRequest;
import com.coupon.management.dto.CouponApplicationResponse;
import com.coupon.management.entity.Coupon;
import com.coupon.management.service.CouponService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    @Autowired
    private CouponService couponService;

    @GetMapping("/active")
    public ResponseEntity<List<Coupon>> getActiveCoupons() {
        List<Coupon> coupons = couponService.getActiveCoupons();
        return ResponseEntity.ok(coupons);
    }

    @PostMapping("/apply")
    public ResponseEntity<CouponApplicationResponse> applyCoupon(@Valid @RequestBody CouponApplicationRequest request) {
        CouponApplicationResponse response = couponService.applyCoupon(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateCoupon(@Valid @RequestBody CouponApplicationRequest request) {
        boolean isValid = couponService.validateCoupon(request.getCode(), request.getOrderAmount());
        return ResponseEntity.ok(isValid);
    }

    @GetMapping
    public ResponseEntity<List<Coupon>> getAllCoupons() {
        List<Coupon> coupons = couponService.getAllCoupons();
        return ResponseEntity.ok(coupons);
    }
}
