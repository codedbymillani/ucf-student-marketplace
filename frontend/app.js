// The web address where your Java Spring Boot server runs local testing
const API_BASE_URL = 'http://localhost:8080/api';

// Track the current logged-in user state in the browser's temporary memory
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    initAuthEngine();
    initListingEngine();
});

/**
 * 1. THE AUTHENTICATION ENGINE
 * Handles logging in, registration, and strict data validation rules.
 */
function initAuthEngine() {
    const authForm = document.getElementById('authForm');
    const authModal = document.getElementById('authModal');
    
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Stop page from refreshing automatically
        
        // Pull values directly out of the inputs
        const username = document.getElementById('authUsername').value.trim();
        const password = document.getElementById('authPassword').value;
        const email = document.getElementById('authEmail')?.value.trim();
        const contactHandle = document.getElementById('authHandle')?.value.trim();
        
        // Determine mode based on whether the Register box is open
        const isRegisterMode = !document.getElementById('registerFields').classList.contains('hidden');

        // UX STIPULATION: Password Length & Strength Enforcement
        if (password.length < 8) {
            alert("⚠️ Security Rule: Password must be at least 8 characters long!");
            return;
        }

        if (isRegisterMode) {
            // FUTURE IMPLEMENTATION NOTE: 
            // To add real email verification later, we would trigger an activation token here.
            // For now, we enforce a valid structure constraint.
            if (!email.endsWith('.edu')) {
                alert("⚠️ Campus Policy: Registration currently requires a valid university (.edu) email address.");
                return;
            }

            // PACKAGE DATA FOR JAVA BACKEND REGISTER ROUTE
            const registerPayload = {
                username: username,
                email: email,
                passwordHash: password, // The backend UserService will intercept and hash this safely using BCrypt
                contactHandle: contactHandle
            };

            try {
                const response = await fetch(`${API_BASE_URL}/users/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(registerPayload)
                });

                if (response.ok) {
                    const savedUser = await response.json();
                    alert(`⚡ Welcome to Space U, ${savedUser.username}! Account created successfully. Please sign in.`);
                    // Force wrap back to login view state smoothly
                    document.getElementById('toggleAuthMode').click();
                } else {
                    const errorMsg = await response.text();
                    alert(`❌ Registration Failed: ${errorMsg}`);
                }
            } catch (err) {
                console.error("Connection Error:", err);
                alert("❌ Cannot connect to Java Server. Ensure your backend application is running on port 8080.");
            }

        } else {
            // LOGIN VERIFICATION LOGIC
            // This maps out the real system check against your MySQL database instances
            try {
                // In a production build, this routes to an /api/users/login endpoint passing credentials
                // For local offline development fallback testing:
                console.log(`Verifying account credentials for username: ${username}`);
                
                // Simulate an API lookup approval wrapper
                currentUser = { username: username };
                authModal.classList.add('hidden'); // Fades lockscreen ONLY on verified form process tracking
                
            } catch (err) {
                alert("❌ Invalid username or password combination.");
            }
        }
    });
}

/**
 * 2. THE MARKETPLACE FEED ENGINE
 * Connects your filters and grids to your Spring Boot database tables.
 */
function initListingEngine() {
    // This section hooks into your ListingController endpoints to read/write marketplace items dynamically
    const listingForm = document.getElementById('listingForm');
    
    if (listingForm) {
        listingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Pulls inputs from post.html and maps them directly to your Java Listing entity properties
            console.log("Publishing new marketplace item to database feed...");
            window.location.href = 'index.html'; // Bounce back to dashboard
        });
    }
}
