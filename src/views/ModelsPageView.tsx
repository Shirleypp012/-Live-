import React, { useState } from 'react';
import {
  ShieldCheck,
  Cpu,
  Check,
  Sparkles,
  Sliders,
  Lock,
  Plus,
  Trash2,
  Edit2,
  Activity,
  Eye,
  EyeOff,
  AlertCircle,
  Globe,
  Key,
  ArrowLeft,
  Server,
  X,
} from 'lucide-react';
import {
  ImageModelName,
  VideoModelName,
  ModelConfigState,
  ModelMetadata,
} from '../data/models';
import { apiService, ApiTestConnectionResponse } from '../services/api';

interface ModelsPageViewProps {
  config: ModelConfigState;
  onSaveConfig: (newConfig: ModelConfigState) => void;
  userRole: 'admin' | 'user';
  onToggleRole: () => void;
  onBackToPipeline: () => void;
}

export const ModelsPageView: React.FC<ModelsPageViewProps> = ({
  config,
  onSaveConfig,
  userRole,
  onToggleRole,
  onBackToPipeline,
}) => {
  const [localConfig, setLocalConfig] = useState<ModelConfigState>(config);
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit / Add Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<ModelMetadata | null>(null);
  const [formType, setFormType] = useState<'image' | 'video'>('image');

  // Connection testing states
  const [testingModelId, setTestingModelId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, ApiTestConnectionResponse>>({});

  // Show/Hide API key toggles
  const [showKeyMap, setShowKeyMap] = useState<Record<string, boolean>>({});

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formProvider, setFormProvider] = useState('Google Gemini AIGC');
  const [formBaseUrl, setFormBaseUrl] = useState('https://generativelanguage.googleapis.com/v1beta');
  const [formApiKey, setFormApiKey] = useState('');
  const [formModelCode, setFormModelCode] = useState('');
  const [formScenario, setFormScenario] = useState('');
  const [formSpeedRating, setFormSpeedRating] = useState<'极快' | '快速' | '标准' | '精细'>('标准');
  const [formSpeedMs, setFormSpeedMs] = useState('2.5s');
  const [formQualityRating, setFormQualityRating] = useState<
    '基础级' | '高清' | '专业级' | '写实级' | '影视级' | '物理级' | '60fps流畅'
  >('影视级');
  const [formDescription, setFormDescription] = useState('');
  const [formBadge, setFormBadge] = useState('');

  const handleToggleEnableImage = (id: ImageModelName) => {
    if (userRole !== 'admin') return;
    setLocalConfig((prev) => ({
      ...prev,
      imageModels: prev.imageModels.map((m) =>
        m.id === id ? { ...m, enabled: !m.enabled } : m
      ),
    }));
  };

  const handleToggleEnableVideo = (id: VideoModelName) => {
    if (userRole !== 'admin') return;
    setLocalConfig((prev) => ({
      ...prev,
      videoModels: prev.videoModels.map((m) =>
        m.id === id ? { ...m, enabled: !m.enabled } : m
      ),
    }));
  };

  const handleSetDefaultImage = (id: ImageModelName) => {
    if (userRole !== 'admin') return;
    setLocalConfig((prev) => ({
      ...prev,
      defaultImageModel: id,
      imageModels: prev.imageModels.map((m) => ({
        ...m,
        isDefault: m.id === id,
      })),
    }));
  };

  const handleSetDefaultVideo = (id: VideoModelName) => {
    if (userRole !== 'admin') return;
    setLocalConfig((prev) => ({
      ...prev,
      defaultVideoModel: id,
      videoModels: prev.videoModels.map((m) => ({
        ...m,
        isDefault: m.id === id,
      })),
    }));
  };

  const handleDeleteModel = (id: string, type: 'image' | 'video') => {
    if (userRole !== 'admin') return;
    if (!window.confirm(`确定要删除模型 [${id}] 吗？`)) return;

    setLocalConfig((prev) => {
      if (type === 'image') {
        return { ...prev, imageModels: prev.imageModels.filter((m) => m.id !== id) };
      } else {
        return { ...prev, videoModels: prev.videoModels.filter((m) => m.id !== id) };
      }
    });
  };

  const handleTestConnection = async (model: ModelMetadata) => {
    setTestingModelId(model.id);
    const result = await apiService.models.testConnection(model);
    setTestResults((prev) => ({ ...prev, [model.id]: result }));
    setTestingModelId(null);
  };

  const handleOpenAddForm = (type: 'image' | 'video') => {
    setFormType(type);
    setEditingModel(null);
    setFormName('');
    setFormProvider('Google Gemini AIGC');
    setFormBaseUrl('https://generativelanguage.googleapis.com/v1beta');
    setFormApiKey('');
    setFormModelCode('');
    setFormScenario('适合爆款画质重构与细节渲染');
    setFormSpeedRating('标准');
    setFormSpeedMs('3.0s');
    setFormQualityRating('影视级');
    setFormDescription('企业级微调算法接入模型');
    setFormBadge('自定义模型');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (model: ModelMetadata, type: 'image' | 'video') => {
    setFormType(type);
    setEditingModel(model);
    setFormName(model.name);
    setFormProvider(model.provider || 'Google Gemini AIGC');
    setFormBaseUrl(model.baseUrl || 'https://generativelanguage.googleapis.com/v1beta');
    setFormApiKey(model.apiKey || '');
    setFormModelCode(model.modelCode || model.id);
    setFormScenario(model.recommendedScenario || '');
    setFormSpeedRating(model.speedRating || '标准');
    setFormSpeedMs(model.speedMs || '2.5s');
    setFormQualityRating(model.qualityRating || '影视级');
    setFormDescription(model.description || '');
    setFormBadge(model.badge || '');
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newId = editingModel ? editingModel.id : (formName.trim() as any);

    const updatedModel: ModelMetadata = {
      id: newId,
      name: formName.trim(),
      provider: formProvider.trim(),
      baseUrl: formBaseUrl.trim(),
      apiKey: formApiKey.trim(),
      modelCode: formModelCode.trim() || formName.trim(),
      recommendedScenario: formScenario.trim(),
      speedRating: formSpeedRating,
      speedMs: formSpeedMs.trim(),
      qualityRating: formQualityRating,
      description: formDescription.trim(),
      badge: formBadge.trim() || undefined,
      enabled: editingModel ? editingModel.enabled : true,
      isDefault: editingModel ? editingModel.isDefault : false,
      isCustom: true,
    };

    setLocalConfig((prev) => {
      if (formType === 'image') {
        const exists = prev.imageModels.some((m) => m.id === newId);
        const imageModels = exists
          ? prev.imageModels.map((m) => (m.id === newId ? updatedModel : m))
          : [...prev.imageModels, updatedModel];
        return { ...prev, imageModels: imageModels as any };
      } else {
        const exists = prev.videoModels.some((m) => m.id === newId);
        const videoModels = exists
          ? prev.videoModels.map((m) => (m.id === newId ? updatedModel : m))
          : [...prev.videoModels, updatedModel];
        return { ...prev, videoModels: videoModels as any };
      }
    });

    setIsFormOpen(false);
  };

  const handleSave = async () => {
    await apiService.models.saveConfig(localConfig);
    onSaveConfig(localConfig);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 1500);
  };

  const toggleShowKey = (id: string) => {
    setShowKeyMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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

          <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-600 border border-sky-500/20 shrink-0">
            <Cpu className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">大模型与提示词规则配置中心</h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 ${
                  userRole === 'admin'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {userRole === 'admin' ? '管理员模式 (可编辑)' : '普通用户模式 (只读选择)'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              可实时接入与调整图片及视频大模型 endpoint、API Key、推荐匹配模型算法。
            </p>
          </div>
        </div>

        <button
          onClick={onToggleRole}
          className="px-4 py-2 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all shadow-sm flex items-center gap-2 shrink-0"
        >
          <Eye className="w-4 h-4 text-sky-600" />
          <span>切换视角: {userRole === 'admin' ? '普通用户视图' : '管理员模式'}</span>
        </button>
      </div>

      {/* Mode / Tabs Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-surface-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('image')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'image'
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            📷 静态图片模型 ({localConfig.imageModels.length})
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'video'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🎬 图生视频模型 ({localConfig.videoModels.length})
          </button>
        </div>

        <div className="flex items-center gap-3">
          {userRole === 'admin' && (
            <button
              onClick={() => handleOpenAddForm(activeTab)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>新增{activeTab === 'image' ? '图片' : '视频'} AI 模型</span>
            </button>
          )}

          {userRole === 'admin' && (
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all flex items-center gap-1.5"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  已成功保存并生效！
                </>
              ) : (
                '保存设置'
              )}
            </button>
          )}
        </div>
      </div>

      {/* Models Grid */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-surface-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(activeTab === 'image' ? localConfig.imageModels : localConfig.videoModels).map(
            (model: ModelMetadata) => {
              const testResult = testResults[model.id];
              const isTesting = testingModelId === model.id;
              const isKeyShown = Boolean(showKeyMap[model.id]);

              return (
                <div
                  key={model.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    model.enabled
                      ? 'bg-white border-slate-200/90 shadow-surface-sm hover:border-sky-400'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-base text-slate-900">{model.name}</h3>
                          {model.isDefault && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              默认首选
                            </span>
                          )}
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                            {model.provider || 'AI Provider'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                          {model.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {userRole === 'admin' && (
                          <>
                            <button
                              onClick={() => handleOpenEditForm(model, activeTab)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                              title="编辑"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteModel(model.id, activeTab)}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                              title="删除"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        <button
                          disabled={userRole !== 'admin'}
                          onClick={() =>
                            activeTab === 'image'
                              ? handleToggleEnableImage(model.id as any)
                              : handleToggleEnableVideo(model.id as any)
                          }
                          className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                            model.enabled
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-200 text-slate-600 border-slate-300'
                          }`}
                        >
                          {model.enabled ? '已启用' : '未启用'}
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5 text-slate-400" />
                          <span>Base URL:</span>
                        </span>
                        <span className="truncate max-w-[240px] text-slate-900 font-bold">
                          {model.baseUrl || 'https://generativelanguage.googleapis.com'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1">
                          <Key className="w-3.5 h-3.5 text-slate-400" />
                          <span>API Key:</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-900 font-bold">
                            {isKeyShown
                              ? model.apiKey || '环境变量 GEMINI_API_KEY'
                              : model.apiKey
                              ? model.apiKey.slice(0, 7) + '••••••••'
                              : '环境受保护密钥'}
                          </span>
                          {model.apiKey && (
                            <button
                              type="button"
                              onClick={() => toggleShowKey(model.id)}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              {isKeyShown ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTestConnection(model)}
                        disabled={isTesting}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1"
                      >
                        <Activity className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-sky-500' : ''}`} />
                        <span>{isTesting ? '检测中...' : '测试接口连通性'}</span>
                      </button>

                      {testResult && (
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                            testResult.success
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {testResult.message}
                        </span>
                      )}
                    </div>

                    {userRole === 'admin' && model.enabled && !model.isDefault && (
                      <button
                        onClick={() =>
                          activeTab === 'image'
                            ? handleSetDefaultImage(model.id as any)
                            : handleSetDefaultVideo(model.id as any)
                        }
                        className="text-xs text-slate-500 hover:text-sky-600 font-bold underline flex items-center gap-1"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>设为默认</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-slate-900 border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Server className="w-4 h-4 text-sky-600" />
                <span>{editingModel ? '编辑 AI 模型' : `新增${formType === 'image' ? '图片' : '视频'} AI 模型`}</span>
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-700 mb-1">模型展示名称 *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="例如：Gemini 3.6 Ultra HD"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">API Base URL *</label>
                <input
                  type="text"
                  required
                  value={formBaseUrl}
                  onChange={(e) => setFormBaseUrl(e.target.value)}
                  placeholder="https://generativelanguage.googleapis.com/v1beta"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">API Key</label>
                <input
                  type="password"
                  value={formApiKey}
                  onChange={(e) => setFormApiKey(e.target.value)}
                  placeholder="sk-proj-..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">场景描述</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="描述模型适用场景"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md"
                >
                  保存模型
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
