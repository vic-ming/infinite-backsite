 // 通用確認彈窗函數
 function showConfirmModal(title, message, confirmText, onConfirm) {
  const modal = document.getElementById('confirm-modal');
  const titleElement = document.getElementById('confirm-modal-title');
  const messageElement = document.getElementById('confirm-modal-message');
  const confirmButton = document.getElementById('confirm-modal-confirm');
  
  titleElement.textContent = title;
  messageElement.textContent = message;
  confirmButton.textContent = confirmText;
  
  // 移除之前的事件監聽器並添加新的
  confirmButton.onclick = onConfirm;
  
  modal.style.display = 'flex';
  modal.classList.add('show');
}

// 隱藏確認彈窗
function hideConfirmModal() {
  const modal = document.getElementById('confirm-modal');
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);
}

// 點擊彈窗背景關閉彈窗
document.getElementById('confirm-modal').addEventListener('click', function(e) {
  if (e.target === this) {
    hideConfirmModal();
  }
});