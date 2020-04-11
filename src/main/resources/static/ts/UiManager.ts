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

        window.onhashchange = this.onHashChangeHandler;
        window.onresize = this.onWindowResize;
    }

    private onHashChangeHandler = (): void => {
        let path = location.hash.startsWith("#")? location.hash.substring(1) : location.hash;
        let page;
        console.log(path)
        if (path === "login" || path === "") {
            page = {
                pageName: "login"
            };
        } else if (path.indexOf("pageOfUser") > -1) {
            page = {
                pageName: "profile",
                user: path.split("=")[1]
            };
        } else {
            page = {
                pageName: path
            };
        }

        this.getPage(page);
    }

    public getPage(pageObject): void {
        if (pageObject.pageName !== "registration" && pageObject.pageName !== "login") {
            $.ajax({
                url: "/authentication",
                type: "GET",
            }).then(
                (data) => {
                    pageObject.pageName = data === "authenticated" ? pageObject.pageName : "login";
                    this.loadPage(pageObject);
                }, 
                (e: jqXHR) => {
                    console.error(e);
                    if (e.status >= 400) {
                        pageObject.pageName = "login";
                        this.loadPage(pageObject);
                    }
                }
            );
        } else {
            this.loadPage(pageObject);
        }
    }

    private changeHash = (pageObject): void => {
        if(pageObject.pageName === `profile`) {
            window.location.hash = `pageOfUser=${pageObject.user}`;
        } else {
            window.location.hash = pageObject.pageName;
        }
    }

    private loadPage = (pageObject): void => {
        switch (pageObject.pageName) {
            case "messages": {
                this.renderHeader();
                this.page = new MessagesPage(this.myId, this.myShortName);
                break;
            }
            case "profile": {
                this.renderHeader();
                this.page = new PageOfUser(this.myId, this.myShortName);
                break;
            }
            case "search": {
                this.renderHeader();
                this.page = new SearchPage(this.myId, this.myShortName);
                break;
            }
            case "login": {
                if(this.header){
                    this.header = undefined;
                }
                Header.renderEmptyHeader();
                this.page = new IndexPage();
                break;
            }
            case "addNewPerson": {
                this.renderHeader();
                this.page = new NewPearsonPage(pageObject.editUser);
                break;
            }
            case "registration": {
                if(this.header){
                    this.header = undefined;
                }
                Header.renderEmptyHeader();
                this.page = new RegistrationPage();
                break;
            }
            default: {
                if(this.header){
                    this.header = undefined;
                }
                Header.renderEmptyHeader();
                console.error("InternalError. Page cannot be loaded!");
                return;
            }
        }
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
