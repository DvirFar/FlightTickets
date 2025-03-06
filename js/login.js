// update the not valid text box
function nonVal(elem, text, color="red") {
    elem.style.display = "block";
    elem.textContent = text;
    elem.style.color=color;
}

// make sure email is not used
function checkEmail(email, users) {
    for (let user of users) {
        if (email == user.email) {
            return false;
        }
    }
    return true;
}

// make sure password has uppercase, is 8 digits long, has lowercase, has number, and has a special char
function isPasswordSuitable(password) {
    const minLength = 8;

    // regular expressions for required character types
    const hasUppercase = /[A-Z]/;
    const hasLowercase = /[a-z]/;
    const hasDigit = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
        return "Password must be at least 8 characters long.";
    }
    if (!hasUppercase.test(password)) {
        return "Password must include at least one uppercase letter.";
    }
    if (!hasLowercase.test(password)) {
        return "Password must include at least one lowercase letter.";
    }
    if (!hasDigit.test(password)) {
        return "Password must include at least one digit.";
    }
    if (!hasSpecialChar.test(password)) {
        return "Password must include at least one special character.";
    }

    return true;
}

// check password validity
function checkPassword(event){
    password = document.getElementById("passwordS").value;
    let isValid = isPasswordSuitable(password);
    const not_valid = document.getElementById('not_valid_passwordS');
    if (isValid === true){
        nonVal(not_valid, "Password is suitable", "green");
        return;
    }
    nonVal(not_valid, isValid);
}




// execute on log in
function loggedIn(username){
    deleteCookie('loginAttempts');
    sessionStorage.setItem('loggedIn', 'true');
    sessionStorage.setItem('username', username);
    showContent(2);
}

// custom hash, starts with a prime num, multiplies by 33 and XOR with char unicode, make sure it's positive
function customHash(input) {
    let hash = 5381;
    for (let i = 0; i < input.length; i++) {
        const charCode = input.charCodeAt(i);
        hash = (hash * 33) ^ charCode;
    }
    return hash >>> 0;
}

// signup function
function signup(event) {
    event.preventDefault();
    const username = document.getElementById('usernameS').value;
    const email = document.getElementById('emailS').value;
    const password = document.getElementById('passwordS').value;

    const not_valid_username = document.getElementById('not_valid_usernameS');
    not_valid_username.style.display = "none";
    if (username.length > 10){
        nonVal(not_valid_username, "Username is too long");
        return;
    }

    const not_valid_password = document.getElementById('not_valid_passwordS');
    not_valid_password.style.display = "none";
    let isPassValid = isPasswordSuitable(password);
    console.log(isPassValid);
    if (!(isPassValid===true)){
        nonVal(not_valid_password, isPassValid);
        return;
    }



    //createUser(username, customHash(password), email);
    const request = new FXAMLHttpRequest();

    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            console.log("✅ Réponse reçue :", JSON.parse(request.responseText));
        }
    };
    
    request.open("POST", "/DB-API/users");
    
    request.send({ username, password, email });



    loggedIn(username);
}

// login function
function login(event) {
    console.log("Submitted");
    event.preventDefault();

    const username = document.getElementById('usernameL').value;
    const password = document.getElementById('passwordL').value;

    const not_valid = document.getElementById('not_validL');
    let attempts = parseInt(getCookie('loginAttempts')) || 0;
    if (attempts >= allowedAttempts) {
        // set a lockout cookie that expires in 5 minutes
        setCookie('lockout', 'true', 5);
        deleteCookie('loginAttempts'); // reset login attempts
    }
    const lockout = getCookie('lockout');
    if (lockout) {
        nonVal(not_valid, "Too many attempts, try again later");
        return;
    }
    
    const user = getUser(username);
    console.log(user);
    if (user?.username === username) {
        if (user.password == customHash(password)){
            loggedIn(username);
            return;
        }
        else {
            attempts++;
            nonVal(not_valid,  `Username and password don't match, ${allowedAttempts-attempts} attempts left`);
            setCookie('loginAttempts', attempts, 30);
            return;
        }
    }
    nonVal(not_valid, "Username doesn't exist");
    return;
}

/*function switchToLogin(event){
    event.preventDefault() 
    /*document.getElementById('signup').style.display = "none";
    document.getElementById('login').style.display = "block";
    document.getElementById('SwitchToSign').addEventListener('click', switchToSignup);
    document.getElementById('SwitchToLog').removeEventListener('click', switchToLogin);
    document.getElementById('passwordS').removeEventListener("input", checkPassword);
    document.getElementById('signupForm').removeEventListener('submit', signup);
}

function switchToSignup(event){
    event.preventDefault() 
    /*document.getElementById('login').style.display = "none";
    document.getElementById('signup').style.display = "block";
    document.getElementById('SwitchToLog').addEventListener('click', switchToLogin);
    document.getElementById('signupForm').addEventListener('submit', signup);
    document.getElementById('passwordS').addEventListener("input", checkPassword);
    document.getElementById('SwitchToSign').removeEventListener('click', switchToSignup);
    document.getElementById('loginForm').removeEventListener('submit', login);
}*/

// function to get a cookie value by name
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(`${name}=`)) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

// function to set a cookie
function setCookie(name, value, minutes) {
    const expires = new Date();
    expires.setTime(expires.getTime() + minutes * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
}

// function to delete a cookie
function deleteCookie(name) {
    setCookie(name, '', -1);
}


const allowedAttempts = 3;