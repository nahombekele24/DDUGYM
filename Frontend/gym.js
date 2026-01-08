document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    const contactForm = document.getElementById('contactForm');
    if (contactForm) contactForm.addEventListener('submit', handleRegistration);
});

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login_email').value;
    const password = document.getElementById('login_password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();

        if (response.ok && data.token) {
            // Save the token
            localStorage.setItem('gymToken', data.token);
            console.log("Token saved successfully!");
            
            // Give the browser a tiny moment to ensure storage is set
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 100); 
        } else {
            alert(data.error || "Login failed");
        }
    } catch (err) {
        console.error("Login error:", err);
    }
}

async function handleRegistration(e) {
    e.preventDefault();
    const formData = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        date_of_birth: document.getElementById('dob').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        phone: document.getElementById('phone').value,
        department: document.getElementById('department').value,
        plan_id: document.getElementById('plan').value
    };

    const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    if (res.ok) alert("Registration Success! Please Login.");
}