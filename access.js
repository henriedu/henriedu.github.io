// INIT
/*
ACCESS.JS - main script used for:
 - updating local storage for usersDatabase which are all the users who signed up
 - also checks if a user is logged in
 - redirects the user to login page if not logged in if the page they're trying to access needs logged in account
*/
let usersDatabase = [];
if (getUDb() == null) {
    localStorage.setItem(`usersDatabase`, JSON.stringify(usersDatabase));
} else {
    usersDatabase = JSON.parse(localStorage.getItem(`usersDatabase`));
}
let currentUserLoggedIn = null;
let currentUserId = usersDatabase.length + 1;
if (getUDb() !== null) {
    addUserIDInc();
}
// if usersDatabase is blank, force logout, needs manual page refresh
if (getUDb() == null || getUDb().length <= 0) {
    userLogin(null);
    setLoggedIn(0);
}

class user {
    userid;
    username;
    password;
    address = null;
    age = null;
    birthDate = null;
    lastname = null;
    firstname = null;
    registrationDate = null;
    deleted = false; // makes use of deleted property to disallow use and new accounts with that username
    
    constructor() {
        this.userid = addUserIDInc();
        // for transaction history
        const newTransaction = new transactionInstance();
        newTransaction.datetime = createDateNowYMDHM();
        newTransaction.type = `Account`;
        newTransaction.details = `Account created`;
        newTransaction.userid = this.userid;
        addTransaction(newTransaction);
        //
        this.registrationDate = `${createDateNowYMDHM()}`;
    }
}

// Init
const usersDatabaseRetrieve = getUDb();
if (usersDatabaseRetrieve !== undefined || usersDatabaseRetrieve !== null || usersDatabaseRetrieve != ``) {
    if (Array.isArray(usersDatabaseRetrieve) && usersDatabaseRetrieve.length > 0) {
        usersDatabase = usersDatabaseRetrieve;
    }
}
// Users Database
// function to add a new user to the array of usersDatabase which records all users that signed up
function addUserToDB(newUser) {
    usersDatabase.push(newUser);
    updateUDb();
}
// function to get deleted property of a class object instance
function deleteUserByID(thisID, number) {
    for (let i = 0; i < usersDatabase.length; i++) {
        if (usersDatabase[i].userid == thisID) {
            if (number == 0) {
                usersDatabase[i].deleted = true;
                updateUDb();
                break;
            } else {
                usersDatabase[i].deleted = false;
                updateUDb();
                break;
            }
        }
    }
}
// function to update usersDatabase through the localStorage key `usersDatabase`
function updateUDb() {
    addUserIDInc();
    localStorage.setItem(`usersDatabase`, JSON.stringify(usersDatabase));
}
// function that returns usersDatabase from localStorage - makes use of JSON.parse
function getUDb() {
    if (localStorage.getItem(`usersDatabase`) == null) {
        return null;
    }
    return JSON.parse(localStorage.getItem(`usersDatabase`));
}

// PRIMARY KEY ID mimic - increment | The value for id of any newly pushed object instance
function addUserIDInc() {
    currentUserId = usersDatabase.length + 1;
    localStorage.setItem(`getUserIDInc`, currentUserId);
    return Number(localStorage.getItem(`getUserIDInc`));
}
function getUserIDInc() {
    return Number(localStorage.getItem(`getUserIDInc`));
}

// FOR LOGGED IN purposes
if (localStorage.getItem(`isLoggedIn`) === null) {
    localStorage.setItem(`isLoggedIn`, 0);
}
// function that returns the value of the localStorage key `isLoggedIn` which is a Boolean or binary number where 1 is there is a logged in user
function getLogInData() {
    return Number(localStorage.getItem(`isLoggedIn`));
}
// function to determine if there is currently a logged in user
function isLoggedIn() {
    if (getLogInData() == 1) {
        return true;
    }
    return false;
}
// sets the logged in user number value
function setLoggedIn(thisValue) {
    localStorage.setItem(`isLoggedIn`, thisValue);
}
// sets localStorage key `loggedInUser` to thisUser argument, sets the actual user
function userLogin(thisUser) {
    localStorage.setItem(`loggedInUser`, JSON.stringify(thisUser));
}
// function that returns the user who is logged in set by the function about userLogin()
function whoIsLoggedIn() {
    forRetrieval = JSON.parse(localStorage.getItem(`loggedInUser`));
    if (forRetrieval === null) {
        return null;
    }
    return JSON.parse(localStorage.getItem(`loggedInUser`));
}

// function to redirect user to login page if not logged in
redirectUser();
function redirectUser() {
    if (isLoggedIn() != true) {
        if (!window.location.href.includes('login.html') && !window.location.href.includes('signup.html') && !window.location.href.includes('index.html') && !window.location.href.includes('reports.html')) {
            //alert(`You need to login first.`);
            window.location.href = `login.html`;
        }
    }
}

// function to check username and validate it, called in the signup
function usernameCheck(input) {
    const inputText = input.val().trim();
    const usersList = getUDb();
    if (usersList === null || usersList === undefined) {
        return true;
    }
    for (let i = 0; i < usersList.length; i++) {
        if (usersList[i].username == inputText && usersList[i].deleted === true) {
            alert(`This username can no longer be used.`);
            window.location.reload();
        }
        if (usersList[i].username == inputText) {
            input.attr(`placeholder`, `Already exists!`);
            console.log(`Username is invalid!`);
            return false;
        }
    }
    return true;
}

// gets user with a certain username and returns that user
function getUserByUsername(username) {
    if (getUDb() === null) {
        return null;
    }
    const usersList = getUDb();
    for (let i = 0; i < usersList.length; i++) {
        if (usersList[i].username == username) {
            return usersList[i];
        }
    }
    return null;
}
// function that returns true if password of the user matches to the attempted password
function userMatchesPassword(userPending, passwordPending) {
    const usersList = getUDb();
    for (let i = 0; i < usersList.length; i++) {
        if (usersList[i].username == userPending.username && usersList[i].password == passwordPending) {
            return true;
        }
    }
    return false;
}

// user-based transaction history - provides transaction history, some other `recording to history` functions may be found elsewhere
let transactionHistory = [];
if (getTransactionHistory() == null) {
    updateTransactionHistory();
} else {
    transactionHistory = getTransactionHistory();
}
class transactionInstance {
    datetime;
    type;
    details;
    userid;
}
function addTransaction(thisTransaction) {
    transactionHistory.push(thisTransaction);
    updateTransactionHistory();
}
function getTransactionHistory() {
    forRetrieval = localStorage.getItem(`transactionHistory`);
    if (forRetrieval == null) {
        return null;
    }
    return JSON.parse(localStorage.getItem(`transactionHistory`));
}
function getTransactionHistoryWithUserID(thisUserID) {
    const history = getTransactionHistory();
    const newHistoryArrayByID = [];
    for (let i = 0; i < history.length; i++) {
        if (history[i].userid == thisUserID) {
            newHistoryArrayByID.push(history[i]);
        }
    }
    return newHistoryArrayByID;
}
function updateTransactionHistory() {
    localStorage.setItem(`transactionHistory`, JSON.stringify(transactionHistory));
}

// jQuery ready
$(document).ready(function() {
    let thisUser = null;
    // logout module, logs out if a button that has class `btnLogout` was clicked
    $(document).on(`click`, `.btnLogout`, function() {
        thisUser = whoIsLoggedIn();
        userLogin(null);
        setLoggedIn(0);
        // for transactionHistory
        const newTransaction = new transactionInstance();
        newTransaction.datetime = createDateNowYMDHM();
        newTransaction.type = `Account`;
        newTransaction.details = `Logged out`;
        newTransaction.userid = Number(thisUser.userid);
        addTransaction(newTransaction);
        //
        window.location.href = `login.html`;
    });
    // create report transaction
    // in the blotter.js - gr-submit button click
    // delete transaction
    $(document).on(`click`, `.report-delete`, function() {
        const transactingUserid  = Number($(this).parent().attr(`reportinguserid`));
        const newTransaction = new transactionInstance();
        newTransaction.datetime = createDateNowYMDHM();
        newTransaction.type = `Blotter Report`;
        newTransaction.details = `Deleted a report (Report ID: ${padThisNum($(this).parent().attr(`reportid`), 5)}).`;
        newTransaction.userid = transactingUserid;
        addTransaction(newTransaction);
    });
    // edit transaction
    $(document).on(`click`, `.report-edit`, function() {
        if ($(this).text() == `Save`) {
            const transactingUserid  = Number($(this).parent().attr(`reportinguserid`));
        const newTransaction = new transactionInstance();
        newTransaction.datetime = createDateNowYMDHM();
        newTransaction.type = `Blotter Report`;
        newTransaction.details = `Edited a report (Report ID: ${padThisNum($(this).parent().attr(`reportid`), 5)}).`;
        newTransaction.userid = transactingUserid;
        addTransaction(newTransaction);
        }
    });
});
