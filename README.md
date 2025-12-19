# 🎬 AI 影片生成器

手機也能用 AI 生成影片！支援文字→影片、圖片→影片。

## ✨ 功能特色

- 📝 **文字生影片** - 輸入描述，AI 生成影片
- 🖼️ **圖片生影片** - 上傳圖片，AI 讓它動起來
- ✨ **AI 優化提示詞** - Gemini / Groq 自動優化描述（二合一）
- 🤖 **多模型支援** - Kling / Hailuo / Wan / Stable Video
- ⏱️ **時長選擇** - 5秒 / 10秒
- 📐 **比例選擇** - 16:9 / 9:16 / 1:1
- 📥 **下載分享** - 下載影片、分享連結
- 💬 **LINE 推送** - 直接發送到 LINE

## 🆕 AI 提示詞優化

簡單輸入 → AI 自動擴充為專業提示詞！

| 原始輸入 | AI 優化後 |
|---------|----------|
| 貓咪在草地上 | A fluffy orange cat running through a sunlit meadow with wildflowers, cinematic slow motion, golden hour lighting... |
| 讓頭髮飄動 | Gentle wind blowing through the hair with natural flowing motion, soft fabric movement... |

支援兩個 AI 引擎（二選一即可）：
- 💎 **Gemini** - 免費額度大，品質好
- ⚡ **Groq** - 速度超快

## 🚀 快速開始

### 1️⃣ 取得 API Keys

**Replicate Token（必要）**
1. 前往 https://replicate.com/account/api-tokens
2. 建立新 Token（r8_xxx 格式）

**Gemini API Key（AI 優化用，選填）**
1. 前往 https://aistudio.google.com/app/apikey
2. 建立 API Key（AIza... 格式）

**Groq API Key（AI 優化用，選填）**
1. 前往 https://console.groq.com/keys
2. 建立 API Key（gsk_... 格式）

### 2️⃣ 部署 GAS

1. 前往 https://script.google.com
2. 建立新專案
3. 貼上 `Code.gs` 內容
4. 部署 → 新增部署 → 網頁應用程式
5. 設定「任何人皆可存取」
6. 複製部署網址

### 3️⃣ 設定 GAS

1. 開啟部署網址
2. 填入 Replicate Token
3. （選填）填入 LINE Token 和 User ID
4. 儲存設定

### 4️⃣ 使用網頁版

1. 開啟 `index.html`（可部署到 Netlify）
2. 設定 → 填入 GAS URL
3. 開始生成影片！

## 🤖 支援模型

| 模型 | 功能 | 說明 |
|------|------|------|
| 🌟 Google Veo 3 | 文字/圖片 | 頂級品質+原生音訊 |
| 🎬 Kling 2.5 | 文字/圖片 | 高品質電影感 |
| 🌊 Hailuo | 文字/圖片 | MiniMax 出品 |
| 🆓 Wan Video | 文字 | 開源免費快速 |
| 🎞️ Stable Video | 圖片 | 圖片動畫化 |

## 💰 費用說明

Replicate 按使用量計費：
- Kling: ~$0.05/秒
- Hailuo: ~$0.03/秒
- Wan: ~$0.01/秒
- Stable Video: ~$0.01/次

## ⚠️ 注意事項

- 影片生成需要 1-5 分鐘
- GAS 有 6 分鐘執行限制，使用輪詢機制
- 建議使用 WiFi 環境

## 📁 檔案說明

```
├── index.html    # 主程式（網頁版）
├── Code.gs       # GAS 後端
└── README.md     # 說明文檔
```

## 🔗 相關連結

- Replicate: https://replicate.com
- LINE Developers: https://developers.line.biz
- ImgBB: https://api.imgbb.com

---

Made with 💜 by AI
