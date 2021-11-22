let body = document.querySelector("#body");

chrome.storage.sync.get("bodyBackgroundColor", ({ bodyBackgroundColor })=>{
    body.style.backgroundColor = bodyBackgroundColor;
});

chrome.runtime.onStartup.addListener(() => {
    let date = new Date();
    console.log(`on start up this is the date pop: ${date}`);
});

chrome.runtime.onSuspend.addListener(() => {
    console.log("on suspend!")
});