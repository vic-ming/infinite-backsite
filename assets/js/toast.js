/**
 * Toast 通知功能
 * 用於顯示各種類型的通知訊息
 */

// Toast 功能
function showToast(message, type = 'error') {
  // 移除現有的 toast（如果有）
  const existingToast = document.getElementById('toast');
  if (existingToast) {
    existingToast.remove();
  }

  // 創建 toast 元素
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = `toast toast-${type}`;
  
  // 如果是錯誤類型，在文字前面加上 warn.svg 圖示
  if (type === 'error') {
    toast.innerHTML = `<img src="/assets/images/warn.svg" alt="warning"> ${message}`;
  } else {
    toast.textContent = message;
  }

  // 添加到頁面
  document.body.appendChild(toast);

  // 顯示動畫
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  // 2秒後自動隱藏
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 2000);
}

// 快捷方法
const Toast = {
  error: (message) => showToast(message, 'error'),
  success: (message) => showToast(message, 'success'),
  warning: (message) => showToast(message, 'warning'),
  info: (message) => showToast(message, 'info')
};