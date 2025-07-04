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
     * 
     */
    protected onLoad(): void {
        let size = view.getDesignResolutionSize();
        this.adjust(size.width, size.height);

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
    private adjust(width: number, height: number): void {
        let transform = this.getComponent(UITransform);

        // 先取得show all模式時, 此節點的實際寬高, 以及初始縮放
        let scale = Math.min(
            width / transform.width,
            height / transform.height,
        );

        let realW = transform.width * scale;
        let realH = transform.height * scale;

        // 基於第一步計算的數據, 再重置節點寬高
        transform.width *= (width / realW);
        transform.height *= (height / realH);
    }
}
