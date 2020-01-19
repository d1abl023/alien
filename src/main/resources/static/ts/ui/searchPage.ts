export class SearchPage {
    public search() {

        const thisClass = this;
        document.getElementById("search_results").innerText = "";
        let searchVal = (<HTMLInputElement>document.getElementById("search_field")).value;

        $.ajax({
            url: "search",
            type: "POST",
            data: searchVal,
            contentType: "text/plain; charset=utf-8",
            complete: (function (data) {
                console.log(data.responseJSON);
                let response = data.responseJSON;

                if (response.hasOwnProperty("users")) {
                    let users = data.responseJSON["users"];
                    for (let i = 0; i < users.length; i += 2) {

                        let line = document.createElement("div");
                        line.className = "line";
                        line.appendChild(thisClass.createUserBlock(users[i]));

                        if (i + 1 < users.length) {
                            line.appendChild(thisClass.createUserBlock(users[i + 1]));
                        }
                        $("#search_results").append(line);
                    }
                }

            })
        });

    };

    public createUserBlock (userEntity) {
        let login = document.createElement("div");
        login.className = "login";
        login.innerText = userEntity.login;

        let location = document.createElement("div");
        location.className = "location";
        location.innerText = userEntity.country + ", " + userEntity.city;


        let openProfileButton = <HTMLButtonElement>document.createElement("button");
        openProfileButton.className = "open_profile_button";
        openProfileButton.addEventListener("click", (e:Event)=> this.openProfile(userEntity.id));
        openProfileButton.innerText = "Open";

        let sendMessageButton = document.createElement("button");
        sendMessageButton.className = "send_message_button";
        sendMessageButton.addEventListener("click", (e:Event)=> this.openBlockForMessageSending(userEntity.id));

        sendMessageButton.innerText = "Message";


        let user = document.createElement("div");
        user.className = "user";
        user.appendChild(login);
        user.appendChild(location);
        user.appendChild(openProfileButton);
        user.appendChild(sendMessageButton);

        return user;
    };

    public openProfile = function (id) {
        window.location.href = "page_of_user.html?" + id;
    };

    public openBlockForMessageSending(receiverId) {

    };
}