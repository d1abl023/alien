import {Stomp} from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
import * as $ from "jquery";
import jqXHR = JQuery.jqXHR;


export class WebSocketActions {

    private myUsername;
    private myId;
    private stompClient;

    /**
     * Function that perform connection to WebSocket
     */
    public connect = (): void => {
        let socket = new SockJS('/ws');
        this.stompClient = Stomp.over(socket);

        console.log("Trying to connect to the server...");

        $.ajax({
            url: "get_id",
            type: "GET"
        }).then((data: jqXHR<any>): void => {
            this.myId = data.responseText;
        });

        $.ajax({
            url: "get_username",
            type: "GET"
        }).then((data: jqXHR<any>): void => {
            this.myUsername = data.responseText;
        });

        this.stompClient.connect({}, this.onConnected, this.onError);
    };

    public onConnected = (): void => {
        console.log("User has been successfully connected.");
        this.stompClient.subscribe("/user/queue/privateMessages", this.onMessageReceived);
        this.stompClient.subscribe("/user/queue/privateMessagesErrors", this.onMessageErrorsReceived);
    };

    public onError = (): void => {
        window.alert('Could not connect to server. Please refresh this page!');
    };

    /**
     * Function that sends private message for certain user to "/app/privateMessage" channel
     *
     * @param message should be an JSON object
     * */
    public sendMessage = (message): void => {
        this.stompClient.send("/app/privateMessage", {}, JSON.stringify(message));
    };

    public onMessageReceived = (payload): void => {
        this.manageIncomingMessage(JSON.parse(payload.body));
    };

    public onMessageErrorsReceived = (payload): void => {
        let message = JSON.parse(payload.body);
        this.showPopUpWithSendingError(message);
    };

    // TODO: to implement popup rendering in HTML page
    public showPopUpWithSendingError = (message): void => {
        console.log("Error: " + message);
    };

    public showPopUp = (message): void => {
        if (message["senderId"] === this.myId) {
            document.getElementById("sender_username").innerText = "Message has been send.";
        } else {
            document.getElementById("sender_username").innerText = "New message from " + message["senderLogin"];
        }
        document.getElementById("part_of_message_text").innerText = message.text;
        document.getElementById("newMessagePopUp").style.visibility = "visible";

        setTimeout(function () {
            document.getElementById("newMessagePopUp").style.visibility = "hidden";
        }, 5000);
    };

    public manageIncomingMessage = (message): void => {
        this.showPopUp(message);
    }

}
