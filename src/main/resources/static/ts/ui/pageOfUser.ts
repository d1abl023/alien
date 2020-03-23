import * as $ from "jquery";
import Uri = require("jsuri");
import {AbstractPage} from "../utils/abstractPage";
import {WebSocketClient} from "../utils/webSocketClient";
import { IUser } from "../utils/templates/iUser";

export class PageOfUser extends AbstractPage {

  private webSocketClient: WebSocketClient;
  private shortName: string;
  private fullName: string;

  constructor(myId: string, myUsername: string) {
    super(myId, myUsername);
    this.render();
    this.webSocketClient = new WebSocketClient(this.myId, this.myUsername);
    this.showUserInfo();
  }

  public showUserInfo = () => {
    let uri = new Uri(window.location.href);
    $.ajax({
      url: "user_info",
      type: "POST",
      data: uri.getQueryParamValue("pageOfUser"),
      contentType: "application/json; charset=utf-8",
    }).then((data: IUser) => {
      this.shortName = `${data.firstName}, ${data.lastName}`;
      this.fullName = `${data.firstName}${data.secondName ? `-${data.secondName}`: ""}, ${data.lastName}`;
      document.title = this.shortName;
      document.querySelector("h5#username").innerHTML = this.fullName;
      this.addUserInfoField("email", "Email", data.email);
      this.addUserInfoField("dateOfBirth", "Date of birth", data.date);
      this.addUserInfoField("sex", "Sex", data.sex);
      this.addUserInfoField("number", "Phonew number", data.number.toString());
      this.addUserInfoField("location", "Lives at", `${data.country}, ${data.city}`);
      this.addUserInfoField("company", "Works at", data.placeOfWork);
      this.addUserInfoField("position", "Works as", data.position);
      this.addUserInfoField("education", "Studied at", data.education);
      $('#mentions_title_lable').text(`Mentions about ${data.firstName}: `)
      $('#amount_of_mentions').text(data.amountOfMentions);
    });
  };

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

    document.querySelector("div#user_info_fields").appendChild(element);
  }

  public renderMentions(): void {

  }

  public addMentionBlock(){
    return `
    <div class="row">
    <div class="col-md-4"><img src="pictures/photo/no_avatar.jpg" class="card-img"></div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 id="username" class="card-title">Card title</h5>
        <p class="card-text"><small class="text-muted">Was online 3 mins ago</small></p>
        <div id="user_info_fields" class="card-text"></div>
      </div>
    </div>
  </div>`;
  }

  public render = () => {
    let body: HTMLElement = document.getElementById("body");
    body.innerHTML = `
      <div id='short_user_data' class='card mx-auto user_data_element'>
        <div class="row">
          <div class="col-md-4"><img src="pictures/photo/no_avatar.jpg" class="card-img"></div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 id="username" class="card-title">Card title</h5>
              <p class="card-text"><small class="text-muted">Was online 3 mins ago</small></p>
              <div id="user_info_fields" class="card-text"></div>
            </div>
          </div>
        </div>
      </div>

      <div id='mentions' class='card mx-auto user_data_element'>
        <div class="row">
        <div class="col-12">
         <div id="mentions_title_text" class="card-body">
            <split id="mentions_title_lable"></split><split id="amount_of_mentions"></split>
           </div>
         </div>
        </div>

      </div>`;

    body.appendChild(this.createNewMessagePopupElement());
  }

}
