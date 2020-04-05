package com.d1abl023.alien.core.exceptions;

import com.d1abl023.alien.tables.DialogsTable;
import com.d1abl023.alien.tables.MessagesTable;


/**
 * Exception {@code InappropriateMessageForDialogException} should be thrown when message in table "messages"
 * is incompatible values for dialog in table "dialogs".
 * "Dialog.id" should be equals with "Messages.dialogId".
 */
public class InappropriateMessageForDialogException extends Throwable {

    public InappropriateMessageForDialogException(MessagesTable message, DialogsTable dialog) {
        super(message.toString() + "\n" + dialog.toString());
    }
}
