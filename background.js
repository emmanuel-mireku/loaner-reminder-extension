let bodyBackgroundColor = "transparent";
let returnTimeObject = { "hr": 18, "min": 0, "sec": 0, "ms": 0 };
let stopTime = false;



chrome.runtime.onStartup.addListener(() => {
    startup(returnTimeObject);
});


let startup = (deadline) => {
    let startDate = new Date();
    let deadlineDate = new Date(new Date().setHours(...Object.values(deadline)));
    let deadlineTime = deadlineDate.getTime();
    let timeLeft = deadlineDate - startDate.getTime();
    if (timeLeft <= 0) {
        let nextDayDeadline = deadlineDate.getDay() + 1;
        let nextDateDeadline = new Date().setDate(nextDateDeadline.getDate() + nextDayDeadline);
        timeLeft = nextDateDeadline.getTime() - startDate.getTime();
    }
    startDate = startDate.toLocaleString();
    deadlineDate = deadlineDate.toLocaleString();
    console.log(timeLeft, startDate, deadlineDate);
    chrome.storage.local.set({ startDate, deadlineDate, timeLeft });
    chrome.identity.getProfileUserInfo(({ email }) => {
        chrome.notifications.create("intro_notification", {
            contextMessage:"If you don't agree with this. Please return the chromebook back to th office immediately.",
            message: `Hi ${email}!\nThis is a reminder that you came to the tech office ${startDate} to borrow a Chromebook.\nIt is your responsibility to return this chromebook on time.\nPlease return it before ${deadlineDate}`,
            priority: 2,
            requireInteraction: true,
            title: "Chromebook Reminder Agreement",
            type: "basic",
            iconUrl: "images/48.png"
    
        });
    });
}



let startClock = setInterval(() => {
    chrome.storage.local.get(null, ({ timeLeft, deadlineDate }) => {
        timeLeft = (new Date(deadlineDate).getTime() - new Date().getTime());
        let days = Math.floor(timeLeft / 86400 / 1000);
        let hours = Math.floor(timeLeft / 3600 / 1000);
        let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (60 * 1000));
        let seconds = Math.floor((timeLeft % (1000 * 60) / 1000));
        let updatedTime = { days, hours, minutes, seconds }
        chrome.runtime.sendMessage({ updatedTime, stopTime });
        if (timeLeft <= 0) {
            clearInterval(startClock);
            stopTime = true;
            console.log("done");
        }
        if(days == 0 && hours <= 1){
            chrome.action.setBadgeText({text: `${hours}:${minutes}`});
            chrome.action.setBadgeBackgroundColor({color: "red"});
        }
        if( days == 0 && hours == 1 && minutes == 0){
            chrome.notifications.create("1hr_notification", {
                contextMessage:"Please prepare to return this chromebook within an hour. Failure to do so will get you into trouble! We know who is signed in into and using this Chromebook.",
                message: "This is a reminder to return Chromebook soon!",
                priority: 2,
                requireInteraction: true,
                title: "Chromebook Return Reminder",
                type: "basic",
                iconUrl: "images/48.png"

            });
        }
        if( days == 0 && hours == 0 && minutes == 30){
            chrome.notifications.create("30min_notification", {
                contextMessage:"Please prepare to return this chromebook within an hour. Failure to do so will get you into trouble! We know who is signed in into and using this Chromebook.",
                message: "This is a reminder to return Chromebook soon!",
                priority: 2,
                requireInteraction: true,
                title: "Chromebook Return Reminder",
                type: "basic",
                iconUrl: "images/48.png"

            });
        }
        chrome.storage.local.set({ timeLeft, updatedTime }, () => {
            console.log(timeLeft);
        });
    });
}, 1000);


let lifeline = null;


async function keepAlive() {
    if (lifeline) return;
    for (const tab of await chrome.tabs.query({ url: '*://*/*' })) {
        try {
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    chrome.runtime.connect({ name: 'keepAlive' });
                    console.log('keepAlive');
                },
            });
            chrome.tabs.onUpdated.removeListener(retryOnTabUpdate);
            return;
        } catch (e) {}
    }
    chrome.tabs.onUpdated.addListener(retryOnTabUpdate);
}

function keepAliveForced() {
    lifeline?.disconnect();
    lifeline = null;
    keepAlive();
}

async function retryOnTabUpdate(tabId, info, tab) {
    if (info.url && /^(file|https?):/.test(info.url)) {
        keepAlive();
    }
}

chrome.runtime.onConnect.addListener(port => {
    if (port.name === 'keepAlive') {
        lifeline = port;
        setTimeout(keepAliveForced, 295e3);
        port.onDisconnect.addListener(keepAliveForced);
    }
});

keepAlive();