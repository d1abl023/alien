'use strict';
import {WebSocketActions} from "../utils/webSocketActions";
import {Message} from "../utils/templates/message";
import {stringify} from "querystring";

export class MessagesPage {
    private conversationsList = document.getElementById("conversations_list");
    private sendMessageButton = document.getElementById("send_message_button");

    private dialogs = null;
    private dialogId = null;
    private myUsername = null;
    private isOpenedDialogId = null;
    private isOpenedInterlocutorUsername = null;
    private isOpenedInterlocutorId = null;

    private myId;


    /**
     * On window is loaded first app tries to get username of current user.
     * After, if username has been successfully fetched,
     * app tries to subscribe to topic where it will receive messages from.
     */
    public onMessagesPageLoad() {
        $.ajax({
            url: "/get_id",
            type: "GET",
        }).then((data) => {
            if (data.responseText) {
                this.myId = data.responseText;
                $.ajax({
                    url: "/get_dialog_list",
                    type: "GET",
                }).then((data) => {
                    if (data.hasOwnProperty("responseJSON")) {
                        console.log(data.responseJSON);
                        this.dialogs = data.responseJSON;
                        for (let dialog in this.dialogs) {

                            let dialogEl = document.createElement("div");
                            let login = document.createElement("div");
                            let lastMessage = document.createElement("div");

                            if (this.dialogs.hasOwnProperty(dialog)) {

                                console.log(dialog);

                                dialog = this.dialogs[dialog];
                                if (dialog.hasOwnProperty("senderId") ?
                                    dialog["senderId"] === this.myId : false) {

                                    dialogEl.id = dialog.hasOwnProperty("dialogId") ?
                                        dialog["dialogId"] : console.error("Missing field \"dialogId\"");
                                    login.innerText = dialog.hasOwnProperty("receiverLogin") ?
                                        dialog["receiverLogin"] : console.error("Missing field \"receiverLogin\"");
                                } else {
                                    dialogEl.id = dialog.hasOwnProperty("dialogId") ?
                                        dialog["dialogId"] : console.error("Missing field \"dialogId\"");
                                    login.innerText = dialog.hasOwnProperty("senderLogin") ?
                                        dialog["senderLogin"] : console.error("Missing field \"senderLogin\"");
                                }

                                dialogEl.className = "person";
                                dialogEl.onclick = function () {
                                    this.openMessageHistory(dialogEl.id);
                                };

                                login.className = "login";
                                lastMessage.className = "last_message";
                                lastMessage.innerText = dialog["text"];

                                dialogEl.appendChild(login);
                                dialogEl.appendChild(lastMessage);

                                this.conversationsList.appendChild(dialogEl);
                            }
                        }
                    }
                })
            }

            WebSocketActions.connect();
        }).catch(
            (data) => {
                console.log("Error");
                console.log(data);
            }
        );
        this.sendMessageButton.addEventListener('click', MessagesPage.send, true);
    }

    /**
     * Function openMessageHistory() request from the server message history and
     * show messages on front-end
     */
    public openMessageHistory(dialogId) {
        if (this.dialogs[dialogId]) {

            this.isOpenedDialogId = dialogId;

            let lastMessage = this.dialogs[dialogId];

            if (lastMessage["senderId"] === this.myId.toString()) {
                this.isOpenedInterlocutorUsername = lastMessage["receiverLogin"];
                this.isOpenedInterlocutorId = lastMessage["receiverId"];
            } else {
                this.isOpenedInterlocutorUsername = lastMessage["senderLogin"];
                this.isOpenedInterlocutorId = lastMessage["senderId"];
            }

            document.getElementById("messages_list").innerText = "";
            document.getElementById("messages_list_header").innerText += " with " + this.isOpenedInterlocutorUsername;

            // Requesting message history for dialog that was clicked on
            $.ajax({
                url: "/get_message_history",
                type: "POST",
                data: this.dialogId.toString(),
                contentType: "text/plain; charset=utf-8",
            }).then((data) => {
                console.log(data);
                let response = data.responseJSON;

                // Iterating over array of received messages
                for (let msg in response) {
                    if (response.hasOwnProperty(msg)) {
                        this.addMessageToMessageList(response[msg]);
                    }
                }
                document.getElementById("messages_list").scrollTop =
                    document.getElementById("messages_list").scrollHeight;
            });
        } else {
            console.error("Missing dialog with id: " + dialogId);
        }
    }

    public addMessageToMessageList(msg) {
        let messageList = document.getElementById("messages_list");

        let sender = document.createElement("div");
        sender.classList.add("sender_username");
        sender.innerText = msg.senderLogin;

        let timestamp = document.createElement("div");
        timestamp.classList.add("timestamp");
        const date: Date = new Date(Number(msg.timestamp));
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

        if (msg.senderId === this.myId) {
            messageBody.className = "outgoing_msg_body";
            message.className = "outgoing_message";
        } else {
            messageBody.className = "incoming_msg_body";
            message.className = "incoming_message";
            if (!this.isOpenedInterlocutorUsername) {
                this.isOpenedInterlocutorUsername = msg.hasOwnProperty("senderId") ?
                    msg.senderId : console.error("Missing property \"senderId\"");
            }
        }

        message.appendChild(messageBody);
        message.appendChild(timestamp);
        messageList.appendChild(message);
        document.getElementById("messages_list").scrollTop =
            document.getElementById("messages_list").scrollHeight;
    }

    public send() {
        let text = document.getElementById("send_message_field").value;
        WebSocketActions.sendMessage(new Message().createMessageObject(
            this.isOpenedDialogId, this.myId,
            this.isOpenedInterlocutorId, text,
            this.myUsername, this.isOpenedInterlocutorUsername
        ));

        document.getElementById("send_message_field").value = "";
    };

    public addDialogIntoDialogList(dialog) {

    }

    public sortDialogs (dialogs) {
        return dialogs;
    }
}