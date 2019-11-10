package com.d1abl023.alien.core.controllers.restcontrollers;

import com.d1abl023.alien.model.Message;
import com.d1abl023.alien.tables.Dialogs;
import com.d1abl023.alien.tables.UserMessage;
import com.d1abl023.alien.utilactions.HibernateUtils;
import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.Query;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.security.Principal;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@RestController
public class MessageController {

    /**
     * Method getDialogList fetch from DB all dialogs of current user using it's principal as id.
     *
     * @param principal principal of the current user that makes request
     * @return map with pairs ( dialogId = lastMessage )
     * */
    @RequestMapping(value = "/get_dialog_list")
    public Map<Long, UserMessage> getDialogList(Principal principal) {

        Map<Long, UserMessage> response = new LinkedHashMap<>();

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
            List listWithMessages =  messageTableQuery.getResultList();
            if(listWithMessages.size() > 0) {
                UserMessage userMessage = (UserMessage) listWithMessages.get(0);
                response.put(dialog.getId(), userMessage);
            }
            messagesTableTransaction.commit();
        }

        return response;
    }

    @RequestMapping(value = "/get_message_history")
    public List getMessageHistory(Long dialogId){
        Session session = HibernateUtils.getSessionFactory().openSession();
        Transaction transaction = session.beginTransaction();

        Query query = session.createQuery("from UserMessage messages where messages.dialogId = :dialogId");
        query.setParameter("dialogId", dialogId);
        List messageList = query.getResultList();
        transaction.commit();
        return messageList;
    }

}
