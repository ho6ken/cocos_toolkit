import { Node } from "cc";
import { SingleObj } from "../singleton/single_obj";

/**
 * 物件池
 */
export abstract class ObjPool<TK, TV> implements SingleObj {
    /**
     * 名稱
     */
    public get name(): string { return this.constructor.name; }

    /**
     * 物件池
     */
    protected declare _pool: Map<TK, TV[]>;

    /**
     * 初始化
     */
    public init(): void {
        this._pool = new Map();
    }

    /**
     * 關閉
     */
    public shutdown(): void {
        Array.from(this._pool.keys()).forEach(item => this.clear(item), this);
        this._pool.clear();
    }

    /**
     * 清除某池
     */
    public clear(key: TK): void {
        if (!this._pool.has(key)) {
            return;
        }

        let items = this._pool.get(key);

        items.forEach(item => {
            (item as Node)?.destroy();
            item = null;
        });

        items = [];
        this._pool.delete(key);
    }

    /**
     * 某池中物數量
     */
    public size(key: TK): number {
        if (!this._pool.has(key)) {
            return 0;
        }

        return this._pool.get(key).length;
    }

    /**
     * 取得物件
     */
    public async fetch(key: TK): Promise<TV> {
        let pool = this._pool.get(key);

        if (!pool) {
            return await this.spawn(key);
        }

        return pool.length > 0 ? pool.shift() : await this.spawn(key);
    }

    /**
     * 生成物件
     */
    protected abstract spawn(key: TK): Promise<TV>;

    /**
     * 回收物件
     */
    public recycle(obj: TV, key: TK): void {
        if (!obj) {
            return;
        }

        if (obj instanceof Node) {
            obj.removeFromParent();
        }

        if (!key) {
            if (obj instanceof Node) {
                obj.destroy();
            }

            return;
        }

        let pool = this._pool.get(key);

        if (!pool) {
            pool = [];
            this._pool.set(key, pool);
        }

        if (pool.indexOf(obj) != -1) {
            return;
        }

        pool.push(obj);
    }
}
