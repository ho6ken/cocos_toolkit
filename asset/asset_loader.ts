import { Asset, assetManager, resources } from "cc";
import { AssetData } from "./asset_data";
import { AssetLoadOpt } from "./asset_load_opt";

/**
 * 單一資源加載器
 */
export class AssetLoader {
    /**
     * 使用中資源
     */
    private declare _assets: Map<string, AssetData>;

    /**
     * 現在時間
     */
    private get _now(): number { return Date.now() / 1000; }

    /**
     * 預計逾期時間
     */
    private get _expire(): number { return this._now + (5 * 60); }

    /**
     * 
     */
    constructor() {
        this._assets = new Map();
    }

    /**
     * 關閉
     */
    public shutdown(): void {
        this._assets.forEach(item => item.asset = null);
        this._assets.clear();
    }

    /**
     * 清理閒置資源
     */
    public clear(): void {
        let jobs = [];

        this._assets.forEach((data, path) => {
            if (data && !data.hold && data.expire < this._now) {
                jobs.push(path);
            }
        });

        jobs.forEach(item => {
            this._assets[item].asset = null;
            this._assets.delete(item);
        });
    }

    /**
     * 取得資源
     * @param type 資源總類
     * @param opt 加載參數
     */
    public async get<T extends Asset>(type: typeof Asset, opt: AssetLoadOpt): Promise<T> {
        if (this._assets.has(opt.path)) {
            let data = this._assets.get(opt.path);
            data.expire = this._expire;
            return data.asset as T;
        }

        let asset = await this.load(type, opt);
        this.addAsset(asset, opt.path, opt.hold);

        return asset as T;
    }

    /**
     * 加載資源
     * @param type 資源總類
     * @param opt 加載參數
     */
    private async load<T extends Asset>(type: typeof Asset, opt: AssetLoadOpt): Promise<T> {
        return new Promise((resolve, reject) => {
            let loader = opt.bundle ? assetManager.getBundle(opt.bundle) : resources;

            if (!loader) {
                console.error(`load asset failed, loader is null`, opt);
                reject();
            }

            loader.load(opt.path, type, (err, asset) => {
                if (err) {
                    console.error(`load asset failed`, opt, err);
                    reject(err);
                }

                resolve(asset as T);
            });
        });
    }

    /**
     * 將資源加入管理
     * @param asset 資源
     * @param path 加載路徑
     * @param hold 是否常駐
     */
    public addAsset<T extends Asset>(asset: T, path: string, hold: boolean): void {
        this._assets.set(path, { asset, hold, expire: this._expire });
    }

    /**
     * 打印資訊
     */
    public print(): void {
        console.table(this._assets.keys());
    }
}
