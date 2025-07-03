import { Asset } from "cc";

/**
 * 資源數據
 */
export interface AssetData {
    /**
     * 資源本體
     */
    asset: Asset;

    /**
     * 常駐不釋放
     */
    hold?: boolean;

    /**
     * 逾期時間
     */
    expire?: number;
}
