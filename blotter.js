// database mimic, initialize
let blotterDatabase = [];
let blotterCurrentID = 0; // the value for new report id, always + 1 of the reportid of the right-most value in array so that if last value is 5, this becomes 6
if (getBlotterDB() != null && getBlotterDB().length > 0) {
    blotterDatabase = getBlotterDB();
    blotterCurrentID = blotterDatabase[blotterDatabase.length - 1].reportID + 1;
} else {
    blotterCurrentID = blotterDatabase.length + 1;
    updateBlotterDB();
    blotterCurrentID = 1;
}
let thisUserBlotterDatabase = []; // array that is like blotterDatabase but only when its reporting user id matches to the currently logged in user id
function updateCurrentUserBlotterDatabase() {
    thisUserBlotterDatabase = [];
    if (blotterDatabase.length <= 0) {
        return;
    }
    for (let i = 0; i < blotterDatabase.length; i++) {
        if (blotterDatabase[i].reportingUserID === currentUserID && blotterDatabase[i].deleted === false) {
            thisUserBlotterDatabase.push(blotterDatabase[i]);
        }
    }
}
// class blotterReport that contains details
class blotterReport {
    constructor(thisUserID, thisDate) {
        this.reportID = null;
        this.reportCreationDate = thisDate;
        this.reportModifiedDate = null;
        this.reportingUserID = thisUserID;
        this.reportedPerson = null;
        this.reportAddress = null;
        this.reportDetails = null;
        this.deleted = false;
    }
}
// functions for manipulating the local storage dedicated for blotter page
function addReportToDB(newReport) {
    blotterDatabase.push(newReport);
    blotterCurrentID = blotterDatabase.length + 1;
    updateBlotterDB();
}
function getBlotterDB() {
    let forRetrieval = localStorage.getItem(`blotterDatabase`);
    if (forRetrieval == null) {
        const blankArray = [];
        return blankArray;
    }
    return JSON.parse(localStorage.getItem(`blotterDatabase`));
}
// updates blotterDB in localStorage key `blotterDatabase`
function updateBlotterDB() {
    // create a blank array
    let blotterDatabaseUndeleted = [];
    // for loop to remove any deleted item
    for (let i = 0; i < blotterDatabase.length; i++) {
        if (blotterDatabase[i].deleted == false) {
            // undeleted item will be pushed into the previously blank array
            blotterDatabaseUndeleted.push(blotterDatabase[i]);            
        }
    }
    // reassigns the blotter database into the new blotterdatabase
    blotterDatabase = blotterDatabaseUndeleted;
    localStorage.setItem(`blotterDatabase`, JSON.stringify(blotterDatabase));
    let arrayDB = getBlotterDB();
    if (arrayDB.length >= 1) {
        blotterCurrentID = arrayDB[arrayDB.length - 1].reportID + 1;
    } else {
        blotterCurrentID = 1;        
    }
}
// function that gets the class object instance that has a certain ID and returns that
function getReportByID(thisID) {
    for (let i = 0; i < blotterDatabase.length; i++) {
        if (blotterDatabase[i].reportID === thisID && blotterDatabase[i].deleted === false) {
            return blotterDatabase[i];
        }
    }
}

function toggleCrudReportsDiv() {
    updateCurrentUserBlotterDatabase();
    if (thisUserBlotterDatabase.length <= 0) {
        $(`#crud-reports`).animate({
            fontSize: `0px`,
            opacity: `0`,
            height: `0px`,
        }, 500, function() {
            $(`#crud-reports`).hide();
        });
        //$(`#crud-reports`).hide();
    } else {
        $(`#crud-reports`).animate({
            opacity: `1`,
        }, 500, function() {
            $(`#crud-reports`).show();
        });
        //$(`#crud-reports`).show();
    }
}

// jQuery
let currentUser = whoIsLoggedIn();
let currentUserID = currentUser.userid;
$(document).ready(function() {
    $(`#report-complainee`).focus();
    $(`#reportingas`).text(`@${currentUser.username}`);
    $(`#report-date`).val(`${createDateNowYMD()}`);
    if (currentUser.lastname && currentUser.firstname) {
        $(`#reportingas`).text(`${currentUser.firstname} ${currentUser.lastname} (@${currentUser.username})`); // if last name and first name is set up, sets full name in account page
    }
    $(`#gr-submit`).on(`click`, function() {
        // retrieves data
        const reportDate = $(`#report-date`).val();
        const reportDetails = $(`#gr-textarea`).val();
        const reportReportedPerson = $(`#report-complainee`).val();
        const reportAddress = $(`#report-address`).val();
        // creates a new blotterReport class object instance
        const newReport = new blotterReport(currentUser.userid, reportDate);
        // alert and return (stop) if there is a blank input when trim()
        if (reportReportedPerson.trim() == `` || reportDetails.trim() == ``) {
            alert(`Please fill up the form.`);
            $(`#report-complainee`).focus();
            return;
        }
        // sets other properties
        newReport.reportedPerson = reportReportedPerson;
        newReport.reportDetails = reportDetails;
        newReport.reportID = blotterCurrentID;
        newReport.reportAddress = reportAddress;        
        // update array and local storage
        addReportToDB(newReport); // adds that instance to array
        
        // for transaction history
        const transactingUserid  = Number(currentUser.userid);
        const newTransaction = new transactionInstance();
        newTransaction.datetime = createDateNowYMDHM();
        newTransaction.type = `Blotter Report`;
        newTransaction.details = `Generated a report (Report ID: ${padThisNum(blotterCurrentID, 5)}).`;
        newTransaction.userid = transactingUserid;
        addTransaction(newTransaction);

        location.reload(); // reload the page
    });

    // Manage your Reports
    if (blotterDatabase.length <= 0) {
        $(`#crud-reports`).hide();
    } else {
        let found = false;
        for (let i = 0; i < blotterDatabase.length; i++) {
            if (blotterDatabase[i].reportingUserID === currentUserID && blotterDatabase[i].deleted === false) {
                found = true;
                break;
            }
        }
        if (!found) {
            $(`#crud-reports`).hide();
        }
    }
    // Update undeleted reports to show in HTML
    // this traverses through all the main blotterDatabase and only accepts when reportingUserID is equal to currentUserID and it's not deleted (deleted property is false)
    for (let i = 0; i < blotterDatabase.length; i++) {
        if (blotterDatabase[i].reportingUserID === currentUserID && blotterDatabase[i].deleted === false) {
            // create new Elements with jQuery
            const newDiv = $(`<div></div>`);
            newDiv.attr(`id`, `report-id-${blotterDatabase[i].reportID}`); // sets id attribute into `report-id-[number]`
            newDiv.attr(`reportid`, `${blotterDatabase[i].reportID}`); // sets custom attribute for the id only
            newDiv.attr(`reportinguserid`, `${blotterDatabase[i].reportingUserID}`); // sets custom attribute for the reporting user id
            newDiv.attr(`class`, `user-report-div`); // sets class attribute
            // Report ID
            const newReportID = $(`<p>`, {
                class: `report-content`,
                html: `<b>Report ID:</b> <span class="report-content-id">${padThisNum(blotterDatabase[i].reportID, 5)}</span>`
            });
            newReportID.appendTo(newDiv);
            // Report Date
            const newReportDate = $(`<p>`, {
                class: `report-content`,
                html: `<b>Date:</b> <span class="report-content-date">${convertDateToDMY(blotterDatabase[i].reportCreationDate)}</span>`
            });
            newReportDate.appendTo(newDiv);
            // if modified
            if (blotterDatabase[i].reportModifiedDate != null) {
                const newReportDateMod = $(`<p>`, {
                    class: `report-content`,
                    html: `<b>Last Modified:</b> <span class="report-content-date">${convertDateToDMYHM(blotterDatabase[i].reportModifiedDate)}</span>`
                });
                newReportDateMod.appendTo(newDiv);
            }
            // Report Address
            const newReportAddress = $(`<p>`, {
                class: `report-content`,
                html: `<b>Address:</b> <span class="report-content-text">${blotterDatabase[i].reportAddress}</span>`
            });
            newReportAddress.appendTo(newDiv);
            
            // Reported Person
            const newReportComplainee = $(`<p>`, {
                class: `report-content`,
                html: `<b>Reported Person:</b> <span class="report-content-text report-content-reported">${blotterDatabase[i].reportedPerson}</span>`
            });
            newReportComplainee.appendTo(newDiv);
            // Report Details
            const newReportDetails = $(`<p>`, {
                class: `report-content`,
                html: `<b>Details:</b> <br><span class="report-content-text report-content-textarea">${blotterDatabase[i].reportDetails}</span>`
            });
            newReportDetails.appendTo(newDiv);
            
            // edit button
            const newEditButton = $(`<button></button>`);
            newEditButton.attr(`class`, `report-edit`);
            newEditButton.attr(`type`, `button`);
            newEditButton.attr(`title`, `Edit`);
            newEditButton.text(`Edit`);
            // delete button
            const newDeleteButton = $(`<button></button>`);
            newDeleteButton.attr(`class`, `report-delete`);
            newDeleteButton.attr(`type`, `button`);
            newDeleteButton.attr(`title`, `Delete`);
            newDeleteButton.text(`Delete`);
            // append the buttons
            newDeleteButton.appendTo(newDiv);
            newEditButton.appendTo(newDiv);
            // finally display to html
            newDiv.appendTo(`#user-reports`);
        }
    }

    // Delete Report
    $(document).on(`click`, `.report-delete`, function() {
        const parentDiv = $(this).parent(); // parent of delete button is the div where all report content of a single report instance is appended to
        const reportID = Number($(this).parent().attr(`reportid`));
        for (let i = 0; i < blotterDatabase.length; i++) {
            if (blotterDatabase[i].reportID === reportID) {
                blotterDatabase[i].deleted = true; // sets deleted property to true
            }
        }
        updateBlotterDB();
        // animation when deleted
        parentDiv.animate({
            fontSize: `0px`,
            opacity: `0`,
            width: `0px`
        }, 500, function() {
            // after animation is done, remove
            parentDiv.remove();
            toggleCrudReportsDiv();
        });
    });

    // Edit Report
    $(document).on(`click`, `.report-edit`, function() {
        const parentDiv = $(this).parent();
        const reportID = parentDiv.attr(`id`);
        const reportIDNum = parentDiv.attr(`reportid`);
        const reportContents = [];
        if ($(this).text() == `Edit`) {
            //
            $(`#${reportID} .report-content-text`).each(function() {
                const spanText = $(this).text();
                //
                if ($(this).hasClass(`report-content-textarea`)) {
                    $(this).replaceWith(`<textarea class="report-content-edit report-content-edit-textarea">${spanText}</textarea>`);
                } else {
                    $(this).replaceWith(`<input class="report-content-edit" type="text" value="${spanText}">`);
                }
                //                
            });
            //
            $(this).text(`Save`);
        } else {
            $(`#${reportID} .report-content-edit`).each(function() {
                const spanText = $(this).val();
                reportContents.push(spanText);
                if ($(this).hasClass(`report-content-edit-textarea`)) {
                    $(this).replaceWith(`<span class="report-content-text report-content-textarea">${spanText}</span>`);
                } else {
                    $(this).replaceWith(`<span class="report-content-text">${spanText}</span>`);
                }
                
            });
            //
            for (let i = 0; i < blotterDatabase.length; i++) {
                if (blotterDatabase[i].reportID == reportIDNum) {
                    blotterDatabase[i].reportAddress = reportContents[0];
                    blotterDatabase[i].reportedPerson = reportContents[1];
                    blotterDatabase[i].reportDetails = reportContents[2];
                    blotterDatabase[i].reportModifiedDate = createDateNowYMDHM();
                }
            }
            updateBlotterDB();
            updateCurrentUserBlotterDatabase();
            //
            $(this).text(`Edit`);
        }
        updateBlotterDB();
    });
});

