#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 PecoLabo Corporate Site Build Process');
console.log('=====================================');

// 1. 依存関係のコピー
console.log('📦 Copying dependencies...');
try {
  // Bootstrap
  execSync('cp -r node_modules/bootstrap/dist/* vendor/bootstrap/', { stdio: 'inherit' });
  
  // FontAwesome
  execSync('cp -r node_modules/@fortawesome/fontawesome-free/css/* vendor/fontawesome-free/css/', { stdio: 'inherit' });
  execSync('cp -r node_modules/@fortawesome/fontawesome-free/webfonts/* vendor/fontawesome-free/webfonts/', { stdio: 'inherit' });
  
  // jQuery
  execSync('cp node_modules/jquery/dist/* vendor/jquery/', { stdio: 'inherit' });
  
  // jQuery Easing
  execSync('cp node_modules/jquery.easing/*.js vendor/jquery-easing/', { stdio: 'inherit' });
  
  console.log('✅ Dependencies copied successfully');
} catch (error) {
  console.error('❌ Error copying dependencies:', error.message);
  process.exit(1);
}

// 2. SCSSのコンパイル
console.log('🎨 Compiling SCSS...');
try {
  const sass = require('sass');
  const scssFile = path.join(__dirname, 'scss', 'agency.scss');
  const cssFile = path.join(__dirname, 'css', 'agency.css');
  const cssMinFile = path.join(__dirname, 'css', 'agency.min.css');
  
  // SCSSをコンパイル
  const result = sass.compile(scssFile, {
    style: 'expanded',
    loadPaths: ['node_modules']
  });
  
  // CSSファイルに書き込み
  fs.writeFileSync(cssFile, result.css);
  
  // ミニファイ版を作成
  const cleanCSS = require('clean-css');
  const minified = new cleanCSS().minify(result.css);
  fs.writeFileSync(cssMinFile, minified.styles);
  
  console.log('✅ SCSS compiled successfully');
} catch (error) {
  console.error('❌ Error compiling SCSS:', error.message);
  process.exit(1);
}

// 3. JavaScriptのミニファイ
console.log('📝 Minifying JavaScript...');
try {
  const uglify = require('uglify-js');
  const jsFile = path.join(__dirname, 'js', 'agency.js');
  const jsMinFile = path.join(__dirname, 'js', 'agency.min.js');
  
  const jsCode = fs.readFileSync(jsFile, 'utf8');
  const result = uglify.minify(jsCode);
  
  if (result.error) {
    throw result.error;
  }
  
  fs.writeFileSync(jsMinFile, result.code);
  console.log('✅ JavaScript minified successfully');
} catch (error) {
  console.error('❌ Error minifying JavaScript:', error.message);
  process.exit(1);
}

console.log('🎉 Build completed successfully!');
console.log('=====================================');