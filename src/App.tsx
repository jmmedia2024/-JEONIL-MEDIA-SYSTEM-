/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Estimate, CompanyInfo, CustomerInfo, EstimateItem } from './types';
import { DEFAULT_COMPANY_INFO, ESTIMATE_PRESETS } from './constants';
import { CompanyInfoForm } from './components/CompanyInfoForm';
import { CustomerInfoForm } from './components/CustomerInfoForm';
import { EstimateItemsTable } from './components/EstimateItemsTable';
import { EstimatePrintView } from './components/EstimatePrintView';
import { EstimateHistory } from './components/EstimateHistory';
import { EstimateSearchModal } from './components/EstimateSearchModal';
import { 
  Printer, 
  Save, 
  Trash2, 
  FilePlus, 
  ArrowLeftRight, 
  Video, 
  Settings, 
  Clock, 
  Check, 
  Sparkles,
  HelpCircle,
  Search
} from 'lucide-react';

export default function App() {
  // State for active estimate
  const [estimate, setEstimate] = useState<Estimate>({
    id: 'draft-active',
    estimateNumber: '',
    title: '홍보 브랜드 영상 콘텐츠 기획 및 포스트 에디팅 용역',
    date: '2026-06-20',
    validityDays: 30,
    customer: {
      name: '홍길동 부장',
      company: '㈜한국영상진흥공사',
      phone: '010-9876-5432',
      email: 'hd.hong@koreamedia.or.kr',
      address: '서울특별시 마포구 월드컵북로 400',
    },
    company: { ...DEFAULT_COMPANY_INFO },
    items: [
      { id: '1', name: '브랜드 채널 홍보영상 시나리오 기획 및 스토리보딩', spec: '1편 (5~8분 분량) / 시안 2개', qty: 1, price: 500000, note: '수정 한도 2회' },
      { id: '2', name: '4K 고품질 메인 카메라 및 서브 카메라 촬영 세션', spec: '가용 시간 6H / 전문 감독 1인 배정', qty: 2, price: 700000, note: '조명 및 짐벌 리그 동반' },
      { id: '3', name: '종합 후반 작업 (컷편집, 색보정 및 사운드 오프 계약)', spec: '최종 납품 1편 / 자막 일괄 삽입', qty: 1, price: 800000, note: '로고 인트로 3D 효과 삽입' },
      { id: '4', name: 'SNS 맞춤형 인트로 카드 및 썸네일 그래픽 디자인', spec: '고해상도 대표 포스터 JPG / 1종', qty: 1, price: 100000, note: '헤드라인 라이선스 서체 활용' },
    ],
    discount: 100000,
    taxIncluded: true,
    taxRate: 10,
    notes: '1. 본 견적서는 발행일로부터 30일간 유효합니다.\n2. 촬영 개시 후 기획 변경이나 과도한 자막 변경 요청 시 별도의 용역비가 실비 청구될 수 있습니다.\n3. 착수금 50% 진행 및 최종 검수 완료 후 잔금 50% 결제 기준입니다.',
    status: 'draft',
    createdAt: new Date().toISOString(),
  });

  // State for estimate archive list
  const [estimatesList, setEstimatesList] = useState<Estimate[]>([]);
  // Search modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // Layout toggles: 'split' | 'edit-only' | 'preview-only'
  const [layoutMode, setLayoutMode] = useState<'split' | 'edit-only' | 'preview-only'>('split');
  // Notification banner
  const [notification, setNotification] = useState<string | null>(null);

  // Load history list from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('jeonil_estimates');
    if (saved) {
      try {
        setEstimatesList(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse estimates history', e);
      }
    }
    
    // Generate initial unique quotation number if empty
    resetEstimateNumber();
  }, []);

  // Show disappearing banner notifications
  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Helper: auto-generate quotation code based on date
  const resetEstimateNumber = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const random = Math.floor(100 + Math.random() * 900); // 3 random digits
    const num = `JI-${yyyy}${mm}${dd}-${random}`;
    
    setEstimate(prev => ({
      ...prev,
      estimateNumber: num,
      date: `${yyyy}-${mm}-${dd}`
    }));
  };

  // Create a completely clean slate estimate
  const handleNewEstimate = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const random = Math.floor(100 + Math.random() * 900);
    
    setEstimate({
      id: crypto.randomUUID(),
      estimateNumber: `JI-${yyyy}${mm}${dd}-${random}`,
      title: '신규 미디어 용역 거래 견적서',
      date: `${yyyy}-${mm}-${dd}`,
      validityDays: 30,
      customer: {
        name: '담당자 본인 귀하',
        company: '신규 거래처명',
        phone: '',
        email: '',
        address: '',
      },
      company: { ...DEFAULT_COMPANY_INFO },
      items: [
        {
          id: crypto.randomUUID(),
          name: '미디어 편집 및 촬영 부문',
          spec: '표준규격 / 기본 단가',
          qty: 1,
          price: 500000,
          note: '',
        },
      ],
      discount: 0,
      taxIncluded: true,
      taxRate: 10,
      notes: '1. 견적 유효기간: 발행일로부터 30일 이내\n2. 지급 조건: 계약 성립 시 50%, 최종 납품 시 50%',
      status: 'draft',
      createdAt: new Date().toISOString(),
    });
    showToast('새로운 클린 견적서 에디터가 준비되었습니다.');
  };

  // Save the currently edited estimate into localStorage database
  const handleSaveToHistory = () => {
    // Basic verification
    if (!estimate.title) {
      alert('건명을 작성해 주세요.');
      return;
    }
    
    const existingIndex = estimatesList.findIndex(e => e.id === estimate.id || e.estimateNumber === estimate.estimateNumber);
    let updatedList = [...estimatesList];
    
    const currentRecord: Estimate = {
      ...estimate,
      id: (estimate.id === 'draft-active' || !estimate.id) ? crypto.randomUUID() : estimate.id,
      status: 'issued',
      createdAt: new Date().toISOString()
    };

    if (existingIndex > -1) {
      updatedList[existingIndex] = currentRecord;
      showToast('기존 보관함 이력이 업데이트(수정)되었습니다.');
    } else {
      updatedList.unshift(currentRecord);
      showToast('새견적서가 보관함(Local History)에 안전하게 저장되었습니다.');
    }

    setEstimatesList(updatedList);
    localStorage.setItem('jeonil_estimates', JSON.stringify(updatedList));
    setEstimate(currentRecord); // update id from active draft to unique id
  };

  // Load a saved estimate from log lists to central editor
  const handleLoadEstimate = (loaded: Estimate) => {
    setEstimate(loaded);
    showToast('보관함에서 견적서를 불러왔습니다.');
  };

  const handleDeleteEstimate = (id: string) => {
    const updated = estimatesList.filter(e => e.id !== id);
    setEstimatesList(updated);
    localStorage.setItem('jeonil_estimates', JSON.stringify(updated));
    showToast('견적서 발행 이력이 삭제되었습니다.');
  };

  const handleCustomerChange = (customer: CustomerInfo) => {
    setEstimate(prev => ({ ...prev, customer }));
  };

  const handleItemsChange = (items: EstimateItem[]) => {
    setEstimate(prev => ({ ...prev, items }));
  };

  const handleCompanyChange = (company: CompanyInfo) => {
    setEstimate(prev => ({ ...prev, company }));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 pb-12">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 border border-slate-800 text-white px-4 py-3 rounded-xl shadow-xl animate-bounce">
          <Check size={16} className="text-emerald-400" />
          <span className="text-xs font-semibold">{notification}</span>
        </div>
      )}

      {/* Top Header Section — Hidden on print */}
      <header className="print:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-6 bg-blue-600 rounded-full shrink-0"></span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-slate-900 tracking-tight font-sans">
                  JEONIL <span className="text-blue-600 font-black">MEDIA</span>
                </h1>
                <span className="text-[9px] font-extrabold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full uppercase tracking-wider font-sans">SYSTEM</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">견적서 통합 발행 시스템</p>
            </div>
          </div>

          {/* Configuration and controls */}
          <div className="flex items-center gap-2.5">
            {/* Split viewport responsive triggers */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-[11px] font-bold">
              <button
                onClick={() => setLayoutMode('split')}
                className={`px-3 py-1.5 rounded-md transition ${layoutMode === 'split' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                분할 화면
              </button>
              <button
                onClick={() => setLayoutMode('edit-only')}
                className={`px-3 py-1.5 rounded-md transition ${layoutMode === 'edit-only' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                에디션 전용
              </button>
              <button
                onClick={() => setLayoutMode('preview-only')}
                className={`px-3 py-1.5 rounded-md transition ${layoutMode === 'preview-only' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                인쇄지 미리보기
              </button>
            </div>

            {/* Past estimates unified lookup trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition duration-150 active:scale-95 shadow-sm shadow-slate-100"
              title="발행해서 보관해 둔 이전 견적서 검색 및 불러오기"
            >
              <Search size={13} className="text-blue-400" />
              견적서 찾아보기 ({estimatesList.length})
            </button>

            {/* Print trigger shortcut */}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-100 font-bold rounded-lg text-xs text-blue-600 transition"
            >
              <Printer size={13} /> 인쇄하기
            </button>
          </div>
        </div>
      </header>

      {/* Main layout contents */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 print:mt-0 print:p-0">
        
        {/* Welcome Section - Banner */}
        <div className="print:hidden mb-6 bg-slate-900 text-white rounded-xl p-6 relative overflow-hidden shadow-md">
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_bottom_right,var(--color-blue-400),transparent)] pointer-events-none" />
          <div className="max-w-2xl">
            <span className="bg-blue-500/10 text-blue-400 font-bold tracking-wider px-2.5 py-1 rounded-full text-[9px] mb-3 inline-block border border-blue-500/10 uppercase font-sans">
              ⚡ SMART DIGITAL SYSTEM
            </span>
            <h2 className="text-xl font-extrabold tracking-tight mb-2">원스톱 인쇄 및 미디어 발행 엔진</h2>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              좌측 폼에 입력하는 규격 정보가 우측 인쇄용 실시간 A4 문서에 오차 없이 즉각 반영됩니다.
              자체 미디어 서비스 패키지를 신속히 로드하여 전일미디어 견적서를 완성하고 발행 이력을 저장하세요.
            </p>
          </div>
        </div>

        {/* Outer Split Wrapper */}
        <div className={`grid grid-cols-1 gap-6 print:block ${
          layoutMode === 'split' ? 'lg:grid-cols-12' : 'lg:grid-cols-1'
        }`}>
          
          {/* LEFT: Forms Inputs Column (Editor) — Hidden completely if preview-only is toggled */}
          <div className={`print:hidden space-y-6 ${
            layoutMode === 'split' ? 'lg:col-span-6' : layoutMode === 'edit-only' ? 'w-full' : 'hidden'
          }`}>
            
            {/* Core document meta options */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <span className="w-1.5 h-4 bg-blue-600 rounded-full shrink-0"></span>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">기본 정보 입력</h3>
                  <p className="text-[11px] text-slate-400">결의자들에게 상정할 제목 및 만기를 정의합니다.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Proposal Title */}
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">건 명 (견적 사항 건목) *</label>
                  <input
                    type="text"
                    value={estimate.title}
                    onChange={(e) => setEstimate(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-bold text-slate-800"
                    placeholder="예: 브랜드 시네마틱 영상 기획 및 촬영"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">견적 발행 일자</label>
                  <input
                    type="date"
                    value={estimate.date}
                    onChange={(e) => setEstimate(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition outline-none text-slate-800 font-mono font-medium"
                  />
                </div>

                {/* Estimate Number */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">견적 계약 번호</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={estimate.estimateNumber}
                      onChange={(e) => setEstimate(prev => ({ ...prev, estimateNumber: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-[11px] focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition outline-none text-slate-800 font-mono"
                      placeholder="JI-2026..."
                    />
                    <button
                      onClick={resetEstimateNumber}
                      className="px-2.5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg text-[10px] font-bold shrink-0 transition"
                      title="고유 번호 재산출"
                    >
                      갱신
                    </button>
                  </div>
                </div>

                {/* Validity Period */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">견적 유효 기간</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={estimate.validityDays}
                      onChange={(e) => setEstimate(prev => ({ ...prev, validityDays: Math.max(1, parseInt(e.target.value) || 30) }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-7 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition outline-none text-slate-800"
                    />
                    <span className="absolute right-2.5 inset-y-0 flex items-center text-[10px] text-slate-400 font-bold">일</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipient Details (Customer) */}
            <CustomerInfoForm info={estimate.customer} onChange={handleCustomerChange} />

            {/* Items Matrix */}
            <EstimateItemsTable 
              items={estimate.items} 
              onChange={handleItemsChange}
              taxIncluded={estimate.taxIncluded}
              onTaxToggle={(included) => setEstimate(prev => ({ ...prev, taxIncluded: included }))}
              discount={estimate.discount}
              onDiscountChange={(discount) => setEstimate(prev => ({ ...prev, discount }))}
            />

            {/* Terms and conditions and payment account details */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <span className="w-1.5 h-4 bg-blue-600 rounded-full shrink-0"></span>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">비고사항 및 약정사항 기재</h3>
                  <p className="text-[11px] text-slate-400">지급 거래 성립을 위한 추가 계정이나 유의사항을 적어둡니다.</p>
                </div>
              </div>

              <div>
                <textarea
                  value={estimate.notes}
                  onChange={(e) => setEstimate(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition outline-none text-slate-700 leading-relaxed"
                  placeholder="특약사항을 자유롭게 입력해 주세요."
                />
              </div>
            </div>

            {/* Company Info (Jeonil Media default settings) */}
            <CompanyInfoForm info={estimate.company} onChange={handleCompanyChange} />

            {/* Direct primary save draft action container */}
            <div className="flex flex-wrap gap-2.5 justify-end">
              <button
                onClick={handleNewEstimate}
                className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 font-bold rounded-lg text-xs text-slate-600 active:scale-95 transition"
              >
                신규 초기화
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200/50 font-bold rounded-lg text-xs text-slate-700 active:scale-95 transition"
                title="기존 로컬 보관함에 들어있는 견적 전체 조회 및 상세 통합 검색"
              >
                <Search size={13.5} className="text-blue-500" />
                보관 목록 검색 ({estimatesList.length})
              </button>
              
              <button
                onClick={handleSaveToHistory}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-md shadow-blue-100 hover:shadow-blue-200 transition active:scale-95 duration-150"
              >
                <Save size={14} />
                보관함에 저장하기
              </button>
            </div>

            {/* Estimate Archive Directory Panel */}
            <EstimateHistory 
              estimates={estimatesList} 
              onLoadEstimate={handleLoadEstimate}
              onDeleteEstimate={handleDeleteEstimate}
              onNewEstimate={handleNewEstimate}
            />

          </div>

          {/* RIGHT: Live printable viewport (A4 Sheet Layout representation) */}
          <div className={`print:w-full print:p-0 ${
            layoutMode === 'split' ? 'lg:col-span-6' : layoutMode === 'preview-only' ? 'w-full' : 'hidden'
          }`}>
            <div className="sticky top-20 print:static">
              {/* Desktop header label for side projection preview */}
              <div className="print:hidden flex items-center justify-between mb-4 bg-white/80 px-4 py-2.5 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles size={11} className="text-blue-500" /> 실시간 인쇄용 A4 미리보기
                </span>
                
                {layoutMode === 'split' && (
                  <button
                    onClick={() => setLayoutMode('preview-only')}
                    className="text-[10px] font-bold text-blue-600 hover:underline"
                  >
                    전체화면으로 보기
                  </button>
                )}
              </div>

              {/* Printable sheet element projection */}
              <div className="shadow-lg rounded-xl overflow-hidden border border-slate-200 print:border-0 print:rounded-none">
                <EstimatePrintView estimate={estimate} />
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Footer credits — Hidden when printing */}
      <footer className="print:hidden mt-20 border-t border-slate-200 py-8 bg-white text-center text-xs text-slate-400">
        <p className="font-bold text-slate-500 mb-1">㈜전일미디어 견적서 발행 시스템</p>
        <p>© 2026 Jeonil Media Company Co., Ltd. All rights reserved.</p>
      </footer>

      {/* Estimate Unified Search Modal */}
      <EstimateSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        estimates={estimatesList}
        onLoadEstimate={handleLoadEstimate}
        onDeleteEstimate={handleDeleteEstimate}
      />
    </div>
  );
}
