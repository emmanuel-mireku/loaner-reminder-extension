import { configurations, user } from "./configurations.js";

let {
  introNotification,
  halfHourNotification,
  hourNotification,
  lastNotification,
  deadline,
} = configurations;

chrome.storage.local.set({
  configurations,
  user,
  deadline: deadline().toLocaleString(),
});

chrome.identity.getProfileUserInfo(({ email }) => {
  console.log(email);
  chrome.storage.local.set({ user: { email } });
});

let { name: halfHourName, options: halfHourOptions } = halfHourNotification;
let { name: hourName, options: hourOptions } = hourNotification;
let { name: lastNoteName, options: lastNoteOptions } = lastNotification;

let remindTimeForHour = new Date(deadline()).setHours(
  deadline().getHours() - 1
);

chrome.alarms.create(halfHourName, { when: remindTimeForHour / 2.0 });
chrome.alarms.create(hourName, { when: remindTimeForHour });
chrome.alarms.create(lastNoteName, {
  when: new Date(deadline()).getTime(),
});

chrome.alarms.onAlarm.addListener(({ name }) => {
  if (name === halfHourName)
    chrome.notifications.create(halfHourName, halfHourOptions);
  if (name === hourName) chrome.notifications.create(hourName, hourOptions);
  if (name === lastNoteName)
    chrome.notifications.create(lastNoteName, lastNoteOptions);
});

let startUp = () => {
  let { name, options } = introNotification;
  chrome.notifications.create(name, options);
};

chrome.runtime.onStartup.addListener(() => startUp());
