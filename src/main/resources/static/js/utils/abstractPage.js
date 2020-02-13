"use strict";
exports.__esModule = true;
var AbstractPage = /** @class */ (function () {
    function AbstractPage() {
    }
    AbstractPage.prototype.createNewMessagePopupElement = function () {
        var popUp = document.createElement("div");
        popUp.id = "newMessagePopUp";
        popUp.className = "popup";
        var senderUsername = document.createElement("div");
        senderUsername.id = "sender_username";
        var partOfMessageText = document.createElement("div");
        partOfMessageText.id = "part_of_message_text";
        popUp.append(senderUsername, partOfMessageText);
        return popUp;
    };
    return AbstractPage;
}());
exports.AbstractPage = AbstractPage;
