// popup.js
document.addEventListener("DOMContentLoaded", () => {
    const responseContainer = document.getElementById("responseContainer");
    const copyButton = document.getElementById("copyButton");
    
    // 追加した要素
    const useAICheckbox = document.getElementById("useAI");
    const apiKeyInput = document.getElementById("apiKey");
    const saveSettingsButton = document.getElementById("saveSettings");
  
    // ------------------------------
    // 設定の読み込み
    // ------------------------------
    chrome.storage.local.get(["useAI", "apiKey", "gptResult"], (data) => {
      // useAI / apiKey をUIに反映
      useAICheckbox.checked = data.useAI === true;
      if (data.apiKey) {
        apiKeyInput.value = data.apiKey;
      }
      // gptResultを表示
      if (data.gptResult) {
        responseContainer.textContent = data.gptResult;
      } else {
        responseContainer.textContent = "まだ結果がありません。";
      }
    });
  
    // ------------------------------
    // 「AIを使う」チェックボックスを切り替えるたびに保存
    // ------------------------------
    useAICheckbox.addEventListener("change", () => {
      const useAI = useAICheckbox.checked;
      chrome.storage.local.set({ useAI }, () => {
        console.log("[popup.js] useAIの設定を保存しました:", useAI);
      });
    });
  
    // ------------------------------
    // 保存ボタン押下 → API Keyのみ保存
    // ------------------------------
    saveSettingsButton.addEventListener("click", () => {
      const apiKey = apiKeyInput.value.trim();
      chrome.storage.local.set({ apiKey }, () => {
        alert("API Keyを保存しました。");
      });
    });
  
    // ------------------------------
    // 「コピーする」ボタン → テキストをクリップボードにコピー
    // ------------------------------
    copyButton.addEventListener("click", () => {
      const textToCopy = responseContainer.textContent;
      navigator.clipboard.writeText(textToCopy).then(
        () => {
          alert("コピーしました！");
        },
        (err) => {
          alert("コピーできませんでした: " + err);
        }
      );
    });
  });
  