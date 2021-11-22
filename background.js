let color = "transparent";
let returnTimeObject = { "hr": 16, "min": 0, "sec": 0, "ms": 0 };


chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ bodyBackgroundColor: color });
    console.log(`the color is now: ${color}`);
});


chrome.runtime.onStartup.addListener(() => {
    let startDate = new Date().toLocaleString();
    let deadlineDate = new Date().setHours(...Object.values(returnTimeObject));
    deadlineDate = new Date(deadlineDate);
    console.log(startDate, deadlineDate);
    chrome.storage.sync.set({borrowDate: startDate, returnTime: deadlineDate });

});


chrome.runtime.onSuspend.addListener(() => {
    console.log("on suspend!");
});