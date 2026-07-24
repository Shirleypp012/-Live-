import React from 'react';
import { ProductItem } from '../types';
import {
  Sparkles,
  PanelLeft,
  PackageCheck,
  Zap,
} from 'lucide-react';

interface NavbarProps {
  isSidebarExpanded: boolean;
  onToggleSidebar: () => void;
  activeProduct?: ProductItem;
  useMockMode: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  isSidebarExpanded,
  onToggleSidebar,
  activeProduct,
  useMockMode,
}) => {
  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3 text-slate-900 transition-all shadow-surface-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Sidebar Toggle & Brand Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors shadow-surface-sm flex items-center justify-center shrink-0"
            title={isSidebarExpanded ? '折叠侧边栏' : '展开侧边栏'}
          >
            <PanelLeft className="w-4 h-4 text-emerald-600" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="relative hidden md:flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-bold shadow-md shadow-emerald-600/20">
              <span className="text-xs tracking-tighter font-mono">BUV</span>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping opacity-75" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm md:text-base font-extrabold tracking-tight text-slate-900">
                  AI 爆款视频反推与生成工作台
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 hidden sm:inline-block">
                  PRO WORKBENCH
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden lg:block">
                短视频解析 → 静态Prompt → 运镜轨迹 → 爆款文案 → BGM卡点 → 合成导出
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Active Product & Mode Badge */}
        <div className="flex items-center gap-2.5">
          {/* Active Product Badge */}
          {activeProduct && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold">
              <PackageCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-slate-500 text-[11px] font-normal hidden sm:inline">当前商品:</span>
              <span className="truncate max-w-[120px] md:max-w-[180px] text-emerald-900 font-extrabold">
                {activeProduct.name}
              </span>
            </div>
          )}

          {/* Engine Mode Badge */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border ${
              useMockMode
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>{useMockMode ? 'Mock 模式' : 'Gemini 3.6 AI'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
