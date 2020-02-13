import {WebSocketClient} from "../utils/webSocketClient";
import {IUser} from "../utils/templates/iUser";

export class NewMessageBlock {

    private webSocket: WebSocketClient;
    private user: IUser;
    private myData: {myId: string, myUsername: string};

    constructor(webSocket: WebSocketClient, user: any) {
        this.webSocket = webSocket;
        this.myData = webSocket.getMyData()
        this.user = user;
        this.render();
    }

    private render(): void {
        let sendNewMessageBlock: HTMLDivElement = document.createElement("div");
        sendNewMessageBlock.id = "send_new_message_block";

        sendNewMessageBlock.appendChild(this.createReceiverInfoBlock());
        sendNewMessageBlock.appendChild(this.createSendNewMessageField());
        sendNewMessageBlock.appendChild(this.createSendNewMessageButtonsBlock());
        document.body.appendChild(sendNewMessageBlock);
    }

    private createReceiverInfoBlock(): HTMLDivElement {
        let receiverInfoBlock: HTMLDivElement = document.createElement("div");
        receiverInfoBlock.id = "receiver_info";
        receiverInfoBlock.innerText = `Send message to ${this.user.login}`;
        return receiverInfoBlock;
    }

    private createSendNewMessageField(): HTMLTextAreaElement {
        let sendNewMessageField: HTMLTextAreaElement = document.createElement("textarea");
        sendNewMessageField.id = "send_new_message_field";
        return sendNewMessageField;
    }

    private createSendNewMessageButtonsBlock(): HTMLDivElement {
        let sendNewMessageButtonsBlock: HTMLDivElement = document.createElement("div");
        sendNewMessageButtonsBlock.id = "send_new_message_buttons";
        let sendButton: HTMLButtonElement = document.createElement("button");
        sendButton.id = "send_new_message_button";
        sendButton.innerText = "Send";
        sendButton.addEventListener("click", () => this.onClickSend());
        let cancelButton: HTMLButtonElement = document.createElement("button");
        cancelButton.id = "cancel_button";
        cancelButton.innerText = "Cancel";
        cancelButton.addEventListener("click", () => this.onClickCancel());
        sendNewMessageButtonsBlock.appendChild(sendButton);
        sendNewMessageButtonsBlock.appendChild(cancelButton);
        return sendNewMessageButtonsBlock;
    }

    private onClickSend = (): void => {
        let message: IMessage = {
            dialogId: "0",
            receiverId: this.user.id,
            receiverLogin: this.user.login,
            senderId: this.myData.myId,
            senderLogin: this.myData.myUsername,
            text: (<HTMLTextAreaElement> document.getElementById("send_new_message_field")).value,
            timestamp: Date.now().toString()
        };
        this.webSocket.sendMessage(JSON.stringify(message));

    };

    private onClickCancel = (): void => {
        document.getElementById("send_new_message_block").remove();
    };
}