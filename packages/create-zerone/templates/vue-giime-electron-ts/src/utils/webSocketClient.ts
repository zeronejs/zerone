import { GmMessage, useLoginStore } from 'giime';

type MessageCallback = (message: any) => void;

export class WebSocketClient {
  /** WebSocket 服务器的 URL */
  private wsUrl: string;
  /** client_stream_id */
  private client_stream_id: string;

  /** 收到消息时的回调函数 */
  private onMessageCallback: MessageCallback;

  /** WebSocket 实例 */
  private socket: WebSocket | null = null;

  /** 是否锁定重连 */
  private lockReconnect = false;

  /** 重连的定时器 ID */
  private reconnectTimeoutId: number | null = null;

  /** 心跳检测相关配置 */
  private heartCheck = {
    /** 心跳检测间隔时间，单位为毫秒 */
    timeout: 30_000,

    /** 心跳检测的定时器 ID */
    intervalId: null as number | null,
    /** 开始心跳检测的方法 */
    start: () => this.startHeartbeat(),
  };

  constructor(wsUrl: string, client_stream_id: string, onMessageCallback: MessageCallback) {
    this.wsUrl = wsUrl;
    this.onMessageCallback = onMessageCallback;
    this.client_stream_id = client_stream_id;
    this.createSocket();
    window.addEventListener('beforeunload', () => this.closeSocketOnUnload());
  }

  /**
   * 创建 WebSocket 连接
   */
  private createSocket() {
    // if (this.socket) return;

    try {
      this.socket = new WebSocket(this.wsUrl);
      this.setupSocketEventHandlers();
    } catch (e) {
      console.log('创建WebSocket连接失败', e);
      this.scheduleReconnect();
    }
  }

  /**
   * 设置 WebSocket 事件处理程序
   */
  private setupSocketEventHandlers() {
    if (!this.socket) return this.scheduleReconnect();

    this.socket.onerror = e => this.handleConnectionError(e);
    this.socket.onopen = () => this.handleConnectionOpen();
    this.socket.onmessage = event => this.handleIncomingMessage(event);
    this.socket.onclose = e => this.handleConnectionClose(e);
  }

  /**
   * 处理 WebSocket 连接错误
   */
  private handleConnectionError(e: Event) {
    console.log('WebSocket连接错误:', e);
    this.checkWebSocketStatus();
    GmMessage.error({ message: 'WebSocket连接失败,尝试重连中,请稍候...', duration: 1000, showClose: true });
    this.scheduleReconnect();
  }

  /**
   * 处理 WebSocket 连接成功
   */
  private handleConnectionOpen() {
    console.log('socket连接成功');
    // GmMessage.success('连接成功，欢迎使用！');
    this.heartCheck.start();
    clearTimeout(this.reconnectTimeoutId ?? 0);
    // 发送连接信息
    this.sendMessage({
      client_stream_id: this.client_stream_id,
      client_type: '',
    });
  }

  /**
   * 处理收到的 WebSocket 消息
   * @param event - 消息事件
   */
  private handleIncomingMessage(event: MessageEvent) {
    try {
      const message = JSON.parse(event.data) as any;

      // // 处理心跳响应
      // if (message.type === ImwsMessageType.pong) {
      //   return;
      // }
      // if (message.type === ImwsMessageType.auth_result && (message.data as ImwsMsgAuthResultData)?.code === 200) {
      //   GmMessage.success('连接成功，欢迎使用！');
      // }
      this.onMessageCallback(message);
    } catch (error) {
      console.error('消息解析错误:', error);
    }
  }
  /**连接断开 */
  private handleConnectionClose = (e: CloseEvent) => {
    console.log('socket连接断开', e);
    // GmMessage.error('连接已断开，正在尝试重新连接...');
    this.scheduleReconnect();
  };
  /**
   * 开始心跳检测
   */
  private startHeartbeat() {
    // 重置心跳检测
    if (this.heartCheck.intervalId !== null) {
      clearInterval(this.heartCheck.intervalId);
    }

    // 启动心跳检测
    this.heartCheck.intervalId = window.setInterval(() => {
      const now = Date.now();

      // 发送心跳包
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.sendMessage({
          type: 'ping',
          data: {
            timestamp: now,
          },
        });
      } else if (this.socket?.readyState === WebSocket.CLOSED) {
        GmMessage.error('连接出错,正在重新连接,请稍候...');
        this.scheduleReconnect();
      }
    }, this.heartCheck.timeout);
  }

  /**
   * 安排重新连接
   */
  private scheduleReconnect() {
    if (this.lockReconnect) return;

    this.lockReconnect = true;
    if (this.reconnectTimeoutId !== null) {
      clearTimeout(this.reconnectTimeoutId);
    }

    this.reconnectTimeoutId = window.setTimeout(() => {
      this.createSocket();
      this.lockReconnect = false;
    }, 1000);
  }

  /**
   * 在窗口卸载时关闭 WebSocket 连接
   */
  private closeSocketOnUnload() {
    this.socket?.close();
  }
  private async checkWebSocketStatus() {
    try {
      const loginStore = useLoginStore();

      if (loginStore.showLogin) return;
      const response = await fetch(this.wsUrl, {
        method: 'GET',
        headers: {
          Connection: 'Upgrade',
          Upgrade: 'websocket',
        },
      });

      if (response.status === 401) {
        loginStore.showLogin = true;
      }
    } catch (error) {
      console.log('请求出错:', error);
    }
  }
  /**
   * 发送消息到 WebSocket 服务器
   * @param message - 要发送的消息
   */
  public sendMessage(message: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      GmMessage.warning('无法发送消息，WebSocket 未连接');
    }
  }
}

// // 使用示例：
// const wsUrl = import.meta.env.VITE_BASE_SHOP_WSAPI;
// const chatStore = useChatStore();

// const handleIncomingMessage = (data: any) => {
//   chatStore.receiveMessage(data);
// };

// const wsClient = new WebSocketClient(wsUrl, handleIncomingMessage);

// // 发送文本消息
// wsClient.sendMessage('Hello, server!');

// // 发送 JSON 格式的消息
// wsClient.sendMessage({ type: 'greeting', content: 'Hello, server!' });

// 导出 WebSocketClient 类，以便在其他地方使用
