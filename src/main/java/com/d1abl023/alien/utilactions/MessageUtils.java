package com.d1abl023.alien.utilactions;

import com.d1abl023.alien.core.exceptions.ExcessNumberOfTableValuesException;
import com.d1abl023.alien.model.Message;
import com.d1abl023.alien.tables.Dialogs;
import com.d1abl023.alien.tables.UserMessage;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import java.util.List;


public class MessageUtils {

    private static Logger logger = LogManager.getLogger();

    public static boolean insertMsgIntoDB(Message msg) throws ExcessNumberOfTableValuesException {
        Long dialogId;

        // If dialog id is not defined, fetch id from database
        if (new Long(msg.getDialogId()).equals(0L)) {
            Session dialogsTableSession = HibernateUtils.getSessionFactory().openSession();
            Transaction dialogsTableTransaction = dialogsTableSession.beginTransaction();
            // TODO: To write query that will fetch data faster
            Query fetchDialogFromDB = dialogsTableSession.createQuery("from Dialogs dialog " +
                    "where (dialog.user1=:sender and dialog.user2=:receiver)" +
                    "or (dialog.user1=:receiver and dialog.user2=:sender)");
            fetchDialogFromDB.setParameter("sender", new Long(msg.getSenderId()));
            fetchDialogFromDB.setParameter("receiver", new Long(msg.getReceiverId()));
            List fetchedDialogs = fetchDialogFromDB.getResultList();
            dialogsTableTransaction.commit();
            dialogsTableSession.close();

            // Should be fetched only one value from DB
            if (fetchedDialogs.size() == 1) {
                dialogId = ((Dialogs) fetchedDialogs.get(0)).getId();
            } else if (fetchedDialogs.size() > 1) {
                throw new ExcessNumberOfTableValuesException("There are too many values in table \"dialogs\"", fetchedDialogs.size() - 1);
            } else {
                // Creates new dialog in table Dialogs

                Session createNewDialogSession = HibernateUtils.getSessionFactory().openSession();
                Transaction createNewDialogTransaction = createNewDialogSession.beginTransaction();
                dialogId = (Long) createNewDialogSession.save(
                        new Dialogs(new Long(msg.getSenderId()), new Long(msg.getReceiverId()),
                                msg.getSenderLogin(), msg.getReceiverLogin()));
                createNewDialogTransaction.commit();
                createNewDialogSession.close();
            }
        } else {
            dialogId = new Long(msg.getDialogId());
        }

//        logger.debug("Dialog id = " + dialogId);

        if (dialogId != null && dialogId != 0) {
            UserMessage message = new UserMessage(
                    dialogId,
                    new Long(msg.getSenderId()),
                    new Long(msg.getReceiverId()),
                    msg.getText(),
                    new Long(msg.getTimestamp())
            );

            // Insertion message into table "messages"
            Session insertMessageSession = HibernateUtils.getSessionFactory().openSession();
            Transaction insertMessageTransaction = insertMessageSession.beginTransaction();
            Long messageId = (Long) insertMessageSession.save(message);
            insertMessageTransaction.commit();
            insertMessageSession.close();

             msg.setId(Long.toString(messageId));

            return messageId != 0;
        }
        return false;
    }
}
