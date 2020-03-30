package com.d1abl023.alien.utilactions;

import com.d1abl023.alien.model.JSMention;
import com.d1abl023.alien.tables.MentionsTable;
import com.d1abl023.alien.tables.UserMentionsIdTable;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.Transaction;

import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.util.LinkedList;
import java.util.List;

public class MentionUtils {

    private static ObjectMapper mapper = new ObjectMapper();
    private static Logger logger = LogManager.getLogger();

    public List<JSMention> getMentionsAboutUser(Long userId) {
        Session session = HibernateUtils.getSessionFactory().openSession();
        UserMentionsIdTable userMentionsIdTableObject = session.get(UserMentionsIdTable.class, userId);

        if (userMentionsIdTableObject != null) {
            return this.getMentionsByTheirId(session, userMentionsIdTableObject.getMentionsIdList().split(", "));
        }
        return new LinkedList<>();
    }

    public List<JSMention> getMentionsByTheirId(@NotNull Session session, String[] mentionIdList) {
        List<JSMention> mentionList = new LinkedList<>();
        try {
            for (String mentionId : mentionIdList) {
                JSMention jsMention = MentionUtils.mapper.readValue(
                        session.get(MentionsTable.class, new Long(mentionId.trim())).getMention(),
                        JSMention.class
                );
                jsMention.setId(mentionId.trim());
                mentionList.add(jsMention);
            }
        } catch (IOException e) {
            e.printStackTrace();
            logger.error("JSMention string parsing error.");
        }
        return mentionList;
    }


    public Long saveNewMentionInDB(JSMention mention) {
        try (Session session = HibernateUtils.getSessionFactory().openSession()) {
            MentionsTable mentionsTable = new MentionsTable();
            mentionsTable.setMention(MentionUtils.mapper.writeValueAsString(mention));

            Long mentionId = this.saveNewMentionInDB(session, mentionsTable);
            mention.setId(Long.toString(mentionId));
            Long mentionedPearsonId = new Long(mention.getMentionedPersonId());

            UserMentionsIdTable userMentionsIdTable = session.get(UserMentionsIdTable.class, mentionedPearsonId);
            if (userMentionsIdTable == null) {
                this.saveMentionIdInDB(session, mentionedPearsonId, mentionId);
            } else {
                this.updateMentionIdInDB(session, userMentionsIdTable, mentionId);
            }
            return mentionId;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private Long saveNewMentionInDB(@NotNull Session session, MentionsTable mentionsTable) {
        Transaction transaction = session.beginTransaction();
        Long mentionId = (Long) session.save(mentionsTable);
        transaction.commit();
        return mentionId;
    }

    private void saveMentionIdInDB(@NotNull Session session, Long mentionedPearsonId, Long mentionId) {
        UserMentionsIdTable userMentionsIdTable = new UserMentionsIdTable(mentionedPearsonId, Long.toString(mentionId));
        Transaction transaction = session.beginTransaction();
        session.save(userMentionsIdTable);
        transaction.commit();
    }

    private void updateMentionIdInDB(@NotNull Session session, UserMentionsIdTable userMentionsIdTable, Long mentionId) {
        userMentionsIdTable.addElementToMentionIdList(Long.toString(mentionId));
        Transaction transaction = session.beginTransaction();
        session.update(userMentionsIdTable);
        transaction.commit();
    }

    public Long getTotalNumberOfMentions() {
        Session session = HibernateUtils.getSessionFactory().openSession();
        String queryString = "select sum(userGeneralData.amountOfMentions) from UserGeneralDataTable userGeneralData";
        return session.createQuery(queryString, Long.class).getSingleResult();
    }

}
