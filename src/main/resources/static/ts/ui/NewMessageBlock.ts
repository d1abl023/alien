import {WebSocketClient} from "../utils/WebSocketClient";
import {IUser} from "../utils/templates/IUser";
import * as $ from "jquery";

export class NewMessageBlock {

    private webSocket: WebSocketClient;
    private user: { receiverShortName: string, receiverId: string };
    private myData: { myId: string, myUsername: string };

    constructor(webSocket: WebSocketClient, user: { receiverShortName: string, receiverId: string }) {
        this.webSocket = webSocket;
        this.myData = webSocket.getMyData();
        this.user = user;
        this.render();
    }

    private render(): void {
        let sendNewMessageBlock: HTMLDivElement = document.createElement("div");
        sendNewMessageBlock.id = "send_new_message_block";
        sendNewMessageBlock.className = "flex-column";
        sendNewMessageBlock.innerHTML = `
            <h3 id="receiver_info" class="text-dark justify-content-center">Send message to ${this.user.receiverShortName}</h3>
            <textarea id="send_new_message_field"></textarea>`;


        // sendNewMessageBlock.appendChild(this.createReceiverInfoBlock());
        // sendNewMessageBlock.appendChild(this.createSendNewMessageField());
        sendNewMessageBlock.appendChild(this.createSendNewMessageButtonsBlock());
        $("#body").append(sendNewMessageBlock);
    }

    private createReceiverInfoBlock(): HTMLDivElement {
        let receiverInfoBlock: HTMLDivElement = document.createElement("div");
        receiverInfoBlock.id = "receiver_info";
        receiverInfoBlock.innerText = `Send message to ${this.user.receiverShortName}`;
        return receiverInfoBlock;
    }

    private createSendNewMessageField(): HTMLTextAreaElement {
        let sendNewMessageField: HTMLTextAreaElement = document.createElement("textarea");
        sendNewMessageField.id = "send_new_message_field";
        return sendNewMessageField;
    }

    private createSendNewMessageButtonsBlock(): HTMLDivElement {
        let sendButton: HTMLButtonElement = document.createElement("button");
        sendButton.id = "send_new_message_button";
        sendButton.className = "btn btn-success send_new_message_block_button";
        sendButton.innerText = "Send";
        sendButton.addEventListener("click", () => this.onClickSend());

        let cancelButton: HTMLButtonElement = document.createElement("button");
        cancelButton.id = "cancel_button";
        cancelButton.className = "btn btn-danger send_new_message_block_button";
        cancelButton.innerText = "Cancel";
        cancelButton.addEventListener("click", () => this.onClickCancel());

        let sendNewMessageButtonsBlock: HTMLDivElement = document.createElement("div");
        sendNewMessageButtonsBlock.id = "send_new_message_buttons";
        sendNewMessageButtonsBlock.className = "col-12 justify-content-center";
        sendNewMessageButtonsBlock.appendChild(sendButton);
        sendNewMessageButtonsBlock.appendChild(cancelButton);
        return sendNewMessageButtonsBlock;
    }

    private onClickSend = (): void => {
        let message: IMessage = {
            dialogId: "0",
            receiverId: this.user.receiverId,
            receiverLogin: this.user.receiverShortName,
            senderId: this.myData.myId,
            senderLogin: this.myData.myUsername,
            text: $("#send_new_message_field").val().toString(),
            timestamp: Date.now().toString()
        };
        this.webSocket.sendMessage(JSON.stringify(message));
        $("#send_new_message_block").remove();
    };

    private onClickCancel = (): void => {
        $("#send_new_message_block").remove();
    };
}