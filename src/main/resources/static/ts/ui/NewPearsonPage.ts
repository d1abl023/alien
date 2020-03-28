import {AbstractPage} from "../utils/AbstractPage";
import {IRegistration} from "../utils/templates/IRegistration";
import jqXHR = JQuery.jqXHR;
import * as $ from "jquery";
import {INewPearson} from "../utils/templates/INewPearson";
import {uiManager} from "../UiManager";

export class NewPearsonPage extends AbstractPage {

    constructor() {
        super(undefined, undefined);
        this.render();
        $("#new_person_form").submit((event) => {
            event.preventDefault();
            NewPearsonPage.submitFormData();
        });
        // $("#new_person_button").click(NewPearsonPage.submitFormData);
    }

    private static submitFormData(): void {
        if (NewPearsonPage.verifyForEmptyFields()) {
            NewPearsonPage.sendNewPersonFormData()
        } else {
            alert("Fill all nessary fields, please!")
        }
    }

    private static verifyForEmptyFields(): boolean {
        let necessaryFieldsId: string[] = ["#first_name", "#second_name", "#last_name",
            "#phone_number", "#country", "#city", "#date_of_birth", "#education", "sex",
            "#company", "#position", "#email", "#homecountry", "#hometown", "#school_list"
        ];

        let result: boolean = true;

        for (let index in necessaryFieldsId) {
            if (necessaryFieldsId[index] === "sex") {
                result = ($("#male").prop("checked") || $("#female").prop("checked")) === false ? false : result;
            } else if (!$(necessaryFieldsId[index]).val()) {
                result = false;
            }
        }
        return result;
    }

    static sendNewPersonFormData() {
        $.ajax({
            url: "/add_new_person",
            type: "POST",
            data: JSON.stringify(NewPearsonPage.createObjectFromNewPersonForm()),
            contentType: "application/json; charset=utf-8"
        }).done((registaredId: string) => {
            if (registaredId) {
                uiManager.getPage({pageName: "profile", user: registaredId});
            } else {
                document.getElementById("#error").style.textAlign = "center";
                document.getElementById("error").style.fontSize = "1.5em";
                document.getElementById("error").style.color = "#D01D33";
                document.getElementById("error").style.marginBottom = "15px";
                document.getElementById("error").innerText = "Registration failed!\nTry one more time!";
                document.getElementById("registration");
            }

        });

        return false;
    }

    private static createObjectFromNewPersonForm(): INewPearson {
        return {
            first_name: $("#first_name").val().toString(),
            second_name: $("#second_name").val().toString(),
            last_name: $("#last_name").val().toString(),

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
        <div id="new_person_form_block" class="col-12 justify-content-center" style="height: ${$(window).height() - 60}px;">
            <h1 id="new_person_form_info" class="col-12 text-center">
                Registration form
            </h1>
            <div id="error"></div>
            <form id="new_person_form" class="flex-column">
                <fieldset class="form-group">
                    <legend class="col-12 text-center">User info</legend>
                    <div class="new_person_form_line">
                        <label for="first_name" class="new_person_form_label">First name:</label>
                        <div class="md-form active-dark-2 align-self-center new_person_form_input">
                            <input id="first_name" name="first_name" type="text" form="new_person_form" class="form-control">
                        </div>
                    </div>
                    <div class="new_person_form_line">
                        <label for="second_name" class="new_person_form_label">Second name:</label>
                        <div class="md-form active-dark-2 align-self-center new_person_form_input">
                            <input id="second_name" name="second_name" type="text" form="new_person_form" class="form-control">
                        </div>
                    </div>
                    <div class="new_person_form_line">
                        <label for="last_name" class="new_person_form_label">Last name:</label>
                        <div class="md-form active-dark-2 align-self-center new_person_form_input">
                            <input id="last_name" name="last_name" type="text" form="new_person_form" class="form-control">
                        </div>
                    </div>
                    <div class="new_person_form_line">
                        <label for="phone_number" class="new_person_form_label">Phone number:</label>
                        <div class="md-form active-dark-2 align-self-center new_person_form_input">
                            <input id="phone_number" name="phone_number" type="text" form="new_person_form" class="form-control">
                        </div>
                    </div>
                    <div class="new_person_form_line">
                        <label for="country" class="new_person_form_label">Country:</label>
                        <div class="md-form active-dark-2 align-self-center new_person_form_input">
                            <input id="country" name="country" type="text" form="new_person_form" class="form-control">
                        </div>
                    </div>
                    <div class="new_person_form_line">
                        <label for="city" class="new_person_form_label">City:</label>
                        <div class="md-form active-dark-2 align-self-center new_person_form_input">
                            <input id="city" name="city" type="text" form="new_person_form" class="form-control">
                        </div>
                    </div>
                    <div class="new_person_form_line">
                        <Label for="education" class="new_person_form_label">Studied at:</Label>
                        <div class="md-form active-dark-2 align-self-center new_person_form_input">
                            <input id="education" name="educatuin" type="text" form="new_person_form" class="form-control">
                        </div>
                    </div>
                    <div class="new_person_form_line">
                        <label for="date_of_birth" class="new_person_form_label">Date of birth:</label>
                        <div class="md-form active-dark-2 align-self-center new_person_form_input">
                            <input id="date_of_birth" name="date_of_birth" type="date" form="new_person_form" class="form-control">
                        </div>
                    </div>
                    <div class="new_person_form_line">
                        <Label for="email" class="new_person_form_label">Email:</Label>
                        <div class="md-form active-dark-2 align-self-center new_person_form_input">
                            <input id="email" name="email" type="text" form="new_person_form" class="form-control">
                        </div>
                    </div>
                    <div class="new_person_form_line">
                        <div class="new_person_form_label">Sex:</div>
                        <div class="new_person_form_input">
                            <label for="male" id="m_sex_label">M</label>
                            <input id="male" type="radio" name="sex" value="male">
                            <label for="female" id="f_sex_label">F</label>
                            <input id="female" type="radio" name="sex" value="female">
                        </div>
                    </div>
                </fieldset>


                <fieldset class="form-group">
                    <legend class="col-12 text-center">Work info</legend>
                    <div class="new_person_form_line">
                        <label for="company" class="new_person_form_label">Company:</label>
                        <div class="md-form active-dark-2 align-self-center new_person_form_input">
                            <input id="company" name="company" type="text" form="new_person_form" class="form-control">
                        </div>
                    </div>
                    <div class="new_person_form_line">
                        <label for="position" class="new_person_form_label">Position:</label>
                        <div class="md-form active-dark-2 align-self-center new_person_form_input">
                            <input id="position" name="position" type="text" form="new_person_form" class="form-control">
                        </div>
                    </div>
                </fieldset>

                <fieldset class="form-group">
                    <legend class="col-12 text-center">Additional info</legend>
                    <div class="new_person_form_line">
                        <label for="homecountry" class="new_person_form_label">Native country:</label>
                        <div class="md-form active-dark-2 align-self-center new_person_form_input">
                            <input id="homecountry" name="homecountry" type="text" form="new_person_form" class="form-control">
                        </div>
                    </div>
                    <div class="new_person_form_line">
                        <label for="hometown" class="new_person_form_label">Hometown:</label>
                        <div class="md-form active-dark-2 align-self-center new_person_form_input">
                            <input id="hometown" name="hometown" type="text" form="new_person_form" class="form-control">
                        </div>
                    </div>
                    <div class="new_person_form_line">
                        <label for="school_list" class="new_person_form_label">Schools:</label>
                        <div class="md-form active-dark-2 align-self-center new_person_form_input">
                            <input id="school_list" name="school_list" type="text" form="new_person_form" class="form-control">
                        </div>
                    </div>
                </fieldset>


                <button id="new_person_button" class="regButton btn btn-primary" type="submit" form="new_person_form">Add person</button>
            </form>
        </div>
        </div>`;
    }
}
