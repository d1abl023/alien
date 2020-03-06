'use strict';
import * as $ from "jquery";
import {AbstractPage} from "../utils/abstractPage";
import {WebSocketClient} from "../utils/webSocketClient";
import {IDialog} from "../utils/templates/iDialog";

export class MessagesPage extends AbstractPage {
    private webSocketClient: WebSocketClient;
    private dialogs: { [key: string]: IDialog };
    private isOpenedInterlocutorUsername: string;
    private isOpenedInterlocutorId: string;
    public isOpenedDialogId: string;


    constructor(myId: string, myUsername: string) {
        super(myId, myUsername);
        this.render();
        this.webSocketClient = new WebSocketClient(this.myId, this.myUsername);
        this.webSocketClient.manageIncomingMessage = this.manageIncomingMessage;
        this.onMessagesPageLoad();
    }

    private manageIncomingMessage = (message: IMessage): void => {
        if (message.dialogId === this.isOpenedDialogId) {
            this.addMessageToMessageList(message);
            this.updateDialogHtmlElement(message);
        } else {
            this.updateDialogHtmlElement(message);
            this.webSocketClient.showPopUp(message);
        }
    };

    /**
     * On window is loaded first app tries to get username of current user.
     * After, if username has been successfully fetched,
     * app tries to subscribe to topic where it will receive messages from.
     */
    public onMessagesPageLoad = (): void => {
        $.ajax({
            url: "get_id",
            type: "GET"
        }).then((data: string): void => {
            this.myId = data;
            this.requestDialogList();
        });

        $.ajax({
            url: "get_username",
            type: "GET"
        }).then((data: string): void => {
            this.myUsername = data;
        });
        document.getElementById("send_message_button").addEventListener('click', this.send, true);
    };

    private requestDialogList(): void {
        $.ajax({
            url: "/get_dialog_list",
            type: "GET",
        }).then((data) => {
            this.dialogs = data;
            for (let dialogId in this.dialogs) {
                if (this.dialogs.hasOwnProperty(dialogId)) {
                    document.getElementById("conversations_list")
                        .appendChild(this.createDialogHtmlElement(this.dialogs[dialogId]));
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

            let lastMessage: IMessage = this.dialogs[dialogId];

            if (lastMessage.senderId === this.myId) {
                this.isOpenedInterlocutorUsername = lastMessage.receiverLogin;
                this.isOpenedInterlocutorId = lastMessage.receiverId;
            } else {
                this.isOpenedInterlocutorUsername = lastMessage.senderLogin;
                this.isOpenedInterlocutorId = lastMessage.senderId;
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
            receiverLogin: this.isOpenedInterlocutorUsername,
            timestamp: Date.now().toString()
        };
        this.webSocketClient.sendMessage(JSON.stringify(message));

        SEND_MESSAGE_FIELD.value = "";
    };

    public addMessageToMessageList(msg: IMessage) {
        let messageList: HTMLElement = document.getElementById("messages_list");

        let sender: HTMLDivElement = document.createElement("div");
        sender.classList.add("sender_username");
        sender.innerText = msg.senderLogin;

        let timestamp: HTMLDivElement = document.createElement("div");
        timestamp.classList.add("timestamp");
        const date: Date = new Date(Number(msg.timestamp));
        let minutes: number = date.getMinutes();
        timestamp.innerText = date.getHours() + ":" + (minutes.toString().length === 2 ? minutes.toString() : "0" + minutes);

        let messageText: HTMLDivElement = document.createElement("div");
        messageText.classList.add("message_text");
        messageText.innerText = msg.text;


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
                this.isOpenedInterlocutorUsername = msg.senderId;
            }
        }

        message.appendChild(messageBody);
        message.appendChild(timestamp);
        messageList.appendChild(message);
        document.getElementById("messages_list").scrollTop =
            document.getElementById("messages_list").scrollHeight;
    }

    public render(): void {
        let body: HTMLElement = document.getElementById("body");
        body.innerHTML = `<div class="container">
        <div class="messaging">
        <div class="inbox_msg">
        <div class="inbox_people">
          <div class="headind_srch">
            <div class="recent_heading">
              <h4 class="text-dark">People</h4>
            </div>
            <div class="srch_bar">
              <div class="stylish-input-group">
                <input type="text" class="search-bar"  placeholder="Search" >
                <span class="input-group-addon">
                <button type="button"> <i class="fa fa-search" aria-hidden="true"></i> </button>
                </span> </div>
            </div>
          </div>
          <div class="inbox_chat">
            <div class="chat_list active_chat">
              <div class="chat_people">
                <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
                <div class="chat_ib">
                  <h5>Sunil Rajput <span class="chat_date">Dec 25</span></h5>
                  <p>Test, which is a new approach to have all solutions 
                    astrology under one roof.</p>
                </div>
              </div>
            </div>
            
            
            <div class="chat_list">
              <div class="chat_people">
                <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
                <div class="chat_ib">
                  <h5>Sunil Rajput <span class="chat_date">Dec 25</span></h5>
                  <p>Test, which is a new approach to have all solutions 
                    astrology under one roof.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mesgs">
          <div class="msg_history">
            <div class="incoming_msg">
              <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
              <div class="received_msg">
                <div class="received_withd_msg">
                  <p>Test which is a new approach to have all
                    solutions</p>
                  <span class="time_date"> 11:01 AM    |    June 9</span></div>
              </div>
            </div>
            <div class="outgoing_msg">
              <div class="sent_msg">
                <p class="bg-dark">Test which is a new approach to have all
                  solutions</p>
                <span class="time_date"> 11:01 AM    |    June 9</span> </div>
            </div>
            <div class="incoming_msg">
              <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
              <div class="received_msg">
                <div class="received_withd_msg">
                  <p>Test, which is a new approach to have</p>
                  <span class="time_date"> 11:01 AM    |    Yesterday</span></div>
              </div>
            </div>
            <div class="outgoing_msg">
              <div class="sent_msg">
                <p class="bg-dark">Apollo University, Delhi, India Test</p>
                <span class="time_date"> 11:01 AM    |    Today</span> </div>
            </div>
            <div class="incoming_msg">
              <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
              <div class="received_msg">
                <div class="received_withd_msg">
                  <p>We work directly with our designers and suppliers,
                    and sell direct to you, which means quality, exclusive
                    products, at a price anyone can afford.</p>
                  <span class="time_date"> 11:01 AM    |    Today</span></div>
              </div>
            </div>
          </div>
          <div class="type_msg">
            <div class="input_msg_write">
              <input type="text" class="write_msg" placeholder="Type a message" />
              <button class="msg_send_btn bg-dark" type="button"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>
            </div>
          </div>
        </div>
        </div>
        </div></div>`;
        body.appendChild(this.createNewMessagePopupElement());
    }

    private updateDialogHtmlElement(message: IMessage): void {
        document.getElementById(
            (message.senderId === this.myId ? message.receiverLogin : message.senderLogin) + "_message"
        ).innerText = message.text;


    }

    private createDialogHtmlElement(message: IMessage): HTMLDivElement {
        let dialogEl: HTMLDivElement = document.createElement("div");
        let loginEl: HTMLDivElement = document.createElement("div");
        let lastMessageEl: HTMLDivElement = document.createElement("div");

        dialogEl.id = message.dialogId;
        dialogEl.className = "person";
        dialogEl.onclick = () => this.openMessageHistory(dialogEl.id);

        loginEl.id = message.senderId === this.myId ? message.receiverLogin : message.senderLogin;
        loginEl.className = "users_login";
        loginEl.innerText = message.senderId === this.myId ? message.receiverLogin : message.senderLogin;

        lastMessageEl.id = (message.senderId === this.myId ? message.receiverLogin : message.senderLogin) + "_message";
        lastMessageEl.className = "last_message";
        lastMessageEl.innerText = message.text;

        dialogEl.appendChild(loginEl);
        dialogEl.appendChild(lastMessageEl);

        return dialogEl;
    }
}
