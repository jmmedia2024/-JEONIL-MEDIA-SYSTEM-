import React, { useRef } from 'react';
import { Estimate } from '../types';
import { numberToKorean, formatCurrency } from '../constants';
import { Printer, Download, Eye, FileSpreadsheet, FileDown } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface EstimatePrintViewProps {
  estimate: Estimate;
}

export const EstimatePrintView: React.FC<EstimatePrintViewProps> = ({ estimate }) => {
  const { company, customer, items, discount, taxIncluded, taxRate, notes, date, estimateNumber, title } = estimate;
  const printRef = useRef<HTMLDivElement>(null);

  // Compute values
  const subtotal = items.reduce((acc, item) => acc + item.qty * item.price, 0);
  const taxAmount = taxIncluded ? Math.round((subtotal - discount) * 0.1) : 0;
  const finalTotal = subtotal - discount + taxAmount;

  // Print command
  const handlePrint = () => {
    window.print();
  };

  // PDF Export using html2pdf.js
  const handleDownloadPDF = () => {
    if (!printRef.current) return;

    const element = printRef.current;
    const opt = {
      margin: 0,
      filename: `전일미디어_견적서_${estimateNumber}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };

    // Use html2pdf
    html2pdf().set(opt).from(element).save();
  };

  // Mock excel export
  const handleCSVExport = () => {
    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
    csvContent += '견적번호,건명,견적자,수신사,최종금액,일자\n';
    csvContent += `"${estimateNumber}","${title}","${company.name}","${customer.company || customer.name}",${finalTotal},"${date}"\n\n`;
    csvContent += '번호,품목명,규격사양,수량,단가,금액,비고\n';
    items.forEach((item, index) => {
      csvContent += `${index + 1},"${item.name}","${item.spec}",${item.qty},${item.price},${item.qty * item.price},"${item.note}"\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `전일미디어_견적서_${estimateNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pads the table to ensure a highly professional uniform height (total 6 rows)
  const minRows = 7;
  const paddedItems = [...items];
  while (paddedItems.length < minRows) {
    paddedItems.push({
      id: `empty-${paddedItems.length}`,
      name: '',
      spec: '',
      qty: 0,
      price: 0,
      note: '',
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Action panel when viewing inside the workspace */}
      <div className="print:hidden bg-slate-900 border border-slate-800 text-white rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">인쇄 및 출력 도구</div>
            <div className="text-xs font-bold text-slate-200">견적서 발행 준비가 완료되었습니다</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Export CSV button */}
          <button
            onClick={handleCSVExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-200 transition"
            title="엑셀 호환 데이터로 견적 내역 저장"
          >
            <FileSpreadsheet size={13} />
            CSV 다운로드
          </button>
          
          {/* PDF Download Button */}
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-xs font-bold text-white shadow-sm shadow-emerald-900 transition hover:scale-102 active:scale-95"
            title="고품질 PDF 파일로 즉시 다운로드"
          >
            <FileDown size={13} />
            PDF로 저장
          </button>
          
          {/* PDF/Print Trigger button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-bold text-white shadow-sm shadow-blue-900 transition hover:scale-102 active:scale-95"
          >
            <Printer size={13} />
            인쇄 및 PDF 저장
          </button>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl shadow-inner p-2 sm:p-4 md:p-6 print:bg-transparent print:border-0 print:p-0 print:shadow-none">
        {/* Actual paper simulation page container */}
        <div 
          ref={printRef}
          className="bg-white text-black p-8 sm:p-12 md:p-14 max-w-[210mm] mx-auto w-full aspect-[210/297] shadow-sm print:shadow-none print:p-0"
        >
        
        {/* Title Spacing */}
        <div className="text-center mb-8 relative">
          <h1 className="text-3xl font-extrabold tracking-[1.5em] text-black pr-[-1.5em] pl-6 border-b-4 border-black pb-2 inline-block">
            견 적 서
          </h1>
        </div>

        {/* Top Split Section: Recipient vs Provider Info Table */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start mb-8 text-xs font-normal leading-relaxed print:grid-cols-12">
          
          {/* Left: Recipient client clause */}
          <div className="md:col-span-6 flex flex-col justify-between h-full py-1 gap-4 print:col-span-6">
            <div className="flex flex-col gap-2">
              <div className="border-b border-black pb-2">
                <span className="text-sm font-bold block mb-1">
                  {customer.company ? `${customer.company} 귀중` : `${customer.name} 귀중`}
                </span>
                {customer.company && customer.name && (
                  <span className="text-[11px] text-slate-700 font-medium block">
                    수신인: {customer.name}
                  </span>
                )}
              </div>
              <div className="text-slate-700 text-[11px] space-y-1 mt-1">
                {customer.phone && <div>연락처: {customer.phone}</div>}
                {customer.email && <div>이메일: {customer.email}</div>}
                {customer.address && <div>주 소: {customer.address}</div>}
              </div>
            </div>

            <div className="mt-2 text-slate-800 text-[11px] font-medium italic">
              아래와 같이 견적서를 제출합니다.
            </div>
          </div>

          {/* Right: Vendor Korean Business details (공급자) */}
          <div className="md:col-span-6 print:col-span-6">
            <table className="w-full border-collapse border border-black text-[11px]">
              <tbody>
                <tr>
                  <td rowSpan={5} className="w-[8%] border border-black bg-slate-50 text-center font-bold px-1 py-4 text-[10px]">
                    공<br />급<br />자
                  </td>
                  <td className="w-[20%] border border-black bg-slate-50 text-center font-bold p-1">
                    등록번호
                  </td>
                  <td colSpan={3} className="border border-black p-1 text-center font-extrabold tracking-wider text-xs">
                    {company.regNumber}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black bg-slate-50 text-center font-bold p-1">
                    상호
                  </td>
                  <td className="w-[32%] border border-black p-1 text-center font-semibold">
                    {company.name}
                  </td>
                  <td className="w-[15%] border border-black bg-slate-50 text-center font-bold p-1">
                    대표
                  </td>
                  <td className="w-[25%] border border-black p-1 text-center font-semibold relative select-none">
                    {company.representative}
                    {/* Official Seal Watermark SVG */}
                    <div className="absolute right-2 -top-1 w-7 h-7 flex items-center justify-center opacity-85 pointer-events-none">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-red-500 fill-transparent stroke-current stroke-[4]">
                        <circle cx="50" cy="50" r="45" />
                        <circle cx="50" cy="50" r="38" className="stroke-[2]" />
                        <text x="50" y="45" dominantBaseline="middle" textAnchor="middle" className="fill-red-500 font-bold text-[18px] stroke-none tracking-tighter">전일</text>
                        <text x="50" y="65" dominantBaseline="middle" textAnchor="middle" className="fill-red-500 font-bold text-[18px] stroke-none tracking-tighter">미디어</text>
                      </svg>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-black bg-slate-50 text-center font-bold p-1">
                    소재지
                  </td>
                  <td colSpan={3} className="border border-black p-1 text-left text-[10px] pl-2">
                    {company.address}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black bg-slate-50 text-center font-bold p-1">
                    업태
                  </td>
                  <td className="border border-black p-1 text-center">
                    서비스, 도소매
                  </td>
                  <td className="border border-black bg-slate-50 text-center font-bold p-1">
                    종목
                  </td>
                  <td className="border border-black p-1 text-center text-[10px]">
                    동영상 제작, 인쇄
                  </td>
                </tr>
                <tr>
                  <td className="border border-black bg-slate-50 text-center font-bold p-1">
                    연락처
                  </td>
                  <td colSpan={3} className="border border-black p-1 text-left pl-2 text-[10px]">
                    전화 : {company.phone} / 이메일 : {company.email}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Date and Estimation Meta Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 text-[11px] items-center text-slate-700">
          <div>
            <span className="font-semibold text-black">견적일자:</span> {date}
          </div>
          <div className="md:text-right">
            <span className="font-semibold text-black">견적번호:</span> {estimateNumber}
          </div>
        </div>

        {/* 건명 Title of proposal */}
        <div className="border-t-2 border-b-2 border-black py-2.5 mb-5 flex items-center justify-between text-xs font-bold bg-slate-50/50">
          <span className="pl-2">건 명:</span>
          <span className="pr-4 text-black text-sm font-extrabold">{title || '미디어 제작 및 기술 용역 견적'}</span>
        </div>

        {/* Core Calculated Sum Banner */}
        <div className="border border-black bg-slate-100 p-3.5 mb-5 flex justify-between items-center text-xs text-black font-semibold">
          <div className="flex items-center gap-2">
            <span>합계금액 :</span>
            <span className="text-sm font-black underline tracking-wide">
              {numberToKorean(finalTotal)}
            </span>
          </div>
          <div className="text-right text-sm font-bold">
            ( ￦{formatCurrency(finalTotal)} ) {taxIncluded ? '부가세 포함' : '부가세 별도'}
          </div>
        </div>

        {/* Itemised Billing Grid Table */}
        <div className="mb-6 flex-grow">
          <table className="w-full border-collapse border border-black text-[11px]">
            <thead>
              <tr className="bg-slate-100 font-bold border-b border-black">
                <th className="border border-black py-1.5 w-[6%] text-center">번호</th>
                <th className="border border-black py-1.5 w-[38%] text-left pl-2">품목 및 내역</th>
                <th className="border border-black py-1.5 w-[20%] text-center">규격 및 사양</th>
                <th className="border border-black py-1.5 w-[8%] text-center">수량</th>
                <th className="border border-black py-1.5 w-[14%] text-right pr-2">단가 (원)</th>
                <th className="border border-black py-1.5 w-[14%] text-right pr-2">금액 (원)</th>
              </tr>
            </thead>
            <tbody>
              {paddedItems.map((item, index) => {
                const itemTotal = item.qty * item.price;
                const isReal = item.qty > 0 && item.price > 0;
                return (
                  <tr key={item.id} className="h-7 hover:bg-slate-50/50">
                    <td className="border border-black text-center text-slate-500">
                      {index + 1}
                    </td>
                    <td className="border border-black text-left pl-2 font-medium truncate max-w-0" title={item.name}>
                      {isReal ? item.name : ''}
                      {isReal && item.note && (
                        <span className="block text-[9px] text-slate-500 leading-none mt-0.5 font-normal">
                          ㄴ {item.note}
                        </span>
                      )}
                    </td>
                    <td className="border border-black text-center text-slate-600 truncate max-w-0" title={item.spec}>
                      {isReal ? item.spec : ''}
                    </td>
                    <td className="border border-black text-center">
                      {isReal ? item.qty : ''}
                    </td>
                    <td className="border border-black text-right pr-2 font-mono">
                      {isReal ? formatCurrency(item.price) : ''}
                    </td>
                    <td className="border border-black text-right pr-2 font-medium font-mono">
                      {isReal ? formatCurrency(itemTotal) : ''}
                    </td>
                  </tr>
                );
              })}
              
              {/* Financial calculations inside the document block */}
              <tr className="bg-slate-50/50">
                <td colSpan={4} rowSpan={3} className="border border-black p-3 text-left text-[10px] text-slate-500 align-top leading-relaxed select-block">
                  <div className="font-bold text-black mb-1">■ 주요 약정 및 비고사항:</div>
                  <div className="whitespace-pre-wrap text-[9px] text-slate-600">
                    {notes || '1. 본 견적금액은 견적일로부터 30일간 유효합니다.\n2. 제작 개시 후 중도 레이아웃 변경 시 추가 요금이 실비 청구될 수 있습니다.'}
                  </div>
                </td>
                <td className="border border-black text-center font-bold py-1">소계</td>
                <td className="border border-black text-right pr-2 font-mono">{formatCurrency(subtotal)}</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="border border-black text-center font-bold py-1">할인 / 기타</td>
                <td className="border border-black text-right pr-2 font-mono text-red-600">
                  {discount > 0 ? `-${formatCurrency(discount)}` : '0'}
                </td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="border border-black text-center font-bold py-1">
                  부가세{taxIncluded ? ' (10%)' : ' (별도)'}
                </td>
                <td className="border border-black text-right pr-2 font-mono">
                  {taxIncluded ? formatCurrency(taxAmount) : '0'}
                </td>
              </tr>
              <tr className="bg-slate-100 font-bold">
                <td colSpan={4} className="border border-black text-right pr-3 font-semibold py-1 px-2 text-xs">최종 견적 총 합계 가액</td>
                <td colSpan={2} className="border border-black text-right pr-2 text-blue-600 font-bold font-mono text-xs">
                  KRW {formatCurrency(finalTotal)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Payment Terms Block */}
        <div className="border border-slate-300 p-3 rounded-lg text-[11px] grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50/80">
          <div>
            <div className="font-bold text-slate-700">■ 입금 및 결제 정보안내</div>
            <div className="text-slate-600 mt-1">
              {company.bankName} : <span className="font-bold text-black font-mono">{company.bankAccount}</span> (예금주: {company.bankHolder})
            </div>
          </div>
          <div className="md:text-right flex flex-col justify-end text-[10px] text-slate-500">
            <div>주식회사 전일미디어 대표 드림</div>
            <div>귀사의 일익 번창과 건승을 기원합니다.</div>
          </div>
        </div>

      </div>
    </div>
    </div>
  );
};
