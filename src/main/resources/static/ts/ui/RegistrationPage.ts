import {AbstractPage} from "../utils/AbstractPage";
import {IRegistration} from "../utils/templates/IRegistration";
import jqXHR = JQuery.jqXHR;
import * as $ from "jquery";
import ClickEvent = JQuery.ClickEvent;
import SubmitEvent = JQuery.SubmitEvent;

export class RegistrationPage extends AbstractPage {

    constructor() {
        super(undefined, undefined);
        this.render();
        $("#reg_button").on("click", (event) => {
            event.preventDefault();
            RegistrationPage.sendRegistrationFormData();
        });
    }


    static sendRegistrationFormData() {
        $.ajax({
            url: "/registration",
            type: "POST",
            data: JSON.stringify(RegistrationPage.createObjectFromRegistrationForm()),
            contentType: "application/json; charset=utf-8"
        }).done(() => {
            window.location.href = 'application.html';
        });
    }


    static createObjectFromRegistrationForm(): IRegistration {
        return {
            first_name: $("#first_name").val().toString(),
            second_name: $("#second_name").val().toString(),
            last_name: $("#last_name").val().toString(),

            login: $("#login").val().toString(),
            password: $("#password").val().toString(),

            phone_number: $("#phone_number").val().toString(),
            country: $("#country").val().toString(),
            city: $("#city").val().toString(),
            date_of_birth: $("#date_of_birth").val().toString(),
            education: $("#education").val().toString(),
            place_of_work: $("#company").val().toString(),
            position: $("#position").val().toString(),
            email: $("#email").val().toString(),
            sex: $("#male").prop("checked") ? $("#male").val().toString() : $("#female").val().toString(),

            homecountry: $("#homecountry").val().toString(),
            hometown: $("#hometown").val().toString(),
            schoolList: $("#school_list").val().toString()
        };
    }

    public render(): void {
        let body: HTMLElement = document.getElementById("body");
        body.innerHTML = `
        <div class="row col-12">
        <div id="reg_form_block" class="col-12 justify-content-center" style="height: ${$(window).height() - 60}px;">
            <h1 id="reg_form_info" class="col-12 text-center">
                Registration form
            </h1>
            <div id="error"></div>
            <form id="reg_form" class="flex-column">
                <fieldset class="form-group">
                    <legend class="col-12 text-center">User info</legend>
                    <div class="reg_form_line">
                        <label for="first_name" class="reg_form_label">First name:</label>
                        <div class="md-form active-dark-2 align-self-center reg_form_input">
                            <input id="first_name" name="first_name" type="text" form="registration" class="form-control">
                        </div>
                    </div>
                    <div class="reg_form_line">
                        <label for="second_name" class="reg_form_label">Second name:</label>
                        <div class="md-form active-dark-2 align-self-center reg_form_input">
                            <input id="second_name" name="second_name" type="text" form="registration" class="form-control">
                        </div>
                    </div>
                    <div class="reg_form_line">
                        <label for="last_name" class="reg_form_label">Last name:</label>
                        <div class="md-form active-dark-2 align-self-center reg_form_input">
                            <input id="last_name" name="last_name" type="text" form="registration" class="form-control">
                        </div>
                    </div>
                    <div class="reg_form_line">
                        <label for="phone_number" class="reg_form_label">Phone number:</label>
                        <div class="md-form active-dark-2 align-self-center reg_form_input">
                            <input id="phone_number" name="phone_number" type="text" form="registration" class="form-control">
                        </div>
                    </div>
                    <div class="reg_form_line">
                        <label for="country" class="reg_form_label">Country:</label>
                        <div class="md-form active-dark-2 align-self-center reg_form_input">
                            <input id="country" name="country" type="text" form="registration" class="form-control">
                        </div>
                    </div>
                    <div class="reg_form_line">
                        <label for="city" class="reg_form_label">City:</label>
                        <div class="md-form active-dark-2 align-self-center reg_form_input">
                            <input id="city" name="city" type="text" form="registration" class="form-control">
                        </div>
                    </div>
                    <div class="reg_form_line">
                        <Label for="education" class="reg_form_label">Studied at:</Label>
                        <div class="md-form active-dark-2 align-self-center reg_form_input">
                            <input id="education" name="educatuin" type="text" form="registration" class="form-control">
                        </div>
                    </div>
                    <div class="reg_form_line">
                        <label for="date_of_birth" class="reg_form_label">Date of birth:</label>
                        <div class="md-form active-dark-2 align-self-center reg_form_input">
                            <input id="date_of_birth" name="date_of_birth" type="date" form="registration" class="form-control">
                        </div>
                    </div>
                    <div class="reg_form_line">
                        <Label for="email" class="reg_form_label">Email:</Label>
                        <div class="md-form active-dark-2 align-self-center reg_form_input">
                            <input id="email" name="email" type="text" form="registration" class="form-control">
                        </div>
                    </div>
                    <div class="reg_form_line">
                        <div class="reg_form_label">Sex:</div>
                        <div class="reg_form_input">
                            <label for="male" id="m_sex_label">M</label>
                            <input id="male" type="radio" name="sex" value="male">
                            <label for="female" id="f_sex_label">F</label>
                            <input id="female" type="radio" name="sex" value="female">
                        </div>
                    </div>
                </fieldset>


                <fieldset class="form-group">
                    <legend class="col-12 text-center">Work data</legend>
                    <div class="reg_form_line">
                        <label for="company" class="reg_form_label">Company:</label>
                        <div class="md-form active-dark-2 align-self-center reg_form_input">
                            <input id="company" name="company" type="text" form="registration" class="form-control">
                        </div>
                    </div>
                    <div class="reg_form_line">
                        <label for="position" class="reg_form_label">Position:</label>
                        <div class="md-form active-dark-2 align-self-center reg_form_input">
                            <input id="position" name="position" type="text" form="registration" class="form-control">
                        </div>
                    </div>
                </fieldset>

                <fieldset class="form-group">
                <legend class="col-12 text-center">Additional info</legend>
                <div class="reg_form_line">
                    <label for="homecountry" class="reg_form_label">Native country:</label>
                    <div class="md-form active-dark-2 align-self-center reg_form_input">
                        <input id="homecountry" name="homecountry" type="text" form="registration" class="form-control">
                    </div>
                </div>
                <div class="reg_form_line">
                    <label for="hometown" class="reg_form_label">Hometown:</label>
                    <div class="md-form active-dark-2 align-self-center reg_form_input">
                        <input id="hometown" name="hometown" type="text" form="registration" class="form-control">
                    </div>
                </div>
                <div class="reg_form_line">
                    <label for="school_list" class="reg_form_label">Schools:</label>
                    <div class="md-form active-dark-2 align-self-center reg_form_input">
                        <input id="school_list" name="school_list" type="text" form="registration" class="form-control">
                    </div>
                </div>
                </fieldset>

                <fieldset class="form-group">
                    <legend class="col-12 text-center">Login data</legend>
                    <div class="reg_form_line">
                        <label for="login" class="reg_form_label">Login:</label>
                        <div class="md-form active-dark-2 align-self-center reg_form_input">
                            <input id="login" name="login" type="text" form="registration" class="form-control">
                        </div>
                    </div>
                    <div class="reg_form_line">
                        <label for="password" class="reg_form_label">Password:</label>
                        <div class="md-form active-dark-2 align-self-center reg_form_input">
                            <input id="password" name="password" type="password" form="registration" class="form-control">
                        </div>
                    </div>
                    <div class="reg_form_line">
                        <label for="passwordValidation" class="reg_form_label">Confirm password:</label>
                        <div class="md-form active-dark-2 align-self-center reg_form_input">
                            <input id="passwordValidation" name="passwordValidation" type="password" form="registration" class="form-control">
                        </div>
                    </div>
                </fieldset>
                <button id="reg_button" class="regButton btn btn-primary" form="reg_form">Register</button>
            </form>
        </div>
        </div>`;
    }
}
