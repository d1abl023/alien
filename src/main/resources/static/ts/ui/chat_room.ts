//'use strict';
import { Stomp } from "@stomp/stompjs";
import { SockJS } from "sockjs";

var chatPage = document.getElementById('#chat-page');
var messageList = document.getElementById('#message_list');
var messageInput = <HTMLInputElement>document.getElementById('#message');
var messageForm = document.getElementById('#message_form');
var sendMessageButton = document.getElementById('#send_message_button');
var connectingElement = document.getElementById('.connecting');

var stompClient = null;
var username = null;


function getUserLogin() {
    $.ajax({
        async: false,
        url: "/get_user_id",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        complete: (function (data) {
            if (data) {
                username = data.responseText;
            }
        })
    });
}


function connect(event) {

    if (!username) {
        getUserLogin();
    }

    if (username) {
        var socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}

function onConnected() {

    //Subscribe to the public topic
    stompClient.subscribe('/topic/public', onMessageReceived);

    //Tell username of use to the server
    stompClient.send("/app/chat.addUser", {},
        JSON.stringify({
            sender: username,
            type: 'JOIN'
        })
    );

    //    connectingElement.classList.add('hidden');
}

function onError() {
    connectingElement.textContent = 'Could not connect to server. Please refresh this page!';
    connectingElement.style.color = 'red';
}

function sendMessage(event) {

    var message = messageInput.value;

    if (message.trim() && stompClient) {
        var chatMesage = {
            sender: username,
            content: message,
            type: 'CHAT'
        };


        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMesage));
        messageInput.value = '';
    }

    event.preventDefault();
}

// @ts-ignore
function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var node = document.createElement('div');

    if (message.type === 'JOIN') {
        var textNode = document.createTextNode(message.sender + ' joined!');
        node.appendChild(textNode);
        node.className = 'announcement_message';
    } else if (message.type === 'LEAVE') {
        var textNode = document.createTextNode(message.sender + ' left!');
        node.appendChild(textNode);
        node.className = 'announcement_message';
    } else {
        if (username === message.sender) {
            node.className = 'outgoing_message';

        } else {
            node.className = 'incoming_message';
        }
        node.appendChild(document.createTextNode(message.sender + ': ' + message.content));
    }

    messageList.appendChild(node);
}

const openMessageHistory = function (login) {

};

if (window.addEventListener) {
    window.addEventListener('load', connect, true); //W3C
} else {
    window.onload = connect;
}
sendMessageButton.addEventListener('click', sendMessage, true);
