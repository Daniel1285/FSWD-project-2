// Get DOM Elements
const userIcon = document.getElementById('userIcon');
const loginPopup = document.getElementById('loginPopup');
const registerPopup = document.getElementById('registerPopup');
const closeLogin = document.getElementById('closeLogin');
const closeRegister = document.getElementById('closeRegister');
const openRegister = document.getElementById('openRegister');

// Show Login Popup
userIcon.addEventListener('click', () => {
    loginPopup.classList.add('active');
});

// Close Login Popup
closeLogin.addEventListener('click', () => {
    loginPopup.classList.remove('active');
});

// Open Registration Popup from Login
openRegister.addEventListener('click', () => {
    loginPopup.classList.remove('active');
    registerPopup.classList.add('active');
});

// Close Registration Popup
closeRegister.addEventListener('click', () => {
    registerPopup.classList.remove('active');
});
