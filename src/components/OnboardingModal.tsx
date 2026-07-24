import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  BookOpen,
  Zap,
  CheckCircle2,
  Play,
  Film,
  Layers,
  Cpu,
  Video,
  FileText,
  Music,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAutoPipeline?: () => void;
  onOpenKnowledge?: () => void;
}

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: '欢迎体验 AI 爆款视频反推工作台',
    tagline: '短视频反向工程 · 结构化 AIGC 生产链',
    description:
      '本工作台基于 BUV (Bottom-Up Video) 爆款视频反推算法，帮你将任何爆款短视频/Live图精准拆解，并全自动重构为全新的高转化率带货视频工程。',
    highlights: [
      { icon: Film, label: '全流程 5 步贯通', desc: '从视频解析到画面Prompt、爆款文案、BGM卡点及成片导出' },
      { icon: Zap, label: '一键全自动生成', desc: '支持 Step 1→5 上下文无缝继承，全路径 AI 智能反推' },
      { icon: BookOpen, label: '品牌卖点绑定', desc: '自动注入产品SGS实验数据与合规禁忌词，确保带货真实性' },
    ],
    color: 'from-emerald-500 to-teal-600',
    accentBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  },
  {
    id: 2,
    title: 'Step 1: 绑定品牌卖点库',
    tagline: '让 AI 懂你的产品，拒绝虚假宣传与硬广',
    description:
      '在顶部【卖点库】中，你可以自由录入或选择不同的产品（包含核心技术配方、SGS实测功效数据、违规词、目标人群）。',
    highlights: [
      { icon: BookOpen, label: '自定义卖点输入', desc: '自由填写配方草稿，并提供丰富行业产品预设模板' },
      { icon: Cpu, label: 'AI 卖点润色', desc: '支持 DeepSeek V3 / R1 / Gemini 一键润色提炼专业卖点' },
      { icon: CheckCircle2, label: '合规禁忌词预警', desc: '生成文案时自动避开违规广告词，确保投放安全' },
    ],
    color: 'from-teal-500 to-cyan-600',
    accentBg: 'bg-teal-50 border-teal-200 text-teal-800',
  },
  {
    id: 3,
    title: '拆解 BUV 5步核心反推流水线',
    tagline: '5 个步骤环环相扣，实现专业级短视频重构',
    description:
      '在页面主区域，你将体验到清晰递进的 5 步反推卡片：',
    pipelineItems: [
      { step: 'Step 1', title: '视觉抽帧与静态图 Prompt', desc: '提取视频黄金帧与视觉构图，生成中英文精准画面提示词', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
      { step: 'Step 2', title: '镜头运镜与动态轨迹', desc: '推拉摇移运镜设定，可一键发送至 AI 视频渲染引擎（Kling/Runway）', color: 'bg-sky-100 text-sky-800 border-sky-200' },
      { step: 'Step 3', title: '爆款带货脚本文案', desc: '黄金 3 秒 Hook 抓人眼球，结合卖点库生成口播与花字字幕', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
      { step: 'Step 4', title: '智能卡点 BGM & 音效', desc: '匹配抖音/小红书热歌 BPM，精确对齐画面转场与高潮拍子', color: 'bg-purple-100 text-purple-800 border-purple-200' },
      { step: 'Step 5', title: '综合成片预览与打包', desc: '实时合成视频预览，提供脚本/音频/剪映草稿完整工程导出', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    ],
    color: 'from-sky-500 to-indigo-600',
    accentBg: 'bg-sky-50 border-sky-200 text-sky-800',
  },
  {
    id: 4,
    title: '高级功能：预设、模型与任务中心',
    tagline: '媲美专业 AIGC 团队的工作流基础设施',
    description:
      '顶部导航栏为你提供了完善的辅助矩阵，帮助提升创作效率与控制粒度：',
    highlights: [
      { icon: Layers, label: '爆款预设库', desc: '内置美妆护肤、数码测评、美食探店等热门短视频爆款模板' },
      { icon: Cpu, label: '模型配置中心', desc: '自由切换 DeepSeek、Gemini 3.6 Flash、GPT-4o 及各类视频生成模型' },
      { icon: Film, label: '素材与任务中心', desc: '管理上传的视频素材与后台正在运行的 AI 渲染任务' },
    ],
    color: 'from-purple-500 to-fuchsia-600',
    accentBg: 'bg-purple-50 border-purple-200 text-purple-800',
  },
  {
    id: 5,
    title: '准备完毕！开启你的第一个爆款生成',
    tagline: '一键全自动运行，体验 AI 的无限创意',
    description:
      '你可以直接点击【⚡ 一键全自动贯通反推】，工作台将使用默认示例视频全自动依次执行 Step 1 到 Step 5，为你呈现完整的反推成片效果！',
    highlights: [
      { icon: Zap, label: '即刻全自动贯通', desc: '自动顺序执行 5 步流程，30秒内获得完整爆款成果' },
      { icon: Lightbulb, label: '自由编辑调整', desc: '任何步骤都可以随时手动微调，替换素材或重新生成' },
    ],
    color: 'from-amber-500 to-emerald-600',
    accentBg: 'bg-amber-50 border-amber-200 text-amber-800',
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartAutoPipeline,
  onOpenKnowledge,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const step = ONBOARDING_STEPS[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      handleComplete();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    if (dontShowAgain) {
      localStorage.setItem('aigc_onboarding_completed', 'true');
    }
    onClose();
  };

  const handleStartAuto = () => {
    handleComplete();
    if (onStartAutoPipeline) {
      onStartAutoPipeline();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white border border-slate-200/90 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Header Progress Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800">
              新手操作指南 ({currentStepIndex + 1} / {ONBOARDING_STEPS.length})
            </span>
          </div>

          {/* Step Dots */}
          <div className="flex items-center gap-1.5">
            {ONBOARDING_STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex
                    ? 'w-6 bg-emerald-600'
                    : idx < currentStepIndex
                    ? 'w-2 bg-emerald-300'
                    : 'w-2 bg-slate-200'
                }`}
                title={`跳转到第 ${idx + 1} 步`}
              />
            ))}
          </div>

          <button
            onClick={handleComplete}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="关闭引导"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Animated Body Content */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Title & Tagline Banner */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{step.tagline}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm text-slate-600 mt-2 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Highlights Cards (Steps 1, 2, 4, 5) */}
              {step.highlights && (
                <div className="grid grid-cols-1 gap-3">
                  {step.highlights.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all flex items-start gap-3 shadow-surface-sm"
                      >
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0 mt-0.5 border border-emerald-200/60">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">
                            {item.label}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pipeline Step List (Step 3) */}
              {step.pipelineItems && (
                <div className="space-y-2">
                  {step.pipelineItems.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`px-2 py-0.5 rounded font-bold font-mono text-[11px] border shrink-0 ${p.color}`}>
                          {p.step}
                        </span>
                        <div className="truncate">
                          <span className="font-bold text-slate-900 mr-2">{p.title}</span>
                          <span className="text-slate-500 hidden sm:inline text-[11px]">{p.desc}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span>不再自动弹出新手指南</span>
          </label>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>上一步</span>
              </button>
            )}

            {isLast ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleComplete}
                  className="px-4 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all"
                >
                  直接探索
                </button>
                <button
                  onClick={handleStartAuto}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>一键运行全自动反推</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <span>下一步</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
