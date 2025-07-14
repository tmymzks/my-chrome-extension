// ページ情報を取得して表示
async function getPageInfo() {
  try {
    // 現在のタブを取得
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // ページのタイトルとURLを取得
    const title = tab.title || 'タイトルなし';
    const url = tab.url || '';
    
    // UIに表示
    document.getElementById('pageTitle').textContent = title;
    document.getElementById('pageUrl').textContent = url;
    
    return { title, url };
  } catch (error) {
    console.error('ページ情報の取得に失敗しました:', error);
    document.getElementById('pageTitle').textContent = 'エラー: ページ情報を取得できませんでした';
    document.getElementById('pageUrl').textContent = '';
    return { title: '', url: '' };
  }
}

// クリップボードにコピー
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showSuccessMessage();
  } catch (error) {
    console.error('クリップボードへのコピーに失敗しました:', error);
    // フォールバック: 古いブラウザ用
    fallbackCopyToClipboard(text);
  }
}

// フォールバック用のコピー機能（古いブラウザ対応）
function fallbackCopyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    showSuccessMessage();
  } catch (error) {
    console.error('フォールバックコピーに失敗しました:', error);
  }
  
  document.body.removeChild(textArea);
}

// 成功メッセージを表示
function showSuccessMessage() {
  const message = document.getElementById('successMessage');
  message.style.display = 'block';
  
  // 3秒後にメッセージを非表示
  setTimeout(() => {
    message.style.display = 'none';
  }, 3000);
}

// イベントリスナーを設定
document.addEventListener('DOMContentLoaded', async () => {
  // ページ情報を取得
  const pageInfo = await getPageInfo();
  
  // タイトルとURLを同時にコピー
  document.getElementById('copyButton').addEventListener('click', () => {
    const text = `${pageInfo.title}\n${pageInfo.url}`;
    copyToClipboard(text);
  });
  
  // タイトルのみコピー
  document.getElementById('copyTitleOnly').addEventListener('click', () => {
    copyToClipboard(pageInfo.title);
  });
  
  // URLのみコピー
  document.getElementById('copyUrlOnly').addEventListener('click', () => {
    copyToClipboard(pageInfo.url);
  });
}); 