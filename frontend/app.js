const API_BASE_URL = 'http://localhost:8080/api';
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    initAuthEngine();
});

function initAuthEngine() {
    const authForm = document.getElementById('authForm');
    const authModal = document.getElementById('authModal');
    
    if (!authForm) return;

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        const username = document.getElementById('authUsername').value.trim();
        const password = document.getElementById('authPassword').value;
        const email = document.getElementById('authEmail')?.value.trim();
        
        const isRegisterMode = !document.getElementById('registerFields').classList.contains('hidden');

        // FIXED: Enforcing explicit password strength requirements on account creation loops
        if (isRegisterMode && password.length < 8) {
            alert("⚠️ Account Rule: Your password must be at least 8 characters long to keep your student account secure!");
            return;
        }

        if (isRegisterMode) {
            if (!email.endsWith('.edu')) {
                alert("⚠️ Access Denied: Space U marketplace features require an active university (.edu) email registry.");
                return;
            }

            const registerPayload = {
                username: username,
                email: email,
                passwordHash: password 
            };

            try {
                const response = await fetch(`${API_BASE_URL}/users/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(registerPayload)
                });

                if (response.ok) {
                    alert(`✅ Account created for ${username}! You can now use these credentials to sign in.`);
                    document.getElementById('toggleAuthMode').click(); 
                } else {
                    const errorMsg = await response.text();
                    alert(`❌ Registration Failed: ${errorMsg}`);
                }
            } catch (err) {
                console.warn("Spring Boot offline. Saving profile to local browser storage...");
                
                const localUsers = JSON.parse(localStorage.getItem('space_u_users') || '[]');
                
                if (localUsers.find(u => u.username === username)) {
                    alert("❌ Registration Failed: That username is already claimed on this device.");
                    return;
                }

                localUsers.push({ username, password, email });
                localStorage.setItem('space_u_users', JSON.stringify(localUsers));

                alert(`🎉 Account Successfully Created!\n\nUser "${username}" is stored locally. Click OK to return to the sign-in screen.`);
                document.getElementById('toggleAuthMode').click();
            }

        } else {
            // LOGIN LOGIC PATH
            try {
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
                    alert("❌ Invalid credentials. Check your username and password combination.");
                }
            } catch (err) {
                const localUsers = JSON.parse(localStorage.getItem('space_u_users') || '[]');
                const foundUser = localUsers.find(u => u.username === username && u.password === password);

                if (foundUser) {
                    currentUser = username;
                    authModal.classList.add('hidden'); // Clear overlay modal
                    alert(`⚡ Success! Logged in locally as: ${username}`);
                } else {
                    alert("❌ Authentication Failed: Incorrect password or profile does not exist yet.");
                }
            }
        }
    });
}
