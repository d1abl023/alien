'use strict';
import {AbstractPage} from "../utils/abstractPage";

export class RegistrationPage extends AbstractPage {

    constructor() {
        super();
        this.render();
    }

    static sendRegistrationFormData(form) {
        $.ajax({
            url: "registration",
            type: "POST",
            data: JSON.stringify(RegistrationPage.createObjectFromRegistrationForm(form)),
            contentType: "application/json; charset=utf-8",
            complete: (function (data) {
                if (data.status === 201) {
                    window.location.href = 'application.html';
                } else {
                    document.getElementById("error").style.textAlign = "center";
                    document.getElementById("error").style.fontSize = "1.5em";
                    document.getElementById("error").style.color = "#D01D33";
                    document.getElementById("error").style.marginBottom = "15px";
                    document.getElementById("error").innerText = "Registration failed!\nTry one more time!";
                    document.getElementById("registration");
                }
            })
        });

        return false;
    }

    static createObjectFromRegistrationForm(form) {
        return {
            "phone_number": form.phone_number.value,
            "country": form.country.value,
            "city": form.city.value,
            "date_of_birth": form.date_of_birth.value,
            "email": form.email.value,
            "sex": form.sex.value,
            "login": form.login.value,
            "password": form.password.value
        };
    }

    render() {
        let body: HTMLDivElement = document.createElement("div");
        body.id = "body";
        body.innerHTML =
            "<div id=\"reg_form\">\n" +
            "        <div id=\"reg_form_info\">\n" +
            "            Registration form\n" +
            "        </div>\n" +
            "        <div id=\"error\"></div>\n" +
            "        <form id=\"registration\" onsubmit=\"return makeJSON(this);\">\n" +
            "            <fieldset>\n" +
            "                <legend>User info</legend>\n" +
            "                <p class=\"reg_form_line\">\n" +
            "                    <label for=\"phone_number\" class=\"reg_form_label\">Phone:</label>\n" +
            "                    <input id=\"phone_number\" name=\"phone_number\" type=\"text\" form=\"registration\" class=\"reg_form_input\">\n" +
            "                </p>\n" +
            "                <p class=\"reg_form_line\">\n" +
            "                    <label for=\"country\" class=\"reg_form_label\">Country:</label>\n" +
            "                    <input id=\"country\" name=\"country\" type=\"text\" form=\"registration\" class=\"reg_form_input\">\n" +
            "                </p>\n" +
            "                <p class=\"reg_form_line\">\n" +
            "                    <label for=\"city\" class=\"reg_form_label\">City:</label>\n" +
            "                    <input id=\"city\" name=\"city\" type=\"text\" form=\"registration\" class=\"reg_form_input\">\n" +
            "                </p>\n" +
            "                <p class=\"reg_form_line\">\n" +
            "                    <label for=\"date_of_birth\" class=\"reg_form_label\">Date:</label>\n" +
            "                    <input id=\"date_of_birth\" name=\"date_of_birth\" type=\"date\" form=\"registration\"\n" +
            "                           class=\"reg_form_input\">\n" +
            "                </p>\n" +
            "                <p class=\"reg_form_line\">\n" +
            "                    <Label for=\"email\" class=\"reg_form_label\">Email:</Label>\n" +
            "                    <input id=\"email\" name=\"email\" type=\"text\" form=\"registration\" class=\"reg_form_input\">\n" +
            "                </p>\n" +
            "                <p class=\"reg_form_line\">\n" +
            "                    Sex:\n" +
            "                    <label for=\"male\" id=\"m_sex_label\">M</label>\n" +
            "                    <input id=\"male\" type=\"radio\" name=\"sex\" value=\"male\">\n" +
            "                    <label for=\"female\" id=\"f_sex_label\">F</label>\n" +
            "                    <input id=\"female\" type=\"radio\" name=\"sex\" value=\"female\">\n" +
            "                </p>\n" +
            "            </fieldset>\n" +
            "            <fieldset>\n" +
            "                <legend>Login data</legend>\n" +
            "                <p class=\"reg_form_line\">\n" +
            "                    <label for=\"login\" class=\"reg_form_label\">Login:</label>\n" +
            "                    <input id=\"login\" name=\"login\" type=\"text\" form=\"registration\" class=\"reg_form_input\">\n" +
            "                </p>\n" +
            "                <p class=\"reg_form_line\">\n" +
            "                    <label for=\"password\" class=\"reg_form_label\">Password:</label>\n" +
            "                    <input id=\"password\" name=\"password\" type=\"password\" form=\"registration\" class=\"reg_form_input\">\n" +
            "                </p>\n" +
            "                <p class=\"reg_form_line\">\n" +
            "                    <label for=\"passwordValidation\" class=\"reg_form_label\">Confirm password:</label>\n" +
            "                    <input id=\"passwordValidation\" name=\"passwordValidation\" type=\"password\" form=\"registration\"\n" +
            "                           class=\"reg_form_input\">\n" +
            "                </p>\n" +
            "            </fieldset>\n" +
            "            <button id=\"reg_button\" class=\"regButton\" type=\"submit\" form=\"registration\">Register</button>\n" +
            "        </form>\n" +
            "    </div>";
        if (document.getElementById("body")) {
            document.getElementById("body").remove();
        }
        document.body.appendChild(body);
    }
}
