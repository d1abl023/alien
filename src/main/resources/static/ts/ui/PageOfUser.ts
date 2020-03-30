import * as $ from "jquery";
import Uri = require("jsuri");
import {AbstractPage} from "../utils/AbstractPage";
import {WebSocketClient} from "../utils/WebSocketClient";
import {IUser} from "../utils/templates/IUser";
import {IMention} from "../utils/templates/IMention";
import {NewMessageBlock} from "./NewMessageBlock";
import {uiManager} from "../UiManager";
import {NewMentionBlock} from "./NewMentionBlock";

export class PageOfUser extends AbstractPage {

    private webSocketClient: WebSocketClient;
    private myUserDataObj: IUser;
    private openedUserObj: IUser;
    private shortName: string;
    private fullName: string;
    private userId: string;
    private fullInfoShown: boolean = false;

    constructor(myId: string, myShortName: string) {
        super(myId, myShortName);
        $.post("user_info", "id=my").then((myUserDataObj: IUser): void => {
            this.myUserDataObj = myUserDataObj
            this.render();
            this.webSocketClient = new WebSocketClient(this.myId, this.myShortName);
            this.showUserInfo();
        }).catch(() => {
            alert("Please refresh the page.")
        });
    }

    public showUserInfo = () => {
        let uri = new Uri(window.location.href);
        let id: string = uri.getQueryParamValue("pageOfUser");
        $.post("user_info", `id=${id}`).then((data: IUser): void => {
            this.openedUserObj = data;
            this.userId = data.id;
            this.shortName = `${data.firstName}, ${data.lastName}`;
            this.fullName = `${data.firstName}${data.secondName ? `-${data.secondName}` : ""}, ${data.lastName}`;
            document.title = this.shortName;
            document.querySelector("h5#username").innerHTML = this.fullName;
            this.addUserInfoField("dateOfBirth", "Date of birth", data.date);
            this.addUserInfoField("sex", "Sex", data.sex);
            this.addUserInfoField("location", "Lives at", `${data.country}, ${data.city}`);
            this.addUserInfoField("company", "Works at", data.placeOfWork);
            this.addUserInfoField("position", "Works as", data.position);
            this.addUserInfoField("education", "Studied at", data.education);
            $('#mentions_title_lable').text(`Mentions about ${data.firstName}: `);
            $('#amount_of_mentions').text(data.amountOfMentions);
        }).catch(() => {
            throw new Error("Error receiving user info!");
        });
        this.renderButtons();
        if (uri.getQueryParamValue("pageOfUser") === "my") {
            $("#mentions").html(`
          <div class="row col-12 mx-0">
              <div id="mentions_title_text" class="card-body">
                  You cannot see mentions about you.
              </div>
          </div>`);
        } else {
            $("#mentions").html(`
          <div class="row col-12 mx-0">
            <div id="mentions_title_text" class="card-body">
              <split id="mentions_title_lable"></split><split id="amount_of_mentions"></split>
            </div>
          </div>
          
          <div class="row col-12 mention flex-column">
              <div class="card-body info_about_mentioned_user col-12">
                  <split class="mentioner_name">Mentioner: Julia, Roberts</split><split class="mentioner_company">From: Microsoft</split>
              </div>
              <div class="mention_text col-12">This text is test text for mentionings</div>
          </div>

          <div class="row col-12 mention flex-column">
              <div class="card-body info_about_mentioned_user col-12">
                  <split class="mentioner_name">Mentioner: Alex, Fergusson</split><split class="mentioner_company">From: Apple</split>
              </div>
              <div class="mention_text col-12">This text is test text for mentionings</div>
          </div>`);
            $.ajax({
                url: "get_mentions",
                type: "POST",
                data: uri.getQueryParamValue("pageOfUser"),
                contentType: "application/json; charset=utf-8"
            }).then((mentions: IMention[]) => {
                for (let mentionNumber in mentions) {
                    this.addMentionBlock(mentions[mentionNumber]);
                }
            })
        }
    };

    private showFullInfo = (): void => {
        if (!this.fullInfoShown) {
            this.fullInfoShown = true;
            $("#show_full_info_btn").text("Hide full info");
            this.addUserInfoField("email", "Email", this.openedUserObj.email);
            this.addUserInfoField("number", "Phone number", this.openedUserObj.number.toString());
        } else {
            this.fullInfoShown = false;
            $("#show_full_info_btn").text("Show full info");
            $("#email").remove();
            $("#number").remove();
        }
    };

    /**
     * Methiod addUserInfoField creates HTML element that represents user info field
     * and appent it to div#user_info_fields.
     *
     * @param id is a fields id
     * @param labelText is text for user_info_label div block
     * @param infoText is text for user_info_data div block
     */
    private addUserInfoField(id: string, labelText: string, infoText: string): void {
        let element: HTMLDivElement = document.createElement("div");
        element.id = id;
        element.className = "user_info_line col-12";

        let label: HTMLDivElement = document.createElement("div");
        label.className = "user_info_label col-4";
        label.textContent = labelText + ":";

        let info: HTMLDivElement = document.createElement("div");
        info.className = "user_info_data col-8";
        info.textContent = infoText;

        element.appendChild(label);
        element.appendChild(info);

        $("div#user_info_fields").append(element);
    }

    public addMentionBlock(mention: IMention): void {
        $.ajax({
            url: "user_info",
            type: "POST",
            data: mention.mentionFromId,
            contentType: "application/json; charset=utf-8"
        }).then((data: IUser) => {
            let mentionElement: HTMLDivElement = document.createElement("div");
            mentionElement.id = mention.id;
            mentionElement.className = "row col-12 mention flex-column";
            mentionElement.innerHTML = `
            <div class="card-body info_about_mentioned_user col-12">
                <split class="mentioner_name">Mentioner: ${data.firstName}, ${data.lastName}</split><split class="mentioner_company">From: ${data.placeOfWork}</split>
            </div>
            <div class="mention_text col-12">${mention.mention_text}</div>`;
            $("#mentions").append(mentionElement);
        });
    }

    private renderButtons = (): void => {
        $("#button_field").html(`
        <button id="write_msg_btn" type="button" class="btn btn-dark user_info_functional_btn">Write message</button>
        <button id="add_mntn_btn" type="button" class="btn btn-primary user_info_functional_btn">Add mention</button>
        <button id="print_info_btn" type="button" class="btn btn-secondary user_info_functional_btn">Print info</button>
        <button id="add_prsn_btn" type="button" class="btn btn-success user_info_functional_btn">Add person</button>
        <button id="show_full_info_btn" type="button" class="btn btn-info user_info_functional_btn">Show full info</button>
        <button id="edit_info_btn" type="button" class="btn btn-danger user_info_functional_btn">Edit info</button>
    `);

        $("#write_msg_btn").on("click", this.showNewMessageBlock);
        $("#add_prsn_btn").on("click", () => uiManager.getPage({pageName: "addNewPerson"}));
        $("#add_mntn_btn").on("click", this.showNewMentionBlock);
        $("#show_full_info_btn").on("click", this.showFullInfo);
    };

    private showNewMessageBlock = (): void => {
        new NewMessageBlock(this.webSocketClient, {receiverId: this.userId, receiverShortName: this.shortName});
    };

    private showNewMentionBlock = (): void => {
        new NewMentionBlock(
            {id: this.userId, shortName: this.shortName},
            {myId: this.myUserDataObj.id, myCorpId: this.myUserDataObj.placeOfWork}
        );
    };

    public render = () => {
        $("#body").html(`<div class="col-12 px-0"><div id='user_page' class='col-12 flex-column overflow-auto justify-content-center'></div></div>`);
        let userPageBlock: JQuery<HTMLElement> = $("#user_page");

        userPageBlock.html(`
      <div id='short_user_data' class='card mx-auto user_data_element'>
        <div class="row">
          <div class="col-md-4"><img src="pictures/photo/no_avatar.jpg" class="card-img"></div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 id="username" class="card-title"></h5>
              <p class="card-text"><small class="text-muted">Was online 3 mins ago</small></p>
              <div id="user_info_fields" class="card-text"></div>
            </div>
          </div>
        </div>
      </div>
    `);

        userPageBlock.append(`<div id="button_field" class="mx-auto text-center"></div>`);
        userPageBlock.append(`<div id='mentions' class='card mx-auto user_data_element'></div>`);
        userPageBlock.append(this.createNewMessagePopupElement());
    }

}
