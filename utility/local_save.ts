import { sys } from "cc";

/**
 * 本地端存儲
 */
export class LocalSave {
    /**
     * 存檔
     * @returns 是否成功
     * @summary 有鍵無值時視作刪除
     */
    public static save(key: string, value: any): boolean {
        if (!key || key.length <= 0) {
            return false;
        }

        if (!value) {
            this.delete(key);
            return true;
        }

        if (typeof value == `function`) {
            return false;
        }

        if (typeof value == `object`) {
            try {
                value = JSON.stringify(value);
            } 
            catch (e) {
                return false;
            }
        }

        sys.localStorage.setItem(key, value);
        return true;
    }

    /**
     * 讀檔
     * @param defValue 預設值, 當取不到值時則回傳此值
     */
    public static load<T>(key: string, defValue: T): T {
        if (!key || key.length <= 0) {
            return defValue;
        }

        let data = sys.localStorage.getItem(key);
        return data ?? defValue;
    }

    /**
     * 刪除
     */
    public static delete(key: string): void {
        if (!key || key.length <= 0) {
            return;
        }

        sys.localStorage.removeItem(key);
    }

    /**
     * 清空本地存檔
     */
    public static rmrf(): void {
        sys.localStorage.clear();
    }

    /**
     * 取數值
     * @param defValue 預設值
     */
    public static getNum(key: string, defValue: number = 0): number {
        return this.load(key, defValue);
    }

    /**
     * 取布林
     * @param defValue 預設值
     */
    public static getBool(key: string, defValue: boolean = false): boolean {
        return this.load(key, defValue);
    }

    /**
     * 取字串
     * @param defValue 預設值
     */
    public static getStr(key: string, defValue: string = ``): string {
        return this.load(key, defValue);
    }

    /**
     * 取json
     * @param defValue 預設值
     */
    public static getJson(key: string, defValue: object = {}): any {
        return JSON.parse(String(this.load(key, defValue)));
    }
}
