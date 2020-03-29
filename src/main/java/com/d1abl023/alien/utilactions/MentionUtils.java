package com.d1abl023.alien.utilactions;

import com.d1abl023.alien.model.JSMention;
import com.d1abl023.alien.tables.MentionsTable;
import com.d1abl023.alien.tables.UserMentionsIdTable;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.Session;
import org.hibernate.Transaction;

public class MentionUtils {

    private static ObjectMapper mapper = new ObjectMapper();

    public boolean saveNewMentionInDB(JSMention mention) {
        try (Session session = HibernateUtils.getSessionFactory().openSession()) {
            MentionsTable mentionsTable = new MentionsTable();
            mentionsTable.setMention(MentionUtils.mapper.writeValueAsString(mention));

            Long mentionId = this.saveNewMentionInDB(session, mentionsTable);
            mention.setId(Long.toString(mentionId));
            Long mentionedPearsonId = new Long(mention.getMentionedPersonId());

            UserMentionsIdTable userMentionsIdTable = session.get(UserMentionsIdTable.class, mentionedPearsonId);
            if (userMentionsIdTable == null) {
                this.saveMentionIdInDB(session,mentionedPearsonId, mentionId);
            } else {
                this.updateMentionIdInDB(session, userMentionsIdTable, mentionId);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public Long getTotalNumberOfMentions() {
        Session session = HibernateUtils.getSessionFactory().openSession();
        String queryString = "select sum(userGeneralData.amountOfMentions) from UserGeneralDataTable userGeneralData";
        return session.createQuery(queryString, Long.class).getSingleResult();
    }

    private Long saveNewMentionInDB(Session session, MentionsTable mentionsTable){
        Transaction transaction = session.beginTransaction();
        Long mentionId = (Long) session.save(mentionsTable);
        transaction.commit();
        return mentionId;
    }

    private void saveMentionIdInDB(Session session, Long mentionedPearsonId, Long mentionId) {
        UserMentionsIdTable userMentionsIdTable = new UserMentionsIdTable(mentionedPearsonId, Long.toString(mentionId));
        Transaction transaction = session.beginTransaction();
        session.save(userMentionsIdTable);
        transaction.commit();
    }

    private void updateMentionIdInDB(Session session, UserMentionsIdTable userMentionsIdTable, Long mentionId){
        userMentionsIdTable.addElementToMentionIdList(Long.toString(mentionId));
        Transaction transaction = session.beginTransaction();
        session.update(userMentionsIdTable);
        transaction.commit();
    }

}
