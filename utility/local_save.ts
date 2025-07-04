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
     * @param defNum 預設值
     */
    public static getNum(key: string, defNum: number = 0): number {
        return this.load(key, defNum);
    }

    /**
     * 取布林
     * @param defBool 預設值
     */
    public static getBool(key: string, defBool: boolean = false): boolean {
        return this.load(key, defBool);
    }

    /**
     * 取字串
     * @param defStr 預設值
     */
    public static getStr(key: string, defStr: string = ``): string {
        return this.load(key, defStr);
    }

    /**
     * 取json
     * @param defObj 預設值
     */
    public static getJson(key: string, defObj: object = {}): any {
        return JSON.parse(String(this.load(key, defObj)));
    }
}
