import React, { useState } from 'react';
import { EstimateItem, EstimatePreset } from '../types';
import { ESTIMATE_PRESETS, formatCurrency } from '../constants';
import { Plus, Trash, ArrowUp, ArrowDown, Sparkles, AlertCircle, ShoppingBag, FolderHeart, Bookmark, Library } from 'lucide-react';
import { PresetLibraryModal } from './PresetLibraryModal';

interface EstimateItemsTableProps {
  items: EstimateItem[];
  onChange: (items: EstimateItem[]) => void;
  taxIncluded: boolean;
  onTaxToggle: (included: boolean) => void;
  discount: number;
  onDiscountChange: (discount: number) => void;
}

export const EstimateItemsTable: React.FC<EstimateItemsTableProps> = ({
  items,
  onChange,
  taxIncluded,
  onTaxToggle,
  discount,
  onDiscountChange,
}) => {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  // Add a blank row
  const handleAddItem = () => {
    const newItem: EstimateItem = {
      id: crypto.randomUUID(),
      name: '',
      spec: '',
      qty: 1,
      price: 0,
      note: '',
    };
    onChange([...items, newItem]);
  };

  // Remove a row
  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      // Keep at least one item, just clear it
      onChange([
        {
          id: crypto.randomUUID(),
          name: '',
          spec: '',
          qty: 1,
          price: 0,
          note: '',
        },
      ]);
      return;
    }
    onChange(items.filter((item) => item.id !== id));
  };

  // Update a field in a row
  const handleUpdateField = (id: string, key: keyof EstimateItem, value: any) => {
    onChange(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [key]: value };
          // Ensure numbers are numeric but allow loose entry (including empty/0) for optimal user experience
          if (key === 'qty') {
            const parsed = parseInt(value);
            updated.qty = isNaN(parsed) ? 0 : Math.max(0, parsed);
          }
          if (key === 'price') {
            const parsed = parseInt(value);
            updated.price = isNaN(parsed) ? 0 : Math.max(0, parsed);
          }
          return updated;
        }
        return item;
      })
    );
  };

  // Reorder items: Move Up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(index - 1, 0, moved);
    onChange(newItems);
  };

  // Reorder items: Move Down
  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(index + 1, 0, moved);
    onChange(newItems);
  };

  // Load a preset template package
  const handleLoadPreset = (preset: EstimatePreset) => {
    const freshItems: EstimateItem[] = preset.items.map((item) => ({
      ...item,
      id: crypto.randomUUID(),
    }));
    onChange(freshItems);
  };

  // Advanced load from PresetLibraryModal (Replace or Append)
  const handleLoadPresetAdv = (presetItems: Omit<EstimateItem, 'id'>[], mode: 'replace' | 'append') => {
    const freshItems = presetItems.map((item) => ({
      ...item,
      id: crypto.randomUUID(),
    }));

    if (mode === 'replace') {
      onChange(freshItems);
    } else {
      // Append: Filter out empty placeholder lines first
      const cleanCurrent = items.filter(i => i.name.trim() !== '' || i.price > 0);
      onChange([...cleanCurrent, ...freshItems]);
    }
  };

  // Calculate calculations
  const subtotal = items.reduce((acc, item) => acc + item.qty * item.price, 0);
  const taxAmount = taxIncluded ? Math.round((subtotal - discount) * 0.1) : 0;
  const finalTotal = subtotal - discount + taxAmount;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      {/* Table Header / Action Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-4 bg-blue-600 rounded-full shrink-0"></span>
          <div>
            <h2 className="font-bold text-slate-800 text-sm">견적 세부 내역</h2>
            <p className="text-[11px] text-slate-400">품목구성을 변경하거나 미디어 패키지 템플릿을 신속히 로드하세요.</p>
          </div>
        </div>

        {/* Preset Packages / Library Trigger */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsLibraryOpen(true)}
            className="flex items-center gap-1 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 font-bold rounded-lg text-xs transition shadow-sm active:scale-95"
            title="자주 쓰는 업무 패키지 및 사용자 지정 프리셋 모음 관리"
          >
            <Library size={13} />
            프리셋 라이브러리 열기
          </button>

          <div className="hidden lg:flex items-center gap-2 border-l border-slate-100 pl-3">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
              <Sparkles size={11} className="text-amber-500" /> 간편적용:
            </span>
            <div className="flex gap-1">
              {ESTIMATE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleLoadPreset(p)}
                  className="text-[10px] font-bold px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-slate-600 hover:text-slate-900 transition"
                  title={p.description}
                >
                  {p.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-3 w-[6%] text-center">정렬</th>
              <th className="py-2.5 px-3 w-[30%]">품목(품명) *</th>
              <th className="py-2.5 px-3 w-[22%]">규격 및 사양 / 세부내역</th>
              <th className="py-2.5 px-3 w-[8%] text-center">수량</th>
              <th className="py-2.5 px-3 w-[15%] text-right">단가 *</th>
              <th className="py-2.5 px-3 w-[14%] text-right font-bold text-blue-600">공급 가액</th>
              <th className="py-2.5 px-3 w-[5%] text-center">삭제</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map((item, idx) => (
              <tr key={item.id} className="group hover:bg-slate-50/50 transition duration-150">
                {/* Reorder Buttons */}
                <td className="py-2.5 px-3 align-middle text-center">
                  <div className="flex items-center justify-center gap-1 opacity-40 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0}
                      className="p-1 hover:bg-white border border-slate-200 rounded disabled:opacity-30 disabled:pointer-events-none text-slate-600 transition"
                    >
                      <ArrowUp size={10} />
                    </button>
                    <button
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === items.length - 1}
                      className="p-1 hover:bg-white border border-slate-200 rounded disabled:opacity-30 disabled:pointer-events-none text-slate-600 transition"
                    >
                      <ArrowDown size={10} />
                    </button>
                  </div>
                </td>

                {/* Item Name */}
                <td className="py-2.5 px-3 align-middle">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateField(item.id, 'name', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs outline-none text-slate-800 transition font-medium"
                    placeholder="예: 촬영 감독 등"
                  />
                </td>

                {/* Spec */}
                <td className="py-2.5 px-3 align-middle">
                  <input
                    type="text"
                    value={item.spec}
                    onChange={(e) => handleUpdateField(item.id, 'spec', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs outline-none text-slate-700 transition"
                    placeholder="예: 4K 촬영 / 고정 1인"
                  />
                </td>

                {/* Quantity */}
                <td className="py-2.5 px-3 align-middle">
                  <input
                    type="number"
                    value={item.qty === 0 ? '' : item.qty}
                    onChange={(e) => handleUpdateField(item.id, 'qty', e.target.value)}
                    className="w-full text-center bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 rounded-lg py-1.5 text-xs outline-none text-slate-800 transition font-mono"
                    min="1"
                  />
                </td>

                {/* Price */}
                <td className="py-2.5 px-3 align-middle">
                  <div className="relative">
                    <input
                      type="number"
                      value={item.price === 0 ? '' : item.price}
                      onChange={(e) => handleUpdateField(item.id, 'price', e.target.value)}
                      className="w-full text-right bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 rounded-lg pl-2 pr-7 py-1.5 text-xs outline-none text-slate-800 font-mono transition"
                      placeholder="0"
                      min="0"
                    />
                    <span className="absolute right-2.5 inset-y-0 flex items-center text-[10px] text-slate-400 font-normal">원</span>
                  </div>
                  {item.price > 0 && (
                    <div className="text-[10px] text-slate-400 text-right mt-0.5 font-mono">
                      {formatCurrency(item.price)}원
                    </div>
                  )}
                </td>

                {/* Calculated Row Total */}
                <td className="py-2.5 px-3 align-middle text-right text-xs font-bold text-slate-700 font-mono">
                  {formatCurrency(item.qty * item.price)}원
                </td>

                {/* Delete Button */}
                <td className="py-2.5 px-3 align-middle text-center">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="항목 제거"
                  >
                    <Trash size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Control / Calc Summary */}
      <div className="mt-4 flex flex-col md:flex-row items-start justify-between gap-6 pt-5 border-t border-slate-100">
        {/* Left Control Column */}
        <div className="flex flex-col gap-3 w-full md:w-auto">
          <div className="flex flex-wrap items-center gap-2">
            {/* Add Row Button */}
            <button
              onClick={handleAddItem}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition active:scale-95 shadow-sm shadow-blue-100"
            >
              <Plus size={14} /> 품목 추가하기
            </button>

            {/* Save Current as Preset Button */}
            <button
              onClick={() => setIsLibraryOpen(true)}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition active:scale-95"
              title="현재 작성된 품목 구성을 마이 프리셋 보관함에 즉시 축적합니다."
            >
              <Bookmark size={13} className="text-blue-600" /> 현재 품목 프리셋 저장
            </button>
          </div>

          {/* Quick Notice */}
          <div className="flex items-start gap-2 max-w-sm mt-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <AlertCircle size={14} className="text-blue-500 mt-0.5 shrink-0" />
            <span className="text-[11px] text-slate-500 leading-relaxed font-normal">
              품목명과 단가를 자유롭게 입력하실 수 있으며, 해당 품목의 공급 가액은 자동으로 산출됩니다.
            </span>
          </div>
        </div>

        {/* Right Financial Calculation Table */}
        <div className="w-full md:w-80 bg-slate-55 p-4 rounded-xl border border-slate-200 flex flex-col gap-3">
          {/* Subtotal */}
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-medium">총 공급 가액</span>
            <span className="font-bold text-slate-800 font-mono">{formatCurrency(subtotal)}원</span>
          </div>

          {/* Discount */}
          <div className="flex items-center justify-between gap-4 text-xs text-slate-600">
            <span className="font-medium">특별 할인 금액</span>
            <div className="relative w-36">
              <input
                type="number"
                value={discount === 0 ? '' : discount}
                onChange={(e) => onDiscountChange(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full text-right bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-500 rounded-lg pl-2 pr-7 py-1 text-xs outline-none text-red-600 font-bold font-mono"
                placeholder="0"
                min="0"
                max={subtotal}
              />
              <span className="absolute right-2 inset-y-0 flex items-center text-[10px] text-slate-400">원</span>
            </div>
          </div>

          {/* VAT Flag Toggle */}
          <div className="flex items-center justify-between pt-1 text-xs text-slate-600">
            <span className="font-medium">부가세(VAT) 설정</span>
            <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
              <button
                onClick={() => onTaxToggle(true)}
                className={`px-2 py-1 rounded transition ${taxIncluded ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                10% 포함
              </button>
              <button
                onClick={() => onTaxToggle(false)}
                className={`px-2 py-1 rounded transition ${!taxIncluded ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                별도 / 없음
              </button>
            </div>
          </div>

          {/* VAT Amount (Calculated) */}
          {taxIncluded && (
            <div className="flex items-center justify-between text-xs text-slate-500 pl-2 border-l-2 border-blue-200">
              <span>부가세 (10%)</span>
              <span className="font-mono">{formatCurrency(taxAmount)}원</span>
            </div>
          )}

          {/* Final Payable Total */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-sm font-bold text-slate-800">
            <span>최종 합계 금액</span>
            <span className="text-base text-blue-600 font-bold font-mono">{formatCurrency(finalTotal)}원</span>
          </div>
        </div>
      </div>

      {/* Preset Library Popup Dialog Modals */}
      <PresetLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        currentItems={items}
        onLoadPreset={handleLoadPresetAdv}
      />
    </div>
  );
};
