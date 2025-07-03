import { SingleObj } from "./single_obj";

/**
 * 單例類型
 * @summary 類型必須具備以下能力
 */
export interface SingleType<T extends SingleObj> {
    /**
     * 建構子
     */
    new(): T;

    /**
     * 名稱
     */
    name: string;

    /**
     * 實例
     * @summary 當物件為cc.component時, 可直接給予實體, 以免額外建立實體
     * @example protected onLoad(): void { inst = this; }
     */
    inst?: T;
}
