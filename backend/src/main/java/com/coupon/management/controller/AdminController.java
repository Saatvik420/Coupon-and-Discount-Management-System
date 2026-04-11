package com.coupon.management.controller;

import com.coupon.management.dto.CouponRequest;
import com.coupon.management.entity.Coupon;
import com.coupon.management.service.CouponService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/coupons")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private CouponService couponService;

    @PostMapping
    public ResponseEntity<Coupon> createCoupon(@Valid @RequestBody CouponRequest couponRequest) {
        Coupon coupon = couponService.createCoupon(couponRequest);
        return ResponseEntity.ok(coupon);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Coupon> updateCoupon(@PathVariable String id, @Valid @RequestBody CouponRequest couponRequest) {
        Coupon coupon = couponService.updateCoupon(id, couponRequest);
        return ResponseEntity.ok(coupon);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable String id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Coupon>> getAllCoupons() {
        List<Coupon> coupons = couponService.getAllCoupons();
        return ResponseEntity.ok(coupons);
    }

    @GetMapping("/active")
    public ResponseEntity<List<Coupon>> getActiveCoupons() {
        List<Coupon> coupons = couponService.getActiveCoupons();
        return ResponseEntity.ok(coupons);
    }

    @GetMapping("/expired")
    public ResponseEntity<List<Coupon>> getExpiredCoupons() {
        List<Coupon> coupons = couponService.getExpiredCoupons();
        return ResponseEntity.ok(coupons);
    }

    @GetMapping("/inactive")
    public ResponseEntity<List<Coupon>> getInactiveCoupons() {
        List<Coupon> coupons = couponService.getInactiveCoupons();
        return ResponseEntity.ok(coupons);
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<Coupon> activateCoupon(@PathVariable String id) {
        Coupon coupon = couponService.activateCoupon(id);
        return ResponseEntity.ok(coupon);
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Coupon> deactivateCoupon(@PathVariable String id) {
        Coupon coupon = couponService.deactivateCoupon(id);
        return ResponseEntity.ok(coupon);
    }
}
