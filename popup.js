let countdownTime = document.querySelector("#countdown-value");
let todaysDate = document.querySelector("#today-date");

let returnMessage = document.querySelector("#return-message");
let timeToReturn = document.querySelector("#time-to-return");
let popupBody = document.querySelector("#body");
let userName = document.querySelector("#user");

chrome.storage.local.get(null, ({ deadline, user }) => {
  let { email } = user;
  userName.innerHTML = `Hi, ${(email ||= "User")}!`;
  todaysDate.innerHTML = new Date().toLocaleDateString();
  let deadlineDate = new Date(deadline);
  timeToReturn.innerHTML = deadlineDate.toLocaleString();
  let timeLeft = deadlineDate.getTime() - new Date().getTime();
  let days = Math.floor(timeLeft / 86400 / 1000);
  let hours = Math.floor(timeLeft / 3600 / 1000);
  let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (60 * 1000));
  let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  countdownTime.innerHTML = `${days}d: ${hours}h: ${minutes}m: ${seconds}s`;
  if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
    clearInterval(startCountdown);
    countdownTime.innerHTML = "Time's Up!";
    returnMessage.innerHTML = "Please return Chromebook or it will get locked.";
  }
});

chrome.identity.getProfileUserInfo(({ email }) => {
  userName.innerHTML = `Hi, ${(email ||= "User")}!`;
  todaysDate.innerHTML = new Date().toLocaleDateString();
  chrome.storage.local.set({ configurations: { user: email } });
});

let startCountdown = setInterval(() => {
  chrome.storage.local.get(null, ({ configurations, deadline }) => {
    let deadlineDate = new Date(deadline);
    let timeLeft = deadlineDate.getTime() - new Date().getTime();
    let days = Math.floor(timeLeft / 86400 / 1000);
    let hours = Math.floor(timeLeft / 3600 / 1000);
    let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (60 * 1000));
    let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    let currentTime = { days, hours, minutes, seconds };
    countdownTime.innerHTML = `${days}d: ${hours}h: ${minutes}m: ${seconds}s`;
    chrome.storage.local.set({ currentTime });
  });
}, 1000);
