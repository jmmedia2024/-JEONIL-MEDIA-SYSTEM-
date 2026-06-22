import React, { useState } from 'react';
import { Estimate } from '../types';
import { formatCurrency } from '../constants';
import { Search, FolderOpen, Calendar, Trash2, ChevronRight, FileText, User, Tag, PlusCircle } from 'lucide-react';

interface EstimateHistoryProps {
  estimates: Estimate[];
  onLoadEstimate: (estimate: Estimate) => void;
  onDeleteEstimate: (id: string) => void;
  onNewEstimate: () => void;
}

export const EstimateHistory: React.FC<EstimateHistoryProps> = ({
  estimates,
  onLoadEstimate,
  onDeleteEstimate,
  onNewEstimate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter estimates by title, customer company, or customer name
  const filteredEstimates = estimates.filter((est) => {
    const q = searchQuery.toLowerCase();
    const titleMatch = est.title.toLowerCase().includes(q);
    const companyMatch = est.customer.company.toLowerCase().includes(q);
    const nameMatch = est.customer.name.toLowerCase().includes(q);
    const numMatch = est.estimateNumber.toLowerCase().includes(q);
    return titleMatch || companyMatch || nameMatch || numMatch;
  });

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-4 bg-blue-600 rounded-full shrink-0"></span>
            <div>
              <h2 className="font-bold text-slate-800 text-sm">발행 견적서 보관함</h2>
              <p className="text-[11px] text-slate-400">기존에 작성하고 저장한 견적서 이력을 관리합니다.</p>
            </div>
          </div>
          
          {/* Quick Create New */}
          <button
            onClick={onNewEstimate}
            className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
          >
            <PlusCircle size={13} /> 새 견적서 작성
          </button>
        </div>

        {/* Search Input bar */}
        <div className="relative mb-4">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search size={15} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition outline-none text-slate-800"
            placeholder="건명, 고객사명, 담당자명, 견적번호 검색..."
          />
        </div>

        {/* Log list elements */}
        <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
          {filteredEstimates.length === 0 ? (
            <div className="text-center py-10 px-4 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
              <FileText size={32} className="text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-medium">검색되거나 저장된 견적서가 없습니다.</p>
              <p className="text-[10px] text-slate-400 mt-1">우측 에디터에서 작성을 마친 뒤 [저장하기] 단추를 누르세요.</p>
            </div>
          ) : (
            filteredEstimates.map((est) => {
              // Calculate sum for each item in list
              const subtotal = est.items.reduce((sum, item) => sum + item.qty * item.price, 0);
              const tax = est.taxIncluded ? Math.round((subtotal - est.discount) * 0.1) : 0;
              const total = subtotal - est.discount + tax;

              return (
                <div
                  key={est.id}
                  className="group relative flex items-center justify-between p-3 bg-slate-50 hover:bg-white border hover:border-blue-200 rounded-lg transition duration-150 cursor-pointer shadow-sm hover:shadow-blue-50/50"
                  onClick={() => onLoadEstimate(est)}
                >
                  <div className="flex-grow pr-4">
                    {/* Top Row: Date, Customer, Number */}
                    <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-slate-400 font-medium mb-1.5">
                      <span className="flex items-center gap-0.5">
                        <Calendar size={11} /> {est.date}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-0.5 font-bold text-slate-500">
                        <User size={11} /> {est.customer.company || est.customer.name}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="bg-slate-200/50 text-slate-600 px-1 py-0.5 rounded text-[9px] font-mono">
                        {est.estimateNumber}
                      </span>
                    </div>

                    {/* Middle: Title */}
                    <div className="font-bold text-xs text-slate-800 mb-1 group-hover:text-blue-600 transition truncate max-w-[200px] md:max-w-xs">
                      {est.title || '제목 없음'}
                    </div>

                    {/* Cost Sum */}
                    <div className="text-xs font-bold text-blue-600 font-mono">
                      {formatCurrency(total)}원
                    </div>
                  </div>

                  {/* Right Actions columns */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Delete entry */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid loading estimate when aiming for deletion
                        if (confirm('이 저장된 견적서를 데이터베이스에서 삭제하시겠습니까?')) {
                          onDeleteEstimate(est.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100 transition duration-150"
                      title="저장 이력 삭제"
                    >
                      <Trash2 size={13} />
                    </button>
                    <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer Info of statistics */}
      {estimates.length > 0 && (
        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
          <span>총 보관 건수 : <strong>{estimates.length}건</strong></span>
          <span>보관 환경 : LocalStorage</span>
        </div>
      )}
    </div>
  );
};
