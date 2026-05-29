// Server communication configuration baseline address
const API_BASE_URL = 'http://localhost:8080/api';

// Current session identity marker tracker 
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    initAuthEngine();
});

/**
 * CORE AUTHENTICATION LOGIC ENGINE
 * Evaluates conditions and orchestrates interface lockouts or successes.
 */
function initAuthEngine() {
    const authForm = document.getElementById('authForm');
    const authModal = document.getElementById('authModal');
    
    if (!authForm) return;

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Halt normal layout submission browser refresh
        
        // Extract raw form value configurations
        const username = document.getElementById('authUsername').value.trim();
        const password = document.getElementById('authPassword').value;
        const email = document.getElementById('authEmail')?.value.trim();
        
        // Determine view intent state by parsing form toggle component
        const isRegisterMode = !document.getElementById('registerFields').classList.contains('hidden');

        // RULE: Strict security length checks
        if (password.length < 8) {
            alert("⚠️ Account Restriction: Security mandates passwords contain a minimum of 8 characters.");
            return;
        }

        if (isRegisterMode) {
            // RULE: Regional campus safety check
            if (!email.endsWith('.edu')) {
                alert("⚠️ Access Denied: Space U marketplace privileges require an authenticated university (.edu) email registry.");
                return;
            }

            // Create network delivery payload structure
            const registerPayload = {
                username: username,
                email: email,
                passwordHash: password 
            };

            try {
                // Route transmission targeting operational Spring Boot server instances
                const response = await fetch(`${API_BASE_URL}/users/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(registerPayload)
                });

                if (response.ok) {
                    alert(`✅ Registration Success! Account database profile established for ${username}. Proceeding to login views.`);
                    document.getElementById('toggleAuthMode').click(); // Revert modal layouts
                } else {
                    const errorMsg = await response.text();
                    alert(`❌ Core Registry Refusal: ${errorMsg}`);
                }
            } catch (err) {
                console.warn("Spring Boot testing database unreachable. Transitioning to integrated browser localStorage backup storage logic...");
                
                // FALLBACK INTERACTIVE SYSTEM: Simulated Disk Arrays
                const localUsers = JSON.parse(localStorage.getItem('space_u_users') || '[]');
                
                // Duplicate identity conflict evaluations
                if (localUsers.find(u => u.username === username)) {
                    alert("❌ Registry Collision: That specific user handle name is already claimed within this platform simulation environment.");
                    return;
                }

                // Append and seal the storage structural block array
                localUsers.push({ username, password, email });
                localStorage.setItem('space_u_users', JSON.stringify(localUsers));

                // CLEAR COMPREHENSIVE SUCCESS UX NOTIFICATION
                alert(`🎉 Success! Verification Account Profile Created!\n\nUser "${username}" has been fully cached onto your web browser profile client files. Click OK to head to login screen verification.`);
                
                // Shift screen presentation values back to input view panels automatically
                document.getElementById('toggleAuthMode').click();
            }

        } else {
            // LOGIN SYSTEM VERIFICATION LOGIC PATHS
            try {
                const response = await fetch(`${API_BASE_URL}/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    currentUser = username;
                    authModal.classList.add('hidden'); // Clear visual blockades
                    alert(`⚡ Authorization Confirmed. Welcome back to Space U channels, ${username}!`);
                } else {
                    alert("❌ Clearance Refused: Valid credentials matching that tracking layout profile matrix do not register.");
                }
            } catch (err) {
                // FALLBACK LOCAL AUTHENTICATION CONFIRMATION 
                const localUsers = JSON.parse(localStorage.getItem('space_u_users') || '[]');
                const foundUser = localUsers.find(u => u.username === username && u.password === password);

                if (foundUser) {
                    currentUser = username;
                    authModal.classList.add('hidden'); // Unlock main dashboard display interface layout
                    alert(`⚡ Client Offline Authorization Granted: Welcome back, ${username}.`);
                } else {
                    alert("❌ Clearance Refused: No matching user metrics discovered on local device configurations. Verify layout fields or complete a registration loop first!");
                }
            }
        }
    });
}
