let countdownTime = document.querySelector("#countdown-value");
let todaysDate = document.querySelector("#today-date");

let returnMessage = document.querySelector("#return-message");
let timeToReturn = document.querySelector("#time-to-return");
let popupBody = document.querySelector("#body");
let userName = document.querySelector("#user");

chrome.storage.local.get(null, ({ configurations }) => {
  let { returnTimeObject } = configurations;
  let deadline = new Date(
    new Date().setHours(...Object.values(returnTimeObject))
  );
  timeToReturn.innerHTML = deadline.toLocaleString();
  let timeLeft = new Date(deadline).getTime() - new Date().getTime();
  let days = Math.floor(timeLeft / 86400 / 1000);
  let hours = Math.floor(timeLeft / 3600 / 1000);
  let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (60 * 1000));
  let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  countdownTime.innerHTML = `${days}d: ${hours}h: ${minutes}m: ${seconds}s`;
});

chrome.identity.getProfileUserInfo(({ email }) => {
  userName.innerHTML = `Hi, ${(email ||= "User")}!`;
  todaysDate.innerHTML = new Date().toLocaleDateString();
});

let startCountdown = setInterval(() => {
  chrome.storage.local.get(null, ({ configurations }) => {
    let { returnTimeObject } = configurations;
    let deadline = new Date(
      new Date().setHours(...Object.values(returnTimeObject))
    );
    let timeLeft = deadline.getTime() - new Date().getTime();
    let days = Math.floor(timeLeft / 86400 / 1000);
    let hours = Math.floor(timeLeft / 3600 / 1000);
    let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (60 * 1000));
    let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    let currentTime = { days, hours, minutes, seconds };
    countdownTime.innerHTML = `${days}d: ${hours}h: ${minutes}m: ${seconds}s`;
    chrome.storage.local.set({ currentTime });
  });
  chrome.runtime.getPlatformInfo(({ os }) => {
    if (os !== "win" && os !== "cros") {
      clearInterval(startCountdown);
    }
  });
}, 1000);
