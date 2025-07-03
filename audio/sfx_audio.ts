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
     * 初始化
     * @param id 流水號
     */
    public init(id: number): void {
        // TODO
    }
}
