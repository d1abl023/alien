import * as $ from "jquery";

import {AbstractPage} from "../utils/AbstractPage";
import {INewPearson} from "../utils/templates/INewPearson";
import {uiManager} from "../UiManager";
import { IUser } from "../utils/templates/IUser";
import { IAdditionalData } from "../utils/templates/IAdditionalData";
import { Logger } from "../utils/Logger";

export class NewPearsonPage extends AbstractPage {

    private userDataToEdit: IUser;
    private additionalData: IAdditionalData;

    constructor(userDataToEdit?: IUser) {
        super(undefined, undefined);
        if(userDataToEdit){
            $.post({
                url: "get_additional_user_info", 
                type: "POST",
                data: userDataToEdit.id,
                contentType: "application/json; charset=utf-8"
            }).then((additionalUserData: IAdditionalData): void => {
                Logger.info("User additional info successfully received.");
                this.userDataToEdit = userDataToEdit;
                this.additionalData = additionalUserData
                this.render();
                $("#new_person_form").submit((event) => {
                    event.preventDefault();
                    this.sendDataToUpdate();
                });
            }).catch((): void => {
                Logger.error("Failed to get additional user info.");
            });
        } else {
            this.render();
            $("#new_person_form").submit((event) => {
                event.preventDefault();
                NewPearsonPage.submitFormData();
            });
        }
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
        }).done((registeredId: string) => {
            Logger.info(`New user added. Id: ${registeredId}`)
            if (registeredId) {
                uiManager.getPage({pageName: "profile", user: registeredId});
            } else {
                document.getElementById("#error").style.textAlign = "center";
                document.getElementById("error").style.fontSize = "1.5em";
                document.getElementById("error").style.color = "#D01D33";
                document.getElementById("error").style.marginBottom = "15px";
                document.getElementById("error").innerText = "Registration failed!\nTry one more time!";
                document.getElementById("registration");
            }

        }).catch(() => {
            Logger.error("Failed to add new user.");
        });

        return false;
    }

    private sendDataToUpdate() {
        $.ajax({
            url: "/update_user_info",
            type: "POST",
            data: JSON.stringify((this.createObjectForUpdate())),
            contentType: "application/json; charset=utf-8"
        }).done((updatedUserId: string) => {
            if (updatedUserId) {
                uiManager.getPage({pageName: "profile", user: updatedUserId});
            } else {
                Logger.error("Was sent user with id 'null'");
            }

        }).catch(() => {
            Logger.error("Failed to send update data.");
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

    private createObjectForUpdate(): {userData: IUser, userAdditionalData: IAdditionalData} {
        this.userDataToEdit.firstName= $("#first_name").val().toString();
        this.userDataToEdit.secondName= $("#second_name").val().toString();
        this.userDataToEdit.lastName= $("#last_name").val().toString();

        this.userDataToEdit.number = Number($("#phone_number").val());
        this.userDataToEdit.country = $("#country").val().toString();
        this.userDataToEdit.city = $("#city").val().toString();
        this.userDataToEdit.date = $("#date_of_birth").val().toString();
        this.userDataToEdit.education = $("#education").val().toString();
        this.userDataToEdit.placeOfWork = $("#company").val().toString();
        this.userDataToEdit.position = $("#position").val().toString();
        this.userDataToEdit.email = $("#email").val().toString();
        this.userDataToEdit.sex = $("#male").prop("checked") ? $("#male").val().toString() : $("#female").val().toString();

        this.additionalData.id = this.userDataToEdit.id;
        this.additionalData.homecountry = $("#homecountry").val().toString();
        this.additionalData.hometown = $("#hometown").val().toString();
        this.additionalData.schoolList = $("#school_list").val().toString();

        return {
            userData: this.userDataToEdit,
            userAdditionalData: this.additionalData
        }
    }

    private createUserInfoFieldset = (): HTMLFieldSetElement => {
        let fieldset: HTMLFieldSetElement = document.createElement("fieldset");
        fieldset.className = "form-group";
        fieldset.innerHTML = `
            <legend class="col-12 text-center">User info</legend>
                    <div class="new_person_form_line">
                        <label for="first_name" class="new_person_form_label">First name:</label>
                        <div class="md-form active-dark-2 align-self-center new_person_form_input">
                            <input id="first_name" name="first_name" type="text" form="new_person_form" class="form-control" value="${this.userDataToEdit ? this.userDataToEdit.firstName : ""}">
                        </div>
                    </div>
                    <div class="new_person_form_line">
                        <label for="second_name" class="new_person_form_label">Second name:</label>
                        <div class="md-form active-dark-2 align-self-center new_person_form_input">
                            <input id="second_name" name="second_name" type="text" form="new_person_form" class="form-control" value="${this.userDataToEdit ? this.userDataToEdit.secondName : ""}">
                        </div>
                    </div>
                    <div class="new_person_form_line">
                        <label for="last_name" class="new_person_form_label">Last name:</label>
                        <div class="md-form active-dark-2 align-self-center new_person_form_input">
                            <input id="last_name" name="last_name" type="text" form="new_person_form" class="form-control" value="${this.userDataToEdit ? this.userDataToEdit.lastName : ""}">
                        </div>
                    </div>
                    <div class="new_person_form_line">
                        <label for="phone_number" class="new_person_form_label">Phone number:</label>
                        <div class="md-form active-dark-2 align-self-center new_person_form_input">
                            <input id="phone_number" name="phone_number" type="text" form="new_person_form" class="form-control" value="${this.userDataToEdit ? this.userDataToEdit.number : ""}">
                        </div>
                    </div>
                    <div class="new_person_form_line">
                        <label for="country" class="new_person_form_label">Country:</label>
                        <div class="md-form active-dark-2 align-self-center new_person_form_input">
                            <input id="country" name="country" type="text" form="new_person_form" class="form-control" value="${this.userDataToEdit ? this.userDataToEdit.country : ""}">
                        </div>
                    </div>
                    <div class="new_person_form_line">
                        <label for="city" class="new_person_form_label">City:</label>
                        <div class="md-form active-dark-2 align-self-center new_person_form_input">
                            <input id="city" name="city" type="text" form="new_person_form" class="form-control" value="${this.userDataToEdit ? this.userDataToEdit.city : ""}">
                        </div>
                    </div>
                    <div class="new_person_form_line">
                        <Label for="education" class="new_person_form_label">Studied at:</Label>
                        <div class="md-form active-dark-2 align-self-center new_person_form_input">
                            <input id="education" name="educatuin" type="text" form="new_person_form" class="form-control" value="${this.userDataToEdit ? this.userDataToEdit.education : ""}">
                        </div>
                    </div>
                    <div class="new_person_form_line">
                        <label for="date_of_birth" class="new_person_form_label">Date of birth:</label>
                        <div class="md-form active-dark-2 align-self-center new_person_form_input">
                            <input id="date_of_birth" name="date_of_birth" type="date" form="new_person_form" class="form-control" value="${this.userDataToEdit ? this.userDataToEdit.date : ""}">
                        </div>
                    </div>
                    <div class="new_person_form_line">
                        <Label for="email" class="new_person_form_label">Email:</Label>
                        <div class="md-form active-dark-2 align-self-center new_person_form_input">
                            <input id="email" name="email" type="text" form="new_person_form" class="form-control" value="${this.userDataToEdit ? this.userDataToEdit.email : ""}">
                        </div>
                    </div>
                    <div class="new_person_form_line">
                        <div class="new_person_form_label">Sex:</div>
                        <div class="new_person_form_input">
                            <label for="male" id="m_sex_label">M</label>
                            <input id="male" type="radio" name="sex" value="male" ${this.userDataToEdit && this.userDataToEdit.sex === "male" ? "checked" : ""}>
                            <label for="female" id="f_sex_label">F</label>
                            <input id="female" type="radio" name="sex" value="female" ${this.userDataToEdit && this.userDataToEdit.sex === "female" ? "checked" : ""}>
                        </div>
                    </div>`;
        return fieldset;
    }

    private createWorkInfoFieldset = (): HTMLFieldSetElement => {
        let fieldset: HTMLFieldSetElement = document.createElement("fieldset");
        fieldset.className = "form-grup";
        fieldset.innerHTML = `
        <fieldset class="form-group">
        <legend class="col-12 text-center">Work info</legend>
        <div class="new_person_form_line">
            <label for="company" class="new_person_form_label">Company:</label>
            <div class="md-form active-dark-2 align-self-center new_person_form_input">
                <input id="company" name="company" type="text" form="new_person_form" class="form-control" value="${this.userDataToEdit ? this.userDataToEdit.placeOfWork : ""}">
            </div>
        </div>
        <div class="new_person_form_line">
            <label for="position" class="new_person_form_label">Position:</label>
            <div class="md-form active-dark-2 align-self-center new_person_form_input">
                <input id="position" name="position" type="text" form="new_person_form" class="form-control" value="${this.userDataToEdit ? this.userDataToEdit.position : ""}">
            </div>
        </div>
        </fieldset>`;
        return fieldset;
    }

    private createAdditionalInfoFieldset = ():HTMLFieldSetElement => {
        let fieldset: HTMLFieldSetElement = document.createElement("fieldset");
        fieldset.className = "form-grup";
        fieldset.innerHTML = `
        <legend class="col-12 text-center">Additional info</legend>
        <div class="new_person_form_line">
            <label for="homecountry" class="new_person_form_label">Native country:</label>
            <div class="md-form active-dark-2 align-self-center new_person_form_input">
                <input id="homecountry" name="homecountry" type="text" form="new_person_form" class="form-control" value="${this.additionalData ? this.additionalData.homecountry : ""}">
            </div>
        </div>
        <div class="new_person_form_line">
            <label for="hometown" class="new_person_form_label">Hometown:</label>
            <div class="md-form active-dark-2 align-self-center new_person_form_input">
                <input id="hometown" name="hometown" type="text" form="new_person_form" class="form-control" value="${this.additionalData ? this.additionalData.hometown : ""}">
            </div>
        </div>
        <div class="new_person_form_line">
            <label for="school_list" class="new_person_form_label">Schools:</label>
            <div class="md-form active-dark-2 align-self-center new_person_form_input">
                <input id="school_list" name="school_list" type="text" form="new_person_form" class="form-control" value="${this.additionalData ? this.additionalData.schoolList : ""}">
            </div>
        </div>
        `;

        return fieldset;
    }

    private createAddPersonButton(): HTMLButtonElement{
        let button: HTMLButtonElement = document.createElement("button");
        button.id = "new_person_button";
        button.className = "regButton btn btn-primary";
        button.type = "submit";
        button.innerHTML = "Add person";
        return button;
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
            <form id="new_person_form" class="flex-column"></form>
        </div>
        </div>`;

        $("#new_person_form").append(this.createUserInfoFieldset());
        $("#new_person_form").append(this.createWorkInfoFieldset());
        $("#new_person_form").append(this.createAdditionalInfoFieldset());
        $("#new_person_form").append(this.createAddPersonButton());
    }
}
