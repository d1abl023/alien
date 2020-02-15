"use strict";
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
var uiManager_1 = require("../uiManager");
var $ = require("jquery");
var abstractPage_1 = require("../utils/abstractPage");
var webSocketClient_1 = require("../utils/webSocketClient");
var newMessageBlock_1 = require("./newMessageBlock");
var SearchPage = /** @class */ (function (_super) {
    __extends(SearchPage, _super);
    function SearchPage() {
        var _this = _super.call(this) || this;
        _this.search = function () {
            document.getElementById("search_results").innerText = "";
            var searchVal = document.getElementById("search_field").value;
            $.ajax({
                url: "search",
                type: "POST",
                data: searchVal,
                contentType: "text/plain; charset=utf-8"
            }).then(function (users) {
                _this.processSearchResponse(users);
            });
        };
        _this.processSearchResponse = function (users) {
            _this.users = users;
            var amountOfRemainingKeys = Object.keys(_this.users).length;
            var userLineCounter = 0;
            var line = document.createElement("div");
            line.className = "line";
            for (var user in _this.users) {
                if (amountOfRemainingKeys > 0) {
                    line.appendChild(_this.createUserBlock(_this.users[user]));
                    userLineCounter++;
                    amountOfRemainingKeys--;
                    if (userLineCounter === 2 || (userLineCounter === 1 && amountOfRemainingKeys === 0)) {
                        $("#search_results").append(line);
                        line = document.createElement("div");
                        line.className = "line";
                        userLineCounter = 0;
                    }
                }
            }
        };
        _this.openProfile = function (id) {
            uiManager_1.uiManager.getPage({ pageName: "profile", user: id });
        };
        _this.render();
        _this.webSocketClient = new webSocketClient_1.WebSocketClient();
        return _this;
    }
    SearchPage.prototype.createUserBlock = function (userEntity) {
        var _this = this;
        var login = document.createElement("div");
        login.className = "login";
        login.innerText = userEntity.login;
        var location = document.createElement("div");
        location.className = "location";
        location.innerText = userEntity.country + ", " + userEntity.city;
        var openProfileButton = document.createElement("button");
        openProfileButton.className = "open_profile_button";
        openProfileButton.addEventListener("click", function (e) { return _this.openProfile(userEntity.id); });
        openProfileButton.innerText = "Open";
        var sendMessageButton = document.createElement("button");
        sendMessageButton.className = "send_message_button";
        sendMessageButton.addEventListener("click", function (e) { return new newMessageBlock_1.NewMessageBlock(_this.webSocketClient, _this.users[userEntity.id]); });
        sendMessageButton.innerText = "Message";
        var user = document.createElement("div");
        user.className = "user";
        user.appendChild(login);
        user.appendChild(location);
        user.appendChild(openProfileButton);
        user.appendChild(sendMessageButton);
        return user;
    };
    SearchPage.prototype.openMessageSendingPopup = function (receiverId) {
    };
    ;
    SearchPage.prototype.render = function () {
        var _this = this;
        var body = document.createElement("div");
        body.id = "body";
        body.innerHTML =
            "        <form id='search_form'>\n" +
                "            <label id='search_label' for='search_field'>Search: </label>\n" +
                "            <input id='search_field' name='search_field' type='text' />\n" +
                "            <button id='search_data_button' type='button'>Search</button>\n" +
                "        </form>\n" +
                "        <div id='search_results'>\n" +
                "        </div>";
        if (document.getElementById("body")) {
            document.getElementById("body").remove();
        }
        body.appendChild(this.createNewMessagePopupElement());
        document.body.appendChild(body);
        document.getElementById("search_data_button").addEventListener("click", function () { return _this.search(); });
    };
    return SearchPage;
}(abstractPage_1.AbstractPage));
exports.SearchPage = SearchPage;
