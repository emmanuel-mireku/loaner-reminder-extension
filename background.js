let color = "transparent";

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ bodyBackgroundColor: color });
    console.log(`the color is now: ${color}`);
});


chrome.runtime.onStartup.addListener( function(){
    console.log("banku");
});


chrome.runtime.onSuspend.addListener(() => {
    console.log("on suspend!")
});