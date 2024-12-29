(() => {
  console.log("[content.js] Loaded content script:", window.location.href);
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startLogging") {
      console.log("[content.js] startLogging received");
      sendResponse({ status: "logging_started" });
      return true;
    } else if (message.action === "stopLogging") {
      console.log("[content.js] stopLogging received");
      sendResponse({ status: "logging_stopped" });
      return true;
    }
  });

  // -----------------------------------------------------------------------
  // 1) クリックイベントをcapturingフェーズで取得
  // -----------------------------------------------------------------------
  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      const tagName = target.tagName.toUpperCase();
      let type = tagName === "INPUT" ? target.type : "";
      let targetDescription = "";
      const text = (target.innerText || target.textContent || "").trim();

      if (text) {
        if (type === "") {
          targetDescription = `'${text}' をクリック`;
        } else {
          targetDescription = `'${text}'(${type}) をクリック`;
        }
      } else if (target.id) {
        if (type === "checkbox" || type === "radio") {
          // checkbox/radioの場合は特にクリックログを分けない例
        } else {
          targetDescription = `'#${target.id}' をクリック`;
        }
      } else if (target.className) {
        targetDescription = `クラス '${target.className}' の要素をクリック`;
      } else {
        targetDescription = `要素(${target.tagName})をクリック`;
      }

      if (targetDescription) {
        chrome.runtime.sendMessage({ action: "addLog", log: targetDescription }, (res) => {
          console.log("[content.js] Element log sent:", targetDescription);
        });
      }
    },
    true // capturingフェーズ
  );

  // -----------------------------------------------------------------------
  // 2) 入力イベントをcapturingフェーズで取得
  //    - input, textarea, checkbox, radio, select などを対象にします。
  // -----------------------------------------------------------------------
  document.addEventListener(
    "change",
    (event) => {
      const target = event.target;
      const tagName = target.tagName.toUpperCase();
      let targetDescription = "";

      if (tagName === "INPUT") {
        const type = target.type; // "text", "checkbox", "radio", "password"など
        if (type === "checkbox" || type === "radio") {
          // チェックの ON/OFF をログ
          const state = target.checked ? "ON" : "OFF";
          targetDescription = `チェックボックス(${target.name || target.id || target.className})を「${state}」に変更`;
        } else if (type === "password") {
          // パスワード入力欄の場合は実際の値ではなく固定メッセージをログ
          targetDescription = `パスワードを入力しました (ID: ${target.id || "なし"})`;
        } else {
          // テキスト系 (password以外)
          const value = target.value;
          targetDescription = `「${value}」を入力 (ID: ${target.id || "なし"})`;
        }
      } else if (tagName === "TEXTAREA") {
        const value = target.value;
        targetDescription = `テキストエリアに「${value}」を入力 (ID: ${target.id || "なし"})`;
      } else if (tagName === "SELECT") {
        // selectタグの選択肢
        const value = target.value;
        const selectedText = target.options[target.selectedIndex].text;
        targetDescription = `プルダウンで「${selectedText}」(${value})を選択 (ID: ${target.id || "なし"})`;
      }

      // ログ内容があれば送信
      if (targetDescription) {
        chrome.runtime.sendMessage({ action: "addLog", log: targetDescription }, (res) => {
          console.log("[content.js] Input log sent:", targetDescription);
        });
      }
    },
    true // capturingフェーズ
  );
})();
