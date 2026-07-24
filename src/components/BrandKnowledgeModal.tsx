import React from 'react';
import { BUV_BRAND_INFO } from '../data/presets';
import { X, ShieldCheck, Award, Sparkles, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

interface BrandKnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandKnowledgeModal: React.FC<BrandKnowledgeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {BUV_BRAND_INFO.name} · 爆款知识库与卖点地图
              </h3>
              <p className="text-xs text-slate-400">
                {BUV_BRAND_INFO.positioning}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-sm">
          {/* Sales & Authority Proof */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>权威背书 & 销量纪录</span>
            </div>
            <p className="text-sm font-semibold text-emerald-200 leading-relaxed">
              {BUV_BRAND_INFO.salesRecord}
            </p>
          </div>

          {/* 3:4:3 Model Breakdown */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-slate-100 font-bold text-sm">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>【3:4:3】清爽控油模型（核心技术架构）</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-xs font-bold text-emerald-400 mb-1">
                  3 重天然泥（清洁吸附）
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {BUV_BRAND_INFO.model343.clays}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-xs font-bold text-teal-400 mb-1">
                  4 重控油植萃（收敛水油）
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {BUV_BRAND_INFO.model343.extracts}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-xs font-bold text-cyan-400 mb-1">
                  3 重清洁表活（温和泡润）
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {BUV_BRAND_INFO.model343.surfactants}
                </p>
              </div>
            </div>
          </div>

          {/* SGS Lab Proof Data */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-slate-100 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SGS 权威人体功效实测数据</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-800/80 border border-emerald-500/20 text-center">
                <div className="text-xl font-extrabold text-emerald-400 font-mono">
                  {BUV_BRAND_INFO.sgsData.oil8h}
                </div>
                <div className="text-xs text-slate-400 mt-1">即刻 & 8小时持久控油</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-emerald-500/20 text-center">
                <div className="text-xl font-extrabold text-teal-400 font-mono">
                  {BUV_BRAND_INFO.sgsData.oil14d}
                </div>
                <div className="text-xs text-slate-400 mt-1">14天改善面部出油</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-emerald-500/20 text-center">
                <div className="text-xl font-extrabold text-cyan-400 font-mono">
                  {BUV_BRAND_INFO.sgsData.blackhead14d}
                </div>
                <div className="text-xs text-slate-400 mt-1">14天黑头面积减少</div>
              </div>
            </div>
          </div>

          {/* Compliance & Negative Case Rules */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30">
            <div className="flex items-center gap-2 mb-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>合规禁忌词与负面反例（文案严禁使用）</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {BUV_BRAND_INFO.prohibitedWords.map((word, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20"
                >
                  ✕ {word}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
          >
            知道了，返回流水线
          </button>
        </div>
      </div>
    </div>
  );
};
