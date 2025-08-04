/**
 * 側邊面板管理器
 * 用於處理各種側邊滑入頁面的通用功能
 */
class SidePanelManager {
  constructor() {
    this.currentPanel = null;
    this.panels = new Map();
    this.init();
  }

  /**
   * 初始化側邊面板管理器
   */
  init() {
    // 監聽來自 iframe 的訊息
    window.addEventListener('message', (event) => {
      this.handleMessage(event);
    });
  }

  /**
   * 註冊一個側邊面板
   * @param {string} panelId - 面板ID
   * @param {string} iframeUrl - iframe 要載入的 URL
   * @param {Function} onSelect - 選擇項目時的回調函數
   * @param {Object} options - 其他選項
   */
  registerPanel(panelId, iframeUrl, onSelect, options = {}) {
    this.panels.set(panelId, {
      url: iframeUrl,
      onSelect: onSelect,
      options: options
    });
  }

  /**
   * 打開指定的側邊面板
   * @param {string} panelId - 面板ID
   */
  openPanel(panelId) {
    console.log(`嘗試打開側邊面板: ${panelId}`);
    
    const panelConfig = this.panels.get(panelId);
    if (!panelConfig) {
      console.error(`Panel ${panelId} not found`);
      return;
    }

    console.log(`找到面板配置:`, panelConfig);

    // 創建或獲取面板容器
    let panelContainer = document.getElementById(`side-panel-${panelId}`);
    if (!panelContainer) {
      console.log(`創建新的面板容器: side-panel-${panelId}`);
      panelContainer = this.createPanelContainer(panelId);
    } else {
      console.log(`使用現有面板容器: side-panel-${panelId}`);
    }

    // 設置 iframe src
    const iframe = panelContainer.querySelector('iframe');
    iframe.src = panelConfig.url;
    console.log(`設置 iframe src: ${panelConfig.url}`);

    // 強制瀏覽器重排，確保初始狀態渲染完成
    panelContainer.offsetHeight;

    // 使用 requestAnimationFrame 確保動畫效果
    requestAnimationFrame(() => {
    //   console.log(`添加 open 類到面板`);
      panelContainer.classList.add('open');
    });
    
    this.currentPanel = panelId;

    // 調用開啟回調
    if (panelConfig.options.onOpen) {
      panelConfig.options.onOpen();
    }

    // console.log(`面板 ${panelId} 開啟完成`);
  }

  /**
   * 關閉當前的側邊面板
   */
  closePanel() {
    if (!this.currentPanel) return;

    const panelContainer = document.getElementById(`side-panel-${this.currentPanel}`);
    if (panelContainer) {
      panelContainer.classList.remove('open');
      
      // 調用關閉回調
      const panelConfig = this.panels.get(this.currentPanel);
      if (panelConfig && panelConfig.options.onClose) {
        panelConfig.options.onClose();
      }
    }

    this.currentPanel = null;
  }

  /**
   * 創建面板容器
   * @param {string} panelId - 面板ID
   * @returns {HTMLElement} 面板容器元素
   */
  createPanelContainer(panelId) {
    // console.log(`創建面板容器: side-panel-${panelId}`);
    
    const container = document.createElement('div');
    container.id = `side-panel-${panelId}`;
    container.className = 'side-panel';
    
    // console.log(`面板容器 ID: ${container.id}`);
    // console.log(`面板容器 className: ${container.className}`);
    
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
    
    container.appendChild(iframe);
    document.body.appendChild(container);
    
    // console.log(`面板容器已添加到 body`);
    // console.log(`容器元素:`, container);
    
    return container;
  }

  /**
   * 處理來自 iframe 的訊息
   * @param {MessageEvent} event - 訊息事件
   */
  handleMessage(event) {
    const { type, data } = event.data;

    switch (type) {
      case 'selectItem':
        this.handleSelectItem(data);
        break;
      case 'closePanel':
        this.closePanel();
        break;
      case 'panelAction':
        this.handlePanelAction(data);
        break;
      default:
        // 向後兼容舊的訊息格式
        if (event.data.type === 'selectAssociate') {
          this.handleSelectItem({
            panelType: 'associate',
            id: event.data.id,
            name: event.data.name
          });
        } else if (event.data.type === 'closePanel') {
          this.closePanel();
        }
        break;
    }
  }

  /**
   * 處理選擇項目
   * @param {Object} data - 選擇的項目資料
   */
  handleSelectItem(data) {
    if (!this.currentPanel) return;

    const panelConfig = this.panels.get(this.currentPanel);
    if (panelConfig && panelConfig.onSelect) {
      panelConfig.onSelect(data);
    }

    this.closePanel();
  }

  /**
   * 處理面板動作
   * @param {Object} data - 動作資料
   */
  handlePanelAction(data) {
    if (!this.currentPanel) return;

    const panelConfig = this.panels.get(this.currentPanel);
    if (panelConfig && panelConfig.options.onAction) {
      panelConfig.options.onAction(data);
    }
  }
}

// 創建全域的側邊面板管理器實例
window.sidePanelManager = new SidePanelManager();

// 提供便捷的全域函數
window.openSidePanel = function(panelId) {
//   console.log(`全域函數 openSidePanel 被調用: ${panelId}`);
  window.sidePanelManager.openPanel(panelId);
};

window.closeSidePanel = function() {
//   console.log(`全域函數 closeSidePanel 被調用`);
  window.sidePanelManager.closePanel();
};

window.registerSidePanel = function(panelId, iframeUrl, onSelect, options = {}) {
//   console.log(`全域函數 registerSidePanel 被調用: ${panelId}, URL: ${iframeUrl}`);
  window.sidePanelManager.registerPanel(panelId, iframeUrl, onSelect, options);
};