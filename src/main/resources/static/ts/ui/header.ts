import {uiManager} from "../uiManager";

export class Header {

    constructor() {
        Header.renderHeader();
        this.setListenersForHeaderButtons();
    }

    public logout() {
        document.cookie = "authToken= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "refreshToken= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "application.html";
    }

    public goToMessages() {
        uiManager.getPage({pageName: "messages"});
    }

    public goToProfile() {
        uiManager.getPage({pageName: "profile", user: "my"});
    }

    public goToSearch() {
        uiManager.getPage({pageName: "search"});
    }

    private static renderHeader(): void {
        let headerBlocks: HTMLElement = document.createElement("div");
        headerBlocks.id = "header_blocks";
        headerBlocks.className = "col-12";
        headerBlocks.innerHTML =
            '<div class="col-md-3"></div>' +
            '<div id="header_menu" class="col-xs-9 col-sm-9 col-md-5">' +
            '<a class="navbar-brand">Alien</a>' +
            '<button id="user_profile_button" class="nav-item btn btn-dark text-left header_button" type="button">My profile</button>' +
            '<button id="messages_button" class="nav-item btn btn-dark text-left header_button" type="button">Messages</button>' +
            '<button id="search_button" class="nav-item btn btn-dark text-left header_button" type="button">Search</button>' +
            '</div>' +
            '<div class="col-xs-3 col-sm-3 col-md-1">' +
            '<button id="logout_button" class="nav-item btn btn-dark text-right header_button" type="button">Log out</button>' +
            '</div>' +
            '<div class="col-md-3"></div>';
        if (document.getElementById("header_blocks")) {
            document.getElementById("header_blocks").remove();
        }
        document.getElementById("header").appendChild(headerBlocks);
    }

    private setListenersForHeaderButtons(): void {
        document.getElementById("user_profile_button").addEventListener("click", this.goToProfile);
        document.getElementById("messages_button").addEventListener("click", this.goToMessages);
        document.getElementById("search_button").addEventListener("click", this.goToSearch);
        document.getElementById("logout_button").addEventListener("click", this.logout);
    }
}
