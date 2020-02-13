"use strict";
exports.__esModule = true;
var uiManager_1 = require("../uiManager");
var Header = /** @class */ (function () {
    function Header() {
        this.renderHeader();
        this.setListenersForHeaderButtons();
    }
    Header.prototype.logout = function () {
        document.cookie = "authToken= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "refreshToken= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "application.html";
    };
    Header.prototype.goToMessages = function () {
        document.getElementById("body").remove();
        uiManager_1.uiManager.getPage({ pageName: "messages" });
    };
    Header.prototype.goToProfile = function () {
        document.getElementById("body").remove();
        uiManager_1.uiManager.getPage({ pageName: "profile", user: "my" });
    };
    Header.prototype.goToSearch = function () {
        document.getElementById("body").remove();
        uiManager_1.uiManager.getPage({ pageName: "search" });
    };
    Header.prototype.renderHeader = function () {
        var header = document.createElement("div");
        header.id = "header";
        header.innerHTML =
            '<div id="header_blocks">' +
                '<button id="user_profile_button" type="button">My profile</button>' +
                '<button id="messages_button" type="button">Messages</button>' +
                '<button id="search_button" type="button">Search</button>' +
                '<button id="logout_button" type="button">Log out</button>' +
                '</div>';
        if (document.getElementById("header")) {
            document.getElementById("header").remove();
        }
        document.body.appendChild(header);
    };
    Header.prototype.setListenersForHeaderButtons = function () {
        document.getElementById("user_profile_button").addEventListener("click", this.goToProfile);
        document.getElementById("messages_button").addEventListener("click", this.goToMessages);
        document.getElementById("search_button").addEventListener("click", this.goToSearch);
        document.getElementById("logout_button").addEventListener("click", this.logout);
    };
    return Header;
}());
exports.Header = Header;
