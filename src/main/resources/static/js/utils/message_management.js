let username;
let myId;

/**
 * Function that perform connection to WebSocket
 */
const connect = function () {
    let socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);

    console.log("Trying to connect to the server...");

    $.ajax({
        url: "get_id",
        type: "GET",
        complete: (function (data) {
            myId = data.responseText;
        })
    });

    $.ajax({
        url: "get_username",
        type: "GET",
        complete: (function (data) {
            username = data.responseText;
        })
    });

    stompClient.connect({}, onConnected, onError);
};

/**
 * Function that is called when connection was successfully established*/
const onConnected = function () {

    console.log("User has been successfully connected.");

    stompClient.subscribe("/user/queue/privateMessages", onMessageReceived);
    stompClient.subscribe("/user/queue/privateMessagesErrors", onMessageErrorsReceived);
};

const onError = function () {
    window.alert('Could not connect to server. Please refresh this page!');
};

/**
 * Function that sends private message to a certain user
 *
 * @param message should be an JSON object
 * */
const sendMessage = function (message) {
    stompClient.send("/app/privateMessage", {}, JSON.stringify(message));
};

const onMessageReceived = function (payload) {
    let message = JSON.parse(payload.body);
    document.title === "Messages" ? manageMessageInDialogs(message) : showPopUp(message);
};

const onMessageErrorsReceived = function (payload) {
    let message = JSON.parse(payload.body);
    showPopUpWithSendingError(message);
};

function showPopUpWithSendingError(message) {
    console.log("Error: " + message);
}

function showPopUp(message) {
    console.log(message);

    $.ajax({
        url: "get_username_by_id",
        type: "POST",
        data: message.senderId,
        contentType: "text/plain; charset=utf-8",
        complete: (function (data) {
            if (message.sender === myId) {
                document.getElementById("sender_username").innerText = "Message has been send.";
            } else {
                document.getElementById("sender_username").innerText = "New message from " + data.responseText;
            }
            document.getElementById("part_of_message_text").innerText = message.text;
            document.getElementById("newMessagePopUp").style.visibility = "visible";

            setTimeout(function () {
                document.getElementById("newMessagePopUp").style.visibility = "hidden";
            }, 5000);
        })
    })
}

function manageMessageInDialogs(message) {
    console.log("<<<<<<< manageMessageInDialogs");
    showPopUp(message);
}
