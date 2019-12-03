package com.d1abl023.alien.core.controllers.restcontrollers;

import com.d1abl023.alien.core.exceptions.InappropriateMessageForDialogException;
import com.d1abl023.alien.model.Message;
import com.d1abl023.alien.tables.Dialogs;
import com.d1abl023.alien.tables.UserMessage;
import com.d1abl023.alien.utilactions.HibernateUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.Query;
import java.security.Principal;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

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
    public Map<Long, Message> getDialogList(Principal principal) {

        Map<Long, Message> response = new LinkedHashMap<>();

        //Get list of dialog id which refer to user
        Session dialogsTableSession = HibernateUtils.getSessionFactory().openSession();
        Transaction dialogsTableTransactions = dialogsTableSession.beginTransaction();
        //Select all from table "dialogs" where
        Query dialogsTableSessionQuery = dialogsTableSession
                .createQuery("from Dialogs dialogs where dialogs.user1 = :id or user2 = :id");
        dialogsTableSessionQuery.setParameter("id", new Long(principal.getName()));
        List dialogs = dialogsTableSessionQuery.getResultList();
        dialogsTableTransactions.commit();

        for (Object tmpObj : dialogs) {
            Dialogs dialog = (Dialogs) tmpObj;

            Session messagesTableSession = HibernateUtils.getSessionFactory().openSession();
            Transaction messagesTableTransaction = messagesTableSession.beginTransaction();
            //Select the last message for each dialog
            Query messageTableQuery = messagesTableSession.createQuery("from UserMessage msg1 where msg1.timestamp = " +
                    "(select max(msg2.timestamp) from UserMessage msg2 where msg2.dialogId = :id) and msg1.dialogId = :id");
            messageTableQuery.setParameter("id", dialog.getId());
            List listWithMessages = messageTableQuery.getResultList();
            if (listWithMessages.size() > 0) {
                UserMessage userMessage = (UserMessage) listWithMessages.get(0);
                String senderLogin;
                String receiverLogin;

                // Defines sender login and receiver login
                if (new Long(userMessage.getSenderId()).equals(dialog.getUser1()) &&
                        new Long(userMessage.getReceiverId()).equals(dialog.getUser2())) {
                    senderLogin = dialog.getUser1Login();
                    receiverLogin = dialog.getUser2Login();
                } else if (new Long(userMessage.getSenderId()).equals(dialog.getUser2()) &&
                        new Long(userMessage.getReceiverId()).equals(dialog.getUser1())) {
                    senderLogin = dialog.getUser2Login();
                    receiverLogin = dialog.getUser1Login();
                } else {
                    throw new InternalError("Error while checking sender and receiver login. " +
                            "Probably this message is not applicable to that dialog." +
                            "Dialog: " + dialog.toString() + "\t" +
                            "Message: " + userMessage.toString());
                }

                Message message = new Message(
                        Long.toString(userMessage.getId()),
                        Long.toString(userMessage.getTimestamp()),
                        Long.toString(userMessage.getDialogId()),
                        Long.toString(userMessage.getSenderId()),
                        Long.toString(userMessage.getReceiverId()),
                        userMessage.getText(),
                        senderLogin,
                        receiverLogin);
                response.put(dialog.getId(), message);
            }
            messagesTableTransaction.commit();
        }

        return response;
    }

    @RequestMapping(value = "/get_message_history")
    public List<Message> getMessageHistory(@RequestBody String dialogId) {
        Session session = HibernateUtils.getSessionFactory().openSession();
        Transaction transaction = session.beginTransaction();
        Query query = session.createQuery("from UserMessage messages where messages.dialogId = :dialogId");
        query.setParameter("dialogId", new Long(dialogId));
        List messageList = query.getResultList();
        Dialogs dialog = session.get(Dialogs.class, new Long(dialogId));
        transaction.commit();
        session.close();

        List<Message> responseList = new LinkedList<>();
        for (Object dbMessage : messageList) {
            UserMessage message = (UserMessage) dbMessage;
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
