// ==========================================
// 🎬 AI 影片生成器 - GAS 後端
// 支援：Kling / Hailuo / Wan Video / Stable Video
// ==========================================

// ========== 設定存取 ==========
function getConfig() {
  const props = PropertiesService.getScriptProperties();
  return {
    repToken: props.getProperty('REPLICATE_TOKEN') || '',
    lineToken: props.getProperty('LINE_TOKEN') || '',
    lineUserId: props.getProperty('LINE_USER_ID') || '',
    imgbbKey: props.getProperty('IMGBB_KEY') || ''
  };
}

function doGet() {
  return HtmlService.createHtmlOutput(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>🎬 AI 影片生成器 - 設定</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:system-ui,sans-serif;background:linear-gradient(135deg,#1a1a2e,#16213e);min-height:100vh;padding:20px;color:#fff;}
    .container{max-width:500px;margin:0 auto;}
    h1{text-align:center;margin-bottom:30px;background:linear-gradient(90deg,#a855f7,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
    .card{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:20px;margin-bottom:16px;}
    .card-title{font-size:14px;color:rgba(255,255,255,0.6);margin-bottom:12px;}
    input{width:100%;padding:12px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.2);border-radius:10px;color:#fff;font-size:14px;}
    input:focus{outline:none;border-color:#a855f7;}
    .btn{width:100%;padding:16px;background:linear-gradient(135deg,#a855f7,#ec4899);border:none;border-radius:12px;color:#fff;font-size:16px;font-weight:bold;cursor:pointer;margin-top:20px;}
    .btn:hover{opacity:0.9;}
    .test-btn{width:100%;padding:12px;margin-top:10px;background:linear-gradient(135deg,#06c755,#04a344);border:none;border-radius:10px;color:#fff;font-size:14px;font-weight:bold;cursor:pointer;}
    .test-btn:hover{opacity:0.9;}
    .status{padding:12px;border-radius:8px;margin-top:16px;text-align:center;display:none;}
    .status.show{display:block;}
    .status.ok{background:rgba(16,185,129,0.2);color:#34d399;}
    .status.err{background:rgba(239,68,68,0.2);color:#f87171;}
    small{display:block;margin-top:6px;color:rgba(255,255,255,0.4);font-size:11px;}
    a{color:#06b6d4;}
  </style>
</head>
<body>
  <div class="container">
    <h1>🎬 AI 影片生成器</h1>
    
    <div class="card">
      <div class="card-title">🔑 Replicate API Token *</div>
      <input type="password" id="repToken" placeholder="r8_...">
      <small><a href="https://replicate.com/account/api-tokens" target="_blank">取得 Token →</a></small>
    </div>
    
    <div class="card">
      <div class="card-title">🔐 LINE Channel Access Token</div>
      <input type="password" id="lineToken" placeholder="LINE Bot Token">
      <small><a href="https://developers.line.biz/console/" target="_blank">LINE Developers →</a></small>
    </div>
    
    <div class="card">
      <div class="card-title">👤 LINE User ID</div>
      <input type="text" id="lineUserId" placeholder="U...">
      <button class="test-btn" onclick="testLine()">🔗 測試 LINE 連線</button>
    </div>
    
    <div class="card">
      <div class="card-title">🖼️ ImgBB API Key（圖片上傳用）</div>
      <input type="password" id="imgbbKey" placeholder="...">
      <small><a href="https://api.imgbb.com/" target="_blank">取得 Key →</a></small>
    </div>
    
    <button class="btn" onclick="save()">💾 儲存設定</button>
    
    <div class="status" id="status"></div>
  </div>
  
  <script>
    // 載入現有設定
    google.script.run.withSuccessHandler(cfg => {
      if(cfg) {
        document.getElementById('repToken').value = cfg.repToken || '';
        document.getElementById('lineToken').value = cfg.lineToken || '';
        document.getElementById('lineUserId').value = cfg.lineUserId || '';
        document.getElementById('imgbbKey').value = cfg.imgbbKey || '';
      }
    }).getConfig();
    
    function save() {
      const cfg = {
        repToken: document.getElementById('repToken').value.trim(),
        lineToken: document.getElementById('lineToken').value.trim(),
        lineUserId: document.getElementById('lineUserId').value.trim(),
        imgbbKey: document.getElementById('imgbbKey').value.trim()
      };
      
      google.script.run
        .withSuccessHandler(() => showStatus('✅ 儲存成功！', 'ok'))
        .withFailureHandler(e => showStatus('❌ ' + e.message, 'err'))
        .saveConfig(cfg);
    }
    
    function showStatus(msg, type) {
      const el = document.getElementById('status');
      el.textContent = msg;
      el.className = 'status show ' + type;
    }
    
    function testLine() {
      const token = document.getElementById('lineToken').value.trim();
      const userId = document.getElementById('lineUserId').value.trim();
      
      if (!token) { showStatus('⚠️ 請先填入 LINE Token', 'err'); return; }
      if (!userId) { showStatus('⚠️ 請先填入 LINE User ID', 'err'); return; }
      
      showStatus('🔄 測試中...', 'ok');
      
      google.script.run
        .withSuccessHandler(result => {
          if (result.ok) {
            showStatus('✅ LINE 連線成功！請查看 LINE', 'ok');
          } else {
            showStatus('❌ ' + result.err, 'err');
          }
        })
        .withFailureHandler(e => showStatus('❌ ' + e.message, 'err'))
        .testLineFromGAS(token, userId);
    }
  </script>
</body>
</html>
  `).setTitle('AI 影片生成器設定');
}

function saveConfig(cfg) {
  const props = PropertiesService.getScriptProperties();
  props.setProperty('REPLICATE_TOKEN', cfg.repToken || '');
  props.setProperty('LINE_TOKEN', cfg.lineToken || '');
  props.setProperty('LINE_USER_ID', cfg.lineUserId || '');
  props.setProperty('IMGBB_KEY', cfg.imgbbKey || '');
}

// 從 GAS 設定頁面測試 LINE
function testLineFromGAS(token, userId) {
  console.log('testLineFromGAS - Token length:', token ? token.length : 0);
  console.log('testLineFromGAS - UserId:', userId);
  
  if (!token) {
    return { ok: false, err: '請填入 LINE Token' };
  }
  if (!userId) {
    return { ok: false, err: '請填入 LINE User ID' };
  }
  if (!userId.startsWith('U')) {
    return { ok: false, err: 'User ID 格式錯誤，應以 U 開頭' };
  }
  
  try {
    const time = Utilities.formatDate(new Date(), 'Asia/Taipei', 'MM/dd HH:mm');
    
    const url = 'https://api.line.me/v2/bot/message/push';
    const res = UrlFetchApp.fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        to: userId,
        messages: [{ 
          type: 'text', 
          text: `🎬 AI 影片生成器\n\n✅ LINE 連線成功！\n\n🔗 GAS 設定頁面測試\n🕐 ${time}` 
        }]
      }),
      muteHttpExceptions: true
    });
    
    const code = res.getResponseCode();
    const body = res.getContentText();
    
    console.log('LINE Response:', code, body);
    
    if (code === 200) {
      return { ok: true };
    } else {
      const err = JSON.parse(body);
      return { ok: false, err: err.message || '推送失敗 (' + code + ')' };
    }
    
  } catch (e) {
    console.error('testLineFromGAS error:', e);
    return { ok: false, err: e.message };
  }
}

// ========== 模型設定 ==========
const MODELS = {
  'veo3': {
    name: 'Google Veo 3',
    replicate: 'google/veo-3',
    fal: 'fal-ai/veo3',
    type: 'both',
    speed: 'slow',
    eta: '2-4分鐘'
  },
  'veo3-fast': {
    name: 'Veo 3 Fast',
    replicate: 'google/veo-3-fast',
    fal: 'fal-ai/veo3/fast',
    type: 'both',
    speed: 'fast',
    eta: '30-60秒'
  },
  'kling': {
    name: 'Kling 2.6',
    replicate: 'kwaivgi/kling-v1.6-pro:d7cccc656e46f646e88a4c607428dbda8885df4b590fac8d9e8ce7d05e327b26',
    fal: 'fal-ai/kling-video/v2.6/pro/text-to-video',
    falI2v: 'fal-ai/kling-video/v2.6/pro/image-to-video',
    type: 'both',
    speed: 'medium',
    eta: '1-3分鐘'
  },
  'hailuo': {
    name: 'Hailuo',
    replicate: 'minimax/video-01',
    fal: 'fal-ai/minimax/video-01/text-to-video',
    falI2v: 'fal-ai/minimax/video-01/image-to-video',
    type: 'both',
    speed: 'medium',
    eta: '1-2分鐘'
  },
  'wan': {
    name: 'Wan Video',
    replicate: 'wan-video/wan-2.1-t2v-480p',
    fal: 'fal-ai/wan/v2.1/text-to-video',
    type: 'text',
    speed: 'fast',
    eta: '30-90秒'
  },
  'svd': {
    name: 'Stable Video',
    replicate: 'stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438',
    fal: 'fal-ai/stable-video',
    type: 'image',
    speed: 'fast',
    eta: '20-40秒'
  }
};

// ========== 主要請求處理 ==========
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const cfg = getConfig();
    
    console.log('Action:', data.action);
    
    // AI 優化提示詞
    if (data.action === 'enhancePrompt') {
      return handleEnhancePrompt(data);
    }
    
    // LINE 連線檢測
    if (data.action === 'testLine') {
      return handleTestLine(data, cfg);
    }
    
    // 生成影片
    if (data.action === 'generateVideo') {
      return handleGenerateVideo(data, cfg);
    }
    
    // 查詢狀態（含進度）
    if (data.action === 'checkStatus') {
      return handleCheckStatus(data, cfg);
    }
    
    // 推送到 LINE
    if (data.action === 'pushVideoToLine') {
      return handlePushToLine(data, cfg);
    }
    
    return jsonResponse({ ok: false, err: 'Unknown action' });
    
  } catch (err) {
    console.error(err);
    return jsonResponse({ ok: false, err: err.message });
  }
}

// ========== AI 優化提示詞 ==========
function handleEnhancePrompt(data) {
  const prompt = data.prompt;
  const type = data.type || 'text'; // 'text' 或 'image'
  const model = data.model || 'auto';
  const geminiKey = data.geminiKey;
  const groqKey = data.groqKey;
  
  // 系統提示詞
  const systemPrompt = type === 'text' 
    ? `你是一位專業的 AI 影片生成提示詞專家。請將用戶的簡短描述擴充為更詳細、更有畫面感的英文提示詞。

要求：
1. 輸出純英文，適合 AI 影片生成模型
2. 加入具體的視覺細節（光線、色彩、氛圍）
3. 加入鏡頭運動描述（如 slow motion, tracking shot, cinematic）
4. 加入時間/天氣/環境描述
5. 控制在 2-3 句話內，不要太長
6. 只輸出優化後的提示詞，不要任何解釋

範例：
輸入：貓咪在草地上
輸出：A fluffy orange cat running through a sunlit meadow with wildflowers, cinematic slow motion, golden hour lighting, shallow depth of field, gentle breeze moving the grass`

    : `你是一位專業的 AI 影片生成提示詞專家。請將用戶對圖片動態效果的描述擴充為更詳細的英文提示詞。

要求：
1. 輸出純英文，適合圖片轉影片模型
2. 描述具體的動態效果和運動方向
3. 加入自然的物理效果（如風吹、水流、光影變化）
4. 控制在 1-2 句話內
5. 只輸出優化後的提示詞，不要任何解釋

範例：
輸入：讓頭髮飄動
輸出：Gentle wind blowing through the hair with natural flowing motion, soft fabric movement, subtle lighting changes`;

  // 決定使用哪個模型
  let usedModel = '';
  let enhanced = '';
  
  if (model === 'gemini' || (model === 'auto' && geminiKey)) {
    if (!geminiKey) {
      return jsonResponse({ ok: false, err: '請設定 Gemini API Key' });
    }
    enhanced = callGemini(prompt, systemPrompt, geminiKey);
    usedModel = 'Gemini';
  } else if (model === 'groq' || (model === 'auto' && groqKey)) {
    if (!groqKey) {
      return jsonResponse({ ok: false, err: '請設定 Groq API Key' });
    }
    enhanced = callGroq(prompt, systemPrompt, groqKey);
    usedModel = 'Groq';
  } else {
    return jsonResponse({ ok: false, err: '請至少設定一個 AI API Key（Gemini 或 Groq）' });
  }
  
  return jsonResponse({
    ok: true,
    enhanced: enhanced,
    usedModel: usedModel
  });
}

// ========== 呼叫 Gemini API ==========
function callGemini(prompt, systemPrompt, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{
      parts: [{ text: systemPrompt + '\n\n用戶輸入：' + prompt }]
    }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500
    }
  };
  
  const res = UrlFetchApp.fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  
  const data = JSON.parse(res.getContentText());
  
  if (data.error) {
    throw new Error(data.error.message || 'Gemini API 錯誤');
  }
  
  return data.candidates[0].content.parts[0].text.trim();
}

// ========== 呼叫 Groq API ==========
function callGroq(prompt, systemPrompt, apiKey) {
  const url = 'https://api.groq.com/openai/v1/chat/completions';
  
  const payload = {
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 500
  };
  
  const res = UrlFetchApp.fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  
  const data = JSON.parse(res.getContentText());
  
  if (data.error) {
    throw new Error(data.error.message || 'Groq API 錯誤');
  }
  
  return data.choices[0].message.content.trim();
}

// ========== 生成影片 ==========
function handleGenerateVideo(data, cfg) {
  const model = MODELS[data.model] || MODELS['veo3'];
  const platform = data.platform || 'auto';
  const falKey = data.falKey || '';
  
  console.log('Platform:', platform);
  console.log('Model:', data.model);
  
  // 決定使用哪個平台
  let useFal = false;
  let useReplicate = false;
  
  if (platform === 'fal') {
    useFal = true;
  } else if (platform === 'replicate') {
    useReplicate = true;
  } else {
    // auto 模式：優先 fal.ai
    useFal = !!falKey;
    useReplicate = !!cfg.repToken;
  }
  
  // 檢查是否有可用平台
  if (!useFal && !useReplicate) {
    return jsonResponse({ ok: false, err: '請設定 fal.ai Key 或 Replicate Token' });
  }
  
  // 優先嘗試 fal.ai
  if (useFal && falKey) {
    try {
      console.log('Trying fal.ai...');
      const result = callFalAI(data, model, falKey, cfg);
      
      // 背景模式處理
      if (data.bgMode && data.lineUserId) {
        savePendingTask({
          id: result.id,
          platform: 'fal',
          userId: data.lineUserId,
          model: model.name,
          startTime: new Date().toISOString()
        });
        setupBgCheckTrigger();
      }
      
      return jsonResponse({
        ok: true,
        id: result.id,
        status: result.status,
        platform: 'fal'
      });
      
    } catch (err) {
      console.error('fal.ai error:', err);
      
      // auto 模式下嘗試備援
      if (platform === 'auto' && cfg.repToken) {
        console.log('fal.ai failed, trying Replicate...');
      } else {
        return jsonResponse({ ok: false, err: 'fal.ai: ' + err.message });
      }
    }
  }
  
  // 使用 Replicate
  if (useReplicate || platform === 'auto') {
    if (!cfg.repToken) {
      return jsonResponse({ ok: false, err: '請先設定 Replicate Token' });
    }
    
    try {
      console.log('Using Replicate...');
      const input = data.mode === 'text' 
        ? buildTextToVideoInput(data, model)
        : buildImageToVideoInput(data, model, cfg);
      
      const prediction = createPrediction(model.replicate, input, cfg.repToken);
      console.log('Replicate Prediction ID:', prediction.id);
      
      // 背景模式處理
      if (data.bgMode && data.lineUserId) {
        savePendingTask({
          id: prediction.id,
          platform: 'replicate',
          userId: data.lineUserId,
          model: model.name,
          startTime: new Date().toISOString()
        });
        setupBgCheckTrigger();
      }
      
      return jsonResponse({
        ok: true,
        id: prediction.id,
        status: prediction.status,
        platform: 'replicate'
      });
      
    } catch (err) {
      console.error('Replicate error:', err);
      return jsonResponse({ ok: false, err: 'Replicate: ' + err.message });
    }
  }
  
  return jsonResponse({ ok: false, err: '無可用平台' });
}

// ========== fal.ai API ==========
function callFalAI(data, model, falKey, cfg) {
  const mode = data.mode;
  let endpoint = mode === 'text' ? model.fal : (model.falI2v || model.fal);
  
  // 建立輸入參數
  let input = {
    prompt: data.prompt || 'animate this image smoothly',
    duration: String(data.duration || 5),
    aspect_ratio: data.ratio || '16:9'
  };
  
  // 圖片模式
  if (mode === 'image' && data.image) {
    let imageUrl = data.image;
    if (imageUrl.startsWith('data:')) {
      if (!cfg.imgbbKey) {
        throw new Error('需要 ImgBB Key 來上傳圖片');
      }
      imageUrl = uploadToImgBB(imageUrl, cfg.imgbbKey);
    }
    input.image_url = imageUrl;
  }
  
  console.log('fal.ai endpoint:', endpoint);
  console.log('fal.ai input:', JSON.stringify(input));
  
  // 提交任務
  const submitRes = UrlFetchApp.fetch('https://queue.fal.run/' + endpoint, {
    method: 'POST',
    headers: {
      'Authorization': 'Key ' + falKey,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(input),
    muteHttpExceptions: true
  });
  
  const submitCode = submitRes.getResponseCode();
  const submitBody = submitRes.getContentText();
  
  console.log('fal.ai submit response:', submitCode, submitBody);
  
  if (submitCode !== 200 && submitCode !== 201) {
    const err = JSON.parse(submitBody);
    throw new Error(err.detail || err.message || '提交失敗');
  }
  
  const result = JSON.parse(submitBody);
  
  return {
    id: result.request_id,
    status: result.status || 'IN_QUEUE'
  };
}

// ========== 建立文字生影片參數 ==========
function buildTextToVideoInput(data, model) {
  const prompt = data.prompt;
  const duration = data.duration || 5;
  const ratio = data.ratio || '16:9';
  
  // Google Veo 3
  if (model.version.includes('veo')) {
    return {
      prompt: prompt,
      duration: duration,
      aspect_ratio: ratio,
      generate_audio: true  // Veo 3 支援原生音訊
    };
  }
  
  // Kling
  if (model.version.includes('kling')) {
    return {
      prompt: prompt,
      duration: duration.toString(),
      aspect_ratio: ratio
    };
  }
  
  // Hailuo / MiniMax
  if (model.version.includes('minimax') || model.version.includes('hailuo')) {
    return {
      prompt: prompt,
      prompt_optimizer: true
    };
  }
  
  // Wan Video
  if (model.version.includes('wan')) {
    return {
      prompt: prompt,
      num_frames: duration * 8, // 8 fps
      width: ratio === '9:16' ? 480 : 848,
      height: ratio === '9:16' ? 848 : 480
    };
  }
  
  // 預設
  return { prompt: prompt };
}

// ========== 建立圖片生影片參數 ==========
function buildImageToVideoInput(data, model, cfg) {
  let imageUrl = data.image;
  
  // 如果是 base64，先上傳到 ImgBB
  if (imageUrl && imageUrl.startsWith('data:')) {
    if (!cfg.imgbbKey) {
      throw new Error('需要 ImgBB Key 來上傳圖片');
    }
    imageUrl = uploadToImgBB(imageUrl, cfg.imgbbKey);
    console.log('Uploaded image:', imageUrl);
  }
  
  const prompt = data.prompt || '';
  const duration = data.duration || 5;
  
  // Google Veo 3
  if (model.version.includes('veo')) {
    return {
      image: imageUrl,
      prompt: prompt || 'animate this image with natural motion',
      duration: duration,
      generate_audio: true
    };
  }
  
  // Stable Video Diffusion
  if (model.version.includes('stable-video')) {
    return {
      input_image: imageUrl,
      motion_bucket_id: 127,
      fps: 8,
      cond_aug: 0.02
    };
  }
  
  // Kling
  if (model.version.includes('kling')) {
    return {
      image: imageUrl,
      prompt: prompt || 'animate this image smoothly',
      duration: duration.toString()
    };
  }
  
  // Hailuo
  if (model.version.includes('minimax') || model.version.includes('hailuo')) {
    return {
      first_frame_image: imageUrl,
      prompt: prompt || 'animate this image'
    };
  }
  
  // 預設
  return {
    image: imageUrl,
    prompt: prompt
  };
}

// ========== Replicate API ==========
function createPrediction(version, input, token) {
  const url = 'https://api.replicate.com/v1/predictions';
  
  const payload = {
    version: version,
    input: input
  };
  
  // 如果是模型路徑格式（不含冒號的版本）
  if (!version.includes(':')) {
    delete payload.version;
    payload.model = version;
  }
  
  const options = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  const res = UrlFetchApp.fetch(url, options);
  const data = JSON.parse(res.getContentText());
  
  if (data.error) {
    throw new Error(data.error.detail || data.error);
  }
  
  return data;
}

function getPrediction(id, token) {
  const url = 'https://api.replicate.com/v1/predictions/' + id;
  
  const options = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
    },
    muteHttpExceptions: true
  };
  
  const res = UrlFetchApp.fetch(url, options);
  return JSON.parse(res.getContentText());
}

// ========== LINE 連線檢測 ==========
function handleTestLine(data, cfg) {
  const userId = data.userId || cfg.lineUserId;
  
  console.log('Test LINE - Token:', cfg.lineToken ? '有設定' : '未設定');
  console.log('Test LINE - UserId:', userId);
  
  if (!cfg.lineToken) {
    return jsonResponse({ ok: false, err: '請先在 GAS 設定頁面填入 LINE Token' });
  }
  
  if (!userId) {
    return jsonResponse({ ok: false, err: '請先設定 LINE User ID' });
  }
  
  if (!userId.startsWith('U')) {
    return jsonResponse({ ok: false, err: 'LINE User ID 格式錯誤，應以 U 開頭' });
  }
  
  try {
    const time = Utilities.formatDate(new Date(), 'Asia/Taipei', 'MM/dd HH:mm');
    
    push(userId, `🎬 AI 影片生成器

✅ LINE 連線成功！

🔗 已連接到您的 LINE
🤖 影片生成完成後將自動推送
🕐 ${time}`, cfg.lineToken);
    
    return jsonResponse({ ok: true, msg: 'LINE 連線成功' });
    
  } catch (err) {
    console.error('LINE Test Error:', err);
    return jsonResponse({ ok: false, err: err.message });
  }
}

// ========== 查詢狀態（含進度）==========
function handleCheckStatus(data, cfg) {
  if (!data.id) {
    return jsonResponse({ ok: false, err: 'Missing prediction ID' });
  }
  
  const platform = data.platform || 'replicate';
  const falKey = data.falKey || '';
  
  try {
    let result;
    
    if (platform === 'fal') {
      result = checkFalStatus(data.id, falKey);
    } else {
      result = checkReplicateStatus(data.id, cfg.repToken);
    }
    
    return jsonResponse(result);
    
  } catch (err) {
    return jsonResponse({ ok: false, err: err.message });
  }
}

// 檢查 fal.ai 狀態
function checkFalStatus(requestId, falKey) {
  const res = UrlFetchApp.fetch('https://queue.fal.run/requests/' + requestId + '/status', {
    method: 'GET',
    headers: {
      'Authorization': 'Key ' + falKey
    },
    muteHttpExceptions: true
  });
  
  const code = res.getResponseCode();
  const body = res.getContentText();
  
  if (code !== 200) {
    throw new Error('查詢失敗: ' + code);
  }
  
  const data = JSON.parse(body);
  
  let status = 'processing';
  let output = null;
  let progress = 10;
  let progressMsg = '排隊中...';
  
  if (data.status === 'COMPLETED') {
    status = 'succeeded';
    progress = 100;
    progressMsg = '完成！';
    
    // 取得結果
    const resultRes = UrlFetchApp.fetch('https://queue.fal.run/requests/' + requestId, {
      method: 'GET',
      headers: { 'Authorization': 'Key ' + falKey },
      muteHttpExceptions: true
    });
    
    if (resultRes.getResponseCode() === 200) {
      const resultData = JSON.parse(resultRes.getContentText());
      output = resultData.video?.url || resultData.output?.url || resultData.url;
    }
    
  } else if (data.status === 'FAILED') {
    status = 'failed';
    return { ok: true, status: 'failed', error: data.error || '生成失敗' };
    
  } else if (data.status === 'IN_PROGRESS') {
    progress = 50;
    progressMsg = '生成中...';
    
  } else if (data.status === 'IN_QUEUE') {
    progress = 10;
    progressMsg = '排隊等待...';
  }
  
  return {
    ok: true,
    status: status,
    output: output,
    progress: progress,
    progressMsg: progressMsg
  };
}

// 檢查 Replicate 狀態
function checkReplicateStatus(predictionId, repToken) {
  const prediction = getPrediction(predictionId, repToken);
  
  let output = null;
  let progress = 0;
  let progressMsg = '準備中...';
  
  if (prediction.status === 'succeeded' && prediction.output) {
    output = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
    progress = 100;
    progressMsg = '完成！';
  } else if (prediction.status === 'processing') {
    const logs = prediction.logs || '';
    if (logs.includes('100%') || logs.includes('Finished')) {
      progress = 95;
      progressMsg = '即將完成...';
    } else if (logs.includes('80%') || logs.includes('rendering')) {
      progress = 80;
      progressMsg = '渲染中...';
    } else if (logs.includes('60%') || logs.includes('generating')) {
      progress = 60;
      progressMsg = '生成影格中...';
    } else if (logs.includes('40%') || logs.includes('processing')) {
      progress = 40;
      progressMsg = '處理中...';
    } else if (logs.includes('20%') || logs.includes('loading')) {
      progress = 20;
      progressMsg = '載入模型...';
    } else {
      progress = 10;
      progressMsg = '排隊處理中...';
    }
  } else if (prediction.status === 'starting') {
    progress = 5;
    progressMsg = '啟動中...';
  }
  
  return {
    ok: true,
    status: prediction.status,
    output: output,
    error: prediction.error,
    progress: progress,
    progressMsg: progressMsg
  };
}

// ========== 推送到 LINE ==========
function handlePushToLine(data, cfg) {
  if (!cfg.lineToken) {
    return jsonResponse({ ok: false, err: '請先設定 LINE Token' });
  }
  
  const userId = data.userId || cfg.lineUserId;
  if (!userId) {
    return jsonResponse({ ok: false, err: '請先設定 LINE User ID' });
  }
  
  const videoUrl = data.videoUrl;
  const model = data.model || 'AI';
  const duration = data.duration || '5';
  
  const time = Utilities.formatDate(new Date(), 'Asia/Taipei', 'MM/dd HH:mm');
  
  const text = `🎬 AI 影片生成完成！

🤖 模型：${model}
⏱️ 長度：${duration} 秒
🕐 時間：${time}

📥 影片連結：
${videoUrl}`;

  push(userId, text, cfg.lineToken);
  
  return jsonResponse({ ok: true });
}

// ========== LINE 推送 ==========
function push(userId, text, token) {
  const url = 'https://api.line.me/v2/bot/message/push';
  
  console.log('LINE Push to:', userId);
  console.log('Token length:', token ? token.length : 0);
  
  const res = UrlFetchApp.fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify({
      to: userId,
      messages: [{ type: 'text', text: text }]
    }),
    muteHttpExceptions: true
  });
  
  const code = res.getResponseCode();
  const body = res.getContentText();
  
  console.log('LINE Response:', code, body);
  
  if (code !== 200) {
    throw new Error('LINE 推送失敗: ' + body);
  }
  
  return true;
}

// ========== ImgBB 上傳 ==========
function uploadToImgBB(base64Data, apiKey) {
  // 移除 data:image/xxx;base64, 前綴
  const imageData = base64Data.replace(/^data:image\/\w+;base64,/, '');
  
  const res = UrlFetchApp.fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    payload: {
      key: apiKey,
      image: imageData
    },
    muteHttpExceptions: true
  });
  
  const data = JSON.parse(res.getContentText());
  
  if (!data.success) {
    throw new Error('圖片上傳失敗');
  }
  
  return data.data.url;
}

// ========== 工具函數 ==========
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ========== 背景任務管理 ==========
function savePendingTask(task) {
  const props = PropertiesService.getScriptProperties();
  let pending = JSON.parse(props.getProperty('PENDING_TASKS') || '[]');
  pending.push(task);
  props.setProperty('PENDING_TASKS', JSON.stringify(pending));
  console.log('Saved pending task:', task.id);
}

function removePendingTask(taskId) {
  const props = PropertiesService.getScriptProperties();
  let pending = JSON.parse(props.getProperty('PENDING_TASKS') || '[]');
  pending = pending.filter(t => t.id !== taskId);
  props.setProperty('PENDING_TASKS', JSON.stringify(pending));
}

function setupBgCheckTrigger() {
  // 檢查是否已有 Trigger
  const triggers = ScriptApp.getProjectTriggers();
  const exists = triggers.some(t => t.getHandlerFunction() === 'checkPendingTasks');
  
  if (!exists) {
    // 每分鐘檢查一次
    ScriptApp.newTrigger('checkPendingTasks')
      .timeBased()
      .everyMinutes(1)
      .create();
    console.log('Created background check trigger');
  }
}

function checkPendingTasks() {
  const props = PropertiesService.getScriptProperties();
  const cfg = getConfig();
  
  let pending = JSON.parse(props.getProperty('PENDING_TASKS') || '[]');
  
  if (pending.length === 0) {
    // 沒有待處理任務，移除 Trigger
    removeBgCheckTrigger();
    return;
  }
  
  console.log('Checking', pending.length, 'pending tasks');
  
  const stillPending = [];
  
  for (const task of pending) {
    try {
      let result;
      const platform = task.platform || 'replicate';
      
      // 根據平台檢查狀態
      if (platform === 'fal') {
        // 需要從某處取得 falKey，這裡假設儲存在 props 中
        const falKey = props.getProperty('FAL_KEY') || '';
        result = checkFalStatus(task.id, falKey);
      } else {
        result = checkReplicateStatus(task.id, cfg.repToken);
      }
      
      if (result.status === 'succeeded') {
        // 成功！發送 LINE 通知
        const time = Utilities.formatDate(new Date(), 'Asia/Taipei', 'MM/dd HH:mm');
        const platformLabel = platform === 'fal' ? 'fal.ai' : 'Replicate';
        
        const text = `🎬 AI 影片生成完成！

✅ 背景生成成功 (${platformLabel})

🤖 模型：${task.model}
🕐 完成時間：${time}

📥 影片連結：
${result.output}`;

        push(task.userId, text, cfg.lineToken);
        console.log('Sent LINE notification for task:', task.id);
        
      } else if (result.status === 'failed') {
        // 失敗
        const time = Utilities.formatDate(new Date(), 'Asia/Taipei', 'MM/dd HH:mm');
        
        push(task.userId, `🎬 AI 影片生成失敗

❌ 背景生成失敗

🤖 模型：${task.model}
🕐 時間：${time}
📝 錯誤：${result.error || '未知錯誤'}`, cfg.lineToken);
        
      } else {
        // 還在處理中
        stillPending.push(task);
      }
      
    } catch (e) {
      console.error('Error checking task', task.id, e);
      stillPending.push(task);
    }
  }
  
  // 更新待處理列表
  props.setProperty('PENDING_TASKS', JSON.stringify(stillPending));
  
  // 如果沒有待處理任務了，移除 Trigger
  if (stillPending.length === 0) {
    removeBgCheckTrigger();
  }
}

function removeBgCheckTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'checkPendingTasks') {
      ScriptApp.deleteTrigger(trigger);
      console.log('Removed background check trigger');
    }
  }
}
