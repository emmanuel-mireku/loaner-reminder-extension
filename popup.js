let body = document.querySelector("#body");
let date = document.querySelector("#date");

chrome.storage.sync.get(["bodyBackgroundColor", "returnTime", "borrowDate"], ({ bodyBackgroundColor, returnTime, borrowDate })=>{
    body.style.backgroundColor = bodyBackgroundColor;
    console.log(bodyBackgroundColor, returnTime, borrowDate);
    date.innerHTML = returnTime ? `${returnTime}, ${borrowDate}` : "There's no date";
});