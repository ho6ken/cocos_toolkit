import { Component } from "cc";
import { ObjPool } from "./obj_pool";

/**
 * 組件池物件
 */
export interface CmptPoolObj {
    /**
     * 被取用
     */
    onFetch?(): void;

    /**
     * 被回收
     */
    onRecycle?(): void;
}

/**
 * 組件池
 */
export abstract class CmptPool extends ObjPool<typeof Component, Component> {
    /**
     * 取得物件
     */
    public async fetch(type: typeof Component): Promise<Component> {
        let cmpt: any = await super.fetch(type);
        cmpt && cmpt.onFetch && cmpt.onFetch();
        return cmpt;
    }

    /**
     * 回收物件
     */
    public recycle(cmpt: Component, type: typeof Component): void {
        if (!cmpt) {
            return;
        }

        let obj = (<any>cmpt);
        obj && obj.onRecycle && (<any>cmpt).onRecycle();
        
        super.recycle(cmpt, type);
    }
}
