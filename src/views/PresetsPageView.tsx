import React from 'react';
import { MOCK_PRESET_TEMPLATES } from '../data/presets';
import { PresetTemplate } from '../types';
import { Sparkles, ArrowRight, ArrowLeft, Layers } from 'lucide-react';

interface PresetsPageViewProps {
  onSelectPreset: (preset: PresetTemplate) => void;
  onBackToPipeline: () => void;
}

export const PresetsPageView: React.FC<PresetsPageViewProps> = ({
  onSelectPreset,
  onBackToPipeline,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-surface-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToPipeline}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold shrink-0"
            title="返回主流水线"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回流水线</span>
          </button>

          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 shrink-0">
            <Layers className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">爆款短视频模版与反推预设库</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold">
                PRESETS
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              精选高转化抖音/小红书小绿泥爆款内容链路，一键填充 5 步全套参数并启动渲染。
            </p>
          </div>
        </div>
      </div>

      {/* Presets Grid */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-surface-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_PRESET_TEMPLATES.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                onSelectPreset(preset);
                onBackToPipeline();
              }}
              className="group relative flex flex-col sm:flex-row items-stretch gap-4 p-5 rounded-2xl bg-slate-50/70 hover:bg-emerald-50/40 border border-slate-200 hover:border-emerald-400 cursor-pointer transition-all shadow-surface-sm hover:shadow-surface-md"
            >
              {/* Image Thumbnail */}
              <div className="relative w-full sm:w-44 h-36 rounded-xl overflow-hidden shrink-0 bg-slate-900">
                <img
                  src={preset.coverImage}
                  alt={preset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-emerald-500 text-slate-950 shadow-sm">
                  {preset.tag}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {preset.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-700 font-mono font-bold">
                    含完整 5 步反推链 Prompt
                  </span>

                  <button className="flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                    <span>载入流水线</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
