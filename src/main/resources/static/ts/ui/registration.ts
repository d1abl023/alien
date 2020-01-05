'use strict';

function makeJSON(form) {

    "use strict";

    let userData = {

        "phone_number": form.phone_number.value,
        "country": form.country.value,
        "city": form.city.value,
        "date_of_birth": form.date_of_birth.value,
        "email": form.email.value,
        "sex": form.sex.value,
        "login": form.login.value,
        "password": form.password.value

    };

    $.ajax({
        url: "registration",
        type: "POST",
        data: JSON.stringify(userData),
        contentType: "application/json; charset=utf-8",
        complete: (function (data) {
            if (data.status === 201) {
                window.location.href = 'index.html';
            } else {
                document.getElementById("error").style.textAlign = "center";
                document.getElementById("error").style.fontSize = "1.5em";
                document.getElementById("error").style.color = "#D01D33";
                document.getElementById("error").style.marginBottom = "15px";
                document.getElementById("error").innerText = "Registration failed!\nTry one more time!";
                (<HTMLFormElement>document.getElementById("registration")).reset();
            }
        })
    });

    return false;
}
