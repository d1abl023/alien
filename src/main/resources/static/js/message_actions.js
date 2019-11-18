'use strict';

const conversationsList = document.getElementById("conversations_list");
const sendMessageButton = document.getElementById("send_message_button");

let dialogs = null;

let stompClient = null;
let myId = null;

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
            if (data.responseText) {
                myId = data.responseText;
                $.ajax({
                    url: "/get_dialog_list",
                    type: "GET",
                    complete: (function (data) {

                        if (data.hasOwnProperty("responseJSON")) {
                            console.log(data.responseJSON);
                            dialogs = data.responseJSON;
                            for (let dialog in dialogs) {

                                let dialogEl = document.createElement("div");
                                let login = document.createElement("div");
                                let lastMessage = document.createElement("div");

                                if (dialogs.hasOwnProperty(dialog)) {

                                    console.log(dialog);

                                    dialog = dialogs[dialog];
                                    if (dialog.hasOwnProperty("senderId") ? dialog.senderId === myId : false) {
                                        dialogEl.id = dialog.hasOwnProperty("dialogId") ?
                                            dialog.dialogId : console.error("Missing field \"dialogId\"");
                                        login.innerText = dialog.hasOwnProperty("receiverLogin") ?
                                            dialog.receiverLogin : console.error("Missing field \"receiverLogin\"");
                                    } else {
                                        dialogEl.id = dialog.hasOwnProperty("dialogId") ?
                                            dialog.dialogId : console.error("Missing field \"dialogId\"");
                                        login.innerText = dialog.hasOwnProperty("senderLogin") ?
                                            dialog.senderLogin : console.error("Missing field \"senderLogin\"");
                                    }

                                    dialogEl.className = "person";
                                    dialogEl.onclick = function () {
                                        openMessageHistory(dialogEl.id);
                                    }

                                    login.className = "login";
                                    lastMessage.className = "last_message";
                                    lastMessage.innerText = dialog.text;

                                    dialogEl.appendChild(login);
                                    dialogEl.appendChild(lastMessage);

                                    conversationsList.appendChild(dialogEl);
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
        error: (function (data) {
            console.log("Error");
            console.log(data);
        })
    });
});

/**
 * Function openMessageHistory() request from the server message history and
 * show messages on front-end
 */
function openMessageHistory(dialogId) {
    if (dialogs[dialogId]) {

        let currentDialog = dialogs[dialogId];

        isOpenedInterlocutorUsername = currentDialog["senderId"] === myId.toString() ?
            currentDialog["receiverLogin"] : currentDialog["senderLogin"];

        let messageList = document.getElementById("messages_list");
        messageList.innerText = "";


        // Requesting message history for dialog that was clicked on
        $.ajax({
            url: "/get_message_history",
            type: "POST",
            data: dialogId.toString(),
            contentType: "text/plain; charset=utf-8",
            complete: (function (data) {
                console.log(data);

                let response = data.responseJSON;

                // Iterating over array of received messages
                for (let msg in response) {
                    if (response.hasOwnProperty(msg)) {
                        let sender = document.createElement("div");
                        sender.classList.add("sender_username");
                        sender.innerText = msg.hasOwnProperty("senderLogin") ?
                            msg.senderLogin : console.error("Missing property \"senderLogin\"");

                        let timestamp = document.createElement("div");
                        timestamp.classList.add("timestamp");
                        const date = msg.hasOwnProperty("timestamp") ?
                            new Date(msg.timestamp) : console.error("Missing property \"timestamp\"");
                        timestamp.innerText = date.getHours() + ":" + date.getMinutes();

                        let messageText = document.createElement("div");
                        messageText.classList.add("message_text");
                        messageText.innerText = msg.hasOwnProperty("text") ?
                            msg.text : console.error("Missing property \"text\"");


                        let message = document.createElement("div");
                        message.appendChild(sender);
                        message.appendChild(messageText);
                        message.appendChild(timestamp);

                        if (msg.senderId === myId) {
                            message.className = "outgoing_message";
                        } else {
                            message.className = "incoming_message";
                            if (!isOpenedInterlocutorUsername) {
                                isOpenedInterlocutorUsername = msg.hasOwnProperty("senderId") ?
                                    msg.senderId : console.error("Missing property \"senderId\"");
                            }
                        }

                        messageList.appendChild(message);
                    }
                }
            })
        });
    } else {
        console.error("Missing dialog with id: " + dialogId);
    }
}

sendMessageButton.addEventListener('click', sendMessage, true);
