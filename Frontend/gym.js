document.addEventListener('DOMContentLoaded', () => {
    // 1. Check if we are on the dashboard page
    if (window.location.pathname === '/dashboard') {
        loadDashboardData();
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    const contactForm = document.getElementById('contactForm');
    if (contactForm) contactForm.addEventListener('submit', handleRegistration);
});

// --- DASHBOARD LOGIC ---
async function loadDashboardData() {
    const token = localStorage.getItem('gymToken');

    if (!token) {
        window.location.href = '/'; // Redirect to home if no token
        return;
    }

    try {
        const response = await fetch('/api/auth/member-info', {
            method: 'GET',
            headers: { 
                'Authorization': token, // Send the token in the header
                'Content-Type': 'application/json' 
            }
        });

        const data = await response.json();

        if (response.ok) {
            // Fill the HTML elements in dashboard.html
            document.getElementById('dashName').innerText = data.first_name;
            document.getElementById('dashPlan').innerText = data.plan_name;
            
            // If you have the admin panel logic:
            if (data.role === 'admin') {
                const adminPanel = document.getElementById('adminPanel');
                if (adminPanel) adminPanel.style.display = 'block';
            }
        } else {
            console.error("Session invalid");
            logout();
        }
    } catch (err) {
        console.error("Error loading dashboard:", err);
    }
}

// --- LOGIN LOGIC ---
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login_email').value;
    const password = document.getElementById('login_password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();

        if (response.ok && data.token) {
            localStorage.setItem('gymToken', data.token);
            // Optional: store role if you added it to login response
            if(data.role) localStorage.setItem('gymRole', data.role);
            
            window.location.href = '/dashboard';
        } else {
            alert(data.error || "Login failed");
        }
    } catch (err) {
        console.error("Login error:", err);
    }
}

// --- REGISTRATION LOGIC ---
async function handleRegistration(e) {
    e.preventDefault();
    const formData = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        date_of_birth: document.getElementById('dob').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        phone: document.getElementById('phone').value,
        department: document.getElementById('department').value, // Maps to your SQL column
        plan_id: document.getElementById('plan').value
    };

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (res.ok) {
            alert("Registration Success! Please Login.");
            // Optional: scroll to login form
            document.getElementById('login').scrollIntoView();
        }
    } catch (err) {
        alert("Registration failed. Try again.");
    }
}

// --- LOGOUT LOGIC ---
function logout() {
    localStorage.removeItem('gymToken');
    localStorage.removeItem('gymRole');
    window.location.href = '/';
}