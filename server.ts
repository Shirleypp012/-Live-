import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI client if API Key exists
function getGenAI() {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    return new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return null;
}

// System prompts for BUV Cleanser Step 1-5
const BUV_SYSTEM_PROMPT_STEP1 = `
你是一个 BUV 笔薇小绿泥洁面品牌的"爆款视觉拆解专家"。
你的任务是把用户上传的【视频帧】或【Live 图】拆解成一段可复用的【静态图生成提示词】。
品牌信息：BUV笔薇小绿泥洁面（控油品类国货第一），主打薄荷绿清爽膏体、3重天然泥+4重控油植萃、8小时控油-66.87%。
你必须返回合法的 JSON 对象，包含以下字段：
1. scene (10-30字)
2. subject (10-30字)
3. style (5-15字)
4. palette (3个色彩的数组，含HEX值与中文名)
5. lighting (5-20字)
6. composition (5-20字)
7. mood (3-8字)
8. camera (5-20字)
9. static_image_prompt (英文 Midjourney/SD prompt, 30-80字)
10. rationale (拆解逻辑与抖音/小红书爆款转化理由, 30-80字)
`;

// API Endpoints

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    brand: 'BUV 笔薇小绿泥洁面爆款流水线',
  });
});

// Step 1 Endpoint
app.post('/api/pipeline/step1', async (req, res) => {
  const { platform = 'douyin', bloggerType = 'daily_seeding', viralReason = '' } = req.body;
  const ai = getGenAI();

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `针对目标平台【${platform}】、博主类型【${bloggerType}】、爆款原因【${viralReason}】，请拆解BUV小绿泥洁面的视觉画面，输出结构化JSON。`,
        config: {
          systemInstruction: BUV_SYSTEM_PROMPT_STEP1,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              scene: { type: Type.STRING },
              subject: { type: Type.STRING },
              style: { type: Type.STRING },
              palette: { type: Type.ARRAY, items: { type: Type.STRING } },
              lighting: { type: Type.STRING },
              composition: { type: Type.STRING },
              mood: { type: Type.STRING },
              camera: { type: Type.STRING },
              static_image_prompt: { type: Type.STRING },
              rationale: { type: Type.STRING },
            },
            required: ['scene', 'subject', 'style', 'palette', 'lighting', 'composition', 'mood', 'camera', 'static_image_prompt', 'rationale'],
          },
        },
      });

      if (response.text) {
        const data = JSON.parse(response.text);
        return res.json({ success: true, data, source: 'gemini' });
      }
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to mock:', err.message);
    }
  }

  // Robust Mock Fallback
  const mockResult = {
    scene: platform === 'xiaohongshu' ? '晨间阳光浴室镜前，自然光从左侧窗户斜照' : '高质感极简化妆台，搭配水滴与深层泥膜质感摆件',
    subject: '女性纤手持 BUV 绿泥洁面管身，膏体带浅绿淡雅纹理',
    style: platform === 'xiaohongshu' ? '小红书治愈风' : '抖音硬核测评风',
    palette: ['#A8D5BA 薄荷绿', '#FFFFFF 纯白', '#F5F5F0 暖白'],
    lighting: '自然柔光，高光润泽，无明显阴影',
    composition: '三分法构图，主体居右下，留白充沛',
    mood: '清爽治愈晨间仪式感',
    camera: '45度俯拍特写 + 微距大光圈虚化',
    static_image_prompt: `a young woman holding BUV green clay cleanser in a bright white bathroom, morning natural light from left window, minimalist composition, fresh mint green and white palette, close-up at 45-degree angle, lifestyle product photography style, soft focus background, ${platform} aesthetic, high resolution`,
    rationale: '小红书/抖音爆款=真实场景+产品特写+低饱和治愈绿色，绿泥色调与8小时控油属性强绑定，增强用户清爽心理暗示',
  };

  return res.json({ success: true, data: mockResult, source: 'mock' });
});

// Step 2 Endpoint
app.post('/api/pipeline/step2', async (req, res) => {
  const { static_image_prompt = '', videoTone = 'douyin_beat', durationSec = 4 } = req.body;
  const ai = getGenAI();

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `基于静态图 Prompt【${static_image_prompt}】，设定调性为【${videoTone}】，时长【${durationSec}秒】，生成视频运动 Prompt 结构化 JSON。`,
        config: {
          systemInstruction: '你是一个AI视频生成专家，专门写Kling/Runway/Vidu的video_prompt。',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              motion_type: { type: Type.STRING },
              motion_intensity: { type: Type.STRING },
              motion_description: { type: Type.STRING },
              duration_sec: { type: Type.STRING },
              video_prompt: { type: Type.STRING },
              audio_layer: { type: Type.STRING },
              negative_prompt: { type: Type.STRING },
            },
            required: ['motion_type', 'motion_intensity', 'motion_description', 'duration_sec', 'video_prompt', 'audio_layer', 'negative_prompt'],
          },
        },
      });

      if (response.text) {
        const data = JSON.parse(response.text);
        return res.json({ success: true, data, source: 'gemini' });
      }
    } catch (err: any) {
      console.warn('Gemini Step2 failed, falling back:', err.message);
    }
  }

  const mockStep2 = {
    motion_type: videoTone === 'douyin_beat' ? 'pan_left' : 'zoom_in',
    motion_intensity: videoTone === 'douyin_beat' ? 'strong' : 'subtle',
    motion_description: '镜头由中景平滑推进至 BUV 绿泥膏体挤出瞬间，薄荷绿管身阳光微光流动',
    duration_sec: String(durationSec),
    video_prompt: 'A smooth slow zoom-in camera motion focusing on the BUV green clay cleanser tube, a silky drop of mint green clay cleanser squeezing out, soft natural morning sunlight reflections, 60fps high frame rate, cinematic texture',
    audio_layer: '晨间水滴声与轻柔环境音',
    negative_prompt: '避免无意义旋转、变形、抖动、花式转场',
  };

  return res.json({ success: true, data: mockStep2, source: 'mock' });
});

// Step 3 Endpoint
app.post('/api/pipeline/step3', async (req, res) => {
  const { videoPrompt = '', targetPlatform = 'douyin', scriptPersona = '成分党' } = req.body;
  const ai = getGenAI();

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `根据视频运动描述【${videoPrompt}】，平台【${targetPlatform}】，人设【${scriptPersona}】，写一段包含BUV笔薇小绿泥洁面卖点（3重泥+4重植萃，SGS实测8小时控油-66.87%，14天黑头-35.92%）的爆款文案JSON。`,
        config: {
          systemInstruction: '你是一个抖音电商/小红书美妆爆款文案专家。禁止使用“震惊！”“必看！”。标题15-25字含1-2个emoji。',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              hook: { type: Type.STRING },
              body: { type: Type.STRING },
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
              cta: { type: Type.STRING },
              platform_fit: {
                type: Type.OBJECT,
                properties: {
                  douyin: { type: Type.STRING },
                  xiaohongshu: { type: Type.STRING },
                },
                required: ['douyin', 'xiaohongshu'],
              },
            },
            required: ['title', 'hook', 'body', 'hashtags', 'cta', 'platform_fit'],
          },
        },
      });

      if (response.text) {
        const data = JSON.parse(response.text);
        return res.json({ success: true, data, source: 'gemini' });
      }
    } catch (err: any) {
      console.warn('Gemini Step3 failed, falling back:', err.message);
    }
  }

  const mockStep3 = {
    title: targetPlatform === 'douyin' ? '油皮别瞎洗了！SGS实测8小时控油-66.87%！🔥' : '大油田晨间快乐水！挤出来是冰淇淋泥膏🍃',
    hook: '夏天早上起来脸像喷油池？试试这支3重泥控油！',
    body: '看看 SGS 专业报告！BUV 笔薇小绿泥，凭什么能卖爆3000万支？\n\n核心就在它的【3:4:3 清爽控油模型】：亚马逊白泥吸走老废角质，4重植萃调节油脂。实测打出的泡沫比奶油还细！洗完8小时不出油！',
    hashtags: ['#BUV小绿泥', '#控油洗面奶', '#油皮救星', '#SGS实测'],
    cta: '点击下方链接，领买一送一专属福利！',
    platform_fit: {
      douyin: '大油田救星！实测8小时控油-66.87%！BUV小绿泥洗完整天不泛油！点击下方小黄车直接领优惠～',
      xiaohongshu: '晨间洗脸仪式感！BUV小绿泥冰淇淋膏体敲治愈🍃 3重泥+4重植萃，SGS实测14天黑头都少了35.92%～',
    },
  };

  return res.json({ success: true, data: mockStep3, source: 'mock' });
});

// Step 4 Endpoint
app.post('/api/pipeline/step4', async (req, res) => {
  const { copywritingTitle = '', tonePreference = '治愈', commercialScenario = '个人' } = req.body;

  const mockStep4 = {
    bgm_recommendation: {
      track_name: tonePreference === '卡点' ? 'Trap Tech Beat 128BPM' : 'Morning Dew & Mint Breeze',
      artist: tonePreference === '卡点' ? 'Phonk Master' : 'Chillout SoundLab',
      style: tonePreference === '卡点' ? ['卡点Electronic', '重低音Trap'] : ['治愈Lofi', '晨间轻音乐'],
      bpm: tonePreference === '卡点' ? '128' : '82',
      mood_match: tonePreference === '卡点' ? '强节奏低音震感，极其适合抖音前3秒冲击力与硬核测评卡点' : '柔和的钢琴伴以低沉Lofi鼓点，完美契合晨间舒缓沉浸的洗脸场景',
      sync_point: '1.2s（膏体挤出特写）、2.8s（泡沫生成）、4.0s（领优惠卡点）',
      license_note: '抖音/小红书曲库已商业授权（支持商用小黄车/小红书小店）',
    },
    alternatives: [
      { track_name: 'Soft Waterdrops', style: '纯水声+轻音乐', when_to_use: '适合小红书Vlog原声感配音' },
      { track_name: 'Fresh Start Piano', style: '清爽钢琴曲', when_to_use: '适合偏大牌TVC质感短视频' },
    ],
  };

  return res.json({ success: true, data: mockStep4, source: 'mock' });
});

// Step 5 Endpoint
app.post('/api/pipeline/step5', async (req, res) => {
  const { aspectRatio = '9:16', subtitleStyle = '黄字黑边' } = req.body;

  const mockStep5 = {
    timeline: [
      { at: '0.0s', action: 'video_in', source: 'buv_video_step2.mp4' },
      { at: '0.0s', action: 'audio_in', source: 'mint_breeze_bgm.mp3', volume: 0.3 },
      { at: '0.2s', action: 'subtitle_in', text: '夏天早上起来脸像喷油池？', position: 'bottom_center' },
      { at: '1.5s', action: 'subtitle_in', text: 'BUV小绿泥 SGS实测8小时控油-66.87%', position: 'bottom_center' },
      { at: '2.8s', action: 'brand_stamp', text: '沙利文国货控油洁面销量第一', position: 'top_right' },
      { at: '3.8s', action: 'subtitle_in', text: '点击左下角领油皮福利！', position: 'bottom_center' },
    ],
    output: {
      filename: `buv_v_${Date.now()}.mp4`,
      resolution: aspectRatio === '9:16' ? '1080x1920' : aspectRatio === '3:4' ? '1080x1440' : '1080x1080',
      format: 'mp4_h264',
      duration_sec: 4,
    },
    qa_checklist: [
      '✓ 音画精准卡点（1.2s膏体拉丝音效到位）',
      '✓ SGS 8小时控油数据字幕明显高亮',
      '✓ 字幕位于下方20%区域，不挡产品管身',
      '✓ 结尾带右上方沙利文第一品牌认证角标',
    ],
  };

  return res.json({ success: true, data: mockStep5, source: 'mock' });
});

// Vite Middleware for development vs Static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BUV Pipeline Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
