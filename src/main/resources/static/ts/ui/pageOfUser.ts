import * as $ from "jquery";
import Uri = require("jsuri");
import {AbstractPage} from "../utils/abstractPage";
import {WebSocketClient} from "../utils/webSocketClient";

export class PageOfUser extends AbstractPage {

  private webSocketClient: WebSocketClient;

  constructor(myId: string, myUsername: string) {
    super(myId, myUsername);
    this.render();
    this.webSocketClient = new WebSocketClient(this.myId, this.myUsername);
    this.showUserInfo();
  }

  public showUserInfo() {
    let uri = new Uri(window.location.href);


    $.ajax({
      url: "user_info",
      type: "POST",
      data: uri.getQueryParamValue("pageOfUser"),
      contentType: "application/json; charset=utf-8",
    }).then(function (data) {
      for (let key in data) {
        if (data.hasOwnProperty(key) && data[key] != null) {
          if (key === "login") {
            document.title = data[key];
            document.querySelector("h5#username").innerHTML = data[key];
            continue;
          }
          let element = document.createElement("div");
          element.className = "user_info_line col-12";

          let label = document.createElement("div");
          label.className = "user_info_label col-4";
          label.textContent = key + ":";

          let info = document.createElement("div");
          info.className = "user_info_data col-8";
          info.textContent = data[key];

          element.appendChild(label);
          element.appendChild(info);

          document.querySelector("div#user_info_fields").appendChild(element);
        }
      }
    });
  };

  public render() {
    let body: HTMLElement = document.getElementById("body");
    body.innerHTML = `<div id='short_user_data' class='card mb-3'>
      <div class="row no-gutters">
      <div class="col-md-4">
      <svg class="bd-placeholder-img" width="100%" height="250" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Image">
        <title>Placeholder</title>
        <rect width="100%" height="100%" fill="#868e96"></rect>
        <text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image</text>
      </svg>
      </div>
      <div class="col-md-8">
        <div class="card-body">
            <h5 id="username" class="card-title">Card title</h5>
            <p class="card-text"><small class="text-muted">Was online 3 mins ago</small></p>
            <div id="user_info_fields" class="card-text"></div>
          </div>
        </div>
       </div>
      </div>`;

    body.appendChild(this.createNewMessagePopupElement());
  }

}
