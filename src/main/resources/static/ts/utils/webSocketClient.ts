import {Logger} from "./logger";
import * as $ from "jquery";

export class WebSocketClient {

    private WS_PATH: string = "ws://localhost:8080/websocket";
    private webSocket: WebSocket = new WebSocket(this.WS_PATH);
    private readonly myId: string;
    private readonly myUsername: string;

    constructor(myId: string, myUsername: string) {
        this.myId = myId;
        this.myUsername = myUsername;
        this.webSocket.onmessage = this.onMessage;
        this.webSocket.onclose = this.onClose;
        this.webSocket.onerror = this.onError;
        this.webSocket.onopen = this.onOpen;
    }

    private onOpen = (): void => {
        Logger.info("WebSocket connected on: " + this.WS_PATH);
    };

    private onClose = (): void => {
        Logger.info("Connection closed");
    };

    private onError = (event): void => {
        Logger.error(`Connection error: ${event.data}`)
    };

    public sendMessage = (message: string): void => {
        this.webSocket.readyState === WebSocket.OPEN ?
            this.webSocket.send(message) : console.error("No connection. Cannot send messages.");
    };

    public getState = (): number => {
        return this.webSocket.readyState;
    };

    public onMessage = (event): void => {
        Logger.info(`Received message: "${event.data}"`);
        this.manageIncomingMessage(JSON.parse(event.data));
    };

    public showPopUp = (message: IMessage): void => {
        if (message.senderId === this.myId) {
            document.getElementById("sender_username").innerText = "Message has been send.";
        } else {
            document.getElementById("sender_username").innerText = "New message from " + message.senderLogin;
        }
        document.getElementById("part_of_message_text").innerText = message.text;
        document.getElementById("newMessagePopUp").style.visibility = "visible";

        setTimeout(function () {
            document.getElementById("newMessagePopUp").style.visibility = "hidden";
        }, 5000);
    };

    public manageIncomingMessage = (message): void => {
        this.showPopUp(message);
    };

    public getMyData = (): { myId: string, myUsername: string } => {
        return {myId: this.myId, myUsername: this.myUsername}
    }
}