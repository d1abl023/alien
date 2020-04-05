package com.d1abl023.hrhelper.utilactions;

import com.d1abl023.hrhelper.tables.UserNameDataTable;
import org.hibernate.Session;

import javax.persistence.TypedQuery;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class UserSearchUtils {

    public static Map<Long, UserNameDataTable> searchByFullName(Session session, String firstName, String secondName, String lastName) {
        TypedQuery<UserNameDataTable> selectUsers = session.createQuery(
                "from UserNameDataTable user where user.firstName = :firstName " +
                        "and user.secondName = :secondName and user.lastName = :lastName", UserNameDataTable.class);
        selectUsers.setParameter("firstName", firstName);
        selectUsers.setParameter("secondName", secondName);
        selectUsers.setParameter("lastName", lastName);

        return UserSearchUtils.performUserNameDataListToMap(selectUsers.getResultList());
    }

    public static Map<Long, UserNameDataTable> searchByShortName(Session session, String firstName, String lastName) {
        TypedQuery<UserNameDataTable> selectUsersAsFLName = session.createQuery(
                "from UserNameDataTable user where user.firstName = :firstName " +
                        "and user.lastName = :lastName", UserNameDataTable.class);
        selectUsersAsFLName.setParameter("firstName", firstName);
        selectUsersAsFLName.setParameter("lastName", lastName);

        TypedQuery<UserNameDataTable> selectUsersAsSLName = session.createQuery(
                "from UserNameDataTable user where user.secondName = :secondName " +
                        "and user.lastName = :lastName", UserNameDataTable.class);
        selectUsersAsSLName.setParameter("secondName", firstName);
        selectUsersAsSLName.setParameter("lastName", lastName);

        return UserSearchUtils.performUserNameDataListToMap(
                Stream.concat(
                        selectUsersAsFLName.getResultList().stream(), selectUsersAsSLName.getResultList().stream()
                ).collect(Collectors.toList())
        );
    }

    public static Map<Long, UserNameDataTable> searchByFirstName(Session session, String firstName) {
        TypedQuery<UserNameDataTable> selectUsers = session.createQuery(
                "from UserNameDataTable user where user.firstName = :firstName", UserNameDataTable.class);
        selectUsers.setParameter("firstName", firstName);
        return UserSearchUtils.performUserNameDataListToMap(selectUsers.getResultList());
    }

    public static Map<Long, UserNameDataTable> searchBySecondName(Session session, String secondName) {
        TypedQuery<UserNameDataTable> selectUsers = session.createQuery(
                "from UserNameDataTable user where user.secondName = :secondName", UserNameDataTable.class);
        selectUsers.setParameter("secondName", secondName);
        return UserSearchUtils.performUserNameDataListToMap(selectUsers.getResultList());
    }

    public static Map<Long, UserNameDataTable> searchByLastName(Session session, String lastName) {
        TypedQuery<UserNameDataTable> selectUsers = session.createQuery(
                "from UserNameDataTable user where user.lastName = :lastName", UserNameDataTable.class);
        selectUsers.setParameter("lastName", lastName);
        return UserSearchUtils.performUserNameDataListToMap(selectUsers.getResultList());
    }

    private static Map<Long, UserNameDataTable> performUserNameDataListToMap(List<UserNameDataTable> userNameDataTableList) {
        Map<Long, UserNameDataTable> userNameDataMap = new LinkedHashMap<>();
        for (UserNameDataTable userNameDataTableObj : userNameDataTableList) {
            userNameDataMap.put(userNameDataTableObj.getId(), userNameDataTableObj);
        }
        return userNameDataMap;
    }
}
