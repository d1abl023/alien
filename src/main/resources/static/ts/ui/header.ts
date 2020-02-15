import {uiManager} from "../uiManager";

export class Header {

    constructor() {
        this.renderHeader();
        this.setListenersForHeaderButtons();
    }

    public logout() {
        document.cookie = "authToken= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "refreshToken= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "application.html";
    }

    public goToMessages() {
        document.getElementById("body").remove();
        uiManager.getPage({pageName: "messages"});
    }

    public goToProfile() {
        document.getElementById("body").remove();
        uiManager.getPage({pageName: "profile", user: "my"});
    }

    public goToSearch() {
        document.getElementById("body").remove();
        uiManager.getPage({pageName: "search"});
    }

    private renderHeader(): void {
        let header: HTMLElement = document.createElement("div");
        header.id = "header";
        header.innerHTML =
            '<div id="header_blocks">' +
                '<button id="user_profile_button" type="button">My profile</button>' +
                '<button id="messages_button" type="button">Messages</button>' +
                '<button id="search_button" type="button">Search</button>' +
                '<button id="logout_button" type="button">Log out</button>' +
            '</div>';
        if (document.getElementById("header")) {
            document.getElementById("header").remove();
        }
        document.body.appendChild(header);
    }

    private setListenersForHeaderButtons(): void {
        document.getElementById("user_profile_button").addEventListener("click", this.goToProfile);
        document.getElementById("messages_button").addEventListener("click", this.goToMessages);
        document.getElementById("search_button").addEventListener("click", this.goToSearch);
        document.getElementById("logout_button").addEventListener("click", this.logout);
    }
}
