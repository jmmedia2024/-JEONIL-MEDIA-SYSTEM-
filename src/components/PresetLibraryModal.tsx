import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EstimateItem, EstimatePreset } from '../types';
import { ESTIMATE_PRESETS, formatCurrency } from '../constants';
import { 
  X, 
  Trash2, 
  FolderHeart, 
  Bookmark, 
  Library, 
  Plus, 
  Sparkles, 
  Video, 
  Paintbrush, 
  Megaphone, 
  Tv, 
  FileCheck,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';

interface PresetLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentItems: EstimateItem[];
  onLoadPreset: (items: Omit<EstimateItem, 'id'>[], mode: 'replace' | 'append') => void;
}

export const PresetLibraryModal: React.FC<PresetLibraryModalProps> = ({
  isOpen,
  onClose,
  currentItems,
  onLoadPreset,
}) => {
  // Tab control: 'system' | 'custom' | 'save'
  const [activeTab, setActiveTab] = useState<'system' | 'custom' | 'save'>('system');
  const [customPresets, setCustomPresets] = useState<EstimatePreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<EstimatePreset | null>(null);

  // Form states for saving current configuration as preset
  const [saveTitle, setSaveTitle] = useState('');
  const [saveDescription, setSaveDescription] = useState('');
  const [saveCategory, setSaveCategory] = useState<'video' | 'design' | 'marketing' | 'rental'>('video');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load custom presets from local storage on mount/change
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('jeonil_custom_presets');
      if (saved) {
        try {
          setCustomPresets(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse custom presets', e);
        }
      }
      // Select the first preset by default when switching tabs
      setSelectedPreset(ESTIMATE_PRESETS[0] || null);
      setActiveTab('system');
      setSaveSuccess(false);
      
      // Auto-populate default save name based on main item or title if available
      const firstNamedItem = currentItems.find(item => item.name)?.name || '';
      setSaveTitle(firstNamedItem ? `${firstNamedItem} 비즈니스 패키지` : '');
      setSaveDescription('㈜전일미디어를 위한 자주 사용하는 맞춤 견적 구성 요약');
    }
  }, [isOpen, currentItems]);

  const handleSelectPreset = (preset: EstimatePreset) => {
    setSelectedPreset(preset);
  };

  // Switch tabs and update selected preset
  const handleTabChange = (tab: 'system' | 'custom' | 'save') => {
    setActiveTab(tab);
    setSaveSuccess(false);
    if (tab === 'system') {
      setSelectedPreset(ESTIMATE_PRESETS[0] || null);
    } else if (tab === 'custom') {
      setSelectedPreset(customPresets[0] || null);
    } else {
      setSelectedPreset(null);
    }
  };

  // Apply a preset
  const handleApply = (mode: 'replace' | 'append') => {
    if (!selectedPreset) return;
    onLoadPreset(selectedPreset.items, mode);
    onClose();
  };

  // Save current items as a new custom preset
  const handleSaveCurrentAsPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveTitle.trim()) return;

    // Filter out completely empty items to save a high-quality preset
    const itemsToSave = currentItems
      .filter(item => item.name.trim() !== '')
      .map(item => ({
        name: item.name,
        spec: item.spec,
        qty: item.qty,
        price: item.price,
        note: item.note,
      }));

    if (itemsToSave.length === 0) {
      alert('저장할 품목명이 입력되어 있지 않습니다. 하나 이상의 품목을 입력해 주세요.');
      return;
    }

    const newPreset: EstimatePreset = {
      id: `custom_${Date.now()}`,
      title: saveTitle,
      description: saveDescription || '사용자가 직접 저장한 품목 구성 프리셋',
      category: saveCategory,
      items: itemsToSave
    };

    const updatedPresets = [newPreset, ...customPresets];
    setCustomPresets(updatedPresets);
    localStorage.setItem('jeonil_custom_presets', JSON.stringify(updatedPresets));
    
    setSaveSuccess(true);
    setTimeout(() => {
      // Smoothly switch back to custom presets and select the newly created one
      setActiveTab('custom');
      setSelectedPreset(newPreset);
      setSaveSuccess(false);
    }, 1500);
  };

  // Delete a custom preset
  const handleDeletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('정말 이 맞춤형 프리셋을 삭제하시겠습니까?')) return;

    const updated = customPresets.filter(p => p.id !== id);
    setCustomPresets(updated);
    localStorage.setItem('jeonil_custom_presets', JSON.stringify(updated));

    if (selectedPreset && selectedPreset.id === id) {
      setSelectedPreset(updated[0] || null);
    }
  };

  // Helper inside loop to render category icons
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'video':
        return <Video size={14} className="text-blue-500" />;
      case 'design':
        return <Paintbrush size={14} className="text-amber-500" />;
      case 'marketing':
        return <Megaphone size={14} className="text-emerald-500" />;
      default:
        return <Tv size={14} className="text-purple-500" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'video': return '영상 제작';
      case 'design': return '디자인/그래픽';
      case 'marketing': return '마케팅/기획';
      case 'rental': return '장비 렌탈';
      default: return '기타 서비스';
    }
  };

  // Sum up preset subtotal
  const calculatePresetTotal = (preset: EstimatePreset) => {
    return preset.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            id="preset-library-modal-overlay"
          />

          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Modal Body Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh]"
              id="preset-library-modal-body"
            >
              {/* Header bar */}
              <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/30 rounded-xl border border-blue-500/20 text-blue-400">
                    <Library size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base leading-none">견적 품목 프리셋 라이브러리</h3>
                    <p className="text-xs text-slate-300 mt-1">자주 쓰는 업무 패키지나 자신만의 전형적인 견적 구성을 빠르게 보관하고 호출하십시오.</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-100 px-6 bg-slate-50/50">
                <button
                  onClick={() => handleTabChange('system')}
                  className={`flex items-center gap-1.5 py-4 px-4 text-xs font-bold border-b-2 transition ${activeTab === 'system' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                >
                  <Sparkles size={13} className="text-amber-500" />
                  기본 추천 패키지 ({ESTIMATE_PRESETS.length})
                </button>
                <button
                  onClick={() => handleTabChange('custom')}
                  className={`flex items-center gap-1.5 py-4 px-4 text-xs font-bold border-b-2 transition ${activeTab === 'custom' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                >
                  <FolderHeart size={13} className="text-emerald-500" />
                  나의 보관소 프리셋 ({customPresets.length})
                </button>
                <button
                  onClick={() => handleTabChange('save')}
                  className={`flex items-center gap-1.5 py-4 px-4 text-xs font-bold border-b-2 transition ${activeTab === 'save' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-900'} ml-auto`}
                >
                  <Bookmark size={13} />
                  현재 편집 중인 목록 저장
                </button>
              </div>

              {/* Main Workspace Split layout (Grid list vs Preview panel) */}
              <div className="flex-1 overflow-hidden flex flex-col md:flex-row min-h-0">
                
                {/* LEFT COLUMN: List pane */}
                {activeTab !== 'save' && (
                  <div className="w-full md:w-[42%] border-r border-slate-100 overflow-y-auto p-4 flex flex-col gap-2 bg-slate-50/30">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">프리셋 목록</div>
                    
                    {activeTab === 'system' && ESTIMATE_PRESETS.map(preset => (
                      <div
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset)}
                        className={`group p-3 rounded-xl border text-left cursor-pointer transition flex flex-col gap-1.5 ${selectedPreset?.id === preset.id ? 'bg-blue-50/60 border-blue-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {getCategoryIcon(preset.category)}
                            {getCategoryLabel(preset.category)}
                          </span>
                          <ChevronRight size={12} className="text-slate-300 group-hover:translate-x-0.5 transition" />
                        </div>
                        <h4 className="font-bold text-slate-800 text-[12px] leading-tight line-clamp-1">{preset.title}</h4>
                        <p className="text-[10.5px] text-slate-400 line-clamp-2 leading-relaxed">{preset.description}</p>
                        <div className="flex items-center justify-between text-[10px] font-mono font-semibold text-slate-500 mt-1 border-t border-slate-50 pt-1.5">
                          <span>품목 {preset.items.length}개</span>
                          <span className="text-blue-600">약 {formatCurrency(calculatePresetTotal(preset))}원</span>
                        </div>
                      </div>
                    ))}

                    {activeTab === 'custom' && (
                      customPresets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-white m-2">
                          <Bookmark size={24} className="text-slate-300 mb-2" />
                          <p className="text-xs font-bold text-slate-500 mb-1">저장된 커스텀 프리셋이 없습니다.</p>
                          <p className="text-[10px] text-slate-400 max-w-[200px] leading-normal">
                            우측 상단 탭을 통해 현재 견적서의 구성 품목들을 나만의 프리셋으로 신속하게 추가할 수 있습니다.
                          </p>
                        </div>
                      ) : (
                        customPresets.map(preset => (
                          <div
                            key={preset.id}
                            onClick={() => handleSelectPreset(preset)}
                            className={`group p-3 rounded-xl border text-left cursor-pointer transition flex flex-col gap-1.5 ${selectedPreset?.id === preset.id ? 'bg-emerald-50/50 border-emerald-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                {getCategoryIcon(preset.category)}
                                {getCategoryLabel(preset.category)}
                              </span>
                              <button
                                onClick={(e) => handleDeletePreset(preset.id, e)}
                                className="p-1 hover:bg-red-50 rounded text-slate-300 hover:text-red-500 transition"
                                title="이 프리셋 삭제"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                            <h4 className="font-bold text-slate-800 text-[12px] leading-tight line-clamp-1">{preset.title}</h4>
                            <p className="text-[10.5px] text-slate-400 line-clamp-2 leading-relaxed">{preset.description}</p>
                            <div className="flex items-center justify-between text-[10px] font-mono font-semibold text-slate-500 mt-1 border-t border-slate-50 pt-1.5">
                              <span>품목 {preset.items.length}개</span>
                              <span className="text-emerald-700">약 {formatCurrency(calculatePresetTotal(preset))}원</span>
                            </div>
                          </div>
                        ))
                      )
                    )}
                  </div>
                )}

                {/* RIGHT COLUMN: Detail preview panel */}
                {activeTab !== 'save' ? (
                  <div className="flex-1 overflow-y-auto p-6 flex flex-col min-w-0">
                    {selectedPreset ? (
                      <div className="flex flex-col h-full">
                        {/* Selected Preset Info */}
                        <div className="mb-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-2">
                            {getCategoryIcon(selectedPreset.category)}
                            {getCategoryLabel(selectedPreset.category)}
                          </span>
                          <h4 className="text-base font-bold text-slate-800 leading-snug">{selectedPreset.title}</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{selectedPreset.description}</p>
                        </div>

                        {/* Items Sub-table */}
                        <div className="border border-slate-200 rounded-xl overflow-hidden mb-6 flex-1 min-h-[150px]">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                <th className="py-2 px-3">품목명</th>
                                <th className="py-2 px-3">규격 / 사양</th>
                                <th className="py-2 px-1 text-center w-12">수량</th>
                                <th className="py-2 px-3 text-right">단가</th>
                                <th className="py-2 px-3 text-right w-24">합계</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {selectedPreset.items.map((item, id) => (
                                <tr key={id} className="hover:bg-slate-50/30">
                                  <td className="py-2 px-3 font-semibold text-slate-800 line-clamp-1">{item.name}</td>
                                  <td className="py-2 px-3 text-slate-500 max-w-[140px] truncate">{item.spec || '-'}</td>
                                  <td className="py-2 px-1 text-center font-mono text-slate-600">{item.qty}</td>
                                  <td className="py-2 px-3 text-right font-mono text-slate-600">{formatCurrency(item.price)}원</td>
                                  <td className="py-2 px-3 text-right font-mono font-bold text-slate-700">{formatCurrency(item.qty * item.price)}원</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="bg-slate-50/50 font-bold border-t border-slate-200">
                                <td colSpan={4} className="py-2.5 px-3 text-right font-bold text-slate-500">예상 소계 합계 가액</td>
                                <td className="py-2.5 px-3 text-right font-mono text-[13px] text-blue-600">
                                  {formatCurrency(calculatePresetTotal(selectedPreset))}원
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>

                        {/* Application action panel */}
                        <div className="mt-auto bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row gap-3 pt-4">
                          <div className="flex-1 flex gap-2">
                            <button
                              onClick={() => handleApply('replace')}
                              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition active:scale-97 shadow-sm shadow-blue-100"
                            >
                              <FileCheck size={14} />
                              새 품목으로 대체 적용
                            </button>
                            <button
                              onClick={() => handleApply('append')}
                              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition active:scale-97 shadow-sm shadow-emerald-100"
                            >
                              <Plus size={14} />
                              현재 목록 하단에 추가
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
                        <Library size={32} className="text-slate-200 mb-2" />
                        <p className="text-xs font-bold">확인할 프리셋을 선택해 주십시오.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  
                  /* SAVE PANEL: Dynamic creation from Editor state */
                  <div className="flex-1 p-6 overflow-y-auto max-w-[500px] mx-auto w-full">
                    {!saveSuccess ? (
                      <form onSubmit={handleSaveCurrentAsPreset} className="flex flex-col gap-4">
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-slate-700 leading-normal">
                          <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                          <div className="text-xs font-normal">
                            <span className="font-bold text-slate-800 block mb-0.5">현재 편집기의 품목들을 묶어 저장합니다</span>
                            현재 입력 테이블에 기재된 품목 <strong>{currentItems.filter(i => i.name.trim() !== '').length}개</strong>를 나만의 프리셋 패키지로 보관합니다. 사양이나 단가 구성을 언제든 편리하게 재호출할 수 있습니다.
                          </div>
                        </div>

                        {/* Preset Name */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-500">프리셋 이름 *</label>
                          <input
                            type="text"
                            value={saveTitle}
                            onChange={(e) => setSaveTitle(e.target.value)}
                            required
                            placeholder="예: 촬영 및 조명 세트 A패키지"
                            className="bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 rounded-lg px-3 py-2 text-xs outline-none text-slate-800 transition font-medium"
                          />
                        </div>

                        {/* Category Selector */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-500">분류 카테고리</label>
                          <div className="grid grid-cols-4 gap-2">
                            {(['video', 'design', 'marketing', 'rental'] as const).map(cat => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setSaveCategory(cat)}
                                className={`py-2 px-1 text-xs font-bold border rounded-lg transition ${saveCategory === cat ? 'bg-blue-50 border-blue-400 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100/50'}`}
                              >
                                {getCategoryLabel(cat)}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-500">설명 / 세부 메모</label>
                          <textarea
                            value={saveDescription}
                            onChange={(e) => setSaveDescription(e.target.value)}
                            rows={3}
                            placeholder="이 패키지 프리셋에 대한 간략한 명세와 사용 용도를 기술하십시오."
                            className="bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 rounded-lg px-3 py-2 text-xs outline-none text-slate-700 transition resize-none leading-relaxed"
                          />
                        </div>

                        {/* Quick preview list of articles to be stored */}
                        <div className="mt-2 border border-slate-100 rounded-xl p-3 bg-slate-50/50 text-[11px]">
                          <div className="font-bold text-slate-500 mb-1.5">저장 대상 품목 리스트 요약 ({currentItems.filter(i => i.name.trim() !== '').length}개):</div>
                          <div className="max-h-24 overflow-y-auto divide-y divide-slate-100">
                            {currentItems.filter(i => i.name.trim() !== '').map((item, id) => (
                              <div key={id} className="py-1 flex justify-between font-medium text-slate-700">
                                <span className="truncate pr-4">{item.name}</span>
                                <span className="font-mono text-slate-500 shrink-0">{item.qty}개 × {formatCurrency(item.price)}원</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition active:scale-97 shadow-sm shadow-blue-100 mt-2 flex items-center justify-center gap-1.5"
                        >
                          <Plus size={14} />
                          프리셋으로 공식 저장하기
                        </button>
                      </form>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                        >
                          <CheckCircle2 size={44} className="text-emerald-500 mb-3" />
                        </motion.div>
                        <h4 className="text-sm font-bold text-slate-800">프리셋 저장이 성공적으로 완료되었습니다!</h4>
                        <p className="text-[11px] text-slate-500 mt-1">곧이어 나의 프리셋 목록에서 신속하게 호출할 수 있습니다.</p>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
