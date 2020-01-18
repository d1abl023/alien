'use strict';
class MessagesPage {
    static conversationsList = document.getElementById("conversations_list");
    static sendMessageButton = document.getElementById("send_message_button");

    static dialogs = null;

    static stompClient = null;

    static isOpenedDialogId = null;
    static isOpenedInterlocutorUsername = null;
    static isOpenedInterlocutorId = null;


    /**
     * On window is loaded first app tries to get username of current user.
     * After, if username has been successfully fetched,
     * app tries to subscribe to topic where it will receive messages from.
     */
    static onMessagesPageLoad() {
        $.ajax({
            url: "/get_id",
            type: "GET",
            complete: (function (data) {
                if (data.responseText) {
                    MessagesPage.myId = data.responseText;
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
                                            MessagesPage.openMessageHistory(dialogEl.id);
                                        };

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

                    WebSocketActions.connect();
                } else {
                    window.alert("Error to load your id!\nTry one more time...");
                }
            }),
            error: (function (data) {
                console.log("Error");
                console.log(data);
            })
        });
        MessagesPage.sendMessageButton.addEventListener('click', MessagesPage.send, true);
    };

    /**
     * Function openMessageHistory() request from the server message history and
     * show messages on front-end
     */
    static openMessageHistory(dialogId) {
        if (dialogs[dialogId]) {

            MessagesPage.isOpenedDialogId = dialogId;

            let lastMessage = dialogs[dialogId];

            if (lastMessage["senderId"] === MessagesPage.myId.toString()) {
                MessagesPage.isOpenedInterlocutorUsername = lastMessage["receiverLogin"];
                MessagesPage.isOpenedInterlocutorId = lastMessage["receiverId"];
            } else {
                MessagesPage.isOpenedInterlocutorUsername = lastMessage["senderLogin"];
                MessagesPage.isOpenedInterlocutorId = lastMessage["senderId"];
            }

            document.getElementById("messages_list").innerText = "";
            document.getElementById("messages_list_header").innerText += " with " + MessagesPage.isOpenedInterlocutorUsername;

            // Requesting message history for dialog that was clicked on
            $.ajax({
                url: "/get_message_history",
                type: "POST",
                data: MessagesPage.dialogId.toString(),
                contentType: "text/plain; charset=utf-8",
                complete: (function (data) {
                    console.log(data);

                    let response = data.responseJSON;

                    // Iterating over array of received messages
                    for (let msg in response) {
                        if (response.hasOwnProperty(msg)) {
                            MessagesPage.addMessageToMessageList(response[msg]);
                        }
                    }
                    document.getElementById("messages_list").scrollTop =
                        document.getElementById("messages_list").scrollHeight;
                })
            });
        } else {
            console.error("Missing dialog with id: " + dialogId);
        }
    }


    static addMessageToMessageList(msg) {
        let messageList = document.getElementById("messages_list");

        let sender = document.createElement("div");
        sender.classList.add("sender_username");
        sender.innerText = msg.hasOwnProperty("senderLogin") ?
            msg.senderLogin : console.error("Missing property \"senderLogin\"");

        let timestamp = document.createElement("div");
        timestamp.classList.add("timestamp");
        const date = msg.hasOwnProperty("timestamp") ?
            new Date(Number(msg.timestamp)) : console.error("Missing property \"timestamp\"");
        let minutes = date.getMinutes();
        timestamp.innerText = date.getHours() + ":" + (minutes.toString().length === 2 ? minutes.toString() : minutes + "0");

        let messageText = document.createElement("div");
        messageText.classList.add("message_text");
        messageText.innerText = msg.hasOwnProperty("text") ?
            msg.text : console.error("Missing property \"text\"");


        let messageBody = document.createElement("div");
        //    messageBody.appendChild(sender);
        messageBody.appendChild(messageText);

        let message = document.createElement("div");


        if (msg.senderId === myId) {
            messageBody.className = "outgoing_msg_body";
            message.className = "outgoing_message";
        } else {
            messageBody.className = "incoming_msg_body";
            message.className = "incoming_message";
            if (!MessagesPage.isOpenedInterlocutorUsername) {
                MessagesPage.isOpenedInterlocutorUsername = msg.hasOwnProperty("senderId") ?
                    msg.senderId : console.error("Missing property \"senderId\"");
            }
        }

        message.appendChild(messageBody);
        message.appendChild(timestamp);
        messageList.appendChild(message);
        document.getElementById("messages_list").scrollTop =
            document.getElementById("messages_list").scrollHeight;
    }

    static send = function () {
        let text = document.getElementById("send_message_field").value;
        let message = new Message(
            MessagesPage.isOpenedDialogId, MessagesPage.myId,
            MessagesPage.isOpenedInterlocutorId, text,
            MessagesPage.myUsername, MessagesPage.isOpenedInterlocutorUsername
        );
        WebSocketActions.sendMessage(message.createMessageObject());

        document.getElementById("send_message_field").value = "";
    };

    static sortDialogs = function (dialogs) {
        return dialogs;
    }
}