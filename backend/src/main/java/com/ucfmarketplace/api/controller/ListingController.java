package com.ucfmarketplace.api.controller;

import com.ucfmarketplace.api.model.Listing;
import com.ucfmarketplace.api.model.Listing.Category;
import com.ucfmarketplace.api.service.ListingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/listings")
@CrossOrigin(origins = "*") // Allows your frontend files to safely talk to this backend
public class ListingController {

    private final ListingService listingService;

    public ListingController(ListingService listingService) {
        this.listingService = listingService;
    }

    // Listens for requests to http://localhost:8080/api/listings
    // Handles filtering automatically if parameters are appended to the URL
    @GetMapping
    public ResponseEntity<List<Listing>> getListings(
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) String complex,
            @RequestParam(required = false) BigDecimal maxPrice) {

        if (category != null) {
            return ResponseEntity.ok(listingService.getListingsByCategory(category));
        }
        if (complex != null) {
            return ResponseEntity.ok(listingService.getListingsByComplex(complex));
        }
        if (maxPrice != null) {
            return ResponseEntity.ok(listingService.getListingsUnderPrice(maxPrice));
        }
        
        // If no filters are used, return everything
        return ResponseEntity.ok(listingService.getAllListings());
    }

    // Listens for POST requests to http://localhost:8080/api/listings
    @PostMapping
    public ResponseEntity<Listing> createListing(@RequestBody Listing listing) {
        Listing newListing = listingService.createListing(listing);
        return ResponseEntity.ok(newListing);
    }
}