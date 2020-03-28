import {uiManager} from "../UiManager";
import {AbstractPage} from "../utils/AbstractPage";

export class IndexPage extends AbstractPage {

    constructor() {
        super(undefined, undefined);
        this.render()
    }

    public sendFormData(form: HTMLFormElement) {
        var authData: object = {
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
                } else {

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
    }

    public render(): void {
        let body: HTMLElement = document.getElementById("body");
        body.innerHTML =
            '<div id="reg_auth_info" class="card mx-auto">' +
            '        <div id="reg_auth_info_text" class="card-header"><h3 class="text-center">Welcome</h3></div>' +
            '        <div id="auth_error"></div>' +
            '        <form id="auth_form" action="/login" method="post">' +
            '            <div class="form-group auth_form_line">' +
            '                <label for="username" class="reg_form_label">Login:</label>' +
            '                <div class="md-form active-dark-2 align-self-center reg_form_input">' +
            '                   <input type="text" id="username" name="username" class="form-control" required>' +
            '                </div>' +
            '            </div>' +
            '            <div class="form-group auth_form_line">' +
            '                <label for="password" class="reg_form_label">Password:</label>' +
            '                <div class="md-form active-dark-2 align-self-center reg_form_input">' +
            '                   <input type="password" id="password" name="password" class="form-control" required>' +
            '                </div>' +
            '            </div>' +
            '            <div id="form_buttons" class="col-12 text-center">' +
            '                <button id="authentication" type="submit" class="btn btn-dark form_button" form="auth_form">' +
            '                    Log in' +
            '                </button>' +
            '                <button id="go_to_registration" type="button" class="btn btn-primary form_button">' +
            '                    Registration' +
            '                </button>' +
            '            </div>' +
            '        </form>' +
            '    </div>' +
            '</div>';
        document.getElementById("go_to_registration").addEventListener("click", () => {
            document.getElementById("body").innerHTML = "";
            uiManager.getPage({pageName: "registration"});
        });
    }
}
