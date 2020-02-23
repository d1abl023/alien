import * as $ from "jquery";
import Uri = require("jsuri");
import {AbstractPage} from "../utils/abstractPage";
import {WebSocketClient} from "../utils/webSocketClient";

export class PageOfUser extends AbstractPage {

    private webSocketClient: WebSocketClient;

    constructor(myId: string, myUsername: string) {
        super(myId, myUsername);
        this.render();
        this.webSocketClient = new WebSocketClient(this.myId, this.myUsername);
        this.showUserInfo();
    }

    public showUserInfo() {
        let uri = new Uri(window.location.href);


        $.ajax({
            url: "user_info",
            type: "POST",
            data: uri.getQueryParamValue("pageOfUser"),
            contentType: "application/json; charset=utf-8",
        }).then(function (data) {
            for (let key in data) {
                if (data.hasOwnProperty(key) && data[key] != null) {
                    if (key === "login") {
                        document.title = data[key];
                    }
                    let element = document.createElement("div");
                    element.className = "user_info_line";

                    let label = document.createElement("div");
                    label.className = "user_info_label";
                    label.textContent = key + ":";

                    let info = document.createElement("div");
                    info.className = "user_info_data";
                    info.textContent = data[key];

                    element.appendChild(label);
                    element.appendChild(info);

                    document.getElementById("short_user_data").appendChild(element);
                }
            }
        });
    };

    public render() {
        let body: HTMLElement = document.getElementById("body");
        body.innerHTML = "<div id='short_user_data'></div>";
        body.appendChild(this.createNewMessagePopupElement());
    }

}
