import {uiManager} from "../UiManager";
import * as $ from "jquery";

export class Header {

    constructor() {
        Header.renderHeader();
        this.setListenersForHeaderButtons();
    }

    public logout() {
        document.cookie = "authToken= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "refreshToken= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        // window.location.href = "application.html";
        $.get("/perform_logout").then(() => window.location.hash = "login");
    }

    public goToMessages() {
        uiManager.changeHash({pageName: "messages"});
    }

    public goToProfile() {
        uiManager.changeHash({pageName: "profile", user: "my"});
    }

    public goToSearch() {
        uiManager.changeHash({pageName: "search"});
    }

    private static renderHeader(): void {
        let headerBlocks: HTMLElement = document.createElement("div");
        headerBlocks.id = "header_blocks";
        headerBlocks.className = "col-12";
        headerBlocks.innerHTML =
            '<div class="col-md-3"></div>' +
            '<div id="header_menu" class="col-xs-9 col-sm-9 col-md-5">' +
            '<a class="navbar-brand">HRH</a>' +
            '<button id="user_profile_button" class="nav-item btn btn-dark text-left header_button" type="button">My profile</button>' +
            '<button id="messages_button" class="nav-item btn btn-dark text-left header_button" type="button">Messages</button>' +
            '<button id="search_button" class="nav-item btn btn-dark text-left header_button" type="button">Search</button>' +
            '</div>' +
            '<div class="col-xs-3 col-sm-3 col-md-1">' +
            '<button id="logout_button" class="nav-item btn btn-dark text-right header_button" type="button">Log out</button>' +
            '</div>' +
            '<div class="col-md-3"></div>';
        if($("#header_blocks")) {
            $("#header_blocks").remove();
        }
        $("#header").append(headerBlocks);
    }

    public static renderEmptyHeader(){
        let headerBlocks: HTMLElement = document.createElement("div");
        headerBlocks.id = "header_blocks";
        headerBlocks.className = "col-12";
        headerBlocks.innerHTML = `
            <div class="col-md-3"></div>
                <div id="header_menu" class="col-md-6"><a class="navbar-brand">HRH</a></div>
            <div class="col-md-3"></div>`;
        if($("#header_blocks")) {
            $("#header_blocks").remove();
        }
        $("#header").append(headerBlocks);
    };

    private setListenersForHeaderButtons(): void {
        $("#user_profile_button").on("click", this.goToProfile);
        $("#messages_button").on("click", this.goToMessages);
        $("#search_button").on("click", this.goToSearch);
        $("#logout_button").on("click", this.logout);
    }
}
