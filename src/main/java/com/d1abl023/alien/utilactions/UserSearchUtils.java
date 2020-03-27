package com.d1abl023.alien.utilactions;

import com.d1abl023.alien.tables.UserNameData;
import org.hibernate.Session;

import javax.persistence.TypedQuery;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class UserSearchUtils {

    public static Map<Long, UserNameData> searchByFullName(Session session, String firstName, String secondName, String lastName) {
        TypedQuery<UserNameData> selectUsers = session.createQuery(
                "from UserNameData user where user.firstName = :firstName " +
                        "and user.secondName = :secondName and user.lastName = :lastName", UserNameData.class);
        selectUsers.setParameter("firstName", firstName);
        selectUsers.setParameter("secondName", secondName);
        selectUsers.setParameter("lastName", lastName);

        return UserSearchUtils.performUserNameDataListToMap(selectUsers.getResultList());
    }

    public static Map<Long, UserNameData> searchByShortName(Session session, String firstName, String lastName) {
        TypedQuery<UserNameData> selectUsersAsFLName = session.createQuery(
                "from UserNameData user where user.firstName = :firstName " +
                        "and user.lastName = :lastName", UserNameData.class);
        selectUsersAsFLName.setParameter("firstName", firstName);
        selectUsersAsFLName.setParameter("lastName", lastName);

        TypedQuery<UserNameData> selectUsersAsSLName = session.createQuery(
                "from UserNameData user where user.secondName = :secondName " +
                        "and user.lastName = :lastName", UserNameData.class);
        selectUsersAsSLName.setParameter("secondName", firstName);
        selectUsersAsSLName.setParameter("lastName", lastName);

        return UserSearchUtils.performUserNameDataListToMap(
                Stream.concat(
                        selectUsersAsFLName.getResultList().stream(), selectUsersAsSLName.getResultList().stream()
                ).collect(Collectors.toList())
        );
    }

    public static Map<Long, UserNameData> searchByFirstName(Session session, String firstName) {
        TypedQuery<UserNameData> selectUsers = session.createQuery(
                "from UserNameData user where user.firstName = :firstName", UserNameData.class);
        selectUsers.setParameter("firstName", firstName);
        return UserSearchUtils.performUserNameDataListToMap(selectUsers.getResultList());
    }

    public static Map<Long, UserNameData> searchBySecondName(Session session, String secondName) {
        TypedQuery<UserNameData> selectUsers = session.createQuery(
                "from UserNameData user where user.secondName = :secondName", UserNameData.class);
        selectUsers.setParameter("secondName", secondName);
        return UserSearchUtils.performUserNameDataListToMap(selectUsers.getResultList());
    }

    public static Map<Long, UserNameData> searchByLastName(Session session, String lastName) {
        TypedQuery<UserNameData> selectUsers = session.createQuery(
                "from UserNameData user where user.lastName = :lastName", UserNameData.class);
        selectUsers.setParameter("lastName", lastName);
        return UserSearchUtils.performUserNameDataListToMap(selectUsers.getResultList());
    }

    private static Map<Long, UserNameData> performUserNameDataListToMap(List<UserNameData> userNameDataList) {
        Map<Long, UserNameData> userNameDataMap = new LinkedHashMap<>();
        for (UserNameData userNameDataObj : userNameDataList) {
            userNameDataMap.put(userNameDataObj.getId(), userNameDataObj);
        }
        return userNameDataMap;
    }
}
