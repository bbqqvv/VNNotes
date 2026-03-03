"use strict";

var QWebChannelMessageTypes = {
    QtContext: 0,
    Handler: 1,
    Init: 2,
    Idle: 3,
    Debug: 4,
    Error: 5,
    Signal: 6,
    Response: 7,
    PropertyUpdate: 8,
    DirectCall: 9,
    DirectResponse: 10
};

var QWebChannel = function (transport, initCallback) {
    if (typeof transport !== "object" || typeof transport.send !== "function") {
        console.error("The QWebChannel transport object is invalid!");
        return;
    }

    var self = this;
    this.transport = transport;

    this.send = function (data) {
        if (typeof data !== "string") {
            data = JSON.stringify(data);
        }
        self.transport.send(data);
    };

    this.transport.onmessage = function (message) {
        var data = message.data;
        if (typeof data === "string") {
            data = JSON.parse(data);
        }
        switch (data.type) {
            case QWebChannelMessageTypes.Signal:
                self.handleSignal(data);
                break;
            case QWebChannelMessageTypes.Response:
                self.handleResponse(data);
                break;
            case QWebChannelMessageTypes.PropertyUpdate:
                self.handlePropertyUpdate(data);
                break;
            case QWebChannelMessageTypes.DirectResponse:
                self.handleDirectResponse(data);
                break;
            default:
                console.error("invalid message type received: " + data.type);
                break;
        }
    };

    this.execCallbacks = {};
    this.execId = 0;
    this.exec = function (data, callback) {
        if (!callback) {
            self.send(data);
            return;
        }
        var id = self.execId++;
        self.execCallbacks[id] = callback;
        data.id = id;
        self.send(data);
    };

    this.objects = {};

    this.handleSignal = function (message) {
        var object = self.objects[message.object];
        if (object) {
            object.signalEmitted(message.signal, message.args);
        } else {
            console.warn("Unhandled signal: " + message.object + "::" + message.signal);
        }
    };

    this.handleResponse = function (message) {
        if (!message.hasOwnProperty("id")) {
            console.error("Invalid response message received: ", message);
            return;
        }
        self.execCallbacks[message.id](message.data);
        delete self.execCallbacks[message.id];
    };

    this.handlePropertyUpdate = function (message) {
        for (var i in message.signals) {
            var object = self.objects[i];
            if (object) {
                object.propertyUpdate(message.signals[i]);
            } else {
                console.warn("Unhandled property update: " + i);
            }
        }
    };

    this.handleDirectResponse = function (message) {
        if (!message.hasOwnProperty("id")) {
            console.error("Invalid direct response message received: ", message);
            return;
        }
        self.execCallbacks[message.id](message.data);
        delete self.execCallbacks[message.id];
    };

    this.send({ type: QWebChannelMessageTypes.Init }, function (data) {
        for (var objectName in data) {
            var object = new QObject(objectName, data[objectName], self);
        }
        for (var objectName in data) {
            var object = self.objects[objectName];
            object.connectSignals();
        }
        if (initCallback) {
            initCallback(self);
        }
    });
};

function QObject(name, data, webChannel) {
    this.__id__ = name;
    webChannel.objects[name] = this;

    this.__objectSignals__ = data.signals;
    this.__methods__ = data.methods;

    this.webChannel = webChannel;

    var self = this;

    for (var i = 0; i < data.methods.length; ++i) {
        var methodName = data.methods[i][0];
        var methodId = data.methods[i][1];

        this[methodName] = (function (id, name) {
            return function () {
                var args = [];
                var callback;
                for (var j = 0; j < arguments.length; ++j) {
                    if (typeof arguments[j] === "function") {
                        callback = arguments[j];
                    } else {
                        args.push(arguments[j]);
                    }
                }
                self.webChannel.exec({
                    type: QWebChannelMessageTypes.DirectCall,
                    object: self.__id__,
                    method: id,
                    args: args
                }, callback);
            };
        })(methodId, methodName);
    }

    this.signalEmitted = function (signalName, args) {
        if (this[signalName]) {
            this[signalName].emit.apply(this[signalName], args);
        }
    };

    this.propertyUpdate = function (signals) {
        for (var signalName in signals) {
            this.signalEmitted(signalName, signals[signalName]);
        }
    };

    this.connectSignals = function () {
        for (var i = 0; i < self.__objectSignals__.length; ++i) {
            var signalName = self.__objectSignals__[i];
            this[signalName] = {
                connections: [],
                connect: function (callback) {
                    this.connections.push(callback);
                },
                disconnect: function (callback) {
                    var index = this.connections.indexOf(callback);
                    if (index !== -1) {
                        this.connections.splice(index, 1);
                    }
                },
                emit: function () {
                    for (var j = 0; j < this.connections.length; ++j) {
                        this.connections[j].apply(null, arguments);
                    }
                }
            };
        }
    };
}

if (typeof module !== 'undefined') {
    module.exports = {
        QWebChannel: QWebChannel
    };
}
