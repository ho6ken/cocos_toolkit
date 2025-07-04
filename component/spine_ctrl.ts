import { _decorator, Component, Node, sp } from 'cc';
import { WaitUtil } from '../utility/wait_util';

const { ccclass, property, disallowMultiple, requireComponent, menu } = _decorator;

/**
 * spine控制
 */
@ccclass
@disallowMultiple
@requireComponent(sp.Skeleton)
@menu(`toolkit/spine_ctrl`)
export class SpineCtrl extends Component {
    /**
     * spine預設的動畫名稱
     */
    private static readonly DEF_SPINE_ANIM = `default`;

    /**
     * spine anim track
     */
    public static readonly TRACK = 99;

    /**
     * spine
     */
    private _spine: sp.Skeleton = null;

    /**
     * 設定骨骼資料
     */
    public set skeletonData(value: sp.SkeletonData) { this._spine.skeletonData = value; }

    /**
     * 取得播放速度
     */
    public get timeScale(): number { return this._spine.timeScale; }

    /**
     * 設定播放速度
     */
    public set timeScale(value: number) { this._spine.timeScale = value; }

    /**
     * 動畫事件
     * @param name 事件名稱
     */
    public onEvent: (name: string) => void = null;

    /**
     * 
     */
    protected onLoad(): void {
        this._spine = this.getComponent(sp.Skeleton); 
    }

    /**
     * 停止播放
     */
    public stop(): void {
        this._spine.clearTrack(SpineCtrl.TRACK); 
        this._spine.setToSetupPose();
        this.resume();
    }

    /**
     * 暫停播放
     */
    public pause(): void {
        this._spine.paused = true;
    }

    /**
     * 恢復播放
     */
    public resume(): void {
        this._spine.paused = false;
    }

    /**
     * 單次播放
     * @param key 動畫名稱
     * @param revert 倒敘播放
     */
    public async play(key: string = SpineCtrl.DEF_SPINE_ANIM, revert: boolean = false): Promise<void> {
        return await this.doPlay(key, false, revert);
    }

    /**
     * 循環播放
     * @param key 動畫名稱
     * @param revert 倒敘播放
     */
    public playLoop(key: string = SpineCtrl.DEF_SPINE_ANIM, revert: boolean = false): void {
        this.doPlay(key, true, revert);
    }

    /**
     * 常規播放
     * @param key 動畫名稱
     * @param loop 是否循環
     * @param revert 倒敘播放
     */
    private async doPlay(key: string, loop: boolean, revert: boolean): Promise<void> {
        this.stop();

        let entry = this._spine.setAnimation(SpineCtrl.TRACK, key, loop);
        entry.timeScale = revert ? -1 : 1;

        // 註冊事件
        this.registerEvent(entry);

        return new Promise(async resolve => {
            await WaitUtil.waitSec(entry.animation.duration, this._spine);
            resolve();
        });
    }

    /**
     * 監聽動畫事件
     * @param handler 事件處理
     */
    private registerEvent(entry: sp.spine.TrackEntry): void {
        if (!entry || !this.onEvent) {
            return;
        }

        this._spine.setTrackEventListener(entry, (entry, event) => {
            let name = (<sp.spine.Event>event)?.data?.name ?? event.toString();
            this.onEvent(name);
        });
    }

    /**
     * 將物件綁定骨骼
     * @param bone 骨骼名稱
     * @param node 被綁的物件
     * @summary 將該物件設定成此骨骼的子物件
     */
    public bindBone(bone: string, node: Node): void {
        // @ts-ignore
        let nodes = this._spine.attachUtil.generateAttachedNodes(bone);

        if (nodes && nodes.length > 0) {
            node.parent = nodes[0];
        }
    }
}
