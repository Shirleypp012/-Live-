import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Save,
  Sliders,
  Type,
  Maximize2,
  FileText,
  Wand2,
} from 'lucide-react';

interface PromptEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  promptType: 'static_image_prompt' | 'video_prompt' | 'script_body';
  modelName?: string;
  initialPrompt: string;
  onSavePrompt: (updatedPrompt: string) => void;
  onRegenerate: (updatedPrompt: string) => void;
  isRegenerating?: boolean;
}

export const PromptEditorModal: React.FC<PromptEditorModalProps> = ({
  isOpen,
  onClose,
  title,
  promptType,
  modelName,
  initialPrompt,
  onSavePrompt,
  onRegenerate,
  isRegenerating = false,
}) => {
  const [promptText, setPromptText] = useState(initialPrompt);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  useEffect(() => {
    setPromptText(initialPrompt);
  }, [initialPrompt, isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSavePrompt(promptText);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 1500);
  };

  const handleRegenerateClick = () => {
    onSavePrompt(promptText);
    onRegenerate(promptText);
  };

  const handleAiEnhance = () => {
    setIsEnhancing(true);
    setTimeout(() => {
      let enhanced = promptText;
      if (promptType === 'static_image_prompt') {
        enhanced +=
          ', cinematic lighting, soft focus bokeh background, ultra-realistic texture, 8k resolution, perfect composition';
      } else if (promptType === 'video_prompt') {
        enhanced +=
          ', seamless fluid 60fps motion, cinematic camera pan, natural soft morning lighting, high detail physics rendering';
      } else {
        enhanced += '\n\n【排版优化】：加入了高转化引导词与爆款文案心理按压策略';
      }
      setPromptText(enhanced);
      setIsEnhancing(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh] transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base">{title}</h3>
                {modelName && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                    {modelName} 专属适配
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                可直接在下方编辑提示词词组，调整参数权重后点击重新生成
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

        {/* Action Quickbar */}
        <div className="px-6 py-3 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleAiEnhance}
              disabled={isEnhancing}
              className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-medium transition-all flex items-center gap-1.5"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
              <span>{isEnhancing ? 'AI 智能润色中...' : 'AI 智能提示词润色'}</span>
            </button>
            <span className="text-slate-500 font-mono">
              字数: {promptText.length} 字
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">已复制!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>复制 Prompt</span>
                </>
              )}
            </button>

            <button
              onClick={handleSave}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">已保存</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>保存修改</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="p-6 flex-1 bg-slate-950 flex flex-col">
          <label className="text-xs font-mono text-slate-400 mb-2 flex items-center justify-between">
            <span>Prompt Asset Raw Text Editor</span>
            <span className="text-[10px] text-slate-500">提示：修改关键词可精细控制光影、材质与动作</span>
          </label>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            rows={8}
            className="w-full flex-1 bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-300 leading-relaxed focus:outline-none focus:border-emerald-500 transition-colors resize-none shadow-inner"
            placeholder="输入或修改 Prompt..."
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Prompt 作为核心数字资产，修改后将同步更新流水线中的下一步衔接
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              关闭
            </button>
            <button
              onClick={handleRegenerateClick}
              disabled={isRegenerating}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? '重新渲染中...' : '使用新 Prompt 重新生成图片/视频'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
