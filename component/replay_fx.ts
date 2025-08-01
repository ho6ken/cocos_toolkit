import { _decorator, Animation, CCBoolean, Component, Node, ParticleSystem, ParticleSystem2D, sp } from 'cc';

const { ccclass, property, disallowMultiple, menu } = _decorator;

/**
 * 特效重播
 * @summary 將所有子節點的特效找出, 並統一控制播放或停止
 */
@ccclass
@disallowMultiple
@menu(`toolkit/replay_fx`)
export class ReplayFX extends Component {
    /**
     * spine預設的動畫名稱
     */
    private static readonly _DEF_SPINE_ANIM = `default`;

    /**
     * 
     */
    @property({ type: CCBoolean, displayName: `刷新`, tooltip: `搜尋所有特效` })
    private get refresh(): boolean { return false; }
    private set refresh(value: boolean) { this.search(); } 

    /**
     * 
     */
    @property({ type: [ParticleSystem], displayName: `3d粒子` })
    private p3d: ParticleSystem[] = [];

    /**
     * 
     */
    @property({ type: [ParticleSystem2D], displayName: `2d粒子` })
    private p2d: ParticleSystem2D[] = [];

    /**
     * 
     */
    @property({ type: [sp.Skeleton], displayName: `骨骼動畫` })
    private spines: sp.Skeleton[] = [];

    /**
     * 
     */
    @property({ type: [Animation], displayName: `一般動畫` })
    private anim: Animation[] = [];

    /**
     * 關閉
     */
    public shutdown(): void {
        this.clear();
    }

    /**
     * 清除
     */
    private clear(): void {
        this.p3d.length = 0;
        this.p2d.length = 0;
        this.spines.length = 0;
        this.anim.length = 0;
    }

    /**
     * 搜尋所有特效
     * @summary 會略過enabled為false的組件
     */
    private search(): void {
        this.clear();

        // 通用搜尋
        let find = function<T extends Component>(type: T): T[] {
            return this.getComponentsInChildren(type).filter(cmpt => cmpt.enabled);
        }.bind(this);

        // 可再各自加入特別搜尋條件
        this.p3d = find(ParticleSystem);
        this.p2d = find(ParticleSystem2D);
        this.spines = find(sp.Skeleton);
        this.anim = find(Animation);
    }

    /**
     * 開始播放
     * @summary 此節點的active會設定成開
     */
    public play(): void {
        this.stop();

        this.p3d.forEach(elm => elm.play());
        this.p2d.forEach(elm => elm.resetSystem());

        this.spines.forEach(elm => {
            elm.setAnimation(99, ReplayFX._DEF_SPINE_ANIM, elm.loop);
            elm.node.active = true;
        });

        this.anim.forEach(elm => elm.play());

        this.node.active = true;
    }

    /**
     * 停止播放
     * @summary 此節點的active會設定成關
     */
    public stop(): void {
        this.node.active = false;

        this.p3d.forEach(elm => elm.stop());
        this.p2d.forEach(elm => elm.stopSystem());
        this.spines.forEach(elm => elm.node.active = false);
        this.anim.forEach(elm => elm.stop());
    }
}
