import {uiManager} from "../uiManager";
import {AbstractPage} from "../utils/abstractPage";

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
            '<div id="reg_auth_info" class="col-xs-12 col-sm-12 col-md-4 card">' +
            '        <div id="reg_auth_info_text" class="card-header">Register or authenticate!</div>' +
            '        <div id="auth_error"></div>' +
            '        <form id="auth_form" action="/login" method="post">' +
            '            <p class="form-group">' +
            '                <label for="username" class="reg_form_labels">Login:</label>' +
            '                <input type="text" id="username" name="username" class="form-control" required>' +
            '            </p>' +
            '            <p class="form-group">' +
            '                <label for="password" class="reg_form_labels">Password:</label>' +
            '                <input type="password" id="password" name="password" class="form-control" required>' +
            '            </p>' +
            '            <button id="authentication" type="submit" class="btn btn-dark" form="auth_form">Log in</button>' +
            '            <button id="go_to_registration" type="button" class="btn btn-dark">Registration</button>' +
            '        </form>' +
            '    </div>' +
            '</div>';
        document.getElementById("go_to_registration").addEventListener("click", () => {
            document.getElementById("body").remove();
            uiManager.getPage("registration");
        });
    }
}
