import { Channel } from './channel/base';
import { keys } from './mixins';
import { Application } from '@feathersjs/feathers';
declare module '@feathersjs/feathers' {
    interface ServiceAddons<T> {
        publish(callback: (data: T, hook: HookContext<T>) => Channel): this;
        publish(event: string, callback: (data: T, hook: HookContext<T>) => Channel): this;
    }
    interface Application<ServiceTypes> {
        channels: string[];
        channel(name: string[]): Channel;
        channel(...names: string[]): Channel;
        publish<T>(callback: (data: T, hook: HookContext<T>) => Channel | Channel[] | void): Application<ServiceTypes>;
        publish<T>(event: string, callback: (data: T, hook: HookContext<T>) => Channel | Channel[] | void): Application<ServiceTypes>;
    }
}
export { keys };
export declare function channels(): (app: Application<any>) => void;
