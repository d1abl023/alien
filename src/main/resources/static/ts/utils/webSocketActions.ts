import {Stomp} from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
import {MessagesPage} from "../ui/messagesPage";

export class WebSocketActions {

    static myUsername;
    static myId;
    static stompClient;

    /**
     * Function that perform connection to WebSocket
     */
    static connect = function () {
        let socket = new SockJS('/ws');
        WebSocketActions.stompClient = Stomp.over(socket);

        console.log("Trying to connect to the server...");

        $.ajax({
            url: "get_id",
            type: "GET",
            complete: (function (data) {
                WebSocketActions.myId = data.responseText;
            })
        });

        $.ajax({
            url: "get_username",
            type: "GET",
            complete: (function (data) {
                WebSocketActions.myUsername = data.responseText;
            })
        });

        WebSocketActions.stompClient.connect({}, WebSocketActions.onConnected, WebSocketActions.onError);
    };

    /**
     * Function that is called when connection was successfully established*/
    static onConnected = function () {

        console.log("User has been successfully connected.");

        WebSocketActions.stompClient.subscribe("/user/queue/privateMessages", WebSocketActions.onMessageReceived);
        WebSocketActions.stompClient.subscribe("/user/queue/privateMessagesErrors", WebSocketActions.onMessageErrorsReceived);
    };

    static onError = function () {
        window.alert('Could not connect to server. Please refresh this page!');
    };

    /**
     * Function that sends private message for certain user to "/app/privateMessage" channel
     *
     * @param message should be an JSON object
     * */
    static sendMessage = function (message) {
        WebSocketActions.stompClient.send("/app/privateMessage", {}, JSON.stringify(message));
    };

    static onMessageReceived = function (payload) {
        let message = JSON.parse(payload.body);
        document.title === "Messages" ? WebSocketActions.manageMessageInDialogs(message) : WebSocketActions.showPopUp(message);
    };

    static onMessageErrorsReceived = function (payload) {
        let message = JSON.parse(payload.body);
        WebSocketActions.showPopUpWithSendingError(message);
    };

    static showPopUpWithSendingError(message) {
        console.log("Error: " + message);
    }

    static showPopUp(message) {
        if (message["senderId"] === WebSocketActions.myId) {
            document.getElementById("sender_username").innerText = "Message has been send.";
        } else {
            document.getElementById("sender_username").innerText = "New message from " + message["senderLogin"];
        }
        document.getElementById("part_of_message_text").innerText = message.text;
        document.getElementById("newMessagePopUp").style.visibility = "visible";

        setTimeout(function () {
            document.getElementById("newMessagePopUp").style.visibility = "hidden";
        }, 5000);
    }

    static manageMessageInDialogs(message) {
        MessagesPage.addMessageToMessageList(message);
        if (message["dialogId"] !== MessagesPage.isOpenedDialogId) {
            if (message["receiverId"] !== WebSocketActions.myId) {
                WebSocketActions.showPopUp(message);
            }
        }
    }
}