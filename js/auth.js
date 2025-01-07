document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const userIcon = document.getElementById('userIcon');
    const usernameDisplay = document.getElementById('usernameDisplay');

    // Helper function to get user data from localStorage
    const getUserData = (username) => {
        return JSON.parse(localStorage.getItem(username));
    };

    // Helper function to check if a user is logged in
    const checkLoggedInUser = () => {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            usernameDisplay.textContent = `Hello, ${currentUser}`;
            usernameDisplay.style.display = 'inline';
            userIcon.src = '../static/icons/log-out.svg'; // Change icon to logout
            userIcon.title = 'Click to log out';
            userIcon.onclick = logout; // Attach logout functionality
        }
    };

    // Logout functionality
    const logout = () => {
        localStorage.removeItem('currentUser');
        alert('You have logged out.');
        location.reload();
    };

    // Check logged-in user on page load
    checkLoggedInUser();

    // Helper function to get all users from localStorage
    const getAllUsers = () => {
        const users = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key !== 'currentUser') {
                try {
                    const userData = JSON.parse(localStorage.getItem(key));
                    if (userData && userData.email && userData.password) {
                        users.push({ username: key, ...userData });
                    }
                } catch (e) {
                    console.warn(`Invalid data found in localStorage for key: ${key}`);
                }
            }
        }
        return users;
    };

    // Login Logic
if (loginForm) {
    loginForm.onsubmit = function (e) {
        // e.preventDefault();

        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();
        const normalizedUsername = username.toLowerCase();

        // Retrieve user data and block-related information from localStorage
        const userData = JSON.parse(localStorage.getItem(normalizedUsername));
        const failedAttempts = JSON.parse(localStorage.getItem(`${normalizedUsername}_failedAttempts`)) || 0;
        const blockUntil = JSON.parse(localStorage.getItem(`${normalizedUsername}_blockUntil`)) || 0;
        const currentTime = Date.now();

        // Check if the user is currently blocked
        if (currentTime < blockUntil) {
            const remainingTime = Math.ceil((blockUntil - currentTime) / 1000); // Remaining time in seconds
            alert(`Too many failed attempts! Please try again in ${remainingTime} seconds.`);
            return;
        }

        // If user was blocked but the block period has expired, reset failed attempts
        if (currentTime >= blockUntil && failedAttempts >= 3) {
            localStorage.removeItem(`${normalizedUsername}_failedAttempts`);
            localStorage.removeItem(`${normalizedUsername}_blockUntil`);
        }

        if (userData && userData.password === password) {
            alert('Login successful!');
            localStorage.setItem('currentUser', normalizedUsername);
            localStorage.removeItem(`${normalizedUsername}_failedAttempts`); // Reset failed attempts on success
            localStorage.removeItem(`${normalizedUsername}_blockUntil`);    // Remove block time if it exists
            loginPopup.classList.remove('active'); // Close the login popup
            location.reload(); // Refresh the page
        } else {
            const newFailedAttempts = failedAttempts + 1;
            const maxFailures = 3;
            if (newFailedAttempts >= maxFailures) {
                const blockDuration = 60 * 1000; // 1 minute in milliseconds
                const unblockTime = currentTime + blockDuration;
                localStorage.setItem(`${normalizedUsername}_blockUntil`, JSON.stringify(unblockTime));
                alert('Too many failed attempts! You are blocked for 1 minute.');
            } else {
                alert(`Invalid credentials! You have ${maxFailures - newFailedAttempts} attempts left.`);
            }

            localStorage.setItem(`${normalizedUsername}_failedAttempts`, JSON.stringify(newFailedAttempts));
        }
    };
}
    // Registration Logic
    if (registerForm) {
        registerForm.onsubmit = function (e) {
            // e.preventDefault();
            const username = document.getElementById('register-username').value.trim().toLowerCase();
            const email = document.getElementById('register-email').value.trim().toLowerCase();
            const password = document.getElementById('register-password').value.trim();
            const confirmPassword = document.getElementById('register-confirm-password').value.trim();

            if (!username || !email || !password || !confirmPassword) {
                alert('Please fill out all fields.');
                return;
            }

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            const allUsers = getAllUsers();

            // Check for duplicate username (case-insensitive)
            const usernameExists = allUsers.some((user) => user.username.toLowerCase() === username);
            if (usernameExists) {
                alert('Username already exists! Please choose a different one.');
                return;
            }

            // Check for duplicate email 
            const emailExists = allUsers.some((user) => user.email.toLowerCase() === email);
            if (emailExists) {
                alert('Email already registered! Please use a different email.');
                return;
            }

            // Save new user to localStorage
            const userData = { email: email, password: password };
            localStorage.setItem(username, JSON.stringify(userData));

            alert('Registration successful! Please log in.');
            registerPopup.classList.remove('active'); 
            loginPopup.classList.add('active');
        };
    }
});
