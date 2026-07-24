import React, { useState } from 'react';
import {
  Upload,
  Video,
  Image as ImageIcon,
  Trash2,
  Check,
  Film,
  Eye,
  X,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { MaterialItem } from '../types';
import { apiService } from '../services/api';

interface MaterialsPageViewProps {
  materials: MaterialItem[];
  onAddMaterials: (items: MaterialItem[]) => void;
  onDeleteMaterial: (id: string) => void;
  onSelectMaterial: (material: MaterialItem) => void;
  onBackToPipeline: () => void;
}

export const MaterialsPageView: React.FC<MaterialsPageViewProps> = ({
  materials,
  onAddMaterials,
  onDeleteMaterial,
  onSelectMaterial,
  onBackToPipeline,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'image'>('all');
  const [selectedPreview, setSelectedPreview] = useState<MaterialItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    const newItems: MaterialItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const item = await apiService.materials.uploadMaterial(file);
      newItems.push(item);
    }

    onAddMaterials(newItems);
    setIsUploading(false);
  };

  const filteredMaterials = materials.filter((item) => {
    if (activeTab === 'video') return item.type === 'video';
    if (activeTab === 'image') return item.type === 'image';
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Header */}
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

          <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 border border-teal-500/20 shrink-0">
            <Film className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">爆款短视频与图片素材库</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold">
                MEDIA ASSETS
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              可批量上传并在线预览短视频真素材，一键选定导入 5 步反推流水线。
            </p>
          </div>
        </div>

        <div className="text-right text-xs font-semibold text-slate-500 hidden sm:block">
          已纳管 <span className="text-teal-600 font-bold text-sm">{materials.length}</span> 个灵感素材
        </div>
      </div>

      {/* Upload Dropzone Section */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-surface-sm">
        <label className="relative group border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-8 bg-slate-50/50 hover:bg-teal-50/30 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3">
          <input
            type="file"
            multiple
            accept="video/*,image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <div className="p-4 rounded-full bg-teal-100 text-teal-700 shadow-sm group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-slate-800">
              {isUploading ? '素材正在解析上传中...' : '点击上传或将爆款视频/原图拖拽至此处'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              支持 MP4, MOV, JPG, PNG, Live Photo 等格式多选批量导入
            </p>
          </div>
        </label>
      </div>

      {/* Filter Tabs */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-surface-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            全部素材 ({materials.length})
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'video'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🎬 视频素材 ({materials.filter((m) => m.type === 'video').length})
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'image'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            📷 图片素材 ({materials.filter((m) => m.type === 'image').length})
          </button>
        </div>

        <span className="text-xs font-medium text-slate-500">
          选中素材后点击【导入流水线】即可将素材填充至Step 1
        </span>
      </div>

      {/* Materials Grid */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-surface-sm">
        {filteredMaterials.length === 0 ? (
          <div className="py-20 text-center text-slate-400 space-y-2">
            <Film className="w-12 h-12 mx-auto opacity-40 text-teal-600" />
            <p className="text-sm font-bold text-slate-600">暂无素材，请上传你的短视频或图文素材</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredMaterials.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-surface-sm hover:shadow-surface-md transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  {item.type === 'video' ? (
                    <div className="relative w-full h-full">
                      <video
                        src={item.url}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                        onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-white text-[10px] font-mono flex items-center gap-1">
                        <Video className="w-3 h-3 text-emerald-400" />
                        <span>{item.duration || '00:15'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-white text-[10px] font-mono flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-cyan-400" />
                        <span>IMAGE</span>
                      </div>
                    </div>
                  )}

                  {/* Hover Controls */}
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                    <button
                      onClick={() => setSelectedPreview(item)}
                      className="p-2.5 rounded-xl bg-white/20 hover:bg-white/40 text-white transition-colors"
                      title="预览全屏"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        onSelectMaterial(item);
                        onBackToPipeline();
                      }}
                      className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>导入流水线</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800 truncate max-w-[140px]">{item.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.size}</p>
                  </div>

                  <button
                    onClick={() => onDeleteMaterial(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Player Modal */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 text-white rounded-3xl max-w-3xl w-full p-4 overflow-hidden space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-sm truncate">{selectedPreview.name}</h3>
              <button
                onClick={() => setSelectedPreview(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden bg-black flex items-center justify-center max-h-[70vh]">
              {selectedPreview.type === 'video' ? (
                <video src={selectedPreview.url} controls autoPlay className="max-h-[70vh] w-full" />
              ) : (
                <img src={selectedPreview.url} alt="" className="max-h-[70vh] object-contain" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
