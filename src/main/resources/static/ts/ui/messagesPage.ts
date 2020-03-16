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
                    document.getElementById("people_list")
                        .appendChild(this.createDialogHtmlElement(this.dialogs[dialogId]));
                }
            }
            let keys = Object.keys(this.dialogs);
            if (keys.length > 0) {
              this.openMessageHistory(keys[0]);
            }
        });
    }

    /**
     * Function openMessageHistory() request from the server message history and
     * show messages on front-end
     */
    public openMessageHistory(dialogId) {

        document.getElementById(`${dialogId}_dialog`).className = "chat_list active_chat";
        if(this.isOpenedDialogId) {
          document.getElementById(`${this.isOpenedDialogId}_dialog`).className = "chat_list";
        }

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

            document.getElementById("dialog_history").innerText = "";
          
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
                document.getElementById("dialog_history").scrollTop =
                    document.getElementById("dialog_history").scrollHeight;
            });
        } else {
            console.error("Missing dialog with id: " + dialogId);
        }
    }

    public send = (): void => {
        const SEND_MESSAGE_FIELD: HTMLInputElement =
            <HTMLInputElement>document.querySelector("textarea.write_msg");
        let text: string = SEND_MESSAGE_FIELD.value.trim();

        if (text.length > 0) {
          let message: IMessage = {
            dialogId: this.isOpenedDialogId,
            senderId: this.myId,
            receiverId: this.isOpenedInterlocutorId,
            text: text,
            senderLogin: this.myUsername,
            receiverLogin: this.isOpenedInterlocutorUsername,
            timestamp: Date.now().toString()
          };
          this.webSocketClient.sendMessage(JSON.stringify(message));
        }

        SEND_MESSAGE_FIELD.value = "";
    };

    public addMessageToMessageList(msg: IMessage) {
        const date: Date = new Date(Number(msg.timestamp));
        const minutes: number = date.getMinutes();
        const stringDate = ` ${date.getHours()}:${minutes.toString().length === 2 ? minutes.toString() : "0" + minutes}   |    ${date.getMonth()} / ${date.getDate()}`;
        let message: HTMLDivElement = document.createElement("div");

        if(msg.senderId === this.myId){
          message.innerHTML = `
            <div class="outgoing_msg">
              <div class="sent_msg">
                <p class="bg-dark">${msg.text}</p>
                <span class="time_date">${stringDate}</span> 
              </div>
            </div>`
        } else {
          message.innerHTML = `<div class="incoming_msg">
        <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
        <div class="received_msg">
          <div class="received_withd_msg">
            <p>${msg.text}</p>
            <span class="time_date"> ${stringDate}</span>
          </div>
        </div>
      </div>`;
        }

        let messageList: HTMLElement = document.getElementById("dialog_history");
        messageList.appendChild(message);
        messageList.scrollTop = messageList.scrollHeight;
    }

    public render(): void {
        let body: HTMLElement = document.getElementById("body");
        body.innerHTML = `
        <div class="col-md-2"></div>
        <div class="inbox_msg col-md-8" style="height: ${$(window).height() - 60}px;">
        <div class="inbox_people h-100 col-4">
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
          <div id="people_list" class="inbox_chat"></div>
        </div>
        <div class="mesgs h-100 col-8">
          <div id="dialog_history" class="msg_history" style="height: ${$(window).height() - 210}px;"></div>
          <div class="type_msg">
            <div class="input_msg_write w-100">
              <textarea class="write_msg" placeholder="Type a message"></textarea>
              <button class="msg_send_btn bg-dark" type="button"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>
            </div>
          </div>
        </div>
        </div>
        <div class="col-md-2"></div>`;
        body.appendChild(this.createNewMessagePopupElement());
        document.querySelector("button.msg_send_btn.bg-dark").addEventListener("click", this.send);
    }

    private updateDialogHtmlElement(message: IMessage): void {
        let msgDate = new Date(Number(message.timestamp));
        document.getElementById(`${message.dialogId}_last_message_date`).innerHTML = `${msgDate.getMonth()} / ${msgDate.getDate()}`;
        document.getElementById(`${message.dialogId}_last_message`).innerText = message.text;
        let dialog: HTMLDivElement = (document.getElementById(`${message.dialogId}_dialog`).cloneNode(true) as HTMLDivElement);
        dialog.onclick = () => this.openMessageHistory(message.dialogId);
        document.getElementById(`${message.dialogId}_dialog`).remove();
        document.getElementById(`people_list`).prepend(dialog);
    }

    private createDialogHtmlElement(message: IMessage): HTMLDivElement {
        let dialogEl: HTMLDivElement = document.createElement("div");
        let chatPeopleEl: HTMLDivElement = document.createElement("div");
        let avatarEl: HTMLDivElement = document.createElement("div");
        let chatIbEl: HTMLDivElement = document.createElement("div");
        let imgEl: HTMLImageElement = document.createElement("img");
        let dateEl: HTMLSpanElement = document.createElement("span");
        let nameEl: HTMLElement = document.createElement("h5");
        let textEl: HTMLElement = document.createElement("p");
        
        imgEl.src = "https://ptetutorials.com/images/user-profile.png";
        imgEl.alt = "avatar";

        avatarEl.id = (message.senderId === this.myId ? message.receiverLogin : message.senderLogin) + "_avatar";
        avatarEl.className = "chat_img";
        avatarEl.appendChild(imgEl);

        let msgDate = new Date(Number(message.timestamp));
        dateEl.id = `${message.dialogId}_last_message_date`;
        dateEl.className = "chat_date";
        dateEl.innerHTML = `${msgDate.getMonth()} / ${msgDate.getDate()}`;

        nameEl.innerHTML = message.senderId === this.myId ? message.receiverLogin : message.senderLogin;
        nameEl.appendChild(dateEl);

        textEl.id = `${message.dialogId}_last_message`;
        textEl.innerHTML = message.text;

        chatIbEl.className = "chat_ib";
        chatIbEl.appendChild(nameEl);
        chatIbEl.appendChild(textEl);
    
        chatPeopleEl.className = "chat_people";
        chatPeopleEl.appendChild(avatarEl);
        chatPeopleEl.appendChild(chatIbEl);

        dialogEl.id = `${message.dialogId}_dialog`;
        dialogEl.className = "chat_list";
        dialogEl.onclick = () => this.openMessageHistory(message.dialogId);
        dialogEl.appendChild(chatPeopleEl);

        return dialogEl;
    }
}
