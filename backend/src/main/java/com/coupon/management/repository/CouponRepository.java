package com.coupon.management.repository;

import com.coupon.management.entity.Coupon;
import com.coupon.management.entity.DiscountType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends MongoRepository<Coupon, String> {
    Optional<Coupon> findByCode(String code);
    boolean existsByCode(String code);
    
    @Query("{ 'status': 'ACTIVE', 'expiryDate': { $gt: ?0 } }")
    List<Coupon> findActiveCoupons(LocalDateTime now);
    
    @Query("{ 'status': 'EXPIRED' }")
    List<Coupon> findExpiredCoupons();
    
    @Query("{ 'status': 'INACTIVE' }")
    List<Coupon> findInactiveCoupons();
    
    @Query("{ 'discountType': ?0 }")
    List<Coupon> findByDiscountType(DiscountType discountType);
    
    @Query("{ 'usedCount': { $gte: 'maxUsage' } }")
    List<Coupon> findFullyUsedCoupons();
}
