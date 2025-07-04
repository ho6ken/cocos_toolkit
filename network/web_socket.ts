import { NetBuf, NetConnOpt, NetSocket } from "./net_base";

/**
 * web socket
 */
export class WSocket implements NetSocket {
    /**
     * real socket
     */
    private declare _socket: WebSocket;

    /**
     * 收到訊息
     */
    public onMsg: (buf: NetBuf) => void = null;

    /**
     * 成功連線
     */
    public onConnect: (event: any) => void = null;

    /**
     * 連線異常
     */
    public onErr: (event: any) => void = null;

    /**
     * 連線中斷
     */
    public onClose: (event: any) => void = null;

    /**
     * 發起連線
     * @param opt 連線參數
     */
    public connect(opt: NetConnOpt): boolean {
        if (this._socket && this._socket.readyState == WebSocket.CONNECTING) {
            console.warn(`ws connect failed, already connecting.`, opt);
            return false;
        }

        this._socket = new WebSocket(new URL(opt.addr));
        this._socket.binaryType = `arraybuffer`;

        // socket event adapt
        this._socket.onmessage = event => this.onMsg(event.data);
        this._socket.onopen = this.onConnect;
        this._socket.onerror = this.onErr;
        this._socket.onclose = this.onClose;

        return true;
    }

    /**
     * 主動斷線
     * @param code 錯誤碼
     * @param reason 錯誤原因
     */
    public disconnect(code?: number, reason?: string): void {
        this._socket?.close(code, reason);
    }

    /**
     * 發送訊息
     * @param buf 數據內容
     */
    public sendMsg(buf: NetBuf): boolean {
        if (this._socket == null || this._socket.readyState != WebSocket.OPEN) {
            return false;
        }

        this._socket.send(buf);
        return true;
    }
}
