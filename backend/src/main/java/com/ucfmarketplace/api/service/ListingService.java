package com.ucfmarketplace.api.service;

import com.ucfmarketplace.api.model.Listing;
import com.ucfmarketplace.api.model.Listing.Category;
import com.ucfmarketplace.api.repository.ListingRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
public class ListingService {

    private final ListingRepository listingRepository;

    public ListingService(ListingRepository listingRepository) {
        this.listingRepository = listingRepository;
    }

    // Fetches every active listing for the dashboard
    public List<Listing> getAllListings() {
        return listingRepository.findAll();
    }

    // Saves a student's newly submitted marketplace item
    public Listing createListing(Listing listing) {
        return listingRepository.save(listing);
    }

    // Filter listings by a chosen category (e.g., Housing)
    public List<Listing> getListingsByCategory(Category category) {
        return listingRepository.findByCategory(category);
    }

    // Filter housing listings specifically by complex name
    public List<Listing> getListingsByComplex(String complexName) {
        return listingRepository.findByComplexNameIgnoreCase(complexName);
    }

    // Filter listings using a price budget limit
    public List<Listing> getListingsUnderPrice(BigDecimal maxPrice) {
        return listingRepository.findByPriceLessThanEqual(maxPrice);
    }
}