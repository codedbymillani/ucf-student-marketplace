package com.ucfmarketplace.api.repository;

import com.ucfmarketplace.api.model.Listing;
import com.ucfmarketplace.api.model.Listing.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Long> {
    
    // Find all listings belonging to a specific category (e.g., Housing)
    List<Listing> findByCategory(Category category);
    
    // Find all housing listings at a specific complex (e.g., Plaza on University)
    List<Listing> findByComplexNameIgnoreCase(String complexName);
    
    // Find all items under a certain budget slider limit
    List<Listing> findByPriceLessThanEqual(BigDecimal maxPrice);
}