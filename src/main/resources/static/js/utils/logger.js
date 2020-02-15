"use strict";
exports.__esModule = true;
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.getTimestamp = function () {
        var date = new Date();
        return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds();
    };
    Logger.info = function (message) {
        console.log(Logger.getTimestamp() + " [INFO] " + message);
    };
    Logger.error = function (message) {
        console.error(Logger.getTimestamp() + " [ERROR] " + message);
    };
    return Logger;
}());
exports.Logger = Logger;
