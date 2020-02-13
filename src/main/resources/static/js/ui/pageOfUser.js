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
var $ = require("jquery");
var Uri = require("jsuri");
var abstractPage_1 = require("../utils/abstractPage");
var webSocketClient_1 = require("../utils/webSocketClient");
var PageOfUser = /** @class */ (function (_super) {
    __extends(PageOfUser, _super);
    function PageOfUser() {
        var _this = _super.call(this) || this;
        _this.render();
        _this.webSocketClient = new webSocketClient_1.WebSocketClient();
        _this.showUserInfo();
        return _this;
    }
    PageOfUser.prototype.showUserInfo = function () {
        var uri = new Uri(window.location.href);
        $.ajax({
            url: "user_info",
            type: "POST",
            data: uri.getQueryParamValue("pageOfUser"),
            contentType: "application/json; charset=utf-8"
        }).then(function (data) {
            for (var key in data) {
                if (data.hasOwnProperty(key) && data[key] != null) {
                    if (key === "login") {
                        document.title = data[key];
                    }
                    var element = document.createElement("div");
                    element.className = "user_info_line";
                    var label = document.createElement("div");
                    label.className = "user_info_label";
                    label.textContent = key + ":";
                    var info = document.createElement("div");
                    info.className = "user_info_data";
                    info.textContent = data[key];
                    element.appendChild(label);
                    element.appendChild(info);
                    document.getElementById("short_user_data").appendChild(element);
                }
            }
        });
    };
    ;
    PageOfUser.prototype.render = function () {
        var body = document.createElement("div");
        body.id = "body";
        body.innerHTML = "<div id='avatar'>Avatar</div><div id='short_user_data'></div>\n";
        if (document.getElementById("body")) {
            document.getElementById("body").remove();
        }
        if (document.getElementById("newMessagePopUp")) {
            document.getElementById("newMessagePopUp").remove();
        }
        body.appendChild(this.createNewMessagePopupElement());
        document.body.appendChild(body);
    };
    return PageOfUser;
}(abstractPage_1.AbstractPage));
exports.PageOfUser = PageOfUser;
