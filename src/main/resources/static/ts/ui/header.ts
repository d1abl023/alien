import {uiManager} from "../uiManager";

export class Header {
    static logout() {
        document.cookie = "authToken= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "refreshToken= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "index.html";
    }

    static goToMessages() {
        uiManager.loadPage("messages");
    }

    static goToProfile() {
        uiManager.loadPage("profile");
    }

    static goToSearch() {
        uiManager.loadPage("search");
    }
}