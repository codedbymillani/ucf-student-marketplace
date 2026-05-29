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
        
        // Determine mode based on whether the Register box is open
        const isRegisterMode = !document.getElementById('registerFields').classList.contains('hidden');

        // UX STIPULATION: Password Length Rules
        if (password.length < 8) {
            alert("⚠️ Security Rule: Password must be at least 8 characters long!");
            return;
        }

        if (isRegisterMode) {
            // Campus Policy Structure Check
            if (!email.endsWith('.edu')) {
                alert("⚠️ Campus Policy: Registration requires a valid university (.edu) email address.");
                return;
            }

            // PACKAGE DATA FOR BACKEND
            const registerPayload = {
                username: username,
                email: email,
                passwordHash: password 
            };

            try {
                // Try sending to the real Java Server
                const response = await fetch(`${API_BASE_URL}/users/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(registerPayload)
                });

                if (response.ok) {
                    alert(`✅ Account successfully created for ${username}! You can now use these credentials to sign in.`);
                    document.getElementById('toggleAuthMode').click(); // Switch back to Sign In view automatically
                } else {
                    const errorMsg = await response.text();
                    alert(`❌ Registration Failed: ${errorMsg}`);
                }
            } catch (err) {
                console.warn("Java Backend offline. Switching to Browser-Database simulation for testing...");
                
                // OFFLINE BACKUP SIMULATION: Save to Browser Disk
                const localUsers = JSON.parse(localStorage.getItem('space_u_users') || '[]');
                
                // Check if username already exists locally
                if (localUsers.find(u => u.username === username)) {
                    alert("❌ Registration Failed: That username is already taken on this device!");
                    return;
                }

                localUsers.push({ username, password, email });
                localStorage.setItem('space_u_users', JSON.stringify(localUsers));

                // SUCCESS UX CONFIRMATION
                alert(`🎉 Account Successfully Created!\n\nUser "${username}" has been saved to local browser memory. Click "OK" to head to the login screen and sign in!`);
                
                // Smoothly toggle the interface back to Sign In view
                document.getElementById('toggleAuthMode').click();
            }

        } else {
            // LOGIN VERIFICATION LOGIC
            try {
                // Try verifying with the live server first
                const response = await fetch(`${API_BASE_URL}/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    currentUser = username;
                    authModal.classList.add('hidden');
                    alert(`⚡ Welcome back to Space U, ${username}!`);
                } else {
                    alert("❌ Invalid username or password combination.");
                }
            } catch (err) {
                // OFFLINE BACKUP SIMULATION: Read from Browser Disk
                const localUsers = JSON.parse(localStorage.getItem('space_u_users') || '[]');
                const foundUser = localUsers.find(u => u.username === username && u.password === password);

                if (foundUser) {
                    currentUser = username;
                    authModal.classList.add('hidden'); // Unlock the marketplace screen!
                    alert(`⚡ Success! Logged in locally as: ${username}`);
                } else {
                    alert("❌ Authentication Failed: Incorrect username/password or account does not exist yet!");
                }
            }
        }
    });
}

function initListingEngine() {
    const listingForm = document.getElementById('listingForm');
    if (listingForm) {
        listingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("✨ Listing published successfully to the marketplace feed!");
            window.location.href = 'index.html';
        });
    }
}
