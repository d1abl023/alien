import jqXHR = JQuery.jqXHR;
import {uiManager} from "../uiManager";
import * as $ from "jquery";
import {AbstractPage} from "../utils/abstractPage";
import {WebSocketClient} from "../utils/webSocketClient";

export class SearchPage extends AbstractPage {

    private webSocketClient: WebSocketClient;

    constructor() {
        super();
        this.render();
        this.webSocketClient = new WebSocketClient();
    }

    public search(): void {
        document.getElementById("search_results").innerText = "";
        let searchVal: string = (<HTMLInputElement>document.getElementById("search_field")).value;

        $.ajax({
            url: "search",
            type: "POST",
            data: searchVal,
            contentType: "text/plain; charset=utf-8",
            complete: (data: jqXHR<any>) => {
                let response = data.responseJSON;

                if (response.hasOwnProperty("users")) {
                    let users = data.responseJSON["users"];
                    for (let i = 0; i < users.length; i += 2) {

                        let line = document.createElement("div");
                        line.className = "line";
                        line.appendChild(this.createUserBlock(users[i]));

                        if (i + 1 < users.length) {
                            line.appendChild(this.createUserBlock(users[i + 1]));
                        }
                        $("#search_results").append(line);
                    }
                }

            }
        });
    }

    public createUserBlock(userEntity): HTMLDivElement {
        let login: HTMLDivElement = document.createElement("div");
        login.className = "login";
        login.innerText = userEntity.login;

        let location: HTMLDivElement = document.createElement("div");
        location.className = "location";
        location.innerText = userEntity.country + ", " + userEntity.city;


        let openProfileButton: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
        openProfileButton.className = "open_profile_button";
        openProfileButton.addEventListener("click", (e: Event) => this.openProfile(userEntity.id));
        openProfileButton.innerText = "Open";

        let sendMessageButton: HTMLButtonElement = document.createElement("button");
        sendMessageButton.className = "send_message_button";
        sendMessageButton.addEventListener("click", (e: Event) => this.openMessageSendingPopup(userEntity.id));
        sendMessageButton.innerText = "Message";

        let user: HTMLDivElement = document.createElement("div");
        user.className = "user";
        user.appendChild(login);
        user.appendChild(location);
        user.appendChild(openProfileButton);
        user.appendChild(sendMessageButton);

        return user;
    }

    public openProfile = function (id: string): void {
        uiManager.getPage({pageName: "profile", user: id});
    };

    public openMessageSendingPopup(receiverId: string): void {
    };

    public render(): void {
        let body: HTMLDivElement = document.createElement("div");
        body.id = "body";
        body.innerHTML =
            "        <form id='search_form'>\n" +
            "            <label id='search_label' for='search_field'>Search: </label>\n" +
            "            <input id='search_field' name='search_field' type='text' />\n" +
            "            <button id='search_data_button' type='button'>Search</button>\n" +
            "        </form>\n" +
            "        <div id='search_results'>\n" +
            "        </div>";
        if (document.getElementById("body")) {
            document.getElementById("body").remove();
        }
        body.appendChild(this.createNewMessagePopupElement());
        document.body.appendChild(body);
        document.getElementById("search_data_button").addEventListener("click", () => this.search());

    }
}