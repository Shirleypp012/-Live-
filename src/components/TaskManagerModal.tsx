import React, { useState } from 'react';
import {
  X,
  ListTodo,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  RotateCcw,
  Download,
  Eye,
  Trash2,
  Sparkles,
  FileCode,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { TaskItem, PipelineData } from '../types';
import { downloadJsonFile, copyToClipboard } from '../utils/format';

interface TaskManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: TaskItem[];
  onSelectTask: (task: TaskItem) => void;
  onDeleteTask: (id: string) => void;
  onReRunTask: (task: TaskItem) => void;
}

export const TaskManagerModal: React.FC<TaskManagerModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onSelectTask,
  onDeleteTask,
  onReRunTask,
}) => {
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<TaskItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'generating'>('all');

  if (!isOpen) return null;

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter === 'completed') return t.status === 'completed';
    if (statusFilter === 'generating') return t.status === 'generating';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-surface-lg w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                AI 生成任务中心 (AIGC Task Manager)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                查看、追溯与管理历史反推任务，支持一键重载工作流程、修改 Prompt 与打包导出
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-3 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              全部任务 ({tasks.length})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === 'completed'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              已完成 ({tasks.filter((t) => t.status === 'completed').length})
            </button>
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            点击任务可一键同步至主工作台直接进行第1-5步编辑与渲染
          </span>
        </div>

        {/* Main Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/40 dark:bg-slate-950/40">
          {filteredTasks.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <ListTodo className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">暂无历史反推任务记录</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-surface-sm hover:border-emerald-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    {task.thumbnailUrl ? (
                      <img
                        src={task.thumbnailUrl}
                        alt=""
                        className="w-16 h-16 rounded-lg object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                        <Sparkles className="w-6 h-6" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {task.title}
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          已完成 5 步流水线
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        提示词: {task.pipelineData.step1.output?.static_image_prompt || '暂无静态图提示词'}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                        创建时间: {task.createdAt} · 任务ID: {task.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedTaskDetail(task)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>查看详情</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectTask(task);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-surface-sm flex items-center gap-1"
                    >
                      <span>载入工作台</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="删除任务"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 flex items-center justify-between text-xs text-slate-500">
          <span>任务状态已实时持久化到后端服务</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
          >
            关闭
          </button>
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTaskDetail && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl max-w-3xl w-full p-6 overflow-hidden space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base">{selectedTaskDetail.title} — 任务流产物全览</h3>
              <button
                onClick={() => setSelectedTaskDetail(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-4 text-xs pr-1">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1 border border-slate-200/80 dark:border-slate-700">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Step 1 静态图提示词 (Prompt):</span>
                <p className="text-slate-800 dark:text-slate-200 font-mono bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  {selectedTaskDetail.pipelineData.step1.output?.static_image_prompt}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1 border border-slate-200/80 dark:border-slate-700">
                <span className="font-bold text-teal-600 dark:text-teal-400">Step 2 视频运镜 Prompt:</span>
                <p className="text-slate-800 dark:text-slate-200 font-mono bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  {selectedTaskDetail.pipelineData.step2.output?.video_prompt}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1 border border-slate-200/80 dark:border-slate-700">
                <span className="font-bold text-cyan-600 dark:text-cyan-400">Step 3 爆款文案文案:</span>
                <p className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <strong>{selectedTaskDetail.pipelineData.step3.output?.title}</strong>
                  <br />
                  {selectedTaskDetail.pipelineData.step3.output?.hook}
                  <br />
                  {selectedTaskDetail.pipelineData.step3.output?.body}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1 border border-slate-200/80 dark:border-slate-700">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">Step 4 推荐 BGM 曲目:</span>
                <p className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  {selectedTaskDetail.pipelineData.step4.output?.bgm_recommendation.track_name} — BPM {selectedTaskDetail.pipelineData.step4.output?.bgm_recommendation.bpm}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() =>
                  downloadJsonFile(selectedTaskDetail.pipelineData, `${selectedTaskDetail.id}_bundle.json`)
                }
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>导出全套 JSON 数据</span>
              </button>

              <button
                onClick={() => {
                  onSelectTask(selectedTaskDetail);
                  setSelectedTaskDetail(null);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                在主工作台中载入并编辑
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
