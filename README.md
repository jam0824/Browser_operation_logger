# 概要
Chrome extentionです。ブラウザでの操作手順を記録し、AIで整形し日本語/英語で操作手順を返します。

# install
0. このリポジトリをcloneしてください。
1. chromeで「拡張機能を管理」を選んでください。
2. 「パッケージ化されていない拡張機能を読み込む」を選択
3. cloneしたフォルダを選択
これで「Browser Operation Logger」が拡張機能と右クリックメニューに現れます。

AI機能を使うためには`background.js`の`apiKey`にopenaiから取得したあなたのAPI KEYを入力してください。

# 使い方
1. 右クリック→「Browser Operation Logger」→「記録開始」
2. ブラウザ操作を実施
3. 右クリック→「Browser Operation Logger」→「記録停止」
4. apiからのレスポンスに10秒程度かかります。しばらく待ってから拡張機能の「Browser Operation Logger」をクリックすると整形された日本語/英語手順が表示されます
5. 「コピーする」でクリップボードに結果をコピーすることができます。
