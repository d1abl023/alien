package com.d1abl023.hrhelper.utilactions;

import com.d1abl023.hrhelper.model.Message;
import com.d1abl023.hrhelper.tables.DialogsTable;
import com.d1abl023.hrhelper.tables.MessagesTable;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.NonUniqueResultException;
import org.hibernate.Session;
import org.hibernate.Transaction;

import javax.persistence.NoResultException;
import javax.persistence.TypedQuery;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


public class MessageUtils {

    private static Logger logger = LogManager.getLogger();

    /**
     * Method {@code insertMsgIntoDB} creates object of class {@code UserMessage} from
     * object of class {@code Message} and inserts it in database table "messages".
     *
     * @param msg object of class {@code Message}
     * @return {@code true} if message has been successful inserted or {@code false} if not inserted
     */
    public static boolean insertMessageIntoDB(Message msg) {
        Long dialogId = null;
        boolean inserted = false;
        try {
            // If dialog id is not defined, fetch id from database
            if (new Long(msg.getDialogId()).equals(0L)) {
                dialogId = MessageUtils.getDialogIdForMessage(msg);
            } else {
                dialogId = new Long(msg.getDialogId());
            }
        } catch (NoResultException e) {
            dialogId = createNewDialogForNewMsgInDB(msg);
        } catch (NonUniqueResultException e) {
            logger.error("There are too many values in table \"dialogs\".");
        } catch (Exception e) {
            logger.error("Exception during defining dialog id for a message.");
        } finally {
            logger.debug("Dialog id = " + dialogId);
            try {
                if (dialogId != null && dialogId != 0) {
                    MessagesTable message = new MessagesTable(
                            dialogId,
                            new Long(msg.getSenderId()),
                            new Long(msg.getReceiverId()),
                            msg.getText(),
                            new Long(msg.getTimestamp())
                    );

                    inserted = MessageUtils.insertUserMessageIntoDB(message) != 0;
                }else{
                    //TODO: to specify exception
                    throw new Exception();
                }
            } catch (Exception e) {
                logger.error("Exceptions during inserting new message in database.");
            }
        }
        return inserted;
    }

    /**
     * Method {@code createNewDialogForNewMsg} creates new records in database for message
     *
     * @param msg message that requires new dialog
     * @return id of created dialog
     */
    public static long createNewDialogForNewMsgInDB(Message msg) {
        Session createNewDialogSession = HibernateUtils.getSessionFactory().openSession();
        Transaction createNewDialogTransaction = createNewDialogSession.beginTransaction();
        long dialogId = (Long) createNewDialogSession.save(
                new DialogsTable(new Long(msg.getSenderId()), new Long(msg.getReceiverId()),
                        msg.getSenderLogin(), msg.getReceiverLogin()));
        createNewDialogTransaction.commit();
        createNewDialogSession.close();
        return dialogId;
    }

    /**
     * Method {@code insertUserMessageIntoDB} inserts message in database in table "messages"
     *
     * @param message object of class {@code Message}
     * @return id of inserted message
     */
    public static long insertUserMessageIntoDB(MessagesTable message) {
        Session insertMessageSession = HibernateUtils.getSessionFactory().openSession();
        Transaction insertMessageTransaction = insertMessageSession.beginTransaction();
        Long messageId = (Long) insertMessageSession.save(message);
        insertMessageTransaction.commit();
        insertMessageSession.close();
        return messageId;
    }

    /**
     * Method {@code getDialogIdForMessage} fetches id of dialog for message
     *
     * @param msg message that contain data for fetching id
     * @return id of dialog for message from arguments
     */
    public static long getDialogIdForMessage(Message msg) {
        Session dialogsTableSession = HibernateUtils.getSessionFactory().openSession();
        Transaction dialogsTableTransaction = dialogsTableSession.beginTransaction();
        // TODO: To write query that will fetch data faster
        TypedQuery<DialogsTable> fetchDialogFromDB = dialogsTableSession.createQuery(
                "from DialogsTable dialog where (dialog.user1=:sender and dialog.user2=:receiver)" +
                        "or (dialog.user1=:receiver and dialog.user2=:sender)", DialogsTable.class);
        fetchDialogFromDB.setParameter("sender", new Long(msg.getSenderId()));
        fetchDialogFromDB.setParameter("receiver", new Long(msg.getReceiverId()));

        long dialogId = fetchDialogFromDB.getSingleResult().getId();
        dialogsTableTransaction.commit();
        dialogsTableSession.close();
        return dialogId;
    }

    /**
     * Method {@code getUserDialogList} fetch from database table "dialogs" all records that are related
     * with user which are requested for.
     *
     * @param principal is {@code Principal} object chat contains user id.
     * @return list with dialogs fetched from database
     */
    public static List<DialogsTable> getUserDialogsList(Principal principal) {
        Session dialogsTableSession = HibernateUtils.getSessionFactory().openSession();
        Transaction dialogsTableTransactions = dialogsTableSession.beginTransaction();
        //Select all from table "dialogs" where
        TypedQuery<DialogsTable> dialogsTableSessionQuery = dialogsTableSession
                .createQuery("from DialogsTable dialogs where dialogs.user1 = :id or user2 = :id", DialogsTable.class);
        dialogsTableSessionQuery.setParameter("id", new Long(principal.getName()));
        List<DialogsTable> dialogs = dialogsTableSessionQuery.getResultList();
        dialogsTableTransactions.commit();
        return dialogs;
    }

    /**
     * Method {@code selectLastMessageOfDialog} select from table {@code dialogs} record that contain last message.
     * Record in database should have the biggest value of timestamp field and should contain value in dialogId field
     * identical with the id of a dialog.
     *
     * @param dialog the dialog to which the message relates by dialogId
     * @return {@code UserMessage} object that contains the last message of the dialog.
     */
    public static MessagesTable selectLastMessageOfDialog(DialogsTable dialog) {
        Session messagesTableSession = HibernateUtils.getSessionFactory().openSession();
        Transaction messagesTableTransaction = messagesTableSession.beginTransaction();
        TypedQuery<MessagesTable> messageTableQuery = messagesTableSession
                .createQuery("from MessagesTable msg1 where msg1.timestamp = (select max(msg2.timestamp) "
                        + "from MessagesTable msg2 where msg2.dialogId = :id) and msg1.dialogId = :id", MessagesTable.class);
        messageTableQuery.setParameter("id", dialog.getId());
        messagesTableTransaction.commit();
        return messageTableQuery.getSingleResult();
    }

    /**
     * Method {@code getSortedLastMessages} select last message from each dialog by timestamp value.
     *
     * @param dialogs is a list of dialogs which are selected last messages from
     * @return list with {@code Message} objects that are last messages of dialog
     */
    public static List<Message> getSortedLastMessages(List<DialogsTable> dialogs) {
        List<Message> messagesList = new ArrayList<>(dialogs.size());
        for (DialogsTable dialog : dialogs) {
            MessagesTable messagesTable = selectLastMessageOfDialog(dialog);
            String senderLogin, receiverLogin;

            // Defines sender login and receiver login
            if (messagesTable.getSenderId() == dialog.getUser1() && messagesTable.getReceiverId() == dialog.getUser2()) {
                senderLogin = dialog.getUser1Login();
                receiverLogin = dialog.getUser2Login();
            } else if (messagesTable.getSenderId() == dialog.getUser2() && messagesTable.getReceiverId() == dialog.getUser1()) {
                senderLogin = dialog.getUser2Login();
                receiverLogin = dialog.getUser1Login();
            } else {
                throw new InternalError("Error while checking sender and receiver login. " +
                        "Probably this message is not applicable to that dialog. " +
                        "Dialog: " + dialog.toString() + "\t" +
                        "Message: " + messagesTable.toString());
            }

            messagesList.add(new Message(
                    Long.toString(messagesTable.getId()),
                    Long.toString(messagesTable.getTimestamp()),
                    Long.toString(messagesTable.getDialogId()),
                    Long.toString(messagesTable.getSenderId()),
                    Long.toString(messagesTable.getReceiverId()),
                    messagesTable.getText(),
                    senderLogin,
                    receiverLogin));
        }
        MessagesQuickSort.descendingQuickSortByTimestamp(messagesList, 0, messagesList.size() - 1);
        return messagesList;
    }

    /**
     * Class {@code MessagesQuickSort} contains methods that perform ascending and descending
     * quick sorting by different parameters.
     */
    private static class MessagesQuickSort {

        /**
         * Method {@code ascendingQuickSortByTimestamp} sorts list with messages in ascending order
         * by timestamp.
         *
         * @param messages is a list with objects of type {@code Message} that sorts this method
         * @param begin    index which starts sorting from
         * @param end      index which sorting ends to
         */
        public static void ascendingQuickSortByTimestamp(List<Message> messages, int begin, int end) {
            if (begin < end) {
                int partitionIndex = MessagesQuickSort.ascendingPartitionByTimestamp(messages, begin, end);
                ascendingQuickSortByTimestamp(messages, begin, partitionIndex - 1);
                ascendingQuickSortByTimestamp(messages, partitionIndex + 1, end);
            }
        }

        /**
         * Method {@code descendingQuickSortByTimestamp} sorts list with messages in descending order
         * by timestamp.
         *
         * @param messages is a list with objects of type {@code Message} that sorts this method
         * @param begin    index which starts sorting from
         * @param end      index which sorting ends to
         */
        public static void descendingQuickSortByTimestamp(List<Message> messages, int begin, int end) {
            if (begin < end) {
                int partitionIndex = MessagesQuickSort.descendingPartitionByTimestamp(messages, begin, end);
                descendingQuickSortByTimestamp(messages, begin, partitionIndex - 1);
                descendingQuickSortByTimestamp(messages, partitionIndex + 1, end);
            }
        }

        /**
         * Method {@code ascendingPartitionByTimestamp} divide  list with messages in two parts from pivot element
         * by timestamp. At left side elements with timestamp < then pivot and at the right side inverse.
         *
         * @param messages is a list with objects of type {@code Message} that divide this method
         * @param begin    index which starts dividing from
         * @param end      index which ends dividing to
         */
        private static int ascendingPartitionByTimestamp(List<Message> messages, int begin, int end) {
            long pivot = new Long(messages.get((begin + end) / 2).getTimestamp());
            int i = begin;
            int j = end;

            while (i < j) {
                while (new Long(messages.get(i).getTimestamp()) < pivot) {
                    i++;
                }
                while (new Long(messages.get(j).getTimestamp()) > pivot) {
                    j--;
                }

                if (i <= j) {
                    Collections.swap(messages, i, j);
                    i++;
                    j--;
                }
            }
            return i;
        }

        /**
         * Method {@code descendingPartitionByTimestamp} divide  list with messages in two parts from pivot element
         * by timestamp. At left side elements with timestamp > then pivot and at the right side inverse.
         *
         * @param messages is a list with objects of type {@code Message} that sorts this method
         * @param begin    index which starts sorting from
         * @param end      index which sorting ends to
         */
        private static int descendingPartitionByTimestamp(List<Message> messages, int begin, int end) {
            long pivot = new Long(messages.get((begin + end) / 2).getTimestamp());
            int i = begin;
            int j = end;

            while (i < j) {
                while (new Long(messages.get(i).getTimestamp()) > pivot) {
                    i++;
                }
                while (new Long(messages.get(j).getTimestamp()) < pivot) {
                    j--;
                }

                if (i <= j) {
                    Collections.swap(messages, i, j);
                    i++;
                    j--;
                }
            }
            return i;
        }
    }
}
