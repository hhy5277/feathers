import { Params } from '@feathersjs/feathers';
interface ServiceOptions {
    name: string;
    connection: any;
    method: string;
    events?: string[];
    timeout?: number;
}
export declare class Service {
    events: string[];
    path: string;
    connection: any;
    method: string;
    timeout: number;
    constructor(options: ServiceOptions);
    send(method: string, ...args: any[]): Promise<{}>;
    find(params?: Params): Promise<{}>;
    get(id: number | string, params?: Params): Promise<{}>;
    create(data: any, params?: Params): Promise<{}>;
    update(id: number | string, data: any, params?: Params): Promise<{}>;
    patch(id: number | string, data: any, params?: Params): Promise<{}>;
    remove(id: number | string, params?: Params): Promise<{}>;
    off(name: string, ...args: any[]): any;
}
export {};
