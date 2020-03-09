import jqXHR = JQuery.jqXHR;
import {uiManager} from "../uiManager";
import * as $ from "jquery";
import {AbstractPage} from "../utils/abstractPage";
import {WebSocketClient} from "../utils/webSocketClient";
import {NewMessageBlock} from "./newMessageBlock";
import {IUser} from "../utils/templates/iUser";

export class SearchPage extends AbstractPage {

    readonly webSocketClient: WebSocketClient;
    private users: { [key: string]: IUser };

    constructor(myId: string, myUsername: string) {
        super(myId, myUsername);
        this.render();
        this.webSocketClient = new WebSocketClient(this.myId, this.myUsername);
    }

    public search = (): void => {
        document.getElementById("search_results").innerText = "";
        let searchVal: string = (<HTMLInputElement>document.getElementById("search_field")).value;

        $.ajax({
            url: "search",
            type: "POST",
            data: searchVal,
            contentType: "text/plain; charset=utf-8"
        }).then((users: { [key: string]: any }) => {
            this.processSearchResponse(users);
        });
    };

    private processSearchResponse = (users: { [key: string]: IUser }): void => {
        this.users = users;
        let amountOfRemainingKeys: number = Object.keys(this.users).length;
        let userLineCounter: number = 0;
        let line: HTMLDivElement = document.createElement("div");
        line.className = "line";

        for (let user in this.users) {
            if (amountOfRemainingKeys > 0) {
                line.appendChild(this.createUserBlock(this.users[user]));
                userLineCounter++;
                amountOfRemainingKeys--;
                if (userLineCounter === 2 || (userLineCounter === 1 && amountOfRemainingKeys === 0)) {
                    $("#search_results").append(line);
                    line = document.createElement("div");
                    line.className = "line";
                    userLineCounter = 0;
                }
            }
        }

    };

    public createUserBlock(userEntity: IUser): HTMLDivElement {
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
        sendMessageButton.addEventListener("click", (e: Event) => new NewMessageBlock(this.webSocketClient, this.users[userEntity.id]));
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
        let body: HTMLElement = document.getElementById("body");
        body.innerHTML =`<div class="row">
                    <form id='search_form'>
                        <label id='search_label' for='search_field'>Search: </label>
                        <input id='search_field' name='search_field' type='text' />
                       <button id='search_data_button' type='button'>Search</button>
                    </form>
                    <div id='search_results' class='mx-auto'>
                    </div>
                    </div>`;
        body.appendChild(this.createNewMessagePopupElement());
        document.getElementById("search_data_button").addEventListener("click", () => this.search());

    }
}
