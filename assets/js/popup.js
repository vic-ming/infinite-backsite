// 通用弹出层管理器
class MultiPopupManager {
  constructor() {
    this.popups = new Map();
    this.currentPopup = null;
    this.init();
  }
  
  init() {
    // 绑定全局事件
    this.bindGlobalEvents();
    
    // 注册弹出层
    this.registerPopup('customerSearch', {
      overlayId: 'customerSearchOverlay',
      closeButtons: ['closeButton'],
     
    });
    
    this.registerPopup('customerRecord', {
      overlayId: 'customerRecordOverlay',
      closeButtons: ['recordCloseButton'],
    });
    
    this.registerPopup('customerDetail', {
      overlayId: 'customerDetailOverlay',
      closeButtons: ['detailCloseButton'],
    });

    this.registerPopup('businessDetail', {
      overlayId: 'businessDetailOverlay',
      closeButtons: ['businessDetailCloseButton'],
    });

    this.registerPopup('aiSummary', {
      overlayId: 'aiSummaryOverlay',
      closeButtons: ['aiSummaryCloseButton'],
    });

    this.registerPopup('transactionDetail', {
      overlayId: 'transactionDetailOverlay',
      closeButtons: ['transactionDetailCloseButton'],
    });

    this.registerPopup('businessUpdateDetail', {
      overlayId: 'businessUpdateDetailOverlay',
      closeButtons: [],
    });
  }
  
  registerPopup(name, config) {
    const overlay = document.getElementById(config.overlayId);
    if (!overlay) {
      console.warn(`Popup overlay ${config.overlayId} not found`);
      return;
    }
    
    const popupInstance = {
      name,
      overlay,
      config,
      isVisible: false,
      isHiding: false
    };
    
    this.popups.set(name, popupInstance);
    this.bindPopupEvents(popupInstance);
  }
  
  bindPopupEvents(popup) {
    const { overlay, config } = popup;
    
    // 绑定关闭按钮
    if (config.closeButtons) {
      config.closeButtons.forEach(closeId => {
        const closeButton = document.getElementById(closeId);
        if (closeButton) {
          closeButton.addEventListener('click', () => this.hide(popup.name));
        }
      });
    }

    // 点击遮罩层关闭
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.hide(popup.name);
      }
    });
  }
  
  bindGlobalEvents() {
    // ESC键关闭当前弹出层
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.currentPopup) {
        this.hide(this.currentPopup);
      }
    });
  }
  
  show(popupName) {
    // 先关闭其他弹出层
    this.hideAll();
    
    const popup = this.popups.get(popupName);
    if (!popup) {
      console.warn(`Popup ${popupName} not found`);
      return;
    }
    
    popup.overlay.classList.add('show');
    popup.isVisible = true;
    this.currentPopup = popupName;
    document.body.style.overflow = 'hidden';
    
    // 调用自定义显示处理器
    if (popup.config.onShow) {
      popup.config.onShow();
    }
  }
  
  hide(popupName) {
    const popup = this.popups.get(popupName);
    if (!popup || !popup.isVisible || popup.isHiding) return;
    
    // 标记正在关闭，防止重复触发
    popup.isHiding = true;
    
    // 添加hiding类来触发关闭动画
    popup.overlay.classList.add('hiding');
    
    // 等待动画完成后再隐藏
    setTimeout(() => {
      popup.overlay.classList.remove('show', 'hiding');
      popup.isVisible = false;
      popup.isHiding = false;
      
      if (this.currentPopup === popupName) {
        this.currentPopup = null;
        document.body.style.overflow = '';
      }
      
      // 调用自定义隐藏处理器
      if (popup.config.onHide) {
        popup.config.onHide();
      }
    }, 300); // 与CSS动画时间一致
  }
  
  hideAll() {
    this.popups.forEach((popup, name) => {
      if (popup.isVisible) {
        this.hide(name);
      }
    });
  }
}

// 全局实例
let popupManager;

// 当DOM载入完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  popupManager = new MultiPopupManager();
  
  // 将实例挂载到window对象上，方便其他脚本使用
  window.popupManager = popupManager;
}); 