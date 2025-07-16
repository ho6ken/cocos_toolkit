import { _decorator, Component, screen, UITransform, view } from 'cc';

const { ccclass, property, disallowMultiple, requireComponent, menu } = _decorator;

/**
 * 背景適配
 * @summary 在定寬高模式下(show all), 重新計算背景圖大小以填滿畫面
 * @summary https://www.jianshu.com/p/24cba3de1e33
 */
@ccclass
@disallowMultiple
@requireComponent(UITransform)
@menu(`toolkit/adapt_desktop`)
export class AdaptDesktop extends Component {
    /**
     * 
     */
    protected onLoad(): void {
        this.adjust();

        screen.on('window-resize', this.adjust, this);
        screen.on('orientation-change', this.adjust, this);
        screen.on('fullscreen-change', this.adjust, this);

        view.on(`canvas-resize`, this.adjust, this);
    }

    /**
     * 
     */
    protected onDestroy(): void {
        screen.off('window-resize', this.adjust, this);
        screen.off('orientation-change', this.adjust, this);
        screen.off('fullscreen-change', this.adjust, this);

        view.off(`canvas-resize`, this.adjust, this);
    }

   /**
    * 校正
    */
   private adjust(): void {
        let viewSize = screen.windowSize;
        let viewW = viewSize.width;
        let viewH = viewSize.height;

        let trans = this.getComponent(UITransform);

        // 先取得show all模式時, 此節點的實際寬高, 以及初始縮放
        let scale = Math.min(
            viewW / trans.width,
            viewH / trans.height,
        );

        let realW = trans.width * scale;
        let realH = trans.height * scale;

        // 基於第一步計算的數據, 再做適配縮放
        scale = Math.max(
            viewW / realW,
            viewH / realH,
        );

        // 基於第一步計算的數據, 再做適配縮放
        this.node.setScale(scale, scale);
    }
}
