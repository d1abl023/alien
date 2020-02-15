'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var $ = require("jquery");
var abstractPage_1 = require("../utils/abstractPage");
var webSocketClient_1 = require("../utils/webSocketClient");
var MessagesPage = /** @class */ (function (_super) {
    __extends(MessagesPage, _super);
    function MessagesPage() {
        var _this = _super.call(this) || this;
        _this.manageIncomingMessage = function (message) {
            if (message.dialogId === _this.isOpenedDialogId) {
                _this.addMessageToMessageList(message);
                _this.updateDialogHtmlElement(message);
            }
            else {
                _this.updateDialogHtmlElement(message);
                _this.webSocketClient.showPopUp(message);
            }
        };
        /**
         * On window is loaded first app tries to get username of current user.
         * After, if username has been successfully fetched,
         * app tries to subscribe to topic where it will receive messages from.
         */
        _this.onMessagesPageLoad = function () {
            $.ajax({
                url: "get_id",
                type: "GET"
            }).then(function (data) {
                _this.myId = data;
                _this.requestDialogList();
            });
            $.ajax({
                url: "get_username",
                type: "GET"
            }).then(function (data) {
                _this.myUsername = data;
            });
            document.getElementById("send_message_button").addEventListener('click', _this.send, true);
        };
        _this.send = function () {
            var SEND_MESSAGE_FIELD = document.getElementById("send_message_field");
            var message = {
                dialogId: _this.isOpenedDialogId,
                senderId: _this.myId,
                receiverId: _this.isOpenedInterlocutorId,
                text: SEND_MESSAGE_FIELD.value,
                senderLogin: _this.myUsername,
                receiverLogin: _this.isOpenedInterlocutorUsername,
                timestamp: Date.now().toString()
            };
            _this.webSocketClient.sendMessage(JSON.stringify(message));
            SEND_MESSAGE_FIELD.value = "";
        };
        _this.render();
        _this.webSocketClient = new webSocketClient_1.WebSocketClient();
        _this.webSocketClient.manageIncomingMessage = _this.manageIncomingMessage;
        _this.onMessagesPageLoad();
        return _this;
    }
    MessagesPage.prototype.requestDialogList = function () {
        var _this = this;
        $.ajax({
            url: "/get_dialog_list",
            type: "GET"
        }).then(function (data) {
            _this.dialogs = data;
            for (var dialogId in _this.dialogs) {
                if (_this.dialogs.hasOwnProperty(dialogId)) {
                    document.getElementById("conversations_list")
                        .appendChild(_this.createDialogHtmlElement(_this.dialogs[dialogId]));
                }
            }
        });
    };
    /**
     * Function openMessageHistory() request from the server message history and
     * show messages on front-end
     */
    MessagesPage.prototype.openMessageHistory = function (dialogId) {
        var _this = this;
        if (this.dialogs[dialogId]) {
            this.isOpenedDialogId = dialogId;
            var lastMessage = this.dialogs[dialogId];
            if (lastMessage.senderId === this.myId) {
                this.isOpenedInterlocutorUsername = lastMessage.receiverLogin;
                this.isOpenedInterlocutorId = lastMessage.receiverId;
            }
            else {
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
                contentType: "text/plain; charset=utf-8"
            }).then(function (data) {
                console.log(data);
                var response = data;
                // Iterating over array of received messages
                for (var msg in response) {
                    if (response.hasOwnProperty(msg)) {
                        _this.addMessageToMessageList(response[msg]);
                    }
                }
                document.getElementById("messages_list").scrollTop =
                    document.getElementById("messages_list").scrollHeight;
            });
        }
        else {
            console.error("Missing dialog with id: " + dialogId);
        }
    };
    MessagesPage.prototype.addMessageToMessageList = function (msg) {
        var messageList = document.getElementById("messages_list");
        var sender = document.createElement("div");
        sender.classList.add("sender_username");
        sender.innerText = msg.senderLogin;
        var timestamp = document.createElement("div");
        timestamp.classList.add("timestamp");
        var date = new Date(Number(msg.timestamp));
        var minutes = date.getMinutes();
        timestamp.innerText = date.getHours() + ":" + (minutes.toString().length === 2 ? minutes.toString() : "0" + minutes);
        var messageText = document.createElement("div");
        messageText.classList.add("message_text");
        messageText.innerText = msg.text;
        var messageBody = document.createElement("div");
        // messageBody.appendChild(sender);
        messageBody.appendChild(messageText);
        var message = document.createElement("div");
        if (msg.senderId === this.myId) {
            messageBody.className = "outgoing_msg_body";
            message.className = "outgoing_message";
        }
        else {
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
    };
    MessagesPage.prototype.render = function () {
        var body = document.createElement("div");
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
    };
    MessagesPage.prototype.updateDialogHtmlElement = function (message) {
        document.getElementById((message.senderId === this.myId ? message.receiverLogin : message.senderLogin) + "_message").innerText = message.text;
    };
    MessagesPage.prototype.createDialogHtmlElement = function (message) {
        var _this = this;
        var dialogEl = document.createElement("div");
        var loginEl = document.createElement("div");
        var lastMessageEl = document.createElement("div");
        dialogEl.id = message.dialogId;
        dialogEl.className = "person";
        dialogEl.onclick = function () { return _this.openMessageHistory(dialogEl.id); };
        loginEl.id = message.senderId === this.myId ? message.receiverLogin : message.senderLogin;
        loginEl.className = "users_login";
        loginEl.innerText = message.senderId === this.myId ? message.receiverLogin : message.senderLogin;
        lastMessageEl.id = (message.senderId === this.myId ? message.receiverLogin : message.senderLogin) + "_message";
        lastMessageEl.className = "last_message";
        lastMessageEl.innerText = message.text;
        dialogEl.appendChild(loginEl);
        dialogEl.appendChild(lastMessageEl);
        return dialogEl;
    };
    return MessagesPage;
}(abstractPage_1.AbstractPage));
exports.MessagesPage = MessagesPage;
