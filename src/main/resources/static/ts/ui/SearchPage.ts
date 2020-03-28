import jqXHR = JQuery.jqXHR;
import {uiManager} from "../UiManager";
import * as $ from "jquery";
import {AbstractPage} from "../utils/AbstractPage";
import {WebSocketClient} from "../utils/WebSocketClient";
import {NewMessageBlock} from "./NewMessageBlock";
import {IUser} from "../utils/templates/IUser";

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
        }).then((users: { [key: string]: IUser }) => {
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

    public createUserBlock = (userEntity: IUser): HTMLDivElement => {

        let shortName: string = `${userEntity.firstName}, ${userEntity.lastName}`;

        let openProfileButton: HTMLButtonElement = document.createElement("button");
        openProfileButton.className = "nav-item btn btn-dark header_button align-self-bottom col-12 mx-0 text-center";
        openProfileButton.addEventListener("click", () => this.openProfile(userEntity.id));
        openProfileButton.innerText = "Open";

        let imgBtnBlock: HTMLDivElement = document.createElement("div");
        imgBtnBlock.className = "col-md-4 align-self-stratch";
        imgBtnBlock.innerHTML = `<img src="pictures/photo/no_avatar.jpg" class="card-img" alt="${shortName}">`;
        imgBtnBlock.appendChild(openProfileButton);

        let cardBodyBlock: HTMLDivElement = document.createElement("div");
        cardBodyBlock.className = "col-md-8";
        cardBodyBlock.innerHTML = `
            <div class="card-body">
              <h5 class="card-title">${shortName}</h5>
              <p id="was_online" class="card-text my-0"><small class="text-muted">Was onlone 3 mins ago</small></p>
              <p class="card-text my-0">Lives at: ${userEntity.country}, ${userEntity.city}</p>
              <p class="card-text my-0">Works at: ${userEntity.placeOfWork}</p>
              <p class="card-text my-0">Feedbacks: 0</p>
            </div>`;

        // TODO: to add feedbacks about employes in  program
        let userInnerBlock: HTMLDivElement = document.createElement("div");
        userInnerBlock.className = "row no-gutters";
        userInnerBlock.appendChild(imgBtnBlock);
        userInnerBlock.appendChild(cardBodyBlock);

        let userBlock: HTMLDivElement = document.createElement("div");
        userBlock.className = "card mb-3";
        userBlock.style.maxWidth = "430px";
        userBlock.appendChild(userInnerBlock);

        return userBlock;
    }

    public openProfile = function (id: string): void {
        uiManager.getPage({pageName: "profile", user: id});
    };

    public openMessageSendingPopup(receiverId: string): void {
    };

    public render(): void {
        let body: HTMLElement = document.getElementById("body");
        body.innerHTML = `
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
