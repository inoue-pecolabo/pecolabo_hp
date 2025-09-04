#!/bin/bash

# PecoLabo Corporate Site Deployment Script
# 本番環境へのデプロイ用スクリプト

set -e  # エラー時に停止

echo "🚀 PecoLabo Corporate Site Deployment"
echo "====================================="

# 1. 環境変数の確認
echo "🔍 Checking environment variables..."
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create it from .env.example"
    exit 1
fi
echo "✅ Environment variables configured"

# 2. 依存関係のインストール
echo "📦 Installing dependencies..."
npm ci --production
echo "✅ Dependencies installed"

# 3. ビルドプロセスの実行
echo "🔨 Building project..."
node build.js
echo "✅ Build completed"

# 4. 最適化の実行
echo "⚡ Running optimizations..."
node optimize.js
echo "✅ Optimizations completed"

# 5. セキュリティチェック
echo "🔒 Running security checks..."
if [ -f "test_security.html" ]; then
    echo "✅ Security test file found"
else
    echo "⚠️ Security test file not found"
fi

# 6. ファイル権限の設定
echo "🔐 Setting file permissions..."
chmod 644 *.html
chmod 644 css/*.css
chmod 644 js/*.js
chmod 600 .env
chmod 644 .htaccess
echo "✅ File permissions set"

# 7. バックアップの作成
echo "💾 Creating backup..."
BACKUP_DIR="backup/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r css js img vendor index.html "$BACKUP_DIR/" 2>/dev/null || true
echo "✅ Backup created in $BACKUP_DIR"

# 8. デプロイメント完了
echo "🎉 Deployment completed successfully!"
echo "====================================="
echo ""
echo "📋 Next steps:"
echo "1. Upload files to your web server"
echo "2. Configure SSL certificate"
echo "3. Set up domain DNS"
echo "4. Test the contact form"
echo "5. Monitor security logs"
echo ""
echo "🔗 Useful commands:"
echo "- Test locally: npm start"
echo "- Build only: npm run build"
echo "- Security test: open test_security.html"
echo ""