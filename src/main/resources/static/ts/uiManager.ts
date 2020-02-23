import {Header} from "./ui/header";
import {MessagesPage} from "./ui/messagesPage";
import {PageOfUser} from "./ui/pageOfUser";
import {SearchPage} from "./ui/searchPage";
import {IndexPage} from "./ui/indexPage";
import {RegistrationPage} from "./ui/registrationPage";
import {AbstractPage} from "./utils/abstractPage";
import * as $ from "jquery";
import jqXHR = JQuery.jqXHR;
import {SpendingsPage} from "./ui/spendingsPage";

class UIManager {

    private header: Header = null;
    private page: AbstractPage;

    private myId: string;
    private myUsername: string;

    constructor() {
        $.ajax({
            url: "get_id",
            type: "GET"
        }).then((data: string): void => {
            this.myId = data;
        });
        $.ajax({
            url: "get_username",
            type: "GET"
        }).then((data: string): void => {
            this.myUsername = data;
        });
    }

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


    private loadPage = (pageObject): void => {
        switch (pageObject.pageName) {
            case "messages": {
                this.renderHeader();
                history.pushState("", "", `application.html?messages`);
                this.page = new MessagesPage(this.myId, this.myUsername);
                break;
            }
            case "profile": {
                this.renderHeader();
                history.pushState("", "", `application.html?pageOfUser=${pageObject.user}`);
                this.page = new PageOfUser(this.myId, this.myUsername);
                break;
            }
            case "search": {
                this.renderHeader();
                history.pushState("", "", `application.html?search`);
                this.page = new SearchPage(this.myId, this.myUsername);
                break;
            }
            case "spendings": {
                this.renderHeader();
                history.pushState("","", `application.html?spendings`);
                this.page = new SpendingsPage(this.myId, this.myUsername);
                break;
            }
            case "login": {
                this.header = null;
                history.pushState("", "", `application.html?login`);
                this.page = new IndexPage();
                break;
            }
            case "registration": {
                this.header = null;
                history.pushState("", "", `application.html?registration`);
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
    };

    private renderHeader() {
        if (this.header === null) {
            this.header = new Header();
        }
    }
}

export const uiManager = new UIManager();
