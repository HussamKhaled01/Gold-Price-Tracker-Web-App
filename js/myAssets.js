// Profile and Username setup
function setupUserProfile() {
    // getSessionUser() is globally available from auth.js
    const stored = window.getSessionUser ? window.getSessionUser() : JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (stored !== null) {
        const navUserName = document.getElementById('navUserName');
        const headerUserName = document.getElementById('headerUserName');
        const profilePic = document.getElementById('profilePic');

        const profileModalPic = document.getElementById('profileModalPic');
        const profileModalName = document.getElementById('profileModalName');
        const profileFirstName = document.getElementById('profileFirstName');
        const profileLastName = document.getElementById('profileLastName');
        const profileEmail = document.getElementById('profileEmail');
        const profileGender = document.getElementById('profileGender');

        if (navUserName !== null) {
            navUserName.textContent = stored.firstName + ' ' + stored.lastName;
        }
        if (headerUserName !== null) {
            headerUserName.textContent = stored.firstName + "'s";
        }
        if (profileModalName !== null) {
            profileModalName.textContent = stored.firstName + ' ' + stored.lastName;
        }

        if (profileFirstName !== null) {
            profileFirstName.value = stored.firstName;
        }
        if (profileLastName !== null) {
            profileLastName.value = stored.lastName;
        }
        if (profileEmail !== null) {
            profileEmail.value = stored.email;
        }
        if (profileGender !== null) {
            profileGender.value = stored.gender === 'm' ? 'Male' : 'Female';
        }
        
        const avatarSrc = stored.gender === 'm' ? '../assets/images/male.png' : '../assets/images/female.png';
        
        if (profilePic !== null) {
            profilePic.src = avatarSrc;
        }
        
        if (profileModalPic !== null) {
            profileModalPic.src = avatarSrc;
        }
    }
}

// 1. Initialization on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    setupUserProfile();

    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn !== null && window.handleLogout !== undefined) {
        signOutBtn.addEventListener('click', window.handleLogout);
    }

    const datePicker = document.getElementById('purchaseDate');
    if (datePicker !== null) {
        const today = new Date().toISOString().split('T')[0];
        datePicker.setAttribute('max', today);
        datePicker.value = today;
    }
});

// 2. Control the catogory input in add asset form
function toggleFormFields() {
    const selectedType = document.getElementById('typeSelect').value;
    const jewelryGroup = document.getElementById('jewelryOptions');
    const coinGroup = document.getElementById('coinOptions');

    jewelryGroup.classList.add('hidden-field');
    coinGroup.classList.add('hidden-field');

    if (selectedType === 'Jewelry') {
        jewelryGroup.classList.remove('hidden-field');
    } else if (selectedType === 'Coins') {
        coinGroup.classList.remove('hidden-field');
    }
}

// 3. to collect Pic with catogory

function getAssetImage(type, category) {
    const imageMap = {
        'Jewelry': {
            'Ring': '../assets/images/gold-jewelry.png',
            'Necklace': '../assets/images/necklace.png',
            'Watch': '../assets/images/watch.png',
        },
        'Coins': {
            'Rashadi': '../assets/coins/rashadi_coin.png',
            'English': '../assets/coins/english_coin.png',
        },
        'Bars': '../assets/bars/gold-bar.jpg'
    };

    if (type === 'Jewelry') {
        return imageMap.Jewelry[category] || '../assets/images/gold-jewelry.png';
    } else if (type === 'Coins') {
        return imageMap.Coins[category] || '../assets/coins/rashadi_coin.png';
    } else {
        return imageMap.Bars;
    }
}
