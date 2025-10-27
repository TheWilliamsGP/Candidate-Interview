// Main JavaScript for the landing page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initializeAnimations();
    
    // Handle form submission
    const form = document.getElementById('candidate-info-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }
    
    // Handle video loading
    initializeIntroVideo();
});

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
    
    // Animate sections
    anime({
        targets: '#intro-section',
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 1000,
        easing: 'easeOutQuart',
        delay: 900
    });
    
    anime({
        targets: '#candidate-form',
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 1000,
        easing: 'easeOutQuart',
        delay: 1200
    });
}

function initializeIntroVideo() {
    const video = document.getElementById('intro-video');
    if (video) {
        // Add event listeners for video
        video.addEventListener('loadeddata', function() {
            console.log('Intro video loaded successfully');
        });
        
        video.addEventListener('error', function(e) {
            console.error('Error loading intro video:', e);
            // Show fallback message
            video.innerHTML = '<p>Video explanation will be available here. Please proceed with the form below.</p>';
        });
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    
    // Basic validation
    if (!fullName || !email) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Store candidate info in sessionStorage
    sessionStorage.setItem('candidateInfo', JSON.stringify({
        fullName: fullName.trim(),
        email: email.trim(),
        startTime: new Date().toISOString()
    }));
    
    // Show success message and redirect
    showNotification('Starting your interview...', 'success');
    
    setTimeout(() => {
        window.location.href = 'question.html?question=1';
    }, 1500);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    anime({
        targets: notification,
        opacity: [0, 1],
        translateX: [100, 0],
        duration: 300,
        easing: 'easeOutQuart'
    });
    
    // Remove after 3 seconds
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