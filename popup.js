// popup.js
document.addEventListener("DOMContentLoaded", () => {
    const responseContainer = document.getElementById("responseContainer");
    const copyButton = document.getElementById("copyButton");
  
    // AI利用チェックボックス
    const useAICheckbox = document.getElementById("useAI");
    // APIキー入力
    const apiKeyInput = document.getElementById("apiKey");
    // APIキー保存ボタン
    const saveSettingsButton = document.getElementById("saveSettings");
  
    // プロンプト用
    const promptInput = document.getElementById("promptInput");
    const savePromptButton = document.getElementById("savePromptButton");
  
    // ------------------------------
    // 設定の読み込み
    // ------------------------------
    chrome.storage.local.get(["useAI", "apiKey", "gptResult", "promptSetting"], (data) => {
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
  
      // プロンプトを表示（未設定ならデフォルト値を入れる）
      const defaultPrompt = "以下はユーザーのブラウザ操作ログです。これを読みやすい手順に変換してください。ですますは不要です。まとめられる手順は上手にわかりやすくまとめてください。手順の理由を書けるときは〜するためにとつけてください。そして上に日本語で手順を記載、下に英語で手順を記載してください。";
      promptInput.value = data.promptSetting || defaultPrompt;
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
        alert("API Keyを保存しました。/API Key has been saved.");
      });
    });
  
    // ------------------------------
    // 「コピーする」ボタン → テキストをクリップボードにコピー
    // ------------------------------
    copyButton.addEventListener("click", () => {
      const textToCopy = responseContainer.textContent;
      navigator.clipboard.writeText(textToCopy).then(
        () => {
          alert("コピーしました！/Copied!");
        },
        (err) => {
          alert("コピーできませんでした/Failed to copy." + err);
        }
      );
    });
  
    // ------------------------------
    // 「プロンプトを保存」ボタン
    // ------------------------------
    savePromptButton.addEventListener("click", () => {
      const promptSetting = promptInput.value.trim();
      chrome.storage.local.set({ promptSetting }, () => {
        alert("プロンプトを保存しました。/Prompt has been saved.");
        console.log("[popup.js] プロンプトの設定を保存しました:", promptSetting);
      });
    });
  });
  