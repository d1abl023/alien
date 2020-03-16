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


        let userBlock: HTMLDivElement = document.createElement("div");


        //TODO: to add feedbacks about employes in  program
        userBlock.innerHTML = `
        <div class="row no-gutters">
          <div class="col-md-4 align-self-stratch">
            <img src="pictures/photo/no_avatar.jpg" class="card-img" alt="${userEntity.login}">
            <button id="open_profile" class="nav-item btn btn-dark header_button align-self-bottom col-12 mx-0 text-center" type="button">Open</button>
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${userEntity.login}</h5>
              <p id="was_online" class="card-text my-0"><small class="text-muted">Was onlone 3 mins ago</small></p>
              <p class="card-text my-0">Lives at: ${userEntity.country}, ${userEntity.city}</p>
              <p class="card-text my-0">Works at: ${userEntity.placeOfWork}</p>
              <p class="card-text my-0">Feedbacks: 0</p>
            </div>
          </div>
        </div>`;

        userBlock.className = "card mb-3";
        userBlock.style.maxWidth = "430px";

        return userBlock;
    }

    public openProfile = function (id: string): void {
        uiManager.getPage({pageName: "profile", user: id});
    };

    public openMessageSendingPopup(receiverId: string): void {
    };

    public render(): void {
        let body: HTMLElement = document.getElementById("body");
        body.innerHTML =`
                    <div class='row col-12'>
                        <div class='col-2'></div>
                        <div class='col-8'>
                            <div class='row col-12'>
                                <form id='search_form' class='justify-content-center'>
                                    <label id='search_label' for='search_field' class='align-self-center text-dark'>Search: </label>
                                    <div class="md-form active-dark-2 align-self-center">
                                        <input id='search_field' name='search_field' class="form-control align-self-center" type="text" placeholder="Search" aria-label="Search">
                                    </div>
                                    <button id='search_data_button' type='button' class='btn btn-dark align-self-center mx-0 text-center'>Search</button>
                                </form>
                            </div>
                            <div id='search_results' class='row mx-auto col-12'></div>
                        </div>
                        <div class='col-2'></div>
                    </div>`;
        body.appendChild(this.createNewMessagePopupElement());
        document.getElementById("search_data_button").addEventListener("click", () => this.search());

    }
}
