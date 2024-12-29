# 概要
Chrome extentionです。ブラウザでの操作手順を記録し、AIで整形し日本語/英語で操作手順を返します。
バグ票のステップ作成や、WEBアプリの操作マニュアルなどを作る際に便利です。

[操作している動画](https://drive.google.com/file/d/1II_IDnRsYBhgqrkQLmq0lddRZscjJr3a/view?usp=sharing)

<img width="400" alt="スクリーンショット 2024-12-28 10 36 59" src="https://github.com/user-attachments/assets/faa6fa9e-3975-4f2f-999f-97862c72e567" />


# install
0. このリポジトリをcloneしてください。
1. chromeで「拡張機能を管理」を選んでください。
2. 「パッケージ化されていない拡張機能を読み込む」を選択
3. cloneしたフォルダを選択

これで「Browser Operation Logger」が拡張機能と右クリックメニューに現れます。

# 使い方
## 準備
1. 拡張機能の「Browser Operation Logger」をクリックするとポップアップが表示されます。
2. AIを使う場合は `AIを使う`にチェックを入れ `OpenAI API Key`にopenaiから取得したAPI KEYを設定して保存してください。

<img width="400" alt="スクリーンショット 2024-12-28 15 43 51" src="https://github.com/user-attachments/assets/bbeeb012-67fb-4305-98ce-bb97a74ec7b3" />

AIを使うと操作ログがわかりやすく整理されます。デフォルト状態では英語翻訳もされます。

AIを使わない場合は操作ログがそのまま表示されます。

<img width="300" alt="スクリーンショット 2024-12-28 15 44 11" src="https://github.com/user-attachments/assets/45c044b0-42e4-4b17-9aa8-203151c6bea2" />


## 使うとき
3. 右クリック→「Browser Operation Logger」→「記録開始」
4. ブラウザ操作を実施
5. 右クリック→「Browser Operation Logger」→「記録停止」
6. AIを使う場合はapiからのレスポンスに10秒程度かかります。しばらく待ってから拡張機能の「Browser Operation Logger」をクリックすると整形された日本語/英語手順が表示されます
7. 「コピーする」でクリップボードに結果をコピーすることができます。

## プロンプトの編集
AIに送るプロンプトを編集したい場合は、popupの最下部より編集してください。
デフォルトでは以下となっています。
```
以下はユーザーのブラウザ操作ログです。これを読みやすい手順に変換してください。ですますは不要です。まとめられる手順は上手にわかりやすくまとめてください。手順の理由を書けるときは〜するためにとつけてください。そして上に日本語で手順を記載、下に英語で手順を記載してください。
```

<img width="400" alt="スクリーンショット 2024-12-29 8 41 12" src="https://github.com/user-attachments/assets/cf4a227b-3d2c-4073-b484-f9a374f8bc77" />
