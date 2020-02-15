import {Header} from "./ui/header";
import {MessagesPage} from "./ui/messagesPage";
import {PageOfUser} from "./ui/pageOfUser";
import {SearchPage} from "./ui/searchPage";
import {Index} from "./ui";
import {RegistrationPage} from "./ui/registrationPage";
import {AbstractPage} from "./utils/abstractPage";
import * as $ from "jquery";
import jqXHR = JQuery.jqXHR;

class UIManager {

    private header: Header = null;
    private page: AbstractPage;

    public getPage(pageObject): void {
        $.ajax(
            {
                url: "/authentication",
                type: "GET",
            }
        ).then((data) => {
            pageObject.pageName = data === "authenticated" ? pageObject.pageName : "login";
            this.loadPage(pageObject);
        }).catch((e: jqXHR) => {
            console.log(e);
            if (e.status >= 400) {
                pageObject.pageName = "login";
                this.loadPage(pageObject);
            }
        });
    }


    private loadPage(pageObject): void {
        switch (pageObject.pageName) {
            case "messages": {
                this.renderHeader();
                history.pushState("", "", `application.html?messages`);
                this.page = new MessagesPage();
                break;
            }
            case "profile": {
                this.renderHeader();
                history.pushState("", "", `application.html?pageOfUser=${pageObject.user}`);
                this.page = new PageOfUser();
                break;
            }
            case "search": {
                this.renderHeader();
                history.pushState("", "", `application.html?search`);
                this.page = new SearchPage();
                break;
            }
            case "login": {
                this.header = null;
                history.pushState("", "", `application.html?login`);
                this.page = new Index();
                break;
            }
            case "registration": {
                this.header = null;
                this.page = new RegistrationPage();
                break;
            }
            default: {
                this.header = null;
                console.error("InternalError. Page cannot be loaded!");
                return;
            }
        }
        this.renderHeader();
    }

    private renderHeader() {
        if (this.header === null) {
            this.header = new Header();
        }
    }
}

export const uiManager = new UIManager();
