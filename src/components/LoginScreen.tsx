import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lock, User, KeyRound, ArrowRight, ShieldCheck, Film, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (username: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('haini');
  const [password, setPassword] = useState('888');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      if (username.trim() === 'haini' && password === '888') {
        onLoginSuccess(username.trim());
      } else {
        setErrorMsg('账号或密码错误！默认测试账号：haini / 密码：888');
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickFill = () => {
    setUsername('haini');
    setPassword('888');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40 p-4 font-sans select-none motionsites-grid">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-8 shadow-surface-lg relative overflow-hidden"
      >
        {/* Decorative Top Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-extrabold shadow-lg shadow-emerald-600/25 mb-4">
            <span className="text-xl tracking-tighter font-mono">BUV</span>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full animate-ping opacity-75" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI 短视频反推与生成工作台</span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            欢迎登录平台
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            短视频解析 · 镜头运镜 · 爆款文案 · BGM卡点 · 成品合成
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>账号 (Username)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入测试账号 (haini)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
              <span>密码 (Password)</span>
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入登录密码 (888)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Quick Credential Hint Button */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">
              测试凭据: <strong className="text-emerald-700">haini / 888</strong>
            </span>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-emerald-600 hover:text-emerald-700 font-bold underline cursor-pointer"
            >
              一键填入凭据
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-emerald-100" />
                <span>验证登录中...</span>
              </>
            ) : (
              <>
                <span>立即登录工作台</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div className="mt-8 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
          BUV AI Studio · 企业级短视频反推与AIGC全流水线平台
        </div>
      </motion.div>
    </div>
  );
};
