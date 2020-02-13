"use strict";
exports.__esModule = true;
var stompjs_1 = require("@stomp/stompjs");
var SockJS = require("sockjs-client");
var $ = require("jquery");
var WebSocketActions = /** @class */ (function () {
    function WebSocketActions() {
        var _this = this;
        /**
         * Function that perform connection to WebSocket
         */
        this.connect = function () {
            var socket = new SockJS('/ws');
            _this.stompClient = stompjs_1.Stomp.over(socket);
            console.log("Trying to connect to the server...");
            $.ajax({
                url: "get_id",
                type: "GET"
            }).then(function (data) {
                _this.myId = data.responseText;
            });
            $.ajax({
                url: "get_username",
                type: "GET"
            }).then(function (data) {
                _this.myUsername = data.responseText;
            });
            _this.stompClient.connect({}, _this.onConnected, _this.onError);
        };
        this.onConnected = function () {
            console.log("User has been successfully connected.");
            _this.stompClient.subscribe("/user/queue/privateMessages", _this.onMessageReceived);
            _this.stompClient.subscribe("/user/queue/privateMessagesErrors", _this.onMessageErrorsReceived);
        };
        this.onError = function () {
            window.alert('Could not connect to server. Please refresh this page!');
        };
        /**
         * Function that sends private message for certain user to "/app/privateMessage" channel
         *
         * @param message should be an JSON object
         * */
        this.sendMessage = function (message) {
            _this.stompClient.send("/app/privateMessage", {}, JSON.stringify(message));
        };
        this.onMessageReceived = function (payload) {
            _this.manageIncomingMessage(JSON.parse(payload.body));
        };
        this.onMessageErrorsReceived = function (payload) {
            var message = JSON.parse(payload.body);
            _this.showPopUpWithSendingError(message);
        };
        // TODO: to implement popup rendering in HTML page
        this.showPopUpWithSendingError = function (message) {
            console.log("Error: " + message);
        };
        this.showPopUp = function (message) {
            if (message["senderId"] === _this.myId) {
                document.getElementById("sender_username").innerText = "Message has been send.";
            }
            else {
                document.getElementById("sender_username").innerText = "New message from " + message["senderLogin"];
            }
            document.getElementById("part_of_message_text").innerText = message.text;
            document.getElementById("newMessagePopUp").style.visibility = "visible";
            setTimeout(function () {
                document.getElementById("newMessagePopUp").style.visibility = "hidden";
            }, 5000);
        };
        this.manageIncomingMessage = function (message) {
            _this.showPopUp(message);
        };
    }
    return WebSocketActions;
}());
exports.WebSocketActions = WebSocketActions;
