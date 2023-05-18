// REPORT.JS - shows all generated reports that aren't deleted by the user
let blotterDatabase = [];
if (localStorage.getItem(`blotterDatabase`) != null) {
    blotterDatabase = JSON.parse(localStorage.getItem(`blotterDatabase`));
}

// DOCUMENT READY
$(document).ready(function() {
    // traverses through all the blotterDatabase items, also has an if statement that it is NOT deleted
    for (let i = 0; i < blotterDatabase.length; i++) {
        if (blotterDatabase[i].deleted == false) {
            const newDiv = $(`<div></div>`);
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
                html: `<b>Details:</b> <br><span class="report-content-textarea">${blotterDatabase[i].reportDetails}</span>`
            });
            newReportDetails.appendTo(newDiv);

            // finally display to html
            newDiv.appendTo(`#reports-wall`);
        }
    }
    if ($('#reports-wall').children().length === 0) {
        alert(`There are no existing reports yet. Create a report in the 'Blotter' page.`);
      }
});