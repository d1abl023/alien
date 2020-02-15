"use strict";
exports.__esModule = true;
var header_1 = require("./ui/header");
var messagesPage_1 = require("./ui/messagesPage");
var pageOfUser_1 = require("./ui/pageOfUser");
var searchPage_1 = require("./ui/searchPage");
var ui_1 = require("./ui");
var registrationPage_1 = require("./ui/registrationPage");
var $ = require("jquery");
var UIManager = /** @class */ (function () {
    function UIManager() {
        this.header = null;
    }
    UIManager.prototype.getPage = function (pageObject) {
        var _this = this;
        $.ajax({
            url: "/authentication",
            type: "GET"
        }).then(function (data) {
            pageObject.pageName = data === "authenticated" ? pageObject.pageName : "login";
            _this.loadPage(pageObject);
        })["catch"](function (e) {
            console.log(e);
            if (e.status >= 400) {
                pageObject.pageName = "login";
                _this.loadPage(pageObject);
            }
        });
    };
    UIManager.prototype.loadPage = function (pageObject) {
        switch (pageObject.pageName) {
            case "messages": {
                this.renderHeader();
                history.pushState("", "", "application.html?messages");
                this.page = new messagesPage_1.MessagesPage();
                break;
            }
            case "profile": {
                this.renderHeader();
                history.pushState("", "", "application.html?pageOfUser=" + pageObject.user);
                this.page = new pageOfUser_1.PageOfUser();
                break;
            }
            case "search": {
                this.renderHeader();
                history.pushState("", "", "application.html?search");
                this.page = new searchPage_1.SearchPage();
                break;
            }
            case "login": {
                this.header = null;
                history.pushState("", "", "application.html?login");
                this.page = new ui_1.Index();
                break;
            }
            case "registration": {
                this.header = null;
                this.page = new registrationPage_1.RegistrationPage();
                break;
            }
            default: {
                this.header = null;
                console.error("InternalError. Page cannot be loaded!");
                return;
            }
        }
        this.renderHeader();
    };
    UIManager.prototype.renderHeader = function () {
        if (this.header === null) {
            this.header = new header_1.Header();
        }
    };
    return UIManager;
}());
exports.uiManager = new UIManager();
