package com.d1abl023.alien.utilactions;

import com.d1abl023.alien.core.exceptions.ExcessNumberOfTableValuesException;
import com.d1abl023.alien.model.Message;
import com.d1abl023.alien.tables.Dialogs;
import com.d1abl023.alien.tables.UserMessage;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import java.util.List;


public class MessageUtils {

    public static boolean insertMsgIntoDB(Message msg) throws ExcessNumberOfTableValuesException {

        Long dialogId;

        // If dialog id is not defined, fetch id from database
        if (msg.getDialogId() == 0) {

//            System.out.println("!!!!    Trying to fetch dialogID    !!!!");

            Session dialogsTableSession = HibernateUtils.getSessionFactory().openSession();
            Transaction dialogsTableTransaction = dialogsTableSession.beginTransaction();
            // TODO: To write query that will fetch data faster
            Query fetchDialogFromDB = dialogsTableSession.createQuery("from Dialogs dialog " +
                    "where (dialog.user1=:sender and dialog.user2=:receiver)" +
                    "or (dialog.user1=:receiver and dialog.user2=:sender)");
            fetchDialogFromDB.setParameter("sender", new Long(msg.getSender()));
            fetchDialogFromDB.setParameter("receiver", new Long(msg.getReceiver()));
            List fetchedDialogs = fetchDialogFromDB.getResultList();
            dialogsTableTransaction.commit();
            dialogsTableSession.close();

//            System.out.println("!!!!    Finished fetching. Fetching size " + fetchedDialogs.size());

            // Should be fetched only one value from DB
            if (fetchedDialogs.size() == 1) {
                dialogId = ((Dialogs) fetchedDialogs.get(0)).getId();
            } else if (fetchedDialogs.size() > 1) {
                throw new ExcessNumberOfTableValuesException("There are too many values in table \"dialogs\"", fetchedDialogs.size() - 1);
            } else {
                // Creates new dialog in table Dialogs

//                System.out.println("!!!!    Creating new dialog    !!!!");

                Session createNewDialogSession = HibernateUtils.getSessionFactory().openSession();
                Transaction createNewDialogTransaction = createNewDialogSession.beginTransaction();
                dialogId = (Long) createNewDialogSession.save(new Dialogs(new Long(msg.getSender()), new Long(msg.getReceiver())));
                createNewDialogTransaction.commit();
                createNewDialogSession.close();
            }
        } else {
            dialogId = msg.getDialogId();
        }

//        System.out.println("!!!!    Dialog id: " + dialogId + "    !!!!");

        if (dialogId != null && dialogId != 0) {
            UserMessage message = new UserMessage(
                    dialogId,
                    msg.getSender(),
                    msg.getReceiver(),
                    msg.getText(),
                    new Long(msg.getTimestamp())
            );

//            System.out.println("!!!!    Inserting message   !!!!");

            // Insertion message into table "messages"
            Session insertMessageSession = HibernateUtils.getSessionFactory().openSession();
            Transaction insertMessageTransaction = insertMessageSession.beginTransaction();
            Long messageId = (Long) insertMessageSession.save(message);
            insertMessageTransaction.commit();
            insertMessageSession.close();

//            System.out.println("!!!!    Message id: " + messageId + "   !!!!");

            return messageId != null && messageId != 0;
        }
        return false;
    }
}
