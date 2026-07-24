export type ImageModelName =
  | 'Nano Banana 2 Lite'
  | 'Nano Banana Pro'
  | 'Imagen 4'
  | 'Imagen 4 Ultra'
  | 'Imagen 4 Fast'
  | 'GPT Image 2';

export type VideoModelName =
  | 'Omni Flash'
  | 'Veo 3.1 Preview'
  | 'Veo 3.1 Fast Preview'
  | 'Seedance 2.0'
  | 'Seedance 2.0 Fast';

export interface ModelMetadata<T extends string = string> {
  id: T;
  name: string;
  provider: string;
  baseUrl: string;
  apiKey: string;
  modelCode: string;
  recommendedScenario: string;
  speedRating: '极快' | '快速' | '标准' | '精细';
  speedMs: string;
  qualityRating: '基础级' | '高清' | '专业级' | '写实级' | '影视级' | '物理级' | '60fps流畅';
  description: string;
  badge?: string;
  enabled: boolean;
  isDefault?: boolean;
  isCustom?: boolean;
}

export const INITIAL_IMAGE_MODELS: ModelMetadata<ImageModelName>[] = [
  {
    id: 'Imagen 4 Ultra',
    name: 'Imagen 4 Ultra',
    provider: 'Google Gemini AIGC',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    apiKey: 'sk-google-gemini-pro-production-v1',
    modelCode: 'imagen-4-ultra',
    recommendedScenario: '超高清写真级重构，人像肤质毛孔+膏体微距特写',
    speedRating: '精细',
    speedMs: '4.8s',
    qualityRating: '影视级',
    description: 'Google 旗舰超高清重构模型，专为商业摄影级产品特写与精致人像设计',
    badge: 'AI推荐首选',
    enabled: true,
    isDefault: true,
  },
  {
    id: 'Imagen 4',
    name: 'Imagen 4',
    provider: 'Google Gemini AIGC',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    apiKey: 'sk-google-gemini-std-key-8890',
    modelCode: 'imagen-4-standard',
    recommendedScenario: '通用标准商业图，家居浴室场景与产品静物',
    speedRating: '快速',
    speedMs: '2.1s',
    qualityRating: '高清',
    description: '标准商业级高画质，平衡生成速度与逼真度，适配小红书多图卡片',
    enabled: true,
    isDefault: false,
  },
  {
    id: 'Imagen 4 Fast',
    name: 'Imagen 4 Fast',
    provider: 'Google Gemini AIGC',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    apiKey: 'sk-google-gemini-fast-key-1029',
    modelCode: 'imagen-4-fast',
    recommendedScenario: '高精细度极速生成，适合批量构图快速测试',
    speedRating: '极快',
    speedMs: '1.5s',
    qualityRating: '高清',
    description: '极速高通量模型，在短时间内生成高匹配度的商品场景打样图',
    enabled: true,
    isDefault: false,
  },
  {
    id: 'Nano Banana Pro',
    name: 'Nano Banana Pro',
    provider: 'Banana AI Cloud',
    baseUrl: 'https://api.nanobanana.ai/v2',
    apiKey: 'nb-prod-8871923091283',
    modelCode: 'nano-banana-pro-v2',
    recommendedScenario: '商业摄影渲染，强调膏体拉丝与自然质感光影',
    speedRating: '标准',
    speedMs: '3.5s',
    qualityRating: '专业级',
    description: '轻量化商业摄影模型，渲染膏体光泽、泥膜粘度与自然光的过渡细节',
    enabled: true,
    isDefault: false,
  },
  {
    id: 'Nano Banana 2 Lite',
    name: 'Nano Banana 2 Lite',
    provider: 'Banana AI Cloud',
    baseUrl: 'https://api.nanobanana.ai/v2',
    apiKey: 'nb-prod-8871923091283',
    modelCode: 'nano-banana-2-lite',
    recommendedScenario: '极速概念草图，灵感捕捉与布局验证',
    speedRating: '极快',
    speedMs: '1.2s',
    qualityRating: '基础级',
    description: '超轻量快抓模型，用于前期构图方向的极速白模预演',
    enabled: true,
    isDefault: false,
  },
  {
    id: 'GPT Image 2',
    name: 'GPT Image 2',
    provider: 'OpenAI Enterprise',
    baseUrl: 'https://api.openai.com/v1',
    apiKey: 'sk-proj-openai-dalle2-commercial-key',
    modelCode: 'dall-e-3-hd',
    recommendedScenario: '高保真写实融合，复杂多光源物理反射',
    speedRating: '标准',
    speedMs: '2.8s',
    qualityRating: '写实级',
    description: '写实物理渲染模型，支持高难度折射、水滴凝结与复杂浴室光影',
    enabled: true,
    isDefault: false,
  },
];

export const INITIAL_VIDEO_MODELS: ModelMetadata<VideoModelName>[] = [
  {
    id: 'Veo 3.1 Preview',
    name: 'Veo 3.1 Preview',
    provider: 'Google Gemini AIGC',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    apiKey: 'sk-google-veo31-preview-8812',
    modelCode: 'veo-3.1-preview',
    recommendedScenario: 'Google 旗舰图生视频，电影级光影流动与膏体细微拉丝',
    speedRating: '标准',
    speedMs: '6.5s',
    qualityRating: '影视级',
    description: 'SOTA 级视频生成引擎，支持物理真实镜面反射、水流动态与微距慢动作',
    badge: 'AI推荐首选',
    enabled: true,
    isDefault: true,
  },
  {
    id: 'Veo 3.1 Fast Preview',
    name: 'Veo 3.1 Fast Preview',
    provider: 'Google Gemini AIGC',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    apiKey: 'sk-google-veo31-fast-3341',
    modelCode: 'veo-3.1-fast',
    recommendedScenario: '极速高帧率预览，60fps 流畅推镜与挤出动作',
    speedRating: '极快',
    speedMs: '3.8s',
    qualityRating: '60fps流畅',
    description: '高帧率极速生成，画面运动流畅无卡顿，适合高频爆款测试',
    enabled: true,
    isDefault: false,
  },
  {
    id: 'Seedance 2.0',
    name: 'Seedance 2.0',
    provider: 'ByteDance Volcengine',
    baseUrl: 'https://open.volcengine.com/api/v1',
    apiKey: 'ak-volc-seedance20-prod-9921',
    modelCode: 'seedance-2.0-pro',
    recommendedScenario: '商业级物理运镜，复杂的膏体挤出拉丝与水花飞溅3D镜头',
    speedRating: '精细',
    speedMs: '7.2s',
    qualityRating: '物理级',
    description: '专业级物理模拟镜头，精准还原流体动力学与软质膏体物理延展',
    enabled: true,
    isDefault: false,
  },
  {
    id: 'Seedance 2.0 Fast',
    name: 'Seedance 2.0 Fast',
    provider: 'ByteDance Volcengine',
    baseUrl: 'https://open.volcengine.com/api/v1',
    apiKey: 'ak-volc-seedance20-fast-7721',
    modelCode: 'seedance-2.0-fast',
    recommendedScenario: '快节奏卡点生成，抖音强节奏音画同步卡点',
    speedRating: '极快',
    speedMs: '3.2s',
    qualityRating: '高清',
    description: '快节奏运动引擎，镜头切换敏捷，极契合短视频前 3 秒黄金卡点',
    enabled: true,
    isDefault: false,
  },
  {
    id: 'Omni Flash',
    name: 'Omni Flash',
    provider: 'Antigravity Omni',
    baseUrl: 'https://api.antigravity.ai/v1',
    apiKey: 'ag-omni-flash-key-0012',
    modelCode: 'omni-flash-video-v1',
    recommendedScenario: '全能极速成片，综合性能优异的高性价比图生视频',
    speedRating: '极快',
    speedMs: '3.0s',
    qualityRating: '高清',
    description: '全能极速架构，生成速度极快且动态连贯，适合高通量日更素材',
    enabled: true,
    isDefault: false,
  },
];

export interface ModelConfigState {
  imageModels: ModelMetadata<ImageModelName>[];
  videoModels: ModelMetadata<VideoModelName>[];
  autoRecommendationEnabled: boolean;
  defaultImageModel: ImageModelName;
  defaultVideoModel: VideoModelName;
}

export const DEFAULT_MODEL_CONFIG: ModelConfigState = {
  imageModels: INITIAL_IMAGE_MODELS,
  videoModels: INITIAL_VIDEO_MODELS,
  autoRecommendationEnabled: true,
  defaultImageModel: 'Imagen 4 Ultra',
  defaultVideoModel: 'Veo 3.1 Preview',
};
