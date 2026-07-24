import React from 'react';
import { motion } from 'framer-motion';
import { StepId, PipelineData } from '../types';
import { Check, Image, Video, FileText, Music, Film, ArrowRight, Zap, Sparkles, Layers } from 'lucide-react';

interface StepProgressProps {
  currentStep: StepId;
  pipelineData: PipelineData;
  onSelectStep: (stepId: StepId) => void;
  onRunFullPipelineAuto?: () => void;
  isAutoPipelineRunning?: boolean;
}

export const STEP_CONFIG: Array<{
  id: StepId;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}> = [
  { id: 1, title: '第 1 步', subtitle: '视频/Live图 → 静态图Prompt', icon: Image, gradient: 'from-emerald-500/10 to-teal-500/10' },
  { id: 2, title: '第 2 步', subtitle: '静态图 → 视频生成Prompt', icon: Video, gradient: 'from-sky-500/10 to-blue-500/10' },
  { id: 3, title: '第 3 步', subtitle: '视频 → 爆款文案', icon: FileText, gradient: 'from-indigo-500/10 to-violet-500/10' },
  { id: 4, title: '第 4 步', subtitle: '文案+视频 → 匹配 BGM', icon: Music, gradient: 'from-purple-500/10 to-fuchsia-500/10' },
  { id: 5, title: '第 5 步', subtitle: '合成输出成品', icon: Film, gradient: 'from-amber-500/10 to-orange-500/10' },
];

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  pipelineData,
  onSelectStep,
  onRunFullPipelineAuto,
  isAutoPipelineRunning = false,
}) => {
  const getStepStatus = (id: StepId) => {
    const key = `step${id}` as keyof PipelineData;
    return pipelineData[key].status;
  };

  const completedCount = STEP_CONFIG.filter((s) => getStepStatus(s.id) === 'completed').length;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 md:p-6 shadow-surface-md mb-8 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
            <span>BUV 5步内容反推流水线</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <Layers className="w-3 h-3 text-emerald-600" />
              全自动上下文继承
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <span>完成度</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200/60">
              {completedCount} / 5
            </span>
          </div>

          {onRunFullPipelineAuto && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onRunFullPipelineAuto}
              disabled={isAutoPipelineRunning}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold text-white transition-all shadow-md flex items-center gap-1.5 ${
                isAutoPipelineRunning
                  ? 'bg-amber-500 animate-pulse cursor-wait'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/20 active:scale-95'
              }`}
            >
              {isAutoPipelineRunning ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>⚡ 全自动反推中 (Step {currentStep}/5)...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>⚡ 一键全自动贯通反推 (Step 1→5)</span>
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>

      {/* Bouncy Progress Bar Step Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {STEP_CONFIG.map((step, idx) => {
          const status = getStepStatus(step.id);
          const isCurrent = currentStep === step.id;
          const isCompleted = status === 'completed';
          const isRunning = status === 'running';
          const Icon = step.icon;

          return (
            <motion.button
              key={step.id}
              whileHover={{ scale: 0.98, rotate: "-0.5deg" }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectStep(step.id)}
              className={`group relative text-left p-3.5 rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer ${
                isCurrent
                  ? 'bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : isCompleted
                  ? 'bg-gradient-to-br from-emerald-50/30 to-slate-50/80 border-emerald-300/80 hover:border-emerald-400'
                  : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2 relative z-10">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : isCurrent
                        ? 'bg-emerald-500 text-white font-extrabold shadow-sm'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      isCurrent
                        ? 'text-emerald-900 font-extrabold'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-500'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>

                <Icon
                  className={`w-4 h-4 ${
                    isCurrent
                      ? 'text-emerald-600'
                      : isCompleted
                      ? 'text-emerald-500'
                      : 'text-slate-400'
                  }`}
                />
              </div>

              <p className="text-xs text-slate-600 font-medium line-clamp-1 truncate relative z-10">
                {step.subtitle}
              </p>

              {/* Status Badge & Arrow */}
              <div className="mt-2.5 flex items-center justify-between relative z-10">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-medium ${
                    isRunning
                      ? 'bg-amber-100 text-amber-800 border border-amber-300/60 animate-pulse'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-800 font-semibold'
                      : 'bg-slate-200/60 text-slate-600'
                  }`}
                >
                  {isRunning ? '生成中...' : isCompleted ? '已就绪' : '待运行'}
                </span>

                {idx < 4 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 hidden lg:block group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
