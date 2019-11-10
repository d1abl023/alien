package com.d1abl023.alien.core.exceptions;


/**
 * Class {@code ExcessNumberOfTableValuesException} is a exception that is thrown
 * in case when fetched amount of database table values is bigger that expected.
 */
public class ExcessNumberOfTableValuesException extends Throwable {

    /**
     * Constructor with no arguments is used in case
     * when is not necessary to specify amount of excess values
     * and message that describes the problem
     */
    public ExcessNumberOfTableValuesException() {
        super();
    }

    /**
     * Constructor with argument {@code long amount}
     * is used in case when is necessary to specify amount of excess values
     *
     * @param amount amount of excess values
     */
    public ExcessNumberOfTableValuesException(long amount) {
        super("There are excess values in a table. Amount of excess values: " + amount);
    }

    /**
     * Constructor with arguments {@code String message} and {@code long amount}
     * is used in case when is necessary to specify amount of excess values
     * and message that describes the problem
     *
     * @param message message for specifying the problem
     * @param amount  amount of excess values
     */
    public ExcessNumberOfTableValuesException(String message, long amount) {
        super(message + " Amount of excess values: " + amount);
    }

}
