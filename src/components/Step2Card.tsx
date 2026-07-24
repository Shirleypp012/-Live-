import React, { useState, useEffect } from 'react';
import { Step2Inputs, Step2Output, Step1Output, StepStatus } from '../types';
import { copyToClipboard, downloadJsonFile } from '../utils/format';
import {
  Video,
  Play,
  RotateCcw,
  Download,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MoveUpRight,
  Gauge,
  Film,
  FileCode,
  Eye,
  Info,
  Edit3,
  RefreshCw,
  Cpu,
  Layers,
} from 'lucide-react';
import { VideoModelName, ModelConfigState } from '../data/models';
import { PromptEditorModal } from './PromptEditorModal';

interface Step2CardProps {
  inputs: Step2Inputs;
  output?: Step2Output;
  step1Output?: Step1Output;
  status: StepStatus;
  useMockMode: boolean;
  modelConfig: ModelConfigState;
  onUpdateInputs: (inputs: Partial<Step2Inputs>) => void;
  onUpdateOutput?: (updatedOutput: Partial<Step2Output>) => void;
  onSyncFromStep1?: () => void;
  onRun: () => void;
  onReset: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Step2Card: React.FC<Step2CardProps> = ({
  inputs,
  output,
  step1Output,
  status,
  useMockMode,
  modelConfig,
  onUpdateInputs,
  onUpdateOutput,
  onSyncFromStep1,
  onRun,
  onReset,
  onPrev,
  onNext,
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');
  const [isPromptEditorOpen, setIsPromptEditorOpen] = useState(false);

  const isRunning = status === 'running';
  const isCompleted = status === 'completed' && Boolean(output);

  // Enabled Video Models
  const enabledVideoModels = modelConfig.videoModels.filter((m) => m.enabled);

  // Auto-recommendation logic
  useEffect(() => {
    if (modelConfig.autoRecommendationEnabled && !inputs.videoModel) {
      if (inputs.videoTone === 'xiaohongshu_healing') {
        onUpdateInputs({ videoModel: 'Veo 3.1 Preview' });
      } else if (inputs.videoTone === 'douyin_beat') {
        onUpdateInputs({ videoModel: 'Seedance 2.0 Fast' });
      } else {
        onUpdateInputs({ videoModel: 'Omni Flash' });
      }
    }
  }, [inputs.videoTone, modelConfig.autoRecommendationEnabled]);

  const handleCopyPrompt = async () => {
    if (output?.video_prompt) {
      await copyToClipboard(output.video_prompt);
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
      onUpdateOutput({ video_prompt: updatedPromptText });
    }
  };

  const handleRegenerateFromEditor = (updatedPromptText: string) => {
    if (output && onUpdateOutput) {
      onUpdateOutput({ video_prompt: updatedPromptText });
    }
    onRun();
  };

  const getMotionTypeName = (type: string) => {
    const map: Record<string, string> = {
      zoom_in: '镜头推近 (Zoom In)',
      zoom_out: '镜头拉远 (Zoom Out)',
      pan_left: '左摇镜头 (Pan Left)',
      pan_right: '右摇镜头 (Pan Right)',
      tilt_up: '仰摇镜头 (Tilt Up)',
      tilt_down: '俯摇镜头 (Tilt Down)',
      rotate: '环绕镜头 (Rotate)',
      static_micro_motion: '微动沉浸 (Static Micro-Motion)',
    };
    return map[type] || type;
  };

  const currentSelectedModelMeta = enabledVideoModels.find(
    (m) => m.id === (inputs.videoModel || 'Veo 3.1 Preview')
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-surface-md overflow-hidden transition-all">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center shadow-surface-sm">
            2
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              第 2 步：静态图 → 视频生成提示词
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              运镜控制 + 动态强度与视频 Prompt 生成（兼容 Veo 3.1 / Seedance / Omni Flash 等模型）
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-surface-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>上一步</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置</span>
          </button>

          {isCompleted && (
            <button
              onClick={() => downloadJsonFile(output, 'step2_video_prompt.json')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-teal-600" />
              <span>下载 Prompt</span>
            </button>
          )}

          <button
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 disabled:opacity-50 transition-all shadow-md shadow-teal-600/20"
          >
            {isRunning ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>AI 动态合成中...</span>
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-sm"
          >
            <span>下一步</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Column */}
        <div className="lg:col-span-5 space-y-4 border-r border-slate-200/80 pr-0 lg:pr-6">
          <div className="text-xs font-bold text-teal-700 uppercase tracking-wider flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Video className="w-4 h-4" />
              <span>1. 继承第 1 步 Prompt & 视频控制参数</span>
            </div>
          </div>

          {/* Context Inheritance Banner */}
          <div className="p-2.5 bg-teal-50/80 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/60 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="font-semibold text-teal-800 dark:text-teal-300">
                🔗 已自动引用 Step 1 产物
              </span>
            </div>
            {onSyncFromStep1 && (
              <button
                onClick={onSyncFromStep1}
                className="px-2 py-1 bg-white dark:bg-slate-800 border border-teal-300 text-teal-700 dark:text-teal-300 rounded-lg text-[11px] font-bold hover:bg-teal-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 shadow-sm"
                title="一键拉取 Step 1 最新 static_image_prompt"
              >
                <RefreshCw className="w-3 h-3" />
                <span>同步 Step 1 结果</span>
              </button>
            )}
          </div>

          {/* Inherited Static Image Prompt */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              第 1 步生成的 static_image_prompt (自动接入)
            </label>
            <textarea
              value={inputs.static_image_prompt}
              onChange={(e) => onUpdateInputs({ static_image_prompt: e.target.value })}
              placeholder="来自于第 1 步的静态图提示词..."
              className="w-full h-24 bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:border-teal-500 resize-none shadow-sm"
            />
          </div>

          {/* Controls: Video Tone & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                视频调性
              </label>
              <select
                value={inputs.videoTone}
                onChange={(e) => onUpdateInputs({ videoTone: e.target.value as any })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500 font-medium shadow-sm"
              >
                <option value="xiaohongshu_healing">小红书治愈（缓慢沉浸推镜）</option>
                <option value="douyin_beat">抖音卡点（强冲击横移）</option>
                <option value="brand_tvc">品牌 TVC（大牌柔影）</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                目标时长 (秒)
              </label>
              <select
                value={inputs.durationSec}
                onChange={(e) => onUpdateInputs({ durationSec: Number(e.target.value) })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500 font-mono font-medium shadow-sm"
              >
                <option value={3}>3 秒（快节奏卡点）</option>
                <option value={4}>4 秒（标准种草）</option>
                <option value={5}>5 秒（硬核测评）</option>
                <option value={6}>6 秒（深度长质感）</option>
              </select>
            </div>
          </div>

          {/* Video Model Selector with Non-technical Metadata */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-slate-800">
              <span className="flex items-center gap-1.5 font-bold">
                <Cpu className="w-3.5 h-3.5 text-teal-600" />
                目标视频生成 AI 模型 (Video Model)
              </span>
              <span className="text-[10px] text-teal-700 bg-teal-100 px-2 py-0.5 rounded font-medium">
                SOTA 运镜引擎
              </span>
            </div>

            <select
              value={inputs.videoModel || 'Veo 3.1 Preview'}
              onChange={(e) => onUpdateInputs({ videoModel: e.target.value as any })}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-semibold shadow-sm"
            >
              {enabledVideoModels.map((m) => (
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
                  <span className="font-semibold text-teal-600">
                    {currentSelectedModelMeta.speedRating} ({currentSelectedModelMeta.speedMs})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">动态质量:</span>
                  <span className="font-semibold text-sky-600">{currentSelectedModelMeta.qualityRating}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Output Column (Immersive Dark Focus Canvas) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-inner">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>2. 视频运动 Prompt 结构化产物</span>
              </div>

              {isCompleted && (
                <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setActiveTab('visual')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      activeTab === 'visual'
                        ? 'bg-teal-400 text-slate-950 font-bold'
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
                        ? 'bg-teal-400 text-slate-950 font-bold'
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
                  <Film className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  点击【运行 ▶】启动第 2 步视频 Prompt 生成引擎
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  （系统将计算运镜轨迹、运动强度、音轨建议与 Veo 3.1 / Seedance 提示词）
                </p>
              </div>
            ) : activeTab === 'visual' ? (
              <div className="space-y-4 animate-fade-in">
                {/* Motion Type & Intensity Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono uppercase">运镜类型 (motion_type)</span>
                      <span className="text-xs font-bold text-teal-300">
                        {getMotionTypeName(output.motion_type)}
                      </span>
                    </div>
                    <MoveUpRight className="w-5 h-5 text-teal-400" />
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono uppercase">运动幅度 (motion_intensity)</span>
                      <span className="text-xs font-bold text-emerald-400 uppercase font-mono">
                        {output.motion_intensity}
                      </span>
                    </div>
                    <Gauge className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>

                {/* Motion Description */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono uppercase">运镜轨迹描述</span>
                  <span className="text-xs text-slate-200">{output.motion_description}</span>
                </div>

                {/* Video Prompt Block with View, Edit, Copy & Regenerate Actions */}
                <div className="p-4 rounded-xl bg-slate-900 border border-teal-500/30 relative group space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-400 font-mono flex items-center gap-2">
                      <span>video_prompt</span>
                      <span className="px-2 py-0.5 rounded bg-teal-500/20 border border-teal-500/30 text-[10px] text-teal-300">
                        {inputs.videoModel || 'Veo 3.1 Preview'} 适配
                      </span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setIsPromptEditorOpen(true)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors border border-slate-700"
                        title="查看与完整编辑 Video Prompt"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-teal-400" />
                        <span>查看 / 编辑</span>
                      </button>

                      <button
                        onClick={handleCopyPrompt}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs transition-colors border border-teal-500/30"
                      >
                        {copiedPrompt ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPrompt ? '已复制' : '复制 Video Prompt'}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 font-mono leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800 select-all">
                    {output.video_prompt}
                  </p>

                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      💡 核心资产：可编辑运镜逻辑并直接重新生成视频动画
                    </span>
                    <button
                      onClick={() => setIsPromptEditorOpen(true)}
                      className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>重新生成视频</span>
                    </button>
                  </div>
                </div>

                {/* Audio & Negative Prompt info */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">环境音轨 suggested_audio</span>
                    <span className="text-xs text-slate-300">{output.audio_layer}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20">
                    <span className="text-[10px] text-rose-400 block font-mono">负面规避 negative_prompt</span>
                    <span className="text-xs text-rose-300">{output.negative_prompt}</span>
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
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? '已复制 JSON' : '复制 JSON'}</span>
                </button>

                <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-teal-400 font-mono overflow-x-auto max-h-96 leading-relaxed">
                  {JSON.stringify(output, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Bottom Step Transfer Notice */}
          {isCompleted && (
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="text-teal-400/90 font-mono">
                ✓ 视频运镜 Prompt 已就绪，将自动传输至第 3 步爆款文案撰写引擎
              </span>
              <button
                onClick={onNext}
                className="flex items-center gap-1 font-bold text-teal-400 hover:text-teal-300 transition-colors"
              >
                <span>下一步：撰写爆款文案</span>
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
          title="第 2 步：图生视频 Video Prompt 精细化编辑器"
          promptType="video_prompt"
          modelName={inputs.videoModel || 'Veo 3.1 Preview'}
          initialPrompt={output.video_prompt}
          onSavePrompt={handleSavePromptFromEditor}
          onRegenerate={handleRegenerateFromEditor}
          isRegenerating={isRunning}
        />
      )}
    </div>
  );
};
