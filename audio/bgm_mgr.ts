import { AudioSource, Tween, Node, AudioClip, tween } from "cc";
import { SingleObj } from "../singleton/single_obj";

/**
 * 音樂管理
 */
export class BgmMgr implements SingleObj {
    /**
     * 名稱
     */
    public get name(): string { return this.constructor.name; }

    /**
     * 音量
     */
    private _vol: number = 1;

    /**
     * 音量
     */
    public get vol(): number { return this._vol; }

    /**
     * 是否已暫停
     */
    private _paused: boolean = false;

    /**
     * 是否已暫停
     */
    public get paused(): boolean { return this._paused; }

    /**
     * 音量緩動
     */
    private _fade: Tween = null;

    /**
     * 是否在緩動中
     */
    private _fading: boolean = false;

    /**
     * 自身的節點
     */
    private _host: AudioSource = null;

    /**
     * 初始化
     * @param parent 將在此節點下生成音效相關物件
     */
    public init(parent: Node): void {
        let node = new Node(this.name);
        parent.addChild(node);
        this._host = node.addComponent(AudioSource);

        this._vol = 1;
        this._paused = false;
    }

    /**
     * 關閉
     * @param params 
     */
    public shutdown(): void {
        this.stop();

        this._host.node.removeFromParent();
        this._host.node.destroy();
        this._host.node = null;
    }

    /**
     * 設定音量 
     */
    public setVol(value: number): void {
        value = value.limit(0, 1);

        if (value == this.vol) {
            return;
        }

        this._vol = value;
        this._host.volume = value;
    }

    /**
     * 停止播放
     */
    public stop(): void {
        if (!this._host.playing) {
            return;
        }

        this._host.stop();

        if (this._fading) {
            this._fade.stop();
            this._host.volume = this.vol;
        }
    }

    /**
     * 暫停播放
     */
    public pause(): void {
        if (this.paused) {
            return;
        }

        this._paused = true;
        this._host.pause();
    }

    /**
     * 續播
     */
    public resume(): void {
        if (!this._paused) {
            return;
        }

        this._paused = false;
        this._host.play();
    }

    /**
     * 播放
     * @param clip 音源
     * @param sec 音量漸變秒數
     */
    public play(clip: AudioClip, sec: number): void {
        if (clip == null) {
            console.warn(`play bgm failed, audio is null.`);
            return;
        }

        sec = sec.limit(0, sec);

        // 執行播放
        let execute = () => {
            this._host.clip = clip;
            this._host.loop = true;
            this._host.play();

            this.fadeVol(sec, 0, 1);
        };

        // 漸變至無聲後播放
        if (this._host.playing) {
            this.fadeVol(sec, 1, 0, () => execute());
        } 
        else {
            execute();
        }
    }

    /**
     * 音量漸變
     * @param sec 漸變秒數
     * @param from 開始音量(倍率)
     * @param to 結束音量(倍率)
     * @param done 漸變完成的回調
     */
    private fadeVol(sec: number, from: number, to: number, done?: Function): void {
        this._fade?.stop();
        this._fading = false;

        // 執行變化
        let execute = (rate) => {
            let vol = (this.vol * rate).limit(0, 1);
            this._host.volume = vol;
        };

        this._fade = tween({ rate: from });
        this._fade.call(() => execute(from));
        this._fade.to(sec, { rate: to }, { onUpdate: curr => execute(curr.rate) });

        // 漸變完成
        this._fade.call(() => {
            execute(to)
            done && done();
            this._fading = false;
        }, this);

        this._fading = true;
        this._fade.start();
    }
}
