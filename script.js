// SCRIPT.JS - basic functions
// function to return false if value of input element in the argument is not null or blank
function validateInput(field) {
    const fieldVal = field.val().trim();
    if (fieldVal == `` || fieldVal === undefined || fieldVal === null) {
        field.val(null); // empties the input field
        field.focus(); // focuses on it
        field.attr(`placeholder`, `Required field`);
        
        // for console log
        console.log(`Text is not valid.`);
        return false;
    }
    return true; // after validation, returns true
}
// function to create current date and time then YYYY-MM-DD format
function createDateNowYMD() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}
// like above function but thisOffset decreases the year by that value
function createDateNowYMDOffset(thisOffset) {
    const date = new Date();
    const year = date.getFullYear();
    const yearOffset = Number(year) - thisOffset;
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${yearOffset}-${month}-${day}`;

    return formattedDate;
}
// create only YYYY-MM-DD date
function convertDateNowYMD(thisDate) {
    const date = new Date(thisDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}
// function to create current date and time then return YYYY-MM-DD HH:MM format
function createDateNowYMDHM() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
    return formattedDate;
}
// function to create and return a String from a date formatted as Day Month, Year
function createDateNowDMY() {
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
    return formattedDate;
}
// converts a given date into DD MMM YYYY
function convertDateToDMY(thisDate) {
    const date = new Date(thisDate);
    const formattedDate = date.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
    return formattedDate;
}
// converts a given date into DD MMM YYYY HH SS
function convertDateToDMYHM(thisDate) {
    const date = new Date(thisDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const customFormattedDate = `${day} ${month} ${year} ${hours}:${minutes}`;
    return customFormattedDate;
}
// function to return a String with a number with leading zeros
function padThisNum(thisNum, howManyZeros) {
    const paddedNumber = String(thisNum).padStart(howManyZeros, `0`);
    return paddedNumber;
}
// reversed value of a result of above function (removes leading zeros), for example: `00300` returns `300`
function unpadThisNum(thisNum) {
    return Number(parseInt(thisNum, 10));
}