import {Header} from "./ui/Header"
import {MessagesPage} from "./ui/MessagesPage";
import {PageOfUser} from "./ui/PageOfUser";
import {SearchPage} from "./ui/SearchPage";
import {IndexPage} from "./ui/IndexPage";
import {RegistrationPage} from "./ui/RegistrationPage";
import {AbstractPage} from "./utils/AbstractPage";
import * as $ from "jquery";
import jqXHR = JQuery.jqXHR;
import {NewPearsonPage} from "./ui/NewPearsonPage";

class UiManager {

    private header: Header = null;
    private page: AbstractPage;

    private myId: string;
    private myShortName: string;

    constructor() {
        $.ajax({
            url: "get_id",
            type: "GET"
        }).then((data: string): void => {
            this.myId = data;
        });
        $.ajax({
            url: "get_short_name",
            type: "GET"
        }).then((data: string): void => {
            this.myShortName = data;
        });

        window.onresize = this.onWindowResize;
    }

    public getPage(pageObject): void {
        if (pageObject.pageName !== "registration" && pageObject.pageName !== "login") {
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
        } else {
            this.loadPage(pageObject);
        }
    }


    private loadPage = (pageObject): void => {
        switch (pageObject.pageName) {
            case "messages": {
                this.renderHeader();
                history.pushState("", "", `application.html?messages`);
                this.page = new MessagesPage(this.myId, this.myShortName);
                break;
            }
            case "profile": {
                this.renderHeader();
                history.pushState("", "", `application.html?pageOfUser=${pageObject.user}`);
                this.page = new PageOfUser(this.myId, this.myShortName);
                break;
            }
            case "search": {
                this.renderHeader();
                history.pushState("", "", `application.html?search`);
                this.page = new SearchPage(this.myId, this.myShortName);
                break;
            }
            case "login": {
                this.header = null;
                history.pushState("", "", `application.html?login`);
                this.page = new IndexPage();
                break;
            }
            case "addNewPerson": {
                history.pushState("", "", `application.html?addNewPearson`);
                this.page = new NewPearsonPage(pageObject.editUser);
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

    private onWindowResize() {
        if (document.location.search.indexOf("messages") > -1) {
            (document.querySelector("div.inbox_msg") as HTMLDivElement).style.cssText = `width: 900px; height: ${$(window).height() - 60}px;`;
            (document.querySelector("div.msg_history") as HTMLDivElement).style.cssText = `height: ${$(window).height() - 210}px;`;
        } else if (document.location.search.indexOf("registration") > -1) {
            (document.querySelector("div#reg_form_block") as HTMLDivElement).style.cssText = `height: ${$(window).height() - 60}px;`;
        } else if (document.location.search.indexOf("pageOfUser") > -1) {
            $("#user_page").css({"height": `${$(window).height() - 60}px`});
        }
    }
}

export const uiManager = new UiManager();
