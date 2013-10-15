/*global define*/
define(function(require, exports, module) {
    var session = require("zed/session");

    var coffee = require("../preview/coffee-script");
    var lineRegex = /on line (\d+)/;

    return function(data, callback) {
        var path = data.path;
        session.getText(path, function(err, text) {
            try {
                coffee.compile(text);
            } catch(e) {
                var message = e.message;
                var match = lineRegex.exec(message);
                if(match) {
                    var line = parseInt(match[1], 10);
                    return session.setAnnotations(path, [{
                        row: line,
                        text: message.slice(0, match.index),
                        type: "error"
                    }], callback);
                }
            }
            session.setAnnotations(path, [], callback);
        });
    };
});