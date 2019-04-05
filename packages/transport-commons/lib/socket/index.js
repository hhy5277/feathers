"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const channels_1 = require("../channels");
const routing_1 = require("../routing");
const utils_1 = require("./utils");
const debug = debug_1.default('@feathersjs/transport-commons');
function socket({ done, emit, socketKey, getParams }) {
    return (app) => {
        app.configure(channels_1.channels());
        app.configure(routing_1.routing());
        app.on('publish', utils_1.getDispatcher(emit, socketKey));
        // `connection` event
        done.then(provider => provider.on('connection', (connection) => app.emit('connection', getParams(connection))));
        // `socket.emit('methodName', 'serviceName', ...args)` handlers
        done.then(provider => provider.on('connection', (connection) => {
            for (const method of app.methods) {
                connection.on(method, (...args) => {
                    const path = args.shift();
                    debug(`Got '${method}' call for service '${path}'`);
                    utils_1.runMethod(app, getParams(connection), path, method, args);
                });
            }
        }));
        // Legacy `socket.emit('serviceName::methodName', ...args)` handlers
        app.mixins.push((service, path) => done.then(provider => {
            provider.on('connection', (socket) => {
                const methods = app.methods.filter(current => 
                // @ts-ignore
                typeof service[current] === 'function');
                for (const method of methods) {
                    const eventName = `${path}::${method}`;
                    socket.on(eventName, (...args) => {
                        debug(`Got legacy method call '${eventName}'`);
                        utils_1.runMethod(app, getParams(socket), path, method, args);
                    });
                }
            });
        }));
    };
}
exports.socket = socket;
//# sourceMappingURL=index.js.map