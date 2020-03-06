import {uiManager} from "../uiManager";
import {AbstractPage} from "../utils/abstractPage";

export class Index extends AbstractPage {

    constructor(myId:string, myUsername: string) {
        super(myId, myUsername);
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
        let body: HTMLDivElement = document.createElement("div");
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
        document.getElementById("go_to_registration").addEventListener("click", () => {
            document.getElementById("body").remove();
            uiManager.getPage("registration");
        });
    }
}
