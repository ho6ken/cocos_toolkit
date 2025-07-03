import { assetManager, AssetManager } from "cc";

/**
 * bundle加載器
 */
export class BundleLoader {
    /**
     * 已加載bundle
     */
    private declare _bundles: Map<string, AssetManager.Bundle>;

    /**
     * 
     */
    constructor() {
        this._bundles = new Map();
    }

    /**
     * 關閉
     */
    public shutdown(): void {
        Array.from(this._bundles.keys()).forEach(item => this.close(item), this);
        this._bundles.clear();
    }

    /**
     * 清除某bundle
     */
    public close(name: string): void {
        if (!this._bundles.has(name)) {
            return;
        }

        let bundle = this._bundles.get(name);
        bundle.releaseAll();
        assetManager.removeBundle(bundle);
        this._bundles.delete(name);
    }

    /**
     * 加載bundle
     */
    public async load(name: string): Promise<AssetManager.Bundle> {
        if (this._bundles.has(name)) {
            return this._bundles.get(name);
        }

        return new Promise((resolve, reject) => {
            assetManager.loadBundle(name, (err, bundle) => {
                if (err) {
                    console.error(`load bundle failed.`, name, err);
                    reject(err);
                }

                this._bundles.set(name, bundle);
                resolve(bundle);
            });
        });
    }

    /**
     * 打印資訊
     */
    public print(): void {
        console.table(this._bundles.keys());
    }
}
