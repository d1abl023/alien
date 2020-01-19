import {WebSocketActions} from "../utils/webSocketActions";

export class PageOfUser {

    constructor() {
        let body = document.getElementsByTagName("body")[0];
        body =
        body.addEventListener("load", (e: Event) => this.showUserInfo());


    }

    public showUserInfo() {
        let param = window.location.search.substring(1);

        $.ajax({
            url: "user_info",
            type: "POST",
            data: param,
            contentType: "application/json; charset=utf-8",
        }).then(function (data) {
            console.log(data.responseJSON);

            let responseObject = data.responseJSON;

            for (let key in responseObject) {
                if (responseObject.hasOwnProperty(key) && responseObject[key] != null) {

                    if (key === "login") {
                        document.title = responseObject[key];
                    }

                    let element = document.createElement("div");
                    element.className = "user_info_line";

                    let label = document.createElement("div");
                    label.className = "user_info_label";
                    label.textContent = key + ":";

                    let info = document.createElement("div");
                    info.className = "user_info_data";
                    info.textContent = responseObject[key];

                    element.appendChild(label);
                    element.appendChild(info);

                    document.getElementById("short_user_data").appendChild(element);
                }
            }
        });

        WebSocketActions.connect();
    };
}