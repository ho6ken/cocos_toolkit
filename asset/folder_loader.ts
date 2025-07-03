import { Asset, assetManager, resources } from "cc";
import { AssetLoadOpt } from "./asset_load_opt";

/**
 * 資料夾加載器
 */
export class FolderLoader {
    /**
     * 時作加載
     * @param type 資源種類
     * @param opt 加載參數
     * @returns 資源列表
     */
    public async load<T extends Asset>(type: typeof Asset, opt: AssetLoadOpt): Promise<{ path: string, asset: T }[]> {
        return new Promise((resolve, reject) => {
            let loader = opt.bundle ? assetManager.getBundle(opt.bundle) : resources;

            if (!loader) {
                console.error(`load folder failed, loader is null`, opt);
                reject();
            }

            loader.loadDir(opt.path, type, (err, assets) => {
                if (err) {
                    console.error(`load folder failed`, opt, err);
                    reject(err);
                }

                let info = loader.getDirWithPath(opt.path, type);
                let res = [];

                assets.forEach((item, idx) => {
                    res.push({ path: info[idx].path, asset: item as T });
                });

                resolve(res);
            });
        });
    }
}
