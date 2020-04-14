import {Logger} from "./Logger";
import * as $ from "jquery";

export class WebSocketClient {

    private WS_PATH: string = "ws://localhost:8080/websocket";
    private webSocket: WebSocket = new WebSocket(this.WS_PATH);
    private readonly myId: string;
    private readonly myShortName: string;

    constructor(myId: string, myShortName: string) {
        this.myId = myId;
        this.myShortName = myShortName;
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
            $("#sender_username").html(`Message has been send.`);
        } else {
            $("#sender_username").html(`New message from ${message.senderLogin}`);
        }
        $("#part_of_message_text").html(message.text);
        $("#newMessagePopUp").css("visibility","visible");

        setTimeout(function () {
            $("#newMessagePopUp").css("visibility","hidden");
        }, 5000);

    };

    public manageIncomingMessage = (message): void => {
        this.showPopUp(message);
    };

    public getMyData = (): { myId: string, myShortName: string } => {
        return {myId: this.myId, myShortName: this.myShortName}
    }
}