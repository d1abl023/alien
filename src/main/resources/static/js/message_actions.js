'use strict';

const usernamePage = document.querySelector('#username-page');
const chatPage = document.querySelector('#chat-page');
const usernameForm = document.querySelector('#usernameForm');
const messageForm = document.querySelector('#messageForm');
const messageInput = document.querySelector('#send_message_field');
const messageArea = document.querySelector('#messageArea');
const sendMessageButton = document.querySelector("#send_message_button");

let dialogs = null;

let stompClient = null;
let userId = null;

let isOpenedDialogId = null;
let isOpenedInterlocutorUsername = null;


/**
 * On window is loaded first app tries to get username of current user.
 * After, if username has been successfully fetched,
 * app tries to subscribe to topic where it will receive messages from.
 */
window.onload = (function () {
    $.ajax({
        url: "/get_id",
        type: "GET",
        complete: (function (data) {

            console.log(data);

            if (data.responseText) {
                userId = data.responseText;
                $.ajax({
                    url: "/get_dialog_list",
                    type: "GET",
                    complete: (function (data) {
                        if (data.responseText) {
                            // dialogs = data.body;
                            console.log(data.responseText);
                            let dialogs = data.body;
                            for (let dialog in dialogs) {
                                let dialogEl = document.createElement("div");
                                if (dialogs.hasOwnProperty(dialog)) {
                                    if (dialogs[dialog].sender === userId) {
                                        dialogEl.id = dialogs[dialog].receiver;
                                    } else {
                                        dialogEl.id = dialogs[dialog].sender;
                                    }
                                }

                            }
                        }
                    })
                });

                connect();
            } else {
                window.alert("Error to load your id!\nTry one more time...");
            }
        }),
        error: (function(data){
            console.log("Error");
            console.log(data);
        })
    });
});

/**
 * Function openMessageHistory() request from the server message history and
 * show messages on front-end
 */
const openMessageHistory = function (dialogId) {
    isOpenedInterlocutorUsername = null;
    let messageList = document.getElementById("messages_list");
    messageList.innerText = "";

    // Requesting message history for dialog that was clicked on
    $.ajax({
        url: "/get_message_history",
        type: "POST",
        data: dialogId,
        contentType: "text/plain; charset=utf-8",
        complete: (function (data) {
            console.log(data.body);

            // Iterating over array of received messages
            for (let msg in data.body) {
                if (data.body.hasOwnProperty(msg)) {
                    let sender = document.createElement("div");
                    sender.classList.add("sender_username");
                    sender.innerText = msg.sender;

                    let timestamp = document.createElement("div");
                    timestamp.classList.add("timestamp");
                    const date = new Date(msg.id);
                    timestamp.innerText = date.getHours() + ":" + date.getMinutes();

                    let messageText = document.createElement("div");
                    messageText.classList.add("message_text");
                    messageText.innerText = msg.text;


                    let message = document.createElement("div");
                    message.appendChild(sender);
                    message.appendChild(messageText);
                    message.appendChild(timestamp);

                    if (msg.sender === userId) {
                        message.className = "outgoing_message";
                    } else {
                        message.className = "incoming_message";
                        if (!isOpenedInterlocutorUsername) {
                            isOpenedInterlocutorUsername = msg.sender;
                        }
                    }

                    messageList.appendChild(message);
                }
            }
        })
    });

};

sendMessageButton.addEventListener('click', sendMessage, true);
window.addEventListener("onload", connect, true);
