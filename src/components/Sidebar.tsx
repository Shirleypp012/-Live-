import React, { useState, useEffect, useRef } from 'react';
import { ProductItem } from '../types';
import {
  BookOpen,
  Layers,
  Zap,
  Cpu,
  Film,
  ListTodo,
  PackageCheck,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Settings2,
  FolderKanban,
  RotateCcw,
  Workflow,
  GripVertical,
} from 'lucide-react';

export type MainViewType = 'pipeline' | 'materials' | 'tasks' | 'presets' | 'models' | 'knowledge';

interface SidebarProps {
  sidebarWidth: number;
  setSidebarWidth: (w: number) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  activeView: MainViewType;
  onChangeView: (view: MainViewType) => void;
  onOpenOnboarding: () => void;
  onResetAll: () => void;
  useMockMode: boolean;
  setUseMockMode: (val: boolean) => void;
  activeProduct?: ProductItem;
  products?: ProductItem[];
  onSelectActiveProduct?: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarWidth,
  setSidebarWidth,
  isExpanded,
  onToggleExpand,
  activeView,
  onChangeView,
  onOpenOnboarding,
  onResetAll,
  useMockMode,
  setUseMockMode,
  activeProduct,
  products = [],
  onSelectActiveProduct,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Dragging handler for dynamic resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      let newWidth = e.clientX;
      if (newWidth < 120) {
        newWidth = 68;
      } else if (newWidth > 420) {
        newWidth = 420;
      }
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      }
    };

    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <aside
      ref={sidebarRef}
      style={{ width: `${sidebarWidth}px` }}
      className="sticky top-0 h-screen z-30 bg-white/95 backdrop-blur-md border-r border-slate-200/80 flex flex-col justify-between shrink-0 shadow-surface-sm select-none relative group/sidebar transition-none"
    >
      {/* Right Drag Handle for Resizing */}
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          setIsResizing(true);
        }}
        className={`absolute top-0 right-0 bottom-0 w-2 cursor-col-resize z-40 hover:bg-emerald-500/20 transition-colors flex items-center justify-center ${
          isResizing ? 'bg-emerald-500/40' : ''
        }`}
        title="按住鼠标左右拖拽调节侧边栏宽度"
      >
        <div className="w-0.5 h-8 bg-slate-300 group-hover/sidebar:bg-emerald-500 rounded-full" />
      </div>

      {/* Top Section */}
      <div className="overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex items-center justify-between min-h-[61px]">
          {isExpanded ? (
            <div className="flex items-center gap-2.5 overflow-hidden pl-1">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-bold shadow-md shadow-emerald-600/20 shrink-0">
                <span className="text-xs font-mono">BUV</span>
              </div>
              <div className="truncate">
                <span className="font-extrabold text-xs text-slate-900 block truncate">
                  AI 爆款反推工作台
                </span>
                <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  v2.5 PRO
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-bold shadow-md shadow-emerald-600/20 shrink-0">
                <span className="text-xs font-mono">BUV</span>
              </div>
            </div>
          )}

          <button
            onClick={onToggleExpand}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
            title={isExpanded ? '收起侧边栏' : '展开侧边栏'}
          >
            {isExpanded ? (
              <PanelLeftClose className="w-4 h-4 text-slate-500" />
            ) : (
              <PanelLeftOpen className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>

        {/* Navigation Items Group */}
        <div className="p-2 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)]">
          {/* Main Pipeline Entrance */}
          <div>
            {isExpanded && (
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>核心工程</span>
                <Workflow className="w-3 h-3 text-emerald-600" />
              </div>
            )}

            <button
              onClick={() => onChangeView('pipeline')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'pipeline'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-700 hover:bg-slate-100'
              } ${!isExpanded ? 'justify-center' : ''}`}
              title="5步短视频反推与生成主工程"
            >
              <Workflow className="w-4 h-4 shrink-0" />
              {isExpanded && <span className="truncate">5步反推生成流水线</span>}
            </button>
          </div>

          {/* Section 1: Active Product & Knowledge Base */}
          <div>
            {isExpanded && (
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>品牌与卖点库</span>
                <Sparkles className="w-3 h-3 text-emerald-600" />
              </div>
            )}

            {/* Active Product Selector Card */}
            {activeProduct && (
              <div
                className={`my-1 p-2 rounded-xl transition-all ${
                  isExpanded
                    ? 'bg-emerald-50/80 border border-emerald-200/80'
                    : 'bg-emerald-50/50 flex justify-center border border-emerald-200/50'
                }`}
              >
                {isExpanded ? (
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                      <span className="flex items-center gap-1 text-emerald-800">
                        <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
                        流水线绑定产品
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-white px-1.5 py-0.2 rounded border border-emerald-200">
                        {activeProduct.category}
                      </span>
                    </div>

                    <select
                      value={activeProduct.id}
                      onChange={(e) =>
                        onSelectActiveProduct && onSelectActiveProduct(e.target.value)
                      }
                      className="w-full bg-white text-xs font-bold text-slate-900 border border-emerald-300/80 rounded-lg px-2 py-1 focus:outline-none cursor-pointer shadow-sm hover:border-emerald-500"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <button
                    onClick={() => onChangeView('knowledge')}
                    className="p-1 text-emerald-700 hover:text-emerald-900"
                    title={`生效卖点: ${activeProduct.name}`}
                  >
                    <PackageCheck className="w-5 h-5 text-emerald-600" />
                  </button>
                )}
              </div>
            )}

            {/* Knowledge Base Direct Page Navigation */}
            <button
              onClick={() => onChangeView('knowledge')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'knowledge'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'text-slate-700 hover:bg-slate-100'
              } ${!isExpanded ? 'justify-center' : ''}`}
              title="卖点库与品牌知识中心"
            >
              <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
              {isExpanded && <span className="truncate">卖点库 & AI润色</span>}
            </button>
          </div>

          {/* Section 2: Core Workspace Modules (Direct View Switches) */}
          <div className="space-y-1">
            {isExpanded && (
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>创作中心</span>
                <FolderKanban className="w-3 h-3 text-slate-400" />
              </div>
            )}

            {/* Materials Library Direct Page */}
            <button
              onClick={() => onChangeView('materials')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                activeView === 'materials'
                  ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              } ${!isExpanded ? 'justify-center' : ''}`}
              title="素材库页面"
            >
              <Film className="w-4 h-4 text-teal-600 shrink-0" />
              {isExpanded && <span className="truncate">视频素材库页面</span>}
            </button>

            {/* Tasks Center Direct Page */}
            <button
              onClick={() => onChangeView('tasks')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                activeView === 'tasks'
                  ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              } ${!isExpanded ? 'justify-center' : ''}`}
              title="后台任务中心页面"
            >
              <ListTodo className="w-4 h-4 text-emerald-600 shrink-0" />
              {isExpanded && <span className="truncate">任务中心页面</span>}
            </button>

            {/* Presets Library Direct Page */}
            <button
              onClick={() => onChangeView('presets')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                activeView === 'presets'
                  ? 'bg-indigo-50 text-indigo-800 font-bold border border-indigo-200'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              } ${!isExpanded ? 'justify-center' : ''}`}
              title="爆款视频与反推预设"
            >
              <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
              {isExpanded && <span className="truncate">爆款模版库页面</span>}
            </button>

            {/* Model Config Direct Page */}
            <button
              onClick={() => onChangeView('models')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                activeView === 'models'
                  ? 'bg-sky-50 text-sky-800 font-bold border border-sky-200'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              } ${!isExpanded ? 'justify-center' : ''}`}
              title="大模型与提示词配置页面"
            >
              <Cpu className="w-4 h-4 text-sky-600 shrink-0" />
              {isExpanded && <span className="truncate">模型配置中心页面</span>}
            </button>
          </div>

          {/* Section 3: Help & System Settings */}
          <div className="space-y-1">
            {isExpanded && (
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>帮助与系统</span>
                <Settings2 className="w-3 h-3 text-slate-400" />
              </div>
            )}

            {/* Onboarding Guide */}
            <button
              onClick={onOpenOnboarding}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all ${
                !isExpanded ? 'justify-center' : ''
              }`}
              title="新手引导 & 操作指南"
            >
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
              {isExpanded && <span className="truncate">新手上手指南</span>}
            </button>

            {/* AI Engine Switcher (Mock / Gemini AI) */}
            <button
              onClick={() => setUseMockMode(!useMockMode)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                useMockMode
                  ? 'bg-amber-50/80 text-amber-800 border-amber-200'
                  : 'bg-emerald-50/80 text-emerald-800 border-emerald-200'
              } ${!isExpanded ? 'justify-center' : ''}`}
              title={useMockMode ? '切换为 Gemini 3.6 真实 AI' : '切换为 Mock 极速模拟'}
            >
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              {isExpanded && (
                <span className="truncate font-bold">
                  {useMockMode ? 'Mock 模拟引擎' : 'Gemini 3.6 真实 AI'}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Reset & Version Footer */}
      <div className="p-2 border-t border-slate-100 bg-slate-50/50 space-y-1">
        <button
          onClick={onResetAll}
          className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition-all ${
            !isExpanded ? 'justify-center' : ''
          }`}
          title="重置整个 5 步流水线工程"
        >
          <RotateCcw className="w-4 h-4 text-slate-500 hover:text-rose-600 shrink-0" />
          {isExpanded && <span>重置流水线工程</span>}
        </button>

        {isExpanded && (
          <div className="px-2.5 py-1 text-[10px] text-slate-400 font-mono text-center flex items-center justify-center gap-1">
            <GripVertical className="w-3 h-3 text-slate-300" />
            <span>可拖拽侧边栏边界</span>
          </div>
        )}
      </div>
    </aside>
  );
};
