// LOGIN
const usernameInputLogin = document.querySelector(`#usernameLogin`);
const passwordInputLogin = document.querySelector(`#passwordLogin`);
const btnLogin = document.querySelector(`#btnLogin`);

$(document).ready(function() {
    const usernameLogin = $(`#usernameLogin`);
    const passwordLogin = $(`#passwordLogin`);
    usernameLogin.focus();
    $(`#btnLogin`).on(`click`, function() {
        const usernameLoginVal = usernameLogin.val();
        const passwordLoginVal = passwordLogin.val();
        let userPending = getUserByUsername(usernameLoginVal);
        // validation
        if (isLoggedIn()) {
            alert(`You are already logged in! To login another account, logout first!`);
            window.location.href = `myaccount.html`;
            return;
        }
        // if any of the username and password is invalid
        if (!validateInput(usernameLogin) || !validateInput(passwordLogin)) {
            return;
        }
        // if there is no user with the username the user attempted to login
        if (userPending == null) {
            usernameLogin.val(null);
            passwordLogin.val(null);
            usernameLogin.focus();
            alert(`There is no account with that username.`);
            return;
        }
        // if the user is deleted, invalidate
        if (userPending.deleted != false) {
            usernameLogin.val(null);
            passwordLogin.val(null);
            usernameLogin.focus();
            alert(`That account is deleted. You can no longer login or signup with this username.`);
            return;
        }
        // if password of user does not match entered password, invalidate
        if (userMatchesPassword(userPending, passwordLoginVal) != true) {
            passwordLogin.val(null);
            passwordLogin.focus();
            alert(`Login and/or password does not match with our records.`);
            return;
        }
        // If validated...
        console.log();
        console.log(`Successfully logged in!`);
        userLogin(userPending); // sets the logged in user
        setLoggedIn(1); // sets that there is a logged in user, to be used by the blotter and my account pages
        // for transaction history
        thisUser = whoIsLoggedIn();
        const newTransaction = new transactionInstance();
        newTransaction.datetime = createDateNowYMDHM();
        newTransaction.type = `Account`;
        newTransaction.details = `Logged in`;
        newTransaction.userid = Number(thisUser.userid);
        addTransaction(newTransaction);
        //
        window.location.href = `index.html`; // after logging in, go to homepage
    });
});