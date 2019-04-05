import { Application } from '@feathersjs/feathers';
export declare const ROUTER: unique symbol;
declare module '@feathersjs/feathers' {
    interface Application<ServiceTypes> {
        lookup(path: string): {
            [key: string]: string;
        };
    }
}
export declare const routing: () => (app: Application<any>) => void;
