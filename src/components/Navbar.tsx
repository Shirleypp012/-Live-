import React from 'react';
import { ProductItem } from '../types';
import {
  Sparkles,
  BookOpen,
  Layers,
  RefreshCw,
  Zap,
  Cpu,
  Film,
  ListTodo,
  PackageCheck,
} from 'lucide-react';

interface NavbarProps {
  onOpenKnowledge: () => void;
  onOpenPresets: () => void;
  onOpenModelConfig: () => void;
  onOpenMaterials: () => void;
  onOpenTasks: () => void;
  onResetAll: () => void;
  useMockMode: boolean;
  setUseMockMode: (val: boolean) => void;
  activeProduct?: ProductItem;
  products?: ProductItem[];
  onSelectActiveProduct?: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenKnowledge,
  onOpenPresets,
  onOpenModelConfig,
  onOpenMaterials,
  onOpenTasks,
  onResetAll,
  useMockMode,
  setUseMockMode,
  activeProduct,
  products = [],
  onSelectActiveProduct,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3 text-slate-900 transition-all shadow-surface-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Brand Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-bold shadow-md shadow-emerald-600/20">
            <span className="text-base tracking-tighter font-mono">AIGC</span>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping opacity-75" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-slate-900">
                AI 爆款视频反推与生成工作台
              </h1>
              <span className="px-2 py-0.5 text-[11px] font-extrabold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                PRO WORKBENCH
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              短视频解析 → 结构化 Prompt → 视频运镜 → 爆款文案 → BGM卡点 → 合成导出
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-end">
          {/* Active Product Indicator & Quick Select */}
          {activeProduct && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <PackageCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline text-slate-500 text-[11px] font-normal">生效卖点:</span>
              <select
                value={activeProduct.id}
                onChange={(e) => onSelectActiveProduct && onSelectActiveProduct(e.target.value)}
                className="bg-transparent text-xs font-bold text-emerald-800 focus:outline-none cursor-pointer max-w-[130px] truncate"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id} className="bg-white text-slate-900">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Materials Library Button */}
          <button
            onClick={onOpenMaterials}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all shadow-surface-sm"
          >
            <Film className="w-3.5 h-3.5 text-teal-600" />
            <span>素材库</span>
          </button>

          {/* Task Center Button */}
          <button
            onClick={onOpenTasks}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all shadow-surface-sm"
          >
            <ListTodo className="w-3.5 h-3.5 text-emerald-600" />
            <span>任务中心</span>
          </button>

          {/* Model Config Center Button */}
          <button
            onClick={onOpenModelConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all shadow-surface-sm"
          >
            <Cpu className="w-3.5 h-3.5 text-sky-600" />
            <span>模型配置</span>
          </button>

          {/* Presets Button */}
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all shadow-surface-sm"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>爆款预设</span>
          </button>

          {/* Knowledge Base Button */}
          <button
            onClick={onOpenKnowledge}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 border border-emerald-500/30 transition-all shadow-surface-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>卖点库</span>
          </button>

          {/* Mode Toggle (Mock / Gemini AI) */}
          <button
            onClick={() => setUseMockMode(!useMockMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              useMockMode
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
            title="点击切换 AI 响应模式"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>{useMockMode ? 'Mock 模拟引擎' : 'Gemini 3.6 真实 AI'}</span>
          </button>

          {/* Global Reset */}
          <button
            onClick={onResetAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-all shadow-surface-sm"
            title="重置整条流水线"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">重置</span>
          </button>
        </div>
      </div>
    </header>
  );
};
