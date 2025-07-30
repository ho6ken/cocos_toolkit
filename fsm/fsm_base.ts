import { FsmState } from "./fsm_state";

/**
 * 狀態機
 */
export class FsmBase<T> {
    /**
     * 狀態機持有人
     */
    protected declare _owner: T;

    /**
     * 狀態機持有人
     */
    public get owner(): T { return this._owner; }

    /**
     * 狀態列表
     */
    protected declare _states: Map<number, FsmState<T>>;

    /**
     * 當前狀態
     */
    protected _currState: FsmState<T> = null;

    /**
     * 當前狀態編號
     */
    public get currStateID(): number { return this._currState ? this._currState.id : -1; }

    /**
     * 
     * @param owner 狀態機持有人
     */
    constructor(owner: T) {
        if (!owner) {
            console.error(`create fsm failed, owner is null.`);
            return;
        }

        this._owner = owner;
        this._states = new Map();
    }

    /**
     * 關閉狀態機
     */
    public shutdown(): void {
        this._states.forEach(state => {
            state.close();
            state = null;
        });

        this._states.clear();
    }

    /**
     * 初始化
     * @param states 狀態列表
     * @param params 各狀態初始化參數
     */
    public init(states: FsmState<T>[], ...params: any[]): void {
        if (!states || states.length <= 0) {
            return;
        }

        states.forEach(state => {
            if (state == null) {
                console.warn(`fsm init failed, state is null`, this.owner);
                return;
            }

            if (this._states.has(state.id)) {
                console.warn(`fsm init failed, id repeat`, state.id, this.owner);
                return;
            }

            state.init(this, ...params);
            this._states.set(state.id, state);
        });
    }

    /**
     * 更新接口
     * @summary 無更新需求可不使用
     */
    public update(dt: number): void {
        this._currState?.onUpdate(dt);
    }

    /**
     * 變更狀態
     * @param id 狀態編號
     * @param params 新狀態onEnter()時的參數
     */
    public changeState(id: number, ...params: any[]): void {
        if (id == this.currStateID) {
            return;
        }

        if (!this._states.has(id)) {
            console.warn(`fsm change state failed, id not found`, id, this.owner);
            return;
        }

        this._currState?.onLeave();

        console.log(`fsm change state`, id, this.owner);

        this._currState = this._states.get(id);
        this._currState.onEnter(...params);
    }
}
