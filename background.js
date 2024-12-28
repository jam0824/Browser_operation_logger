// --------------------
// background.js
// --------------------

// 「記録中かどうか」と操作ログを一元管理
let isRecording = false;
let operationLogs = [];

// 拡張機能インストール時やブラウザ起動時に、右クリックメニューを作成
chrome.runtime.onInstalled.addListener(() => {
  createContextMenus();
});
chrome.runtime.onStartup.addListener(() => {
  createContextMenus();
});

/**
 * 右クリックメニューを生成する関数
 */
function createContextMenus() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "start-logging",
      title: "記録開始",
      contexts: ["all"]
    });
    chrome.contextMenus.create({
      id: "stop-logging",
      title: "記録停止",
      contexts: ["all"]
    });
  });
}

/**
 * 右クリックメニュー選択時の挙動
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "start-logging") {
    startLogging(tab);
  } else if (info.menuItemId === "stop-logging") {
    stopLogging(tab);
  }
});

/**
 * 記録開始
 */
function startLogging(tab) {
  isRecording = true;
  operationLogs = []; // ログを初期化
  console.log("[background.js] Logging started.");

  // content script 側に通知
  chrome.tabs.sendMessage(tab.id, { action: "startLogging" });
  return true;
}

/**
 * 記録停止
 */
function stopLogging(tab) {
  isRecording = false;
  console.log("[background.js] Logging stopped.");

  // content script 側に通知
  chrome.tabs.sendMessage(tab.id, { action: "stopLogging" }, (response) => {
    console.log("[background.js] content script response:", response);
    console.log("[background.js] Raw operation logs:", operationLogs);

    // ここで ChatGPT API に送信して自然言語化
    sendLogsToChatGPT(operationLogs)
      .then((result) => {
        console.log("[background.js] ChatGPT変換後手順:", result);
        chrome.storage.local.set({ gptResult: result }, () => {
          console.log("[background.js] GPT result stored in local storage.");
        });
      })
      .catch((error) => {
        console.error("[background.js] ChatGPT API呼び出しエラー:", error);
      });
  });
}

/**
 * タブ更新を検知 → ページ遷移完了でタイトルをログに追加
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (isRecording && changeInfo.status === "complete") {
    const titleLog = `ページ遷移: 「${tab.title}」`;
    operationLogs.push(titleLog);
    console.log("[background.js] Page navigation logged:", titleLog);

    // SPAなどでcontent.jsの再注入が必要ならばここで実行
    // chrome.scripting.executeScript({
    //   target: { tabId: tabId },
    //   files: ["content.js"]
    // }).then(() => {
    //   console.log("[background.js] content.js was re-injected to tab", tabId);
    // });
  }
});

/**
 * content script からのメッセージを受信
 *  - "addLog": クリックログを受け取る
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "addLog") {
    // 記録中ならログを追加
    if (isRecording) {
      operationLogs.push(message.log);
      console.log("[background.js] Log added:", message.log);
    }
    sendResponse({ status: "log_received" });
    return true;
  }
  return false;
});

/**
 * ChatGPT API呼び出し
 */
async function sendLogsToChatGPT(logs) {
  const promptMessage = generatePromptFromLogs(logs);
  const apiUrl = "https://api.openai.com/v1/chat/completions";
  const apiKey = "YOUR_API_KEY";//openaiのapi keyを入れてください

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "あなたはユーザーの操作ログを手順書に変換するアシスタントです。"
        },
        {
          role: "user",
          content: promptMessage
        }
      ],
      temperature: 0.7
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const result = data.choices && data.choices[0].message.content;
  console.log("[background.js] ChatGPT API response:", result);
  return result;
}

/**
 * ログ配列からプロンプトを組み立て
 */
function generatePromptFromLogs(logs) {
  const steps = logs.map((log, i) => `${i + 1}. ${log}`).join("\n");
  return `以下はユーザーのブラウザ操作ログです。これを読みやすい手順に変換してください。ですますは不要です。まとめられる手順は上手にわかりやすくまとめてください。手順の理由を書けるときは〜するためにとつけてください。そして上に日本語で手順を記載、下に英語で手順を記載してください。:\n\n${steps}`;
}
