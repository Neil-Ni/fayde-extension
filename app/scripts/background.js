'use strict';

chrome.runtime.onConnect.addListener(function (port) {
  // Listen for message from the panel and pass it on to the content
  port.onMessage.addListener(function (message) {
    console.log('Received message from panel (background.js): ' + message);
    // Request a tab for sending needed information
    chrome.tabs.sendMessage(message.tabId, message);
  });
  // Post back to Devtools from content
  chrome.runtime.onMessage.addListener(function (message, sender) {
    console.log('Received message from content; sending back to panel (background.js): ' + message);
    port.postMessage(message);
  });
});
console.log(chrome);