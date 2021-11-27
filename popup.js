let countdownTime = document.querySelector("#countdown-value");
let todaysDate = document.querySelector("#today-date");
let timeBorrowed = document.querySelector("#time-borrowed");
let returnMessage = document.querySelector("#return-message");
let timeToReturn = document.querySelector("#time-to-return");
let popupBody = document.querySelector("#body");


chrome.runtime.getPlatformInfo((platformInfo) => {
    let {
        os
    } = platformInfo;
    if (os == "cros") {
        console.log("This extension is intended to work for only Chromebooks ATM");
        chrome.storage.sync.get(null, ({
            startDate
        }) => {
            timeBorrowed.innerHTML = startDate;
        });

        chrome.storage.local.get(null, ({
            updatedTime,
            deadlineDate
        }) => {
            todaysDate.innerHTML = new Date().toLocaleDateString();
            timeToReturn.innerHTML = deadlineDate;
            if (updatedTime) {
                let {
                    days,
                    hours,
                    minutes,
                    seconds
                } = updatedTime;
                countdownTime.innerHTML = `${days}d: ${hours}h: ${minutes}m: ${seconds}s`;
                if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
                    countdownTime.innerHTML = "Time's Up!";
                    returnMessage.innerHTML = "Please return Chromebook."
                }
            } else {
                let timeLeft = (new Date(deadlineDate).getTime() - new Date().getTime());
                let days = Math.floor(timeLeft / 86400 / 1000);
                let hours = Math.floor(timeLeft / 3600 / 1000);
                let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (60 * 1000));
                let seconds = Math.floor((timeLeft % (1000 * 60) / 1000));
                countdownTime.innerHTML = `${days}d: ${hours}h: ${minutes}m: ${seconds}s`;
                if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
                    countdownTime.innerHTML = "Time's Up!";
                    returnMessage.innerHTML = "Please return Chromebook."
                }
            }
        });

        chrome.runtime.onMessage.addListener(function ({
            updatedTime,
            stopTime
        }, sender, sendResponse) {
            if (stopTime) {
                countdownTime.innerHTML = "Time's Up!";
                returnMessage.innerHTML = "Please return Chromebook."
            }
            let {
                days,
                hours,
                minutes,
                seconds
            } = updatedTime;
            countdownTime.innerHTML = `${days}d: ${hours}h: ${minutes}m: ${seconds}s`;
            console.log("background sent a fucking message bitch!", sender, sendResponse, updatedTime);
        });
    }
    let notWorkingMessage = "This extension works only on school managed loaner chromebooks.";
    popupBody.innerHTML = "";
    let p = document.createElement("h2");
    popupBody.appendChild(p);
    p.innerHTML = notWorkingMessage;
    popupBody.style.height = "100px";
    popupBody.style.width = "100px";
    p.style.fontFamily = "Roboto";
    p.style.padding = "12px";
    p.style.textAlign = "center";
});