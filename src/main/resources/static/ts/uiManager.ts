import {Header} from "./ui/header";
import {MessagesPage} from "./ui/messagesPage";
import {PageOfUser} from "./ui/pageOfUser";
import {SearchPage} from "./ui/searchPage";

class UIManager {

    private userProfileButton = document.getElementById("#user_profile_button");
    private messagesButton = document.getElementById("#messages_button");
    private searchButton = document.getElementById("#search_button");
    private logoutButton = document.getElementById("#logout_button");
    private page;

    constructor() {
        this.userProfileButton.addEventListener("click", (e: Event) => Header.goToProfile());
        this.messagesButton.addEventListener("click", (e: Event) => Header.goToMessages());
        this.searchButton.addEventListener("click", (e: Event) => Header.goToSearch());
        this.logoutButton.addEventListener("click", (e: Event) => Header.logout())
    }

    public loadPage(pageName: string): void {
        switch (pageName) {
            case "messages": {
                this.page = new MessagesPage();
                break;
            }
            case "profile": {
                this.page = new PageOfUser();
                break;
            }
            case "search": {
                this.page = new SearchPage();
                break;
            }
            default: {
                console.error("InternalError. Page cannot be loaded!");
                return;
            }
        }


    }
}

export const uiManager = new UIManager();