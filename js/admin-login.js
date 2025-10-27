// Admin login JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminLogin();
});

function initializeAdminLogin() {
    // Initialize animations
    initializeAnimations();
    
    // Setup form handler
    const form = document.getElementById('admin-login-form');
    if (form) {
        form.addEventListener('submit', handleAdminLogin);
    }
    
    // Check if already logged in
    if (isAdminLoggedIn()) {
        window.location.href = 'admin-dashboard.html';
    }
}

function initializeAnimations() {
    // Animate title
    anime({
        targets: '#main-title',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 1000,
        easing: 'easeOutQuart',
        delay: 300
    });
    
    // Animate subtitle
    anime({
        targets: '#subtitle',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        easing: 'easeOutQuart',
        delay: 600
    });
    
    // Animate login form
    anime({
        targets: '#login-form',
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 1000,
        easing: 'easeOutQuart',
        delay: 900
    });
}

async function handleAdminLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');
    
    // Basic validation
    if (!username || !password) {
        showError('Please enter both username and password');
        return;
    }
    
    try {
        // Simulate admin authentication (in production, use proper backend auth)
        const isValid = await validateAdminCredentials(username, password);
        
        if (isValid) {
            // Store login session
            sessionStorage.setItem('adminLoggedIn', 'true');
            sessionStorage.setItem('adminUsername', username);
            
            // Show success and redirect
            showNotification('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 1500);
            
        } else {
            showError('Invalid username or password');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showError('An error occurred during login. Please try again.');
    }
}

async function validateAdminCredentials(username, password) {
    // In a real application, this would make an API call to your backend
    // For demo purposes, we'll use hardcoded credentials
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Replace with secure authentication in production
    return username === 'admin' && password === 'admin123';
}

function isAdminLoggedIn() {
    return sessionStorage.getItem('adminLoggedIn') === 'true';
}

function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.querySelector('p').textContent = message;
    errorElement.classList.remove('hidden');
    
    // Hide after 5 seconds
    setTimeout(() => {
        errorElement.classList.add('hidden');
    }, 5000);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    anime({
        targets: notification,
        opacity: [0, 1],
        translateX: [100, 0],
        duration: 300,
        easing: 'easeOutQuart'
    });
    
    setTimeout(() => {
        anime({
            targets: notification,
            opacity: [1, 0],
            translateX: [0, 100],
            duration: 300,
            easing: 'easeInQuart',
            complete: () => {
                document.body.removeChild(notification);
            }
        });
    }, 3000);
}