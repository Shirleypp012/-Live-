import React, { useState, useEffect } from 'react';
import { Step1Inputs, Step1Output, StepStatus } from '../types';
import { copyToClipboard, downloadJsonFile } from '../utils/format';
import {
  Upload,
  Play,
  RotateCcw,
  Download,
  Copy,
  Check,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  Palette,
  Eye,
  FileCode,
  Info,
  Edit3,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import { ImageModelName, ModelConfigState } from '../data/models';
import { PromptEditorModal } from './PromptEditorModal';
import { apiService } from '../services/api';

interface Step1CardProps {
  inputs: Step1Inputs;
  output?: Step1Output;
  status: StepStatus;
  useMockMode: boolean;
  modelConfig: ModelConfigState;
  onUpdateInputs: (inputs: Partial<Step1Inputs>) => void;
  onUpdateOutput?: (updatedOutput: Partial<Step1Output>) => void;
  onRun: () => void;
  onReset: () => void;
  onNext: () => void;
  onOpenMaterials?: () => void;
}

export const Step1Card: React.FC<Step1CardProps> = ({
  inputs,
  output,
  status,
  useMockMode,
  modelConfig,
  onUpdateInputs,
  onUpdateOutput,
  onRun,
  onReset,
  onNext,
  onOpenMaterials,
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');
  const [isPromptEditorOpen, setIsPromptEditorOpen] = useState(false);

  const isRunning = status === 'running';
  const isCompleted = status === 'completed' && Boolean(output);

  // Available image models from config
  const enabledImageModels = modelConfig.imageModels.filter((m) => m.enabled);

  // Auto-recommendation logic based on platform and blogger type
  useEffect(() => {
    if (modelConfig.autoRecommendationEnabled && !inputs.imageModel) {
      if (inputs.platform === 'xiaohongshu') {
        onUpdateInputs({ imageModel: 'Imagen 4 Ultra' });
      } else if (inputs.bloggerType === 'skincare_expert') {
        onUpdateInputs({ imageModel: 'Nano Banana Pro' });
      } else {
        onUpdateInputs({ imageModel: 'Imagen 4 Fast' });
      }
    }
  }, [inputs.platform, inputs.bloggerType, modelConfig.autoRecommendationEnabled]);

  const sampleImages = [
    {
      name: '晨间阳光浴室（小红书爆款）',
      url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: '左右脸对比测评（抖音卡点）',
      url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleCopyPrompt = async () => {
    if (output?.static_image_prompt) {
      await copyToClipboard(output.static_image_prompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  const handleCopyJson = async () => {
    if (output) {
      await copyToClipboard(JSON.stringify(output, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  const handleSavePromptFromEditor = (updatedPromptText: string) => {
    if (output && onUpdateOutput) {
      onUpdateOutput({ static_image_prompt: updatedPromptText });
    }
  };

  const handleRegenerateFromEditor = (updatedPromptText: string) => {
    if (output && onUpdateOutput) {
      onUpdateOutput({ static_image_prompt: updatedPromptText });
    }
    onRun();
  };

  const currentSelectedModelMeta = enabledImageModels.find(
    (m) => m.id === (inputs.imageModel || 'Imagen 4 Ultra')
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-surface-md overflow-hidden transition-all">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shadow-surface-sm">
            1
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              第 1 步：视频 / Live图 → 同款静态图提示词
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              视觉深度理解 + 爆款结构化 Prompt 拆解（输出可用于文生图模型的提示词）
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-surface-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置</span>
          </button>

          {isCompleted && (
            <button
              onClick={() => downloadJsonFile(output, 'step1_static_prompt.json')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-surface-sm"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>下载 Prompt</span>
            </button>
          )}

          <button
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-all shadow-md shadow-emerald-600/20"
          >
            {isRunning ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>AI 拆解中...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>运行 ▶</span>
              </>
            )}
          </button>

          <button
            onClick={onNext}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-surface-sm"
          >
            <span>下一步</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Column (Clean High Readability Enterprise Area) */}
        <div className="lg:col-span-5 space-y-4 border-r border-slate-200/80 pr-0 lg:pr-6">
          <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
            <Upload className="w-4 h-4" />
            <span>1. 输入画面与场景上下文</span>
          </div>

          {/* Media Preview / Drag Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                爆款视频帧 / Live 图 / 封面图 (必填)
              </label>
              {onOpenMaterials && (
                <button
                  type="button"
                  onClick={onOpenMaterials}
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <ImageIcon className="w-3 h-3" />
                  从素材库中挑选
                </button>
              )}
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={async (e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  const uploaded = await apiService.materials.uploadMaterial(e.dataTransfer.files[0]);
                  onUpdateInputs({ mediaUrl: uploaded.url });
                }
              }}
              className="relative group border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-xl p-3 bg-slate-50 dark:bg-slate-900 text-center transition-all cursor-pointer overflow-hidden"
            >
              <input
                type="file"
                accept="video/*,image/*"
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const uploaded = await apiService.materials.uploadMaterial(e.target.files[0]);
                    onUpdateInputs({ mediaUrl: uploaded.url });
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              {inputs.mediaUrl ? (
                <div className="relative w-full h-44 rounded-lg overflow-hidden group">
                  <img
                    src={inputs.mediaUrl}
                    alt="Uploaded source"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                    <span className="text-xs text-white font-medium">点击或拖拽更换画面素材</span>
                  </div>
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center justify-center gap-2 pointer-events-none">
                  <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    拖拽视频/图片至此，或点击本地上传
                  </p>
                  <p className="text-[11px] text-slate-400">支持 MP4 抽帧 / JPG / PNG / Live Photo</p>
                </div>
              )}
            </div>

            {/* Quick Sample Selector */}
            <div className="pt-1">
              <span className="text-[11px] text-slate-500 block mb-1.5">或选择内置爆款素材：</span>
              <div className="grid grid-cols-2 gap-2">
                {sampleImages.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onUpdateInputs({ mediaUrl: sample.url })}
                    className={`flex items-center gap-2 p-2 rounded-lg text-left border text-xs transition-all ${
                      inputs.mediaUrl === sample.url
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <img src={sample.url} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
                    <span className="line-clamp-1 truncate text-[11px]">{sample.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Context Options */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                来源平台
              </label>
              <select
                value={inputs.platform}
                onChange={(e) => onUpdateInputs({ platform: e.target.value as any })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-medium shadow-sm"
              >
                <option value="xiaohongshu">小红书（治愈种草）</option>
                <option value="douyin">抖音（卡点冲击）</option>
                <option value="shipinhao">视频号（信任品质）</option>
                <option value="general">通用平台</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                博主类型
              </label>
              <select
                value={inputs.bloggerType}
                onChange={(e) => onUpdateInputs({ bloggerType: e.target.value as any })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-medium shadow-sm"
              >
                <option value="daily_seeding">日常种草（真实生活）</option>
                <option value="skincare_expert">护肤达人（成分解析）</option>
                <option value="ingredient_geek">成分党（硬核测评）</option>
                <option value="review_beauty">美妆测评（红黑榜）</option>
              </select>
            </div>
          </div>

          {/* Image Model Selector with Non-technical Metadata */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-slate-800">
              <span className="flex items-center gap-1.5 font-bold">
                <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                目标图片生成 AI 模型 (Image Model)
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-medium">
                AI 自动推荐适配
              </span>
            </div>

            <select
              value={inputs.imageModel || 'Imagen 4 Ultra'}
              onChange={(e) => onUpdateInputs({ imageModel: e.target.value as any })}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-semibold shadow-sm"
            >
              {enabledImageModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {m.recommendedScenario} ({m.speedRating})
                </option>
              ))}
            </select>

            {currentSelectedModelMeta && (
              <div className="text-[11px] bg-white p-2.5 rounded-lg border border-slate-200 text-slate-600 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">推荐场景:</span>
                  <span className="font-medium text-slate-800">{currentSelectedModelMeta.recommendedScenario}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">预估速度:</span>
                  <span className="font-semibold text-emerald-600">
                    {currentSelectedModelMeta.speedRating} ({currentSelectedModelMeta.speedMs})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">画质评级:</span>
                  <span className="font-semibold text-indigo-600">{currentSelectedModelMeta.qualityRating}</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              爆款转化因（可选）
            </label>
            <textarea
              value={inputs.viralReason}
              onChange={(e) => onUpdateInputs({ viralReason: e.target.value })}
              placeholder="例如：自然透光+膏体冰淇淋质感+低饱和度视觉，带来强治愈信任感"
              className="w-full h-20 bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 placeholder:text-slate-400 resize-none shadow-sm"
            />
          </div>
        </div>

        {/* Right Output Column (Immersive Dark Focus Canvas for AI Prompts & Previews) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-inner">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>2. 静态图 Prompt 结构化产物</span>
              </div>

              {isCompleted && (
                <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setActiveTab('visual')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      activeTab === 'visual'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Eye className="w-3 h-3 inline mr-1" />
                    可视化卡片
                  </button>
                  <button
                    onClick={() => setActiveTab('json')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      activeTab === 'json'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileCode className="w-3 h-3 inline mr-1" />
                    JSON 代码
                  </button>
                </div>
              )}
            </div>

            {/* Output Display Area */}
            {!output ? (
              <div className="h-64 rounded-xl border border-dashed border-slate-800 bg-slate-900/50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 text-slate-500">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  点击【运行 ▶】启动第 1 步视觉拆解流水线
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  （系统将自动提取画面色板、镜头构图、情绪与 Midjourney/Imagen 提示词）
                </p>
              </div>
            ) : activeTab === 'visual' ? (
              <div className="space-y-4 animate-fade-in">
                {/* Color Palette Badge Row */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-300">
                    <Palette className="w-3.5 h-3.5 text-emerald-400" />
                    <span>画面拆解色板 (Palette)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {output.palette.map((color, idx) => {
                      const hexMatch = color.match(/#[0-9A-Fa-f]{6}/);
                      const hex = hexMatch ? hexMatch[0] : '#00B060';
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200"
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: hex }}
                          />
                          <span>{color}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Structured Attributes Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block font-mono uppercase">场景 (Scene)</span>
                    <span className="text-xs font-semibold text-slate-200">{output.scene}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block font-mono uppercase">主体 (Subject)</span>
                    <span className="text-xs font-semibold text-slate-200">{output.subject}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block font-mono uppercase">光线 (Lighting)</span>
                    <span className="text-xs font-semibold text-slate-200">{output.lighting}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block font-mono uppercase">镜头语言 (Camera)</span>
                    <span className="text-xs font-semibold text-slate-200">{output.camera}</span>
                  </div>
                </div>

                {/* Static Image Prompt Block with Direct View, Edit, Copy & Regenerate Actions */}
                <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 relative group space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-2">
                      <span>static_image_prompt</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-[10px] text-emerald-300">
                        {inputs.imageModel || 'Imagen 4 Ultra'} 适配
                      </span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setIsPromptEditorOpen(true)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors border border-slate-700"
                        title="查看与完整编辑 Prompt"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>查看 / 编辑</span>
                      </button>

                      <button
                        onClick={handleCopyPrompt}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs transition-colors border border-emerald-500/30"
                      >
                        {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPrompt ? '已复制' : '复制 Prompt'}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 font-mono leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800 select-all">
                    {output.static_image_prompt}
                  </p>

                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      💡 核心资产：点击右侧按钮可用修改后的 Prompt 重新生图
                    </span>
                    <button
                      onClick={() => setIsPromptEditorOpen(true)}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>重新生成图片</span>
                    </button>
                  </div>
                </div>

                {/* Rationale explanation */}
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200/90 flex items-start gap-2">
                  <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-emerald-300 mb-0.5">拆解转化逻辑：</span>
                    {output.rationale}
                  </div>
                </div>
              </div>
            ) : (
              /* JSON Code View */
              <div className="relative group animate-fade-in">
                <button
                  onClick={handleCopyJson}
                  className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 transition-colors"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? '已复制 JSON' : '复制 JSON'}</span>
                </button>

                <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-mono overflow-x-auto max-h-96 leading-relaxed">
                  {JSON.stringify(output, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Bottom Step Transfer Notice */}
          {isCompleted && (
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="text-emerald-400/90 font-mono">
                ✓ 静态图 Prompt 已生成，将自动注入第 2 步视频提示词引擎
              </span>
              <button
                onClick={onNext}
                className="flex items-center gap-1 font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>下一步：生成视频提示词</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Prompt Editor Modal */}
      {output && (
        <PromptEditorModal
          isOpen={isPromptEditorOpen}
          onClose={() => setIsPromptEditorOpen(false)}
          title="第 1 步：静态图 Prompt 精细化编辑器"
          promptType="static_image_prompt"
          modelName={inputs.imageModel || 'Imagen 4 Ultra'}
          initialPrompt={output.static_image_prompt}
          onSavePrompt={handleSavePromptFromEditor}
          onRegenerate={handleRegenerateFromEditor}
          isRegenerating={isRunning}
        />
      )}
    </div>
  );
};
