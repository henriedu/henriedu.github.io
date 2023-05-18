// INIT
let usernameInput = document.querySelector(`#usernameSignup`);
let passwordInput = document.querySelector(`#passwordSignup`);
let passwordAgainInput = document.querySelector(`#passwordAgainSignup`);
let btnSignup = document.querySelector(`#btnSignup`);
usernameInput.focus();

// SIGNUP / REGISTER
$(document).ready(function() {
    // check if currently logged in
    if (isLoggedIn()) {
        alert(`You are already logged in! To signup for another account, logout first!`);
        window.location.href = `myaccount.html`;
        return;
    }
    //
    const username = $(`#usernameSignup`);
    const password = $(`#passwordSignup`);
    const passwordAgain = $(`#passwordAgainSignup`);
    username.focus();
    
    $(`#btnSignup`).on(`click`, function() {
        const usernameVal = username.val().trim();
        const passwordVal = password.val();
        // Validate all the inputs.
        if (usernameValid(username) != true) {
            username.focus();
            return;
        }
        if (validateInput(username) != true || 
        validateInput(password) != true) {
            username.focus();
            return;
        }
        if (passwordSame() != true) {
            passwordAgain.val(null);
            password.focus();
            return;
        }

        // If finally validated...
        const newUser = new user(); // creates a user class object instance
        newUser.username = usernameVal; // assigns username to newUser
        newUser.password = passwordVal; // assigns password to newUser
        addUserToDB(newUser); // adds the new user to localStorage usersDatabase array
        console.log(`Successfully created a new user account!`);
        window.location.href = `login.html`;
    });

    // validates username
    function usernameValid(usernameField) {
        const myUsername = usernameField.val().trim();
        // username should only contain alphanumeric characters - invalidated when username has whitespaces and special characters
        const containsNonAlphanumeric = /[^a-zA-Z0-9]/.test(myUsername);
        if (containsNonAlphanumeric == true) {
            username.val(null);
            username.focus();
            username.attr(`placeholder`, `Invalid characters!`);
            console.log(`Contains non-alphanumeric characters!`);
            return false;
        }
        // check if there is already another account with that username
        if (usernameCheck(username) != true) {
            username.val(null);
            username.focus();
            return false;
        }
        return true;
    }
    // password and confirm password should be the same
    function passwordSame() {
        if (password.val() != passwordAgain.val()) {
            console.log(`Password does not match.\n${password.val()}\n${passwordAgain.val()}`);
            return false;
        }
        console.log(`Password matches.\n${password.val()}\n${passwordAgain.val()}`);
        return true;
    }
});

//

//

// Save to sessionStorage
