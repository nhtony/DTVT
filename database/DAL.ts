import {PoolManager} from './PoolManager';

export class DAL {
    protected pool: any = null;
    protected createConnectionPool = async (name:string) => {
        this.pool = await PoolManager.createPool(name);
    };
}