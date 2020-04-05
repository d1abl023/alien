import * as $ from "jquery";
import {IMention} from "../utils/templates/IMention";
import {Logger} from "../utils/Logger";
import { PageOfUser } from "./PageOfUser";

export class NewMentionBlock {
    private mentionedPersonData: { id: string, shortName: string };
    private myData: { myId: string, myCorpId: string };

    constructor(mentionedPersonData: { id: string, shortName: string }, myData: { myId: string, myCorpId: string }) {
        this.mentionedPersonData = mentionedPersonData;
        this.myData = myData;
        this.render();
    }

    private render(): void {
        let addNewMentionBlock: HTMLDivElement = document.createElement("div");
        addNewMentionBlock.id = "add_new_mention_block";
        addNewMentionBlock.className = "flex-column";
        addNewMentionBlock.innerHTML = `
            <h3 id="mentioned_person_info" class="text-dark justify-content-center">
                Add mention about ${this.mentionedPersonData.shortName}
            </h3>
            <textarea id="add_new_mention_field"></textarea>`;
        addNewMentionBlock.appendChild(this.createAddNewMentionButtonsBlock());
        $("#body").append(addNewMentionBlock);
    }


    private createAddNewMentionButtonsBlock(): HTMLDivElement {
        let sendButton: HTMLButtonElement = document.createElement("button");
        sendButton.id = "add_new_mention_button";
        sendButton.className = "btn btn-success send_new_message_block_button";
        sendButton.innerText = "Send";
        sendButton.addEventListener("click", () => this.onClickSend());

        let cancelButton: HTMLButtonElement = document.createElement("button");
        cancelButton.id = "cancel_button";
        cancelButton.className = "btn btn-danger send_new_message_block_button";
        cancelButton.innerText = "Cancel";
        cancelButton.addEventListener("click", () => this.onClickCancel());

        let addNewMentionButtonsBlock: HTMLDivElement = document.createElement("div");
        addNewMentionButtonsBlock.id = "add_new_mention_buttons";
        addNewMentionButtonsBlock.className = "col-12 justify-content-center";
        addNewMentionButtonsBlock.appendChild(sendButton);
        addNewMentionButtonsBlock.appendChild(cancelButton);
        return addNewMentionButtonsBlock;
    }

    private onClickSend = (): void => {
        let mention: IMention = {
            id: null,
            mentionedPersonId: this.mentionedPersonData.id,
            mentionFromId: this.myData.myId,
            mentionFromCorpId: this.myData.myCorpId,
            mention_text: $("#add_new_mention_field").val().toString(),
            timestamp: Date.now().toString()
        };

        $.post("add_new_mention", JSON.stringify(mention)).then((mentionId: string) => {
            Logger.info(`Mention was success sent, Mention id: ${mentionId}`);
            mention.id = mentionId;
            PageOfUser.addMentionBlock(mention);
        }).catch(() => {
            Logger.error("Mention sending failed. Please, try again.")
        });
        $("#add_new_mention_block").remove();
    };

    private onClickCancel = (): void => {
        $("#add_new_mention_block").remove();
    };
}