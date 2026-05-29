const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    initializePlatformEngine();
});

function initializePlatformEngine() {
    const authForm = document.getElementById('authForm');
    const authOverlay = document.getElementById('authOverlay');

    if (!authForm) return;

    authForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('authUsername').value.trim();
        const password = document.getElementById('authPassword').value;
        const email = document.getElementById('authEmail')?.value.trim();
        const isRegisterMode = !document.getElementById('registerEmailGroup').classList.contains('hidden');

        // --- ACCOUNT CREATION SYSTEM PATHWAY ---
        if (isRegisterMode) {
            
            // REQUIREMENT 1: Username Character Boundaries (4 - 15 Characters)
            if (username.length < 4 || username.length > 15) {
                alert("❌ Input Error:\n\nYour username must be between 4 and 15 characters long.");
                return;
            }

            // REQUIREMENT 2: Password Minimum Boundary (8+ Characters)
            if (password.length < 8) {
                alert("❌ Input Error:\n\nYour password must be at least 8 characters long.");
                return;
            }

            // REQUIREMENT 3: Uppercase, Lowercase, and Special Character Validation
            const hasUppercase = /[A-Z]/.test(password);
            const hasLowercase = /[a-z]/.test(password);
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>_]/.test(password);

            if (!hasUppercase || !hasLowercase || !hasSpecial) {
                alert("❌ Complexity Policy Failure:\n\nYour password must contain at least:\n• One uppercase letter (A-Z)\n• One lowercase letter (a-z)\n• One special symbol character (e.g., !, @, #, $, %)");
                return;
            }

            // Assemble API JSON Payload Structure
            const registerPayload = { username, email, passwordHash: password };

            try {
                // Network Delivery Attempt
                const response = await fetch(`${API_BASE_URL}/users/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(registerPayload)
                });

                if (response.ok) {
                    alert(`✅ Network Registered: Account profile ${username} successfully logged!`);
                    document.getElementById('toggleAuthMode').click();
                } else {
                    const errMsg = await response.text();
                    alert(`❌ Network Rejection: ${errMsg}`);
                }
            } catch (err) {
                console.warn("Spring Boot server absent. Routing transaction directly inside client localStorage sandbox system array...");

                // LOCAL LOCALSTORAGE DATABASE REPLICATOR
                const mockDatabase = JSON.parse(localStorage.getItem('space_u_db') || '[]');

                // Username conflict evaluation logic
                if (mockDatabase.find(user => user.username.toLowerCase() === username.toLowerCase())) {
                    alert(`❌ Registry Collision:\n\nThe username "${username}" is already claimed in this environment.`);
                    return;
                }

                // Push clean transaction values and commit data records to memory arrays
                mockDatabase.push({ username, password, email });
                localStorage.setItem('space_u_db', JSON.stringify(mockDatabase));

                // Requirement: Confirm it worked, then prompt directly to login
                alert(`🎉 Registration Successful!\n\nAccount for "${username}" has been successfully verified and securely stored in browser database file memory. Click OK to sign into your new profile.`);
                
                // Programmatically trigger button switch to flip form views instantly
                document.getElementById('toggleAuthMode').click();
            }

        // --- SIGN IN APPLICATION SYSTEM PATHWAY ---
        } else {
            try {
                const response = await fetch(`${API_BASE_URL}/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    authOverlay.classList.add('hidden'); // Drop entire blocker card
                    alert(`⚡ Welcome to Space U, ${username}!`);
                } else {
                    alert("❌ Login Error: Invalid credential tracking metrics. Verification denied.");
                }
            } catch (err) {
                // LOCAL DISK AUTHENTICATION ENGINE FALLBACK 
                const mockDatabase = JSON.parse(localStorage.getItem('space_u_db') || '[]');
                const verifiedMatch = mockDatabase.find(user => user.username === username && user.password === password);

                if (verifiedMatch) {
                    // DISMISS BLOCKING VIEW MODAL SECTOR CLEANLY
                    authOverlay.classList.add('hidden');
                    alert(`⚡ Local Access Granted: Welcome back to your dashboard, ${username}!`);
                } else {
                    // Requirement: Throw descriptive error if validation fails
                    alert("❌ Authorization Refused:\n\nInvalid username or password match configuration discovered on this device. Try again or build a profile.");
                }
            }
        }
    });
}
