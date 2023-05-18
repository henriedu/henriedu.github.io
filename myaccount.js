// MYACCOUNT.JS - ables the user to edit their profile, see transaction history, and delete their account which would make the associated username completely unusable until localStorage is cleared
// document ready
$(document).ready(function() {
    let currentUser = whoIsLoggedIn(); // sets up who is currently logged in
    if (currentUser.lastname && currentUser.firstname) {
        // if last name and first name is not null, set up names in the myaccount page
        // if null, only username and userid is found in the top of the myaccount page
        $(`#my-account-name`).text(`${currentUser.firstname} ${currentUser.lastname}`);
    }
    // sets up my account page
    $(`#my-account-username`).text(`@${currentUser.username}`);
    $(`#my-account-userid`).text(`#${padThisNum(currentUser.userid, 5)}`); // userid, pad it with leading zeroes for 5 digits
    $(`#my-account-firstname`).find(".my-account-content").text(`${currentUser.firstname}`);
    $(`#my-account-lastname`).find(".my-account-content").text(`${currentUser.lastname}`);
    $(`#my-account-address`).find(".my-account-content").text(`${currentUser.address}`);
    $(`#my-account-age`).find(".my-account-content").text(`${currentUser.age}`);    
    // for birthdate if nothing found
    if (currentUser.birthDate === null || currentUser.birthDate == `` || currentUser.birthDate == `NaN-NaN-NaN`) {
        $(`#my-account-birthdate`).find(`.my-account-content-date`).text(`[none provided]`);
    } else {
        // if there is, put date
        $(`#my-account-birthdate`).find(`.my-account-content-date`).text(`${convertDateToDMY(currentUser.birthDate)}`);
    }
    $(`#my-account-regdate`).find(".my-account-content-uneditable").text(`${convertDateToDMY(currentUser.registrationDate)}`);
    // FOR EDITING PROFILE
    $(`#btnEditProfile`).on(`click`, function() {
        $(`#btnEditProfile`).prop(`disabled`, true);
        $(`#btnSaveProfile`).prop(`disabled`, false);
        //
        $(`.my-account-content`).each(function() {
            const spanText = $(this).text();
            $(this).replaceWith(`<input class="my-account-content-edit" type="text" value="${spanText}">`);
        });
        // for birthdate
        $(`#my-account-birthdate`).find(".my-account-content-date").replaceWith(`<input class="my-account-content-date-edit" type="date" value="">`);
        if (currentUser.birthDate === null || currentUser.birthDate == `` || currentUser.birthDate == `NaN-NaN-NaN`) {
            $(`#my-account-birthdate`).find(`.my-account-content-date-edit`).val(`${createDateNowYMDOffset(18)}`);
        } else {
            $(`#my-account-birthdate`).find(`.my-account-content-date-edit`).val(`${currentUser.birthDate}`);
        }
        // sets focus to first field
        $(`#my-account-lastname`).find(".my-account-content-edit").focus();
        //
    });
    //
    $(`#btnSaveProfile`).on(`click`, function() {
        $(`#btnSaveProfile`).prop(`disabled`, true); // disables save button
        $(`#btnEditProfile`).prop(`disabled`, false); // enables edit button
        //
        $(".my-account-content-edit").each(function() {
            const inputText = $(this).val();
            $(this).replaceWith(`<span class="my-account-content">${inputText}</span>`);
        });
        // for date
        const inputDate = $(`#my-account-birthdate`).find(".my-account-content-date-edit").val();
        const inputDateObj = convertDateNowYMD(`${inputDate}`);
        $(`#my-account-birthdate`).find(".my-account-content-date-edit").replaceWith(`<span class="my-account-content-date">${inputDateObj}</span>`);
        objectSave();
        currentUser = whoIsLoggedIn();
        // for transaction history
        const newTransaction = new transactionInstance();
        newTransaction.datetime = createDateNowYMDHM();
        newTransaction.type = `Account`;
        newTransaction.details = `Edited profile.`;
        newTransaction.userid = whoIsLoggedIn().userid;
        addTransaction(newTransaction);
        //
        location.reload();
    });
    // also save to class object instance
    function objectSave() {
        $(`.my-account-content`).each(function() {
            if ($(this).val() == `` || $(this.val() == null) || $(this).val() == `null`) {
                $(this).val(``);
            }
        })
        for (let i = 0; i < usersDatabase.length; i++) {            
            if (usersDatabase[i].userid == currentUser.userid) {
                usersDatabase[i].address = $(`#my-account-address`).find(`.my-account-content`).text();
                usersDatabase[i].age = $(`#my-account-age`).find(`.my-account-content`).text();
                usersDatabase[i].birthDate = $(`#my-account-birthdate`).find(`.my-account-content-date`).text();
                usersDatabase[i].lastname = $(`#my-account-lastname`).find(`.my-account-content`).text();
                usersDatabase[i].firstname = $(`#my-account-firstname`).find(`.my-account-content`).text();
                userLogin(usersDatabase[i]);
                updateUDb();
                return;
            }
        }
    }
    // DELETE ACCOUNT FUNCTION, once deleted, account with current username will no longer be usable
    $(document).on(`click`, `#delete`, function() {
        // for transaction history
        const transactingUserid  = Number(currentUser.userid);
        const newTransaction = new transactionInstance();
        newTransaction.datetime = createDateNowYMDHM();
        newTransaction.type = `Account`;
        newTransaction.details = `Deleted account.`;
        newTransaction.userid = transactingUserid;
        addTransaction(newTransaction);
        //
        deleteUserByID(currentUser.userid, 0);
        userLogin(null);
        setLoggedIn(0);
        window.location.href = `signup.html`; // go to signup
    });

    // transaction history
    let history = getTransactionHistoryWithUserID(whoIsLoggedIn().userid); // creates an array that has matching user id
    if (history.length <= 0) {
        $(`user-transaction-history`).hide(); // hide if no history
        return;
    }
    // create an <ol> or ordered list element
    const newTransactionList = $(`<ol>`, {
        class: `transaction-list`
    });
    for (let i = 0; i < history.length; i++) {
        if (history[i].userid == whoIsLoggedIn().userid) {
            // creates list item or <ul> element to be appended to the <ol>
            const newTransactionListItem = $(`<li>`, {
                class: `transaction-list-item`
            });
            // sets up text of list item with details
            newTransactionListItem.text(`[${history[i].datetime}] | ${history[i].type} - ${history[i].details}`);
            newTransactionListItem.appendTo(newTransactionList);
        }
    }
    // finally, display the <ol> to html by appending it to a visible div
    newTransactionList.appendTo($(`#user-transaction-list`));
});