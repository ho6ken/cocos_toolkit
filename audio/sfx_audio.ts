import { AudioSource } from "cc";

/**
 * 音效
 */
export class SfxAudio extends AudioSource {
    /**
     * 播放完畢回調
     */
    public onComplete: (src: SfxAudio) => void = null;

    /**
     * 編號
     */
    private _pid: number = -1;

    /**
     * 編號
     */
    public get pid(): number { return this._pid; }

    /**
     * 初始化
     * @param id 流水號
     */
    public init(id: number): void {
        this._pid = id;
        this.node.name = id.toString();
    }

    /**
     * 播放完畢
     */
    private onFinish(): void {
        this.onComplete && this.onComplete(this);
    }

    /**
     * 
     */
    public onLoad(): void {
        this.node.on(AudioSource.EventType.ENDED, this.onFinish, this);
    }

    /**
     * 
     */
    public onDestroy(): void { 
        this.node.off(AudioSource.EventType.ENDED, this.onFinish, this);
    } 
}
