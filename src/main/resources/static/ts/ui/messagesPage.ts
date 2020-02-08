'use strict';
import {AbstractPage} from "../utils/abstractPage";
import * as $ from "jquery";
import {WebSocketClient} from "../utils/webSocketClient";
import {Logger} from "../utils/logger";

export class MessagesPage extends AbstractPage {
    private webSocketClient: WebSocketClient;

    private dialogs: object = null;
    // private dialogId: string = null;
    private myUsername: string = null;
    private isOpenedInterlocutorUsername: string = null;
    private isOpenedInterlocutorId: string = null;
    private myId: string;
    public isOpenedDialogId: string = null;


    constructor() {
        super();
        this.render();
        this.webSocketClient = new WebSocketClient();
        this.webSocketClient.manageIncomingMessage = this.manageIncomingMessage;
        this.onMessagesPageLoad();
    }

    private manageIncomingMessage = (message): void => {
        this.webSocketClient.showPopUp(message);
        this.addMessageToMessageList(message);
    };

    /**
     * On window is loaded first app tries to get username of current user.
     * After, if username has been successfully fetched,
     * app tries to subscribe to topic where it will receive messages from.
     */
    public onMessagesPageLoad = (): void => {
        $.ajax({
            url: "/get_id",
            type: "GET",
        }).then((data: string) => {
            this.myId = data;
            this.requestDialogList();
        }).catch(
            (data) => {
                console.log("Error");
                console.log(data);
            }
        );
        document.getElementById("send_message_button").addEventListener('click', this.send, true);
    };

    private requestDialogList(): void {
        $.ajax({
            url: "/get_dialog_list",
            type: "GET",
        }).then((data: object) => {
            this.dialogs = data;
            for (let dialog in this.dialogs) {
                if (this.dialogs.hasOwnProperty(dialog)) {
                    document.getElementById("conversations_list").appendChild(this.createDialogHtmlElement(dialog));
                }
            }
        });
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
            document.getElementById("messages_list_header").innerText = "Messages with " + this.isOpenedInterlocutorUsername;

            // Requesting message history for dialog that was clicked on
            $.ajax({
                url: "/get_message_history",
                type: "POST",
                data: this.isOpenedDialogId.toString(),
                contentType: "text/plain; charset=utf-8",
            }).then((data: object) => {
                console.log(data);
                let response = data;

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

    public send = (): void => {
        const SEND_MESSAGE_FIELD: HTMLInputElement =
            <HTMLInputElement>document.getElementById("send_message_field");
        let message: IMessage = {
            dialogId: this.isOpenedDialogId,
            senderId: this.myId,
            receiverId: this.isOpenedInterlocutorId,
            text: SEND_MESSAGE_FIELD.value,
            senderLogin: this.myUsername,
            receiverLogin: this.isOpenedInterlocutorUsername
        };
        this.webSocketClient.sendMessage(JSON.stringify(message));

        SEND_MESSAGE_FIELD.value = "";
    };

    public addMessageToMessageList(msg) {

        Logger.info(msg);

        let messageList: HTMLElement = document.getElementById("messages_list");

        let sender: HTMLDivElement = document.createElement("div");
        sender.classList.add("sender_username");
        sender.innerText = msg.senderLogin;

        let timestamp: HTMLDivElement = document.createElement("div");
        timestamp.classList.add("timestamp");
        const date: Date = new Date(Number(msg.timestamp));
        let minutes: number = date.getMinutes();
        timestamp.innerText = date.getHours() + ":" + (minutes.toString().length === 2 ? minutes.toString() : minutes + "0");

        let messageText: HTMLDivElement = document.createElement("div");
        messageText.classList.add("message_text");
        messageText.innerText = msg.hasOwnProperty("text") ?
            msg.text : console.error("Missing property 'text'");


        let messageBody: HTMLDivElement = document.createElement("div");
        // messageBody.appendChild(sender);
        messageBody.appendChild(messageText);

        let message: HTMLDivElement = document.createElement("div");

        if (msg.senderId === this.myId) {
            messageBody.className = "outgoing_msg_body";
            message.className = "outgoing_message";
        } else {
            messageBody.className = "incoming_msg_body";
            message.className = "incoming_message";
            if (!this.isOpenedInterlocutorUsername) {
                this.isOpenedInterlocutorUsername = msg.hasOwnProperty("senderId") ?
                    msg.senderId : console.error("Missing property 'senderId'");
            }
        }

        message.appendChild(messageBody);
        message.appendChild(timestamp);
        messageList.appendChild(message);
        document.getElementById("messages_list").scrollTop =
            document.getElementById("messages_list").scrollHeight;
    }

    public static sortDialogs(dialogs) {
        return dialogs;
    }

    public render(): void {
        let body: HTMLElement = document.createElement("div");
        body.id = "body";
        body.innerHTML =
            "<div id='body_blocks'>\n" +
            "            <div id='headers_block'>\n" +
            "                <div id='conversations_list_header'>Conversations</div>\n" +
            "                <div id='messages_list_header'>Messages</div>\n" +
            "            </div>\n" +
            "            <div id='conversations_list'></div>\n" +
            "            <div id='messages_block'>\n" +
            "                <div id='messages_list'></div>\n" +
            "                <div id='send_messages_block'>\n" +
            "                    <textarea id='send_message_field'></textarea>\n" +
            "                    <div id='send_message_functional'>\n" +
            "                        <button id='send_message_button'>send</button>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "            </div>\n" +
            "            <div id='newMessagePopUp' class='popup'>\n" +
            "                <div id='sender_username'></div>\n" +
            "                <div id='part_of_message_text'></div>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n";
        if (document.getElementById("body")) {
            document.getElementById("body").remove();
        }
        body.appendChild(this.createNewMessagePopupElement());
        document.body.appendChild(body);
    }

    private createDialogHtmlElement(dialog): HTMLDivElement {
        let dialogEl: HTMLDivElement = document.createElement("div");
        let login: HTMLDivElement = document.createElement("div");
        let lastMessage: HTMLDivElement = document.createElement("div");

        dialog = this.dialogs[dialog];
        if (dialog.hasOwnProperty("senderId") ? dialog["senderId"] === this.myId : false) {
            dialogEl.id = dialog.hasOwnProperty("dialogId") ?
                dialog["dialogId"] : console.error("Missing field 'dialogId'");
            login.innerText = dialog.hasOwnProperty("receiverLogin") ?
                dialog["receiverLogin"] : console.error("Missing field 'receiverLogin'");
        } else {
            dialogEl.id = dialog.hasOwnProperty("dialogId") ?
                dialog["dialogId"] : console.error("Missing field 'dialogId'");
            login.innerText = dialog.hasOwnProperty("senderLogin") ?
                dialog["senderLogin"] : console.error("Missing field 'senderLogin'");
        }

        dialogEl.className = "person";
        dialogEl.onclick = () => this.openMessageHistory(dialogEl.id);

        login.className = "users_login";
        lastMessage.className = "last_message";
        lastMessage.innerText = dialog["text"];

        dialogEl.appendChild(login);
        dialogEl.appendChild(lastMessage);

        return dialogEl;
    }
}
