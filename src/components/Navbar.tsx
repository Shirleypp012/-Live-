import React from 'react';
import {
  Sparkles,
  BookOpen,
  Layers,
  RefreshCw,
  Zap,
  Sun,
  Moon,
  Cpu,
  Film,
  ListTodo,
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
  isDarkMode: boolean;
  onToggleTheme: () => void;
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
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 lg:px-8 py-3 text-slate-900 dark:text-slate-100 transition-all shadow-surface-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Brand Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-bold shadow-md shadow-emerald-600/20">
            <span className="text-base tracking-tighter font-mono">AIGC</span>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping opacity-75" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
                AI 爆款视频反推与创作工坊
              </h1>
              <span className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20">
                AIGC Video Pipeline
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              短视频/Live图 → 结构化 Prompt → 视频生成 → 爆款文案 → BGM匹配 → 一键合成
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-end">
          {/* Materials Library Button */}
          <button
            onClick={onOpenMaterials}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all shadow-surface-sm"
          >
            <Film className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>素材库</span>
          </button>

          {/* Task Center Button */}
          <button
            onClick={onOpenTasks}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all shadow-surface-sm"
          >
            <ListTodo className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>任务中心</span>
          </button>

          {/* Model Config Center Button */}
          <button
            onClick={onOpenModelConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all shadow-surface-sm"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>模型配置</span>
          </button>

          {/* Presets Button */}
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all shadow-surface-sm"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>爆款预设</span>
          </button>

          {/* Knowledge Base Button */}
          <button
            onClick={onOpenKnowledge}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all shadow-surface-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>卖点库</span>
          </button>

          {/* Mode Toggle (Mock / Gemini AI) */}
          <button
            onClick={() => setUseMockMode(!useMockMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              useMockMode
                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30'
            }`}
            title="点击切换 AI 响应模式"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>{useMockMode ? 'Mock 模拟引擎' : 'Gemini 3.6 真实 AI'}</span>
          </button>

          {/* Icon-Only Theme Switcher Button */}
          <button
            onClick={onToggleTheme}
            className={`p-1.5 rounded-lg border transition-all ${
              isDarkMode
                ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 shadow-surface-sm'
            }`}
            title={isDarkMode ? '切换至曜石白极简主题' : '切换至暗色夜间主题'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Global Reset */}
          <button
            onClick={onResetAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 transition-all shadow-surface-sm"
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
