package com.d1abl023.alien.utilactions;

import com.d1abl023.alien.tables.*;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.cfg.Environment;

import java.util.Properties;

public class HibernateUtils {

    private static Properties properties;
    private static SessionFactory sessionFactory;

    private static Properties getProperties(){
        if(properties == null){
            properties = new Properties();
            properties.put(Environment.DRIVER, "org.postgresql.Driver");
            properties.put(Environment.URL, "jdbc:postgresql://localhost:5432/alien");
            properties.put(Environment.USER, "postgres");
            properties.put(Environment.PASS, "postgres");
            properties.put(Environment.DIALECT, "org.hibernate.dialect.PostgreSQL95Dialect");
            properties.put(Environment.SHOW_SQL, "true");
        }
        return properties;
    }

    @SuppressWarnings("WeakerAccess")
    public static Configuration getConfiguration(){
        return new Configuration()
                .setProperties(getProperties())
                .addAnnotatedClass(UserAuthData.class)
                .addAnnotatedClass(UserGeneralData.class)
                .addAnnotatedClass(UserNameData.class)
                .addAnnotatedClass(UserAdditionalData.class)
                .addAnnotatedClass(UserMentionsId.class)
                .addAnnotatedClass(Messages.class)
                .addAnnotatedClass(Dialogs.class);
    }

    public static SessionFactory getSessionFactory() {
        if (sessionFactory == null){
            sessionFactory = getConfiguration().buildSessionFactory(
                    new StandardServiceRegistryBuilder().applySettings(
                            getConfiguration().getProperties())
                            .build()
            );
        }

        return sessionFactory;
    }
}
