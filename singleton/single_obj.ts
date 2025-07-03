/**
 * 單例物件
 * @summary 物件必須實作以下接口
 */
export interface SingleObj {
    /**
     * 名稱
     */
    name: string;

    /**
     * 初始化
     */
    init?(...params: any[]): any;

    /**
     * 關閉
     */
    shutdown?(...params: any[]): any;
}
