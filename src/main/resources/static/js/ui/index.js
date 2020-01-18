class Index {

    static goToRegistration() {
        window.location.href = "registration.html";
    }

    static sendFormData(form) {

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
                    //                window.location.href = "page_of_user.html";
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
}