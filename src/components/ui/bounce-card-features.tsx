import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Video, FileText, Music, Play, Layers, Cpu, CheckCircle } from "lucide-react";

export const BouncyCardsFeatures: React.FC = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 text-slate-800">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end md:px-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI 爆款全自动反推与生成矩阵</span>
          </div>
          <h2 className="max-w-2xl text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            全链路 AI 视频生成流水线
            <span className="text-emerald-600 block md:inline font-bold"> · 5 大核心功能卡片</span>
          </h2>
        </div>
        <motion.a
          href="#pipeline-start"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="whitespace-nowrap rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 flex items-center gap-2"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>立即体验 AI 生成</span>
        </motion.a>
      </div>

      <div className="mb-4 grid grid-cols-12 gap-4">
        <BounceCard className="col-span-12 md:col-span-4 border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-teal-50/50">
          <CardTitle icon={<Video className="w-5 h-5 text-emerald-600" />}>
            Step 1: 视频反推与解析
          </CardTitle>
          <p className="text-xs text-slate-500 mt-2 text-center max-w-xs mx-auto">
            抽帧镜头脚本 + 卖点配方自动比对解析
          </p>
          <div className="absolute bottom-0 left-4 right-4 top-28 translate-y-6 rounded-t-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 transition-transform duration-[250ms] group-hover:translate-y-2 group-hover:rotate-[1deg] shadow-lg text-white">
            <div className="flex items-center justify-between text-xs font-bold mb-2 border-b border-emerald-400/40 pb-2">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> 结构化 Prompt
              </span>
              <span className="bg-emerald-700/60 px-2 py-0.5 rounded text-[10px]">DeepSeek / Gemini</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-95">
              自动识别前3秒黄金Hook、人物动作与卖点字幕，精准锁定爆款密码。
            </p>
          </div>
        </BounceCard>

        <BounceCard className="col-span-12 md:col-span-8 border border-sky-100 bg-gradient-to-br from-sky-50/80 to-blue-50/50">
          <CardTitle icon={<Cpu className="w-5 h-5 text-sky-600" opacity={1} />}>
            Step 2 & 3: 运镜与爆款文案生成
          </CardTitle>
          <p className="text-xs text-slate-500 mt-2 text-center max-w-sm mx-auto">
            AI 自动生成 Kling / Runway / MiniMax / Sora 级高精度 Prompt 与金句标题
          </p>
          <div className="absolute bottom-0 left-4 right-4 top-28 translate-y-6 rounded-t-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 p-4 transition-transform duration-[250ms] group-hover:translate-y-2 group-hover:rotate-[1deg] shadow-lg text-white">
            <div className="grid grid-cols-2 gap-3 text-xs font-bold mb-2">
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/20">
                <span className="text-sky-200 text-[10px] block font-mono">STEP 2 PROMPT</span>
                <span>镜头轨迹: 快速推进 45° 俯拍细节</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/20">
                <span className="text-sky-200 text-[10px] block font-mono">STEP 3 COPYWRITING</span>
                <span>爆款文案: "大油田姐妹听我一句劝..."</span>
              </div>
            </div>
          </div>
        </BounceCard>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <BounceCard className="col-span-12 md:col-span-8 border border-purple-100 bg-gradient-to-br from-purple-50/80 to-fuchsia-50/50">
          <CardTitle icon={<Music className="w-5 h-5 text-purple-600" />}>
            Step 4: BGM 情绪卡点音效
          </CardTitle>
          <p className="text-xs text-slate-500 mt-2 text-center max-w-sm mx-auto">
            精准推荐抖音/小红书网感热歌与转场音效 BPM 节奏
          </p>
          <div className="absolute bottom-0 left-4 right-4 top-28 translate-y-6 rounded-t-2xl bg-gradient-to-br from-purple-500 via-violet-600 to-fuchsia-600 p-4 transition-transform duration-[250ms] group-hover:translate-y-2 group-hover:rotate-[1deg] shadow-lg text-white">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="flex items-center gap-1.5">
                <Music className="w-4 h-4 animate-bounce" />
                推荐 BGM: 《节奏对冲 · 爆款带货节奏》
              </span>
              <span className="bg-purple-800/60 px-2 py-0.5 rounded text-[10px] font-mono">128 BPM / 卡点对齐</span>
            </div>
            <p className="text-[11px] text-purple-100">
              智能分析视频高潮节拍，实现音乐停顿与画面卖点出现的微秒级卡点。
            </p>
          </div>
        </BounceCard>

        <BounceCard className="col-span-12 md:col-span-4 border border-amber-100 bg-gradient-to-br from-amber-50/80 to-orange-50/50">
          <CardTitle icon={<Layers className="w-5 h-5 text-amber-600" />}>
            Step 5: 综合成片与多端导出
          </CardTitle>
          <p className="text-xs text-slate-500 mt-2 text-center max-w-xs mx-auto">
            格式渲染 / 脚本打包 / 剪映草稿同步
          </p>
          <div className="absolute bottom-0 left-4 right-4 top-28 translate-y-6 rounded-t-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-4 transition-transform duration-[250ms] group-hover:translate-y-2 group-hover:rotate-[1deg] shadow-lg text-white">
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span>一键合成完整工程</span>
              <span className="bg-amber-700/60 px-2 py-0.5 rounded text-[10px]">1080P 60FPS</span>
            </div>
            <p className="text-[11px] text-amber-100">
              直接生成含音频、字幕、画面提示词的成品短视频打包工程！
            </p>
          </div>
        </BounceCard>
      </div>
    </section>
  );
};

interface BounceCardProps {
  className?: string;
  children: React.ReactNode;
}

const BounceCard: React.FC<BounceCardProps> = ({ className = "", children }) => {
  return (
    <motion.div
      whileHover={{ scale: 0.98, rotate: "-0.5deg" }}
      className={`group relative min-h-[260px] cursor-pointer overflow-hidden rounded-2xl bg-slate-50/90 p-6 shadow-sm hover:shadow-md transition-all ${className}`}
    >
      {children}
    </motion.div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const CardTitle: React.FC<CardTitleProps> = ({ children, icon }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {icon}
      <h3 className="text-center text-base md:text-lg font-bold text-slate-900">{children}</h3>
    </div>
  );
};
