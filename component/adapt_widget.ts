import { _decorator, Component, Node, screen, UITransform, view } from 'cc';

const { ccclass, property, disallowMultiple, requireComponent, menu } = _decorator;

/**
 * 背景widget適配
 * @summary 在定寬高模式下(show all), 重新計算背景的widget大小, 讓元件可以正常貼邊
 * @summary https://www.jianshu.com/p/738a8f6a2ec1
 */
@ccclass
@disallowMultiple
@requireComponent(UITransform)
@menu(`toolkit/adapt_widget`)
export class AdaptWidget extends Component {
    /**
     * 原始寬
     */
    private _initW: number = 0;

    /**
     * 原始高
     */
    private _initH: number = 0;

    /**
     * 
     */
    protected onLoad(): void {
        let trans = this.getComponent(UITransform);
        this._initW = trans.width;
        this._initH = trans.height;

        this.adjust(); 

        screen.on('window-resize', this.adjust, this);
    }

    /**
     * 
     */
    protected onDestroy(): void {
        screen.off('window-resize', this.adjust, this);
    }

    /**
     * 校正
     */
   private adjust(): void {
        let viewSize = screen.windowSize;
        let viewW = viewSize.width;
        let viewH = viewSize.height;

        // 先取得show all模式時, 此節點的實際寬高, 以及初始縮放
        let scale = Math.min(
            viewW / this._initW,
            viewH / this._initH,
        );

        let realW = this._initW * scale;
        let realH = this._initH * scale;

        // 基於第一步計算的數據, 再做節點重置寬高
        let trans = this.getComponent(UITransform);
        trans.width = this._initW * (viewW / realW);
        trans.height = this._initH * (viewH / realH);
    }
}
