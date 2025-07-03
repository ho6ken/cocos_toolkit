import { SingleObj } from "./single_obj";
import { SingleType } from "./single_type";

/**
 * 單例管理
 */
export class SingleMgr {
    /**
     * 單例列表
     */
    private static _singles = new Map<string, SingleObj>();

    /**
     * 生成實例
     * @param type 物件類型
     * @param params 初始化參數
     */
    public static spawn<T extends SingleObj>(type: SingleType<T>, ...params: any[]): T {
        if (this._singles.has(type.name)) {
            return this._singles.get(type.name) as T;
        }

        // 優先使用外部實體, 無實體則另外生成
        let inst = type.inst ?? new type();
        this._singles.set(type.name, inst);

        console.log(`single obj spawn.`, type.name);

        // 初始化
        inst.init && inst.init(...params);

        return inst;
    }

    /**
     * 取得實例
     * @param type 物件類型
     */
    public static get<T extends SingleObj>(type: SingleType<T>): T {
        return this._singles.get(type.name) as T;
    }

    /**
     * 關閉系統
     */
    public static shutdown(): void {
        Array.from(this._singles.keys()).forEach(item => this.doClose(item), this);
    }

    /**
     * 關閉實例
     */
    public static close<T extends SingleObj>(type: SingleType<T>): void {
        this.doClose(type.name);
    }

    /**
     * 實作關閉單例
     * @param name 物件名稱
     */
    private static doClose(name: string): void {
        let obj = this._singles.get(name);

        if (!obj) {
            return;
        }

        obj.close && obj.close();
        obj = null;

        this._singles.delete(name);

        console.log(`single obj close`, name);
    }
}
