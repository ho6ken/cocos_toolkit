/**
 * 資源加載參數
 */
export interface AssetLoadOpt {
    /**
     * 資源所在位置
     */
    path: string;

    /**
     * 資源所屬bundle
     */
    bundle?: string;

    /**
     * 常駐不釋放
     */
    hold: boolean;
}
