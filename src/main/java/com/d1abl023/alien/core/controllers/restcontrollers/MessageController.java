package com.d1abl023.alien.core.controllers.restcontrollers;

import com.d1abl023.alien.core.exceptions.InappropriateMessageForDialogException;
import com.d1abl023.alien.model.Message;
import com.d1abl023.alien.tables.DialogsTable;
import com.d1abl023.alien.tables.MessagesTable;
import com.d1abl023.alien.utilactions.HibernateUtils;
import com.d1abl023.alien.utilactions.MessageUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.TypedQuery;
import java.security.Principal;
import java.util.*;

@RestController
public class MessageController {

    private static final Logger logger = LogManager.getLogger();


    /**
     * Method getDialogList fetch from DB all dialogs of current user using it's principal as id.
     *
     * @param principal principal of the current user that makes request
     * @return map with pairs ( dialogId = lastMessage )
     */
    @RequestMapping(value = "/get_dialog_list")
    public Map<String, Message> getDialogList(Principal principal) {

        Map<String, Message> response = new LinkedHashMap<>();

        List<Message> sortedlastMessages = MessageUtils.getSortedLastMessages(MessageUtils.getUserDialogsList(principal));

        for (Message message : sortedlastMessages) {
            response.put(message.getDialogId(), message);
        }

        return response;
    }

    @RequestMapping(value = "/get_message_history")
    public List<Message> getMessageHistory(@RequestBody String dialogId) {
        Session session = HibernateUtils.getSessionFactory().openSession();
        Transaction transaction = session.beginTransaction();
        TypedQuery<MessagesTable> query = session.createQuery(
                "from MessagesTable messages where messages.dialogId = :dialogId",
                MessagesTable.class
        );
        query.setParameter("dialogId", new Long(dialogId));
        List<MessagesTable> messageList = query.getResultList();
        DialogsTable dialog = session.get(DialogsTable.class, new Long(dialogId));
        transaction.commit();
        session.close();

        List<Message> responseList = new LinkedList<>();
        for (MessagesTable message : messageList) {
            try {
                if (message.getSenderId() == dialog.getUser1() && message.getReceiverId() == dialog.getUser2()) {
                    responseList.add(new Message(
                            Long.toString(message.getId()),
                            Long.toString(message.getTimestamp()),
                            Long.toString(message.getDialogId()),
                            Long.toString(message.getSenderId()),
                            Long.toString(message.getReceiverId()),
                            message.getText(),
                            dialog.getUser1Login(),
                            dialog.getUser2Login()
                    ));
                } else if (message.getSenderId() == dialog.getUser2() && message.getReceiverId() == dialog.getUser1()) {
                    responseList.add(new Message(
                            Long.toString(message.getId()),
                            Long.toString(message.getTimestamp()),
                            Long.toString(message.getDialogId()),
                            Long.toString(message.getSenderId()),
                            Long.toString(message.getReceiverId()),
                            message.getText(),
                            dialog.getUser2Login(),
                            dialog.getUser1Login()
                    ));
                } else {
                    throw new InappropriateMessageForDialogException(message, dialog);
                }

            } catch (InappropriateMessageForDialogException e) {
                e.printStackTrace();
            }
        }
        return responseList;
    }


}