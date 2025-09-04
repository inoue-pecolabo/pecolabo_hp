# PecoLabo Corporate Site

PecoLabo合同会社のコーポレートサイトです。IT事業、美容事業、物販事業を通じて、もっと自由に自分らしく生きる選択肢を提供します。

## 🚀 特徴

- **セキュアな設計**: CSRF対策、XSS対策、レート制限を実装
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- **高速パフォーマンス**: 最適化されたCSS/JS、画像圧縮
- **SEO対応**: メタタグ、構造化データ、サイトマップ
- **アクセシビリティ**: WCAG 2.1準拠の設計

## 📋 技術スタック

- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+)
- **フレームワーク**: Bootstrap 5.3.2
- **アイコン**: FontAwesome 6.5.1
- **ビルドツール**: Node.js, npm
- **バックエンド**: PHP 8.1+ (お問い合わせフォーム)

## 🛠️ セットアップ

### 前提条件

- Node.js 16.0.0以上
- npm 8.0.0以上
- PHP 8.1以上（お問い合わせフォーム用）

### インストール

1. リポジトリをクローン
```bash
git clone https://github.com/pecolabo/corporate-site.git
cd corporate-site
```

2. 依存関係をインストール
```bash
npm install
```

3. 環境変数を設定
```bash
cp .env.example .env
# .envファイルを編集して適切な値を設定
```

4. ビルドを実行
```bash
npm run build
```

## 🚀 開発

### 開発サーバーの起動

```bash
npm start
```

### ビルドのみ

```bash
npm run build
```

### 最適化の実行

```bash
node optimize.js
```

### セキュリティテスト

```bash
open test_security.html
```

## 📁 プロジェクト構造

```
pecolabo_corporatesite/
├── css/                 # コンパイルされたCSSファイル
├── js/                  # JavaScriptファイル
├── img/                 # 画像ファイル
├── scss/                # SCSSソースファイル
├── vendor/              # 外部ライブラリ
├── mail/                # PHPメール処理
├── index.html           # メインページ
├── package.json         # 依存関係
├── gulpfile.js          # Gulp設定
├── build.js             # カスタムビルドスクリプト
├── optimize.js          # 最適化スクリプト
├── deploy.sh            # デプロイスクリプト
├── .env                 # 環境変数
├── .htaccess            # Apache設定
└── nginx.conf           # Nginx設定
```

## 🔒 セキュリティ機能

### 実装済みセキュリティ対策

- **CSRF保護**: トークンベースの保護
- **XSS対策**: 入力値のサニタイズ
- **レート制限**: 5分間に3回までの送信制限
- **入力検証**: クライアント・サーバーサイド両方で検証
- **セキュリティヘッダー**: X-Frame-Options, CSP等

### セキュリティヘッダー

```apache
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

## 🚀 デプロイメント

### 本番環境へのデプロイ

```bash
./deploy.sh
```

### 手動デプロイ

1. ファイルをWebサーバーにアップロード
2. SSL証明書を設定
3. ドメインのDNS設定
4. 環境変数の設定
5. お問い合わせフォームのテスト

### サーバー設定

#### Apache (.htaccess)
- HTTPS強制リダイ���クト
- セキュリティヘッダー
- キャッシュ設定
- Gzip圧縮

#### Nginx (nginx.conf)
- SSL/TLS設定
- セキュリティヘッダー
- 静的ファイルキャッシュ
- PHP-FPM設定

## 📊 パフォーマンス

### 最適化済み項目

- CSS/JSのミニファイ
- 画像の最適化
- Gzip圧縮
- ブラウザキャッシュ
- CDN対応

### パフォーマンス指標

- **Lighthouse Score**: 90+ (目標)
- **First Contentful Paint**: <2秒
- **Largest Contentful Paint**: <4秒
- **Cumulative Layout Shift**: <0.1

## 🧪 テスト

### セキュリティテスト

```bash
# セキュリティテストページを開く
open test_security.html
```

### 手動テスト項目

- [ ] フォームバリデーション
- [ ] CSRFトークン生成
- [ ] レート制限
- [ ] レスポンシブデザイン
- [ ] アクセシビリティ

## 📝 ライセンス

MIT License - 詳細は[LICENSE](LICENSE)ファイルを参照

## 👥 貢献

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📞 サポート

- **Email**: info@pecolabo.com
- **Website**: https://pecolabo.com
- **Issues**: [GitHub Issues](https://github.com/pecolabo/corporate-site/issues)

## 🔄 更新履歴

### v1.0.0 (2024-01-XX)
- 初回リリース
- セキュリティ機能の実装
- パフォーマンス最適化
- レスポンシブデザイン対応

---

**PecoLabo合同会社** - もっと自由に自分らしく生きる選択肢を。
