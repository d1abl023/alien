import {AbstractPage} from "../utils/abstractPage";

export class SpendingsPage extends AbstractPage{



    constructor(myId: string, myUsername: string) {
        super(myId, myUsername);

        $.ajax({
            url: `/getMySpendings`,
        })
    }

    render(): void {
    }
}