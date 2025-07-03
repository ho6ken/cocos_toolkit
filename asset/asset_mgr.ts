import { Asset } from "cc";
import { SingleObj } from "../singleton/single_obj";
import { AssetLoader } from "./asset_loader";
import { BundleLoader } from "./bundle_loader";
import { FolderLoader } from "./folder_loader";
import { AssetLoadOpt } from "./asset_load_opt";

/**
 * 資源管理
 */
export class AssetMgr implements SingleObj {
    /**
     * 名稱
     */
    public get name(): string { return this.constructor.name; }

    /**
     * 單一資源加載
     */
    private declare _al: AssetLoader;

    /**
     * bundle加載
     */
    private declare _bl: BundleLoader;

    /**
     * 資料夾加載
     */
    private declare _fl: FolderLoader;

    /**
     * 
     */
    constructor() {
        this._al = new AssetLoader();
        this._bl = new BundleLoader();
        this._fl = new FolderLoader();
    }

    /**
     * 關閉
     */
    public shutdown(): void {
        this._al.shutdown();
        this._al = null;

        this._bl.shutdown();
        this._bl = null;

        this._fl = null;
    }

    /**
     * 清理閒置資源
     */
    public clearAssets(): void {
        this._al.clear();
    }

    /**
     * 清除bundle
     */
    public clearBundle(bundle: string): void {
        this._bl.close(bundle)
    }

    /**
     * 取得資源
     * @param type 資源種類
     * @param opt 加載參數
     */
    public async getAsset<T extends Asset>(type: typeof Asset, opt: AssetLoadOpt): Promise<T> {
        opt.bundle && await this._bl.load(opt.bundle);
        return await this._al.get(type, opt);
    }

    /**
     * 加載整個資料夾
     * @param type 目標資源種類
     * @param opt 加載參數
     */
    public async loadFolder(type: typeof Asset, opt: AssetLoadOpt): Promise<void> {
        opt.bundle && await this._bl.load(opt.bundle);
        let list = await this._fl.load(type, opt);

        list.forEach(item => {
            this._al.addAsset(item.asset, item.path, opt.hold);
        }, this);
    }

    /**
     * 打印資訊
     */
    public print(): void {
        console.group(`dump asset mgr.`);

        this._al.print();
        this._bl.print();

        console.groupEnd();
    }
}
