import { AudioSource, Node } from "cc";
import { ObjPool } from "../pool/obj_pool";
import { SfxAudio } from "./sfx_audio";

/**
 * 音效池
 */
export class SfxPool extends ObjPool<typeof AudioSource, SfxAudio> {
    /**
     * 計數器
     */
    private static _count: number = 0;

    /**
     * 音效池使用者
     */
    private _owner: Node = null;

    /**
     * 初始化
     * @param owner 音效池使用者, 使用無其他功能交互的空白節點
     */
    public init(owner: Node): void {
        super.init();

        this._owner = owner;

        this._pool.clear();
        SfxPool._count = 0;
    }

    /**
     * 關閉
     */
    public shutdown(): void {
        this._owner.removeAllChildren();
        this._owner = null;

        super.shutdown();
    }

    /**
     * 生成音效
     * @param key 
     */
    protected async spawn(): Promise<SfxAudio> {
        let node = new Node();
        this._owner.addChild(node);

        let audio = node.addComponent(SfxAudio);
        audio.init(SfxPool._count++);
        audio.onComplete = this.onComplete.bind(this);

        return audio;
    }

    /**
     * 播放完畢
     * @param src 音效來源
     */
    private onComplete(src: SfxAudio): void {
        this.recycle(src, SfxAudio);
    }
}
