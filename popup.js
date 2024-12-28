// popup.js
document.addEventListener("DOMContentLoaded", () => {
    const responseContainer = document.getElementById("responseContainer");
    const copyButton = document.getElementById("copyButton");
  
    // background.jsで保存したgptResultを読み込む
    chrome.storage.local.get("gptResult", (data) => {
      if (data.gptResult) {
        responseContainer.textContent = data.gptResult;
      } else {
        responseContainer.textContent = "まだ結果がありません。";
      }
    });
  
    // 「コピーする」ボタン押下時、表示しているテキストをクリップボードにコピーする
    copyButton.addEventListener("click", () => {
      const textToCopy = responseContainer.textContent;
      navigator.clipboard.writeText(textToCopy).then(() => {
        alert("コピーしました！");
      }, (err) => {
        alert("コピーできませんでした: " + err);
      });
    });
  });
  