'use strict';
import {AbstractPage} from "../utils/abstractPage";
import jqXHR = JQuery.jqXHR;

export class RegistrationPage extends AbstractPage {

    constructor() {
        super(undefined, undefined);
        this.render();
    }

    static sendRegistrationFormData(form) {
        $.ajax({
            url: "registration",
            type: "POST",
            data: JSON.stringify(RegistrationPage.createObjectFromRegistrationForm(form)),
            contentType: "application/json; charset=utf-8",
            complete: (function (data: jqXHR<any>) {
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

    public render(): void {
        let body: HTMLElement = document.getElementById("body");
        body.innerHTML =
            '<div id="reg_form">' +
            '      <div id="reg_form_info">' +
            '          Registration form' +
            '      </div>' +
            '      <div id="error"></div>' +
            '      <form id="registration">' +
            '          <fieldset>' +
            '              <legend>User info</legend>' +
            '              <p class="reg_form_line">' +
            '                  <label for="phone_number" class="reg_form_label">Phone:</label>' +
            '                  <input id="phone_number" name="phone_number" type="text" form="registration" class="reg_form_input">' +
            '              </p>' +
            '              <p class="reg_form_line">' +
            '                  <label for="country" class="reg_form_label">Country:</label>' +
            '                  <input id="country" name="country" type="text" form="registration" class="reg_form_input">' +
            '              </p>' +
            '              <p class="reg_form_line">' +
            '                  <label for="city" class="reg_form_label">City:</label>' +
            '                  <input id="city" name="city" type="text" form="registration" class="reg_form_input">' +
            '              </p>' +
            '              <p class="reg_form_line">' +
            '                  <label for="date_of_birth" class="reg_form_label">Date:</label>' +
            '                  <input id="date_of_birth" name="date_of_birth" type="date" form="registration"' +
            '                         class="reg_form_input">' +
            '              </p>' +
            '              <p class="reg_form_line">' +
            '                  <Label for="email" class="reg_form_label">Email:</Label>' +
            '                  <input id="email" name="email" type="text" form="registration" class="reg_form_input">' +
            '              </p>' +
            '              <p class="reg_form_line">' +
            '                  Sex:' +
            '                  <label for="male" id="m_sex_label">M</label>' +
            '                  <input id="male" type="radio" name="sex" value="male">' +
            '                  <label for="female" id="f_sex_label">F</label>' +
            '                  <input id="female" type="radio" name="sex" value="female">' +
            '              </p>' +
            '          </fieldset>' +
            '          <fieldset>' +
            '              <legend>Login data</legend>' +
            '              <p class="reg_form_line">' +
            '                  <label for="login" class="reg_form_label">Login:</label>' +
            '                  <input id="login" name="login" type="text" form="registration" class="reg_form_input">' +
            '              </p>' +
            '              <p class="reg_form_line">' +
            '                  <label for="password" class="reg_form_label">Password:</label>' +
            '                  <input id="password" name="password" type="password" form="registration" class="reg_form_input">' +
            '              </p>' +
            '              <p class="reg_form_line">' +
            '                  <label for="passwordValidation" class="reg_form_label">Confirm password:</label>' +
            '                  <input id="passwordValidation" name="passwordValidation" type="password" form="registration"' +
            '                         class="reg_form_input">' +
            '              </p>' +
            '          </fieldset>' +
            '          <button id="reg_button" class="regButton" type="submit" form="registration">Register</button>' +
            '      </form>' +
            '  </div>';

        document.getElementById("registration")
            .addEventListener("submit", () => RegistrationPage.sendRegistrationFormData(this));
    }
}
