"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const errors_1 = require("@feathersjs/errors");
const debug = debug_1.default('@feathersjs/transport-commons/client');
const namespacedEmitterMethods = [
    'addListener',
    'emit',
    'listenerCount',
    'listeners',
    'on',
    'once',
    'prependListener',
    'prependOnceListener',
    'removeAllListeners',
    'removeListener'
];
const otherEmitterMethods = [
    'eventNames',
    'getMaxListeners',
    'setMaxListeners'
];
const addEmitterMethods = (service) => {
    otherEmitterMethods.forEach(method => {
        service[method] = function (...args) {
            if (typeof this.connection[method] !== 'function') {
                throw new Error(`Can not call '${method}' on the client service connection`);
            }
            return this.connection[method](...args);
        };
    });
    // Methods that should add the namespace (service path)
    namespacedEmitterMethods.forEach(method => {
        service[method] = function (name, ...args) {
            if (typeof this.connection[method] !== 'function') {
                throw new Error(`Can not call '${method}' on the client service connection`);
            }
            const eventName = `${this.path} ${name}`;
            debug(`Calling emitter method ${method} with ` +
                `namespaced event '${eventName}'`);
            const result = this.connection[method](eventName, ...args);
            return result === this.connection ? this : result;
        };
    });
};
class Service {
    constructor(options) {
        this.events = options.events;
        this.path = options.name;
        this.connection = options.connection;
        this.method = options.method;
        this.timeout = options.timeout || 5000;
        addEmitterMethods(this);
    }
    send(method, ...args) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => reject(new errors_1.Timeout(`Timeout of ${this.timeout}ms exceeded calling ${method} on ${this.path}`, {
                timeout: this.timeout,
                method,
                path: this.path
            })), this.timeout);
            args.unshift(method, this.path);
            args.push(function (error, data) {
                error = errors_1.convert(error);
                clearTimeout(timeoutId);
                return error ? reject(error) : resolve(data);
            });
            debug(`Sending socket.${this.method}`, args);
            this.connection[this.method](...args);
        });
    }
    find(params = {}) {
        return this.send('find', params.query || {});
    }
    get(id, params = {}) {
        return this.send('get', id, params.query || {});
    }
    create(data, params = {}) {
        return this.send('create', data, params.query || {});
    }
    update(id, data, params = {}) {
        return this.send('update', id, data, params.query || {});
    }
    patch(id, data, params = {}) {
        return this.send('patch', id, data, params.query || {});
    }
    remove(id, params = {}) {
        return this.send('remove', id, params.query || {});
    }
    // `off` is actually not part of the Node event emitter spec
    // but we are adding it since everybody is expecting it because
    // of the emitter-component Socket.io is using
    off(name, ...args) {
        if (typeof this.connection.off === 'function') {
            return this.connection.off(`${this.path} ${name}`, ...args);
        }
        else if (args.length === 0) {
            // @ts-ignore
            return this.removeAllListeners(name);
        }
        // @ts-ignore
        return this.removeListener(name, ...args);
    }
}
exports.Service = Service;
//# sourceMappingURL=client.js.map