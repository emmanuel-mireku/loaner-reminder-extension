// let body = document.querySelector("#body");
// let countdownTime = document.querySelector("#countdown-value");
// let todaysDate = document.querySelector("#today-date");
// let timeBorrowed = document.querySelector("#time-borrowed");
// let returnMessage = document.querySelector("#return-message");
// let actualTimeLeft = 0;


let countdownTime = document.querySelector("#countdown-value");
let todaysDate = document.querySelector("#today-date");
let timeBorrowed = document.querySelector("#time-borrowed");
let returnMessage = document.querySelector("#return-message");
let timeToReturn = document.querySelector("#time-to-return");



chrome.storage.local.get(null, ({ startDate, updatedTime, deadlineDate }) => {
    timeBorrowed.innerHTML = startDate;
    todaysDate.innerHTML = new Date().toLocaleDateString();
    timeToReturn.innerHTML = deadlineDate;
    if (updatedTime) {
        let { days, hours, minutes, seconds } = updatedTime;
        countdownTime.innerHTML = `${days}d: ${hours}h: ${minutes}m: ${seconds}s`;
    } else {
        let timeLeft = (new Date(deadlineDate).getTime() - new Date().getTime());
        let days = Math.floor(timeLeft / 86400 / 1000);
        let hours = Math.floor(timeLeft / 3600 / 1000);
        let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (60 * 1000));
        let seconds = Math.floor((timeLeft % (1000 * 60) / 1000));
        countdownTime.innerHTML = `${days}d: ${hours}h: ${minutes}m: ${seconds}s`;
    }
});


chrome.storage.onChanged.addListener((changes, area) => {
    console.log(typeof changes);
    console.log(changes, area);
});


chrome.runtime.sendMessage({ popupOpen: true });

chrome.runtime.onMessage.addListener(function({ updatedTime, stopTime }, sender, sendResponse) {
    if (!stopTime) {
        let { days, hours, minutes, seconds } = updatedTime;
        countdownTime.innerHTML = `${days}d: ${hours}h: ${minutes}m: ${seconds}s`;
        console.log("background sent a fucking message bitch!", sender, sendResponse, updatedTime);
    }
});


chrome.runtime.getPlatformInfo((platformInfo) => {
    console.log(platformInfo);
});