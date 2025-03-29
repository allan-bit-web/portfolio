document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const submitButton = form.querySelector('input[type="submit"]');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent the default form submission
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Basic validation
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Disable submit button and show loading state
        submitButton.disabled = true;
        submitButton.value = 'Sending...';
        
        try {
            // Send data to server
            const response = await fetch('http://localhost:3000/api/submissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    message
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit form');
            }
            
            // Show success message
            alert('Thank you for your message! I will get back to you soon.');
            
            // Clear the form
            form.reset();
            
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting your message. Please try again later.');
        } finally {
            // Re-enable submit button and restore original text
            submitButton.disabled = false;
            submitButton.value = 'Submit';
        }
    });
}); 