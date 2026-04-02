const loginBtn = document.getElementById('loginBtn');
const redirectToSignUp = document.getElementById('redirectToSignUp');
const loginForm = document.getElementById("loginForm");


const registerBtn = document.getElementById('registerBtn');
const redirectToSignIn = document.getElementById('redirectToSignIn');
const registerForm = document.getElementById("registerForm");


const xBtn = document.querySelectorAll('.xBtn');

const logoutBtn = document.getElementById('logoutBtn');

const assetsBtn = document.getElementById('assetsBtn');

const loginModal = document.getElementById('loginModal');
const loginModalInstance = new bootstrap.Modal(loginModal);

const registerModal = document.getElementById('registerModal');
const registerModalInstance = new bootstrap.Modal(registerModal);

const currentUser = JSON.parse(sessionStorage.getItem("currentUser")) || {
    email: "",
    firstName: "",
    lastName: "",
    gender: "",
    isLoggedIn: false
}

// if (sessionStorage.getItem("currentUser") !== null) {
//     const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
//     if (currentUser.isLoggedIn) {
//         loginBtn.style.display = "none";
//         registerBtn.style.display = "none";
//         logoutBtn.style.display = "inline-block";
//     }
// }

if (sessionStorage.getItem("currentUser") !== null) {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    if (currentUser.isLoggedIn) {
        window.open("../html/prices.html", "_blank");
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";
    } else {
        loginModalInstance.show();
    }
}

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}


loginBtn.addEventListener('click', () => {
    loginModalInstance.show();
});

assetsBtn.addEventListener('click', function (event) {

    const storedUser = sessionStorage.getItem("currentUser");

    if (!storedUser) {
        loginModalInstance.show();
        return;
    }

    const currentUser = JSON.parse(storedUser);

    if (!currentUser.isLoggedIn) {
        loginModalInstance.show();
        return;
    }

    window.location.href = "myAsset.html";
});

registerBtn.addEventListener('click', () => {
    registerModalInstance.show();
});

xBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        loginModalInstance.hide();
        registerModalInstance.hide();
    });
});

redirectToSignUp.addEventListener('click', () => {
    loginModalInstance.hide();
    registerModalInstance.show();
});

redirectToSignIn.addEventListener('click', () => {
    registerModalInstance.hide();
    loginModalInstance.show();
});

registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let users = getUsers();
    console.log("users:", users);

    const newUser = {
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
        password: ""
    };

    const formData = new FormData(this);

    let isValid = true;

    const errorFirst = document.getElementById("error-fName");
    const errorLast = document.getElementById("error-lName");
    const errorEmail = document.getElementById("error-registerEmail");
    const errorConfirmEmail = document.getElementById("error-confirmEmail");
    const errorGender = document.getElementById("error-gender");
    const errorPassword = document.getElementById("error-registerPassword");
    const errorConfirmPassword = document.getElementById("error-confirmPassword");

    const fName = formData.get("fName").trim();
    const lName = formData.get("lName").trim();
    const email = formData.get("email").trim();
    const cEmail = formData.get("confirmEmail").trim();
    const gender = formData.get("gender");
    const password = formData.get("password");
    const cPassword = formData.get("confirmPassword");

    const namePattern = /^[A-Za-z]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^[A-Z](?=.*(?:\d.*){2,})(?=.*[!@#$%^&*(),.?":{}|<>]).{7,31}$/;

    errorFirst.textContent = "";
    errorLast.textContent = "";
    errorEmail.textContent = "";
    errorConfirmEmail.textContent = "";
    errorGender.textContent = "";
    errorPassword.textContent = "";
    errorConfirmPassword.textContent = "";

    if (fName.length === 0) {
        errorFirst.textContent = "First name is required.";
        isValid = false;
    }
    else if (!namePattern.test(fName)) {
        errorFirst.textContent = "Only letters.";
        isValid = false;
    }
    else {
        newUser.firstName = fName;
    }

    if (lName.length === 0) {
        errorLast.textContent = "Last name is required.";
        isValid = false;
    }
    else if (!namePattern.test(lName)) {
        errorLast.textContent = "Only letters.";
        isValid = false;
    }
    else {
        newUser.lastName = lName;
    }

    if (email.length === 0) {
        errorEmail.textContent = "Email is required.";
        isValid = false;
    }
    else if (!emailPattern.test(email)) {
        errorEmail.textContent = "Please enter a valid email.";
        isValid = false;
    }
    else if (checkEmailExists(email)) {
        errorEmail.textContent = "Email already exists.";
        isValid = false;
    }
    else if (email !== cEmail) {
        errorConfirmEmail.textContent = "Emails do not match.";
        isValid = false;
    }
    else {
        newUser.email = email;
    }

    if (gender === null) {
        errorGender.textContent = "Please select your gender.";
        isValid = false;
    }
    else {
        newUser.gender = gender;
    }

    if (password.length === 0) {
        errorPassword.textContent = "Password is required.";
        isValid = false;
    } else if (!passwordPattern.test(password)) {
        errorPassword.textContent = "Password must start with an Capital letter, contain at least 2 numbers, at least 1 special character, and be between 8 and 32 characters characters.";
        isValid = false;
    } else {
        if (cPassword.length === 0) {
            errorConfirmPassword.textContent = "Please confirm your password.";
            isValid = false;
        } else if (cPassword !== password) {
            errorConfirmPassword.textContent = "Passwords do not match.";
            isValid = false;
        }
        else {
            newUser.password = sha256(password);
        }
    }

    if (isValid) {
        newUser.password = sha256(password);
        users.push(newUser);
        console.log("New user:", newUser);
        console.log("Updated users array:", users);
        localStorage.setItem("users", JSON.stringify(users));
        alert("Form submitted successfully!");
        currentUser.email = newUser.email;
        currentUser.firstName = newUser.firstName;
        currentUser.lastName = newUser.lastName;
        currentUser.gender = newUser.gender;
        currentUser.isLoggedIn = true;
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";
        sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
        registerForm.reset();
        registerModalInstance.hide();
    }
});

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    let isValid = true;

    const errorEmail = document.getElementById("error-loginEmail");
    const errorPassword = document.getElementById("error-loginPassword");

    const email = formData.get("loginEmail").trim();
    const password = formData.get("loginPassword");

    errorEmail.textContent = "";
    errorPassword.textContent = "";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.length === 0) {
        errorEmail.textContent = "Email is required.";
        isValid = false;
    }
    else if (!emailPattern.test(email)) {
        errorEmail.textContent = "Please enter a valid email.";
        isValid = false;
    }
    else if (!checkEmailExists(email)) {
        errorEmail.textContent = "No account found with this email.";
        isValid = false;
    }

    if (password.length === 0) {
        errorPassword.textContent = "Password is required.";
        isValid = false;
    }

    if (isValid) {
        const users = getUsers();
        const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());

        console.log("User found: ", user);

        if (user !== null && user.password === sha256(password)) {
            alert("Login successful!");
            currentUser.email = user.email;
            currentUser.firstName = user.firstName;
            currentUser.lastName = user.lastName;
            currentUser.gender = user.gender;
            currentUser.isLoggedIn = true;
            sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
            loginBtn.style.display = "none";
            registerBtn.style.display = "none";
            logoutBtn.style.display = "inline-block";
            loginForm.reset();
            loginModalInstance.hide();
        } else {
            errorPassword.textContent = "Incorrect password.";
        }
    }
});

function checkEmailExists(email) {
    const users = getUsers();
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("currentUser");
    window.location.href = "index.html";
    loginBtn.style.display = "inline-block";
    registerBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
});




