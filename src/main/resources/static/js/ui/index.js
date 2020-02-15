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
var abstractPage_1 = require("../utils/abstractPage");
var Index = /** @class */ (function (_super) {
    __extends(Index, _super);
    function Index() {
        var _this = _super.call(this) || this;
        _this.render();
        return _this;
    }
    Index.prototype.sendFormData = function (form) {
        var authData = {
            "username": form.username.value,
            "password": form.password.value
        };
        $.ajax({
            url: "authentication",
            type: "POST",
            data: JSON.stringify(authData),
            contentType: "application/json; charset=utf-8",
            complete: (function (data) {
                console.log(data);
                if (data.status === 200) {
                    console.log("login success");
                }
                else {
                    document.getElementById("auth_error").style.textAlign = "center";
                    document.getElementById("auth_error").style.fontSize = "1.5em";
                    document.getElementById("auth_error").style.color = "#D01D33";
                    document.getElementById("auth_error").style.marginBottom = "15px";
                    switch (data.responseText) {
                        case "invalid password": {
                            document.getElementById("auth_error").innerText
                                = "Invalid password!\nPlease try again!";
                            break;
                        }
                        case "invalid login field": {
                            document.getElementById("auth_error").innerText
                                = "Invalid login!\nPlease try again!";
                            break;
                        }
                        case "user description data does not exist": {
                            break;
                        }
                    }
                }
            })
        });
        return false;
    };
    Index.prototype.render = function () {
        var body = document.createElement("div");
        body.id = "body";
        body.innerHTML =
            '<div id="reg_auth_info">\n' +
                '        <div id="reg_auth_info_text">Register or authenticate!</div>\n' +
                '        <div id="auth_error"></div>\n' +
                '        <form id="auth_form" action="/login" method="post">\n' +
                '            <p>\n' +
                '                <label for="username" class="reg_form_labels">Login:</label>\n' +
                '                <input type="text" id="username" name="username" class="reg_form_fields" required>\n' +
                '            </p>\n' +
                '            <p>\n' +
                '                <label for="password" class="reg_form_labels">Password:</label>\n' +
                '                <input type="password" id="password" name="password" class="reg_form_fields" required>\n' +
                '            </p>\n' +
                '            <button id="authentication" type="submit" class="reg_form_button" form="auth_form">Log in</button>\n' +
                '            <button id="go_to_registration" type="button" class="reg_form_button" onclick="goToRegistration();">Registration</button>\n' +
                '        </form>\n' +
                '    </div>\n' +
                '</div>\n';
        if (document.getElementById("body")) {
            document.getElementById("body").remove();
        }
        document.body.appendChild(body);
        document.getElementById("go_to_registration").addEventListener("click", function () {
            document.getElementById("body").remove();
            uiManager_1.uiManager.getPage("registration");
        });
    };
    return Index;
}(abstractPage_1.AbstractPage));
exports.Index = Index;
