import { AudioClip, Node } from "cc";
import { SingleObj } from "../singleton/single_obj";
import { SfxPool } from "./sfx_pool";
import { SfxAudio } from "./sfx_audio";

/**
 * 音效管理
 */
export class SfxMgr implements SingleObj {
    /**
     * 名稱
     */
    public get name(): string { return this.constructor.name; }

    /**
     * 音量
     */
    private _vol: number = 1;

    /**
     * 設定音量
     */
    public set vol(value: number) { this._vol = value.limit(0, 1); }

    /**
     * 暫停中
     */
    private _paused: boolean = false;

    /**
     * 是否暫停中
     */
    public get paused(): boolean { return this._paused; }

    /**
     * 暫停開關
     */
    public set paused(value: boolean) { this._paused = value; }

    /**
     * 音效池
     */
    private _pool: SfxPool = null;

    /**
     * 自身的節點
     */
    private _host: Node = null;

    /**
     * 初始化
     * @param parent 將在此節點下生成音效相關物件
     */
    public init(parent: Node): void {
        this._host = new Node(this.name);
        parent.addChild(this._host);

        this._pool = new SfxPool();
        this._pool.init(this._host);

        this._vol = 1;
        this._paused = false;
    }

    /**
     * 關閉
     * @param params 
     */
    public shutdown(): void {
        this._pool.shutdown();
        this._pool = null;

        this._host.removeFromParent();
        this._host.destroy();
        this._host = null;
    }

    /**
     * 播放音效
     * @summary 暫停時直接不播放
     */
    public async play(clip: AudioClip): Promise<void> {
        if (!clip || this.paused) {
            return;
        }

        let sfx = await this._pool.fetch(SfxAudio);
        sfx.node.setParent(this._host);
        sfx.playOneShot(clip, this._vol);
    }
}
