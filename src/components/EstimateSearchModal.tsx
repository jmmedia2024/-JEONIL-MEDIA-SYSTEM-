import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Estimate } from '../types';
import { formatCurrency } from '../constants';
import { 
  X, 
  Search, 
  Trash2, 
  FolderOpen, 
  Calendar, 
  User, 
  ArrowUpDown, 
  TrendingUp, 
  Database, 
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

interface EstimateSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  estimates: Estimate[];
  onLoadEstimate: (estimate: Estimate) => void;
  onDeleteEstimate: (id: string) => void;
}

export const EstimateSearchModal: React.FC<EstimateSearchModalProps> = ({
  isOpen,
  onClose,
  estimates,
  onLoadEstimate,
  onDeleteEstimate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'price-desc' | 'price-asc'>('date-desc');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('all');

  // Reset inputs when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSortBy('date-desc');
      setSelectedCompanyFilter('all');
    }
  }, [isOpen]);

  // Compute calculated values for each estimate to make searching & filtering instantaneous
  const enrichedEstimates = useMemo(() => {
    return estimates.map(est => {
      const subtotal = est.items.reduce((sum, item) => sum + item.qty * item.price, 0);
      const tax = est.taxIncluded ? Math.round((subtotal - est.discount) * (est.taxRate / 100)) : 0;
      const total = subtotal - est.discount + tax;
      
      return {
        ...est,
        calculatedTotal: total,
        itemCount: est.items.length,
        searchText: `${est.title} ${est.estimateNumber} ${est.customer.company} ${est.customer.name} ${est.customer.phone} ${est.customer.email}`.toLowerCase()
      };
    });
  }, [estimates]);

  // Extract all unique customer company names for filtering dropdown
  const uniqueCompanies = useMemo(() => {
    const list = new Set<string>();
    estimates.forEach(est => {
      if (est.customer.company && est.customer.company.trim()) {
        list.add(est.customer.company.trim());
      }
    });
    return Array.from(list).sort();
  }, [estimates]);

  // Handle Search and Filter application
  const filteredAndSorted = useMemo(() => {
    let result = [...enrichedEstimates];

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(est => est.searchText.includes(q));
    }

    // Company filter match
    if (selectedCompanyFilter !== 'all') {
      result = result.filter(est => est.customer.company === selectedCompanyFilter);
    }

    // Sorting implementation
    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === 'price-desc') {
        return b.calculatedTotal - a.calculatedTotal;
      }
      if (sortBy === 'price-asc') {
        return a.calculatedTotal - b.calculatedTotal;
      }
      return 0;
    });

    return result;
  }, [enrichedEstimates, searchQuery, selectedCompanyFilter, sortBy]);

  // Calculate high level stats from search matches
  const statistics = useMemo(() => {
    const count = filteredAndSorted.length;
    const totalSum = filteredAndSorted.reduce((sum, est) => sum + est.calculatedTotal, 0);
    return { count, totalSum };
  }, [filteredAndSorted]);

  const handleLoad = (est: Estimate) => {
    onLoadEstimate(est);
    onClose();
  };

  const handleConfirmDelete = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`[${title || '무제'}] 견적서 발행 이력을 영구적으로 삭제하시겠습니까?\n삭제 후에는 복구할 수 없습니다.`)) {
      onDeleteEstimate(id);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Blur background overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            id="search-modal-backdrop"
          />

          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Modal Body container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col h-[85vh] max-h-[85vh]"
              id="search-modal-body"
            >
              {/* Header Bar */}
              <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-xl text-white">
                    <Database size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base leading-none">발행 견적서 전체 통합 검색기</h3>
                    <p className="text-xs text-slate-300 mt-1">㈜전일미디어가 발행하여 로컬 환경에 축적한 모든 견적서를 한눈에 찾고 불러옵니다.</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Advanced Search & Filtering Control Panel */}
              <div className="bg-slate-50 border-b border-slate-200/60 p-4 sm:p-5 flex flex-col gap-3.5">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  
                  {/* Search Input Box */}
                  <div className="md:col-span-6 relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Search size={15} />
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs outline-none text-slate-800 font-medium shadow-sm transition"
                      placeholder="건명, 견적번호, 고객사, 담당자 성명, 연락처 검색..."
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-[10px] font-bold"
                      >
                        지우기
                      </button>
                    )}
                  </div>

                  {/* Company filter */}
                  <div className="md:col-span-3 relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                      <Filter size={13} />
                    </span>
                    <select
                      value={selectedCompanyFilter}
                      onChange={(e) => setSelectedCompanyFilter(e.target.value)}
                      className="w-full pl-8.5 pr-8 py-2.5 bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs outline-none text-slate-700 font-medium appearance-none select-arrow shadow-sm cursor-pointer"
                    >
                      <option value="all">모든 고객사 전체 조회</option>
                      {uniqueCompanies.map(company => (
                        <option key={company} value={company}>{company}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sorter */}
                  <div className="md:col-span-3 relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                      <ArrowUpDown size={13} />
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full pl-8.5 pr-8 py-2.5 bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs outline-none text-slate-700 font-medium appearance-none select-arrow shadow-sm cursor-pointer"
                    >
                      <option value="date-desc">날짜 최신순 (최근 발행)</option>
                      <option value="date-asc">날짜 오래된순</option>
                      <option value="price-desc">견적 금액 높은순</option>
                      <option value="price-asc">견적 금액 낮은순</option>
                    </select>
                  </div>

                </div>

                {/* Real-time search analytics badges */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
                  <div className="flex items-center gap-4 text-slate-600 font-medium">
                    <span className="flex items-center gap-1">
                      총 검색 결과: <strong className="text-blue-600 font-black">{statistics.count}건</strong>
                      {estimates.length > 0 && <span className="text-slate-300">/전체 {estimates.length}건</span>}
                    </span>
                    <span className="text-slate-300 hidden sm:inline">|</span>
                    <span className="flex items-center gap-1">
                      검색 합계 금액: <strong className="text-slate-800 font-bold font-mono">{formatCurrency(statistics.totalSum)}원</strong>
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5">
                    <CheckCircle size={12} className="text-emerald-500" /> 로컬 스토리지 실시간 연동 중
                  </div>
                </div>
              </div>

              {/* Listing Area */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50/20">
                {filteredAndSorted.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                    <div className="p-4 bg-slate-100 rounded-full mb-3.5 border border-slate-200/50">
                      <AlertCircle size={28} className="text-slate-400" />
                    </div>
                    <p className="text-sm font-bold text-slate-700 mb-1">검색 조건과 일치하는 견적서가 없습니다.</p>
                    <p className="text-[11px] text-slate-400 max-w-sm leading-normal">
                      검색어를 바꾸거나 필터를 재설정해 보십시오. 만일 보관함이 아예 비어있다면 에디터에서 작성을 완료하고 [보관함에 저장하기] 버튼을 눌러 추가하십시오.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3.5">
                    {filteredAndSorted.map((est) => (
                      <div
                        key={est.id}
                        onClick={() => handleLoad(est)}
                        className="group bg-white border border-slate-200/75 hover:border-blue-400 hover:shadow-lg rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition duration-200 cursor-pointer text-left relative overflow-hidden"
                      >
                        {/* Selected overlay glow line */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition" />

                        {/* General Info Column */}
                        <div className="flex-1 min-w-0">
                          {/* Top metadata tags combo */}
                          <div className="flex items-center gap-2 flex-wrap text-[10px] font-bold text-slate-400 mb-2">
                            <span className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-sans">
                              <Calendar size={11} className="text-slate-500" />
                              {est.date}
                            </span>
                            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-mono">
                              {est.estimateNumber}
                            </span>
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                              <User size={10} className="text-slate-500" />
                              {est.customer.company || '수신자 불명'}
                            </span>
                          </div>

                          {/* Subject line Title */}
                          <h4 className="text-[13px] sm:text-sm font-extrabold text-slate-800 leading-snug group-hover:text-blue-600 transition truncate pr-4">
                            {est.title || '제목이 정의되지 않은 견적서'}
                          </h4>

                          {/* items count and detail summary */}
                          <div className="mt-1.5 flex items-center gap-2 text-[10.5px] text-slate-500">
                            <span className="font-semibold text-slate-600 bg-slate-100 shrink-0 rounded px-1.5 py-0.5">품목 {est.itemCount}개</span>
                            <span className="truncate max-w-[280px] sm:max-w-md text-slate-400 font-medium">
                              ({est.items.filter(i => i.name).map(i => i.name).join(', ') || '-'})
                            </span>
                          </div>
                        </div>

                        {/* Cost & Load actions Column */}
                        <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 shrink-0">
                          <div className="text-right">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">견적 계약 이행가액</div>
                            <div className="text-sm sm:text-base font-black text-blue-600 font-mono tracking-tight">
                              {formatCurrency(est.calculatedTotal)}원
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5">
                            {/* Delete button option */}
                            <button
                              onClick={(e) => handleConfirmDelete(est.id, est.title, e)}
                              className="p-2 bg-slate-50 hover:bg-red-50 text-slate-300 hover:text-red-500 border border-slate-100 hover:border-red-100 rounded-lg transition"
                              title="보관 이력 삭제"
                            >
                              <Trash2 size={13.5} />
                            </button>

                            {/* Load indicator Button */}
                            <button
                              onClick={() => handleLoad(est)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition font-extrabold rounded-lg text-[11px]"
                            >
                              불러오기
                              <ExternalLink size={11} />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom bar inside modal */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between flex-wrap gap-2.5">
                <span>총 축적 이력 규모 : <strong>{estimates.length}건</strong></span>
                <span>불러올 항목을 클릭하면 즉시 메인 에디터 및 인쇄용 템플릿에 실시간 반영됩니다.</span>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
