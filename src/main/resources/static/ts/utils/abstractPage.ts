export abstract class AbstractPage {

    public abstract render(): void;

    protected createNewMessagePopupElement(): HTMLDivElement {
        let popUp: HTMLDivElement = document.createElement("div");
        popUp.id = "newMessagePopUp";
        popUp.className = "popup";
        let senderUsername: HTMLDivElement = document.createElement("div");
        senderUsername.id = "sender_username";
        let partOfMessageText: HTMLDivElement = document.createElement("div");
        partOfMessageText.id = "part_of_message_text";
        popUp.append(senderUsername, partOfMessageText);
        return popUp;
    }
}