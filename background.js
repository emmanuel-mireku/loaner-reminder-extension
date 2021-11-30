import { configurations } from "./configurations.js";

chrome.storage.local.set({ configurations });

console.log(new Date(configurations.configDeadline()) - 4 * 3600 * 1000);

let {
  introNotification,
  halfHourNotification,
  hourNotification,
  lastNotification,
  configDeadline,
} = configurations;

let { name: halfHourName, options: halfHourOptions } = halfHourNotification;
let { name: hourName, options: hourOptions } = hourNotification;
let { name: lastNoteName, options: lastNoteOptions } = lastNotification;

let remindTimeForHour = new Date(configDeadline()).setHours(
  configDeadline().getHours() - 1
);

chrome.alarms.create(halfHourName, { when: remindTimeForHour / 2.0 });
chrome.alarms.create(hourName, { when: remindTimeForHour });
chrome.alarms.create(lastNoteName, {
  when: new Date(configDeadline()).getTime(),
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
