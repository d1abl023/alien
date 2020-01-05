// 'use strict';
import {MessageManager} from "../utils/message_manager";

export class MessagesPage {

    private conversationsList = document.getElementById("conversations_list");

    private sendMessageButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("send_message_button");

    private dialogs = null;

    private isOpenedDialogId = null;

    private isOpenedInterlocutorUsername = null;

    private isOpenedInterlocutorId = null;

    private messageManager: MessageManager = new MessageManager();

    constructor() {
        this.sendMessageButton.addEventListener('click', this.send, true);

    }


    /**
     * Function openMessageHistory() request from the server message history and
     * show messages on front-end
     */
    openMessageHistory(dialogId) {
        if (this.dialogs[dialogId]) {

            this.isOpenedDialogId = dialogId;

            let lastMessage = this.dialogs[dialogId];

            if (lastMessage["senderId"] === this.messageManager.getMyId().toString()) {
                this.isOpenedInterlocutorUsername = lastMessage["receiverLogin"];
                this.isOpenedInterlocutorId = lastMessage["receiverId"];
            } else {
                this.isOpenedInterlocutorUsername = lastMessage["senderLogin"];
                this.isOpenedInterlocutorId = lastMessage["senderId"];
            }

            document.getElementById("messages_list").innerText = "";
            document.getElementById("messages_list_header").innerText += " with " + this.isOpenedInterlocutorUsername;

            // Requesting message history for dialog that was clicked on
            this.getMessageHistory(dialogId);

        } else {
            console.error("Missing dialog with id: " + dialogId);
        }
    }

    /**
     * Requesting message history for dialog that was clicked on
     */
    private getMessageHistory(dialogId) {
        let that = this;
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
                        that.addMessageToMessageList(response[msg]);
                    }
                }
                document.getElementById("messages_list").scrollTop =
                    document.getElementById("messages_list").scrollHeight;
            })
        });
    }

    addMessageToMessageList(msg) {
        try {
            let messageList = document.getElementById("messages_list");

            let sender = document.createElement("div");
            sender.classList.add("sender_username");
            if (msg.hasOwnProperty("senderLogin")) {
                sender.innerText = msg.senderLogin;
            } else {
                throw new Error("Missing property \"senderLogin\"");
            }
            let timestamp = document.createElement("div");
            timestamp.classList.add("timestamp");
            if (msg.hasOwnProperty("timestamp")) {
                const date: Date = new Date(Number(msg["timestamp"]));
                const minutes: number = date.getMinutes();
                timestamp.innerText = date.getHours() + ":" + (minutes.toString().length === 2 ? minutes.toString() : minutes + "0");
            } else {
                throw new Error("Missing property \"timestamp\"");
            }
            let messageText = document.createElement("div");

            messageText.classList.add("message_text");
            if (msg.hasOwnProperty("text")) {
                messageText.innerText =
                    msg.text
            } else {
                throw new Error("Missing property \"text\"");
            }


            let messageBody = document.createElement("div");
            //    messageBody.appendChild(sender);
            messageBody.appendChild(messageText);

            let message = document.createElement("div");


            if (msg.senderId === this.messageManager.getMyId()) {
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
        } catch (e) {
            // TODO: Need to add catch block implementation
        }
    }

     public send() {
        let text = (<HTMLInputElement>document.getElementById("send_message_field")).value;
        let message = {
            "dialogId": this.isOpenedDialogId,
            "senderId": this.messageManager.getMyId(),
            "receiverId": this.isOpenedInterlocutorId,
            "text": text,
            "senderLogin": this.messageManager.getMyUsername(),
            "receiverLogin": this.isOpenedInterlocutorUsername
        };

        this.messageManager.sendMessage(message);

        (<HTMLInputElement>document.getElementById("send_message_field")).value = "";
    };

    sortDialogs(dialogs) {
        return dialogs;
    }
}