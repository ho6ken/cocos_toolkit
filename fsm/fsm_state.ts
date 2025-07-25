import { FsmBase } from "./fsm_base";

/**
 * 狀態機狀態
 */
export abstract class FsmState<T> {
    /**
     * 狀態控制器
     */
    protected _ctrl: FsmBase<T> = null;

    /**
     * 狀態機持有人
     */
    protected get _owner(): T { return this._ctrl ? this._ctrl.owner : null }

    /**
     * 狀態編號
     * @summary 相同狀態機內編號不可重複
     */
    public abstract get id(): number;

    /**
     * 初始化
     * @param ctrl 狀態控制器
     * @param params 初始化參數
     */
    public init(ctrl: FsmBase<T>, ...params: any[]): void {
        this._ctrl = ctrl;
    }

    /**
     * 關閉此狀態
     */
    public close(): void {}

    /**
     * 進入此狀態
     */
    public onEnter(...params: any[]): void {}

    /**
     * 離開此狀態
     */
    public onLeave(): void {}

    /**
     * 狀態更新
     * @summary 狀態機當前狀態為此狀態時才會調用
     */
    public onUpdate(dt: number): void {}

    /**
     * 變更狀態
     * @param id 狀態編號
     * @param params 新狀態onEnter()時的參數
     */
    protected changeState(id: number, ...params: any[]): void {
        this._ctrl.changeState(id, ...params);
    }
}
