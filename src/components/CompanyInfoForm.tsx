import React from 'react';
import { CompanyInfo } from '../types';
import { Building2, User, FileText, MapPin, Phone, Mail, Award, Landmark, CreditCard } from 'lucide-react';

interface CompanyInfoFormProps {
  info: CompanyInfo;
  onChange: (info: CompanyInfo) => void;
}

export const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({ info, onChange }) => {
  const handleChange = (key: keyof CompanyInfo, value: string) => {
    onChange({
      ...info,
      [key]: value
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
        <span className="w-1.5 h-4 bg-blue-600 rounded-full shrink-0"></span>
        <div>
          <h2 className="font-bold text-slate-800 text-sm">공급자 정보 (전일미디어)</h2>
          <p className="text-[11px] text-slate-400">인쇄물에 출력될 우리 사 정보를 설정합니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 상호명 */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">상호 / 법인명</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Building2 size={15} />
            </span>
            <input
              type="text"
              value={info.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-slate-800 font-medium"
              placeholder="예: 주식회사 전일미디어"
            />
          </div>
        </div>

        {/* 대표자 */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">대표자명</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <User size={15} />
            </span>
            <input
              type="text"
              value={info.representative}
              onChange={(e) => handleChange('representative', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-slate-800 font-medium"
              placeholder="대표이사 이름"
            />
          </div>
        </div>

        {/* 사업자등록번호 */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">사업자등록번호</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <FileText size={15} />
            </span>
            <input
              type="text"
              value={info.regNumber}
              onChange={(e) => handleChange('regNumber', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-slate-800"
              placeholder="000-00-00000"
            />
          </div>
        </div>

        {/* 대표 전화번호 */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">대표 연락처</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Phone size={15} />
            </span>
            <input
              type="text"
              value={info.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-slate-800"
              placeholder="예: 02-1234-5678"
            />
          </div>
        </div>

        {/* 주소 */}
        <div className="md:col-span-2">
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">사업장 주소</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <MapPin size={15} />
            </span>
            <input
              type="text"
              value={info.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-slate-800"
              placeholder="사업장 소재지 주소"
            />
          </div>
        </div>

        {/* 이메일 */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">공식 이메일</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Mail size={15} />
            </span>
            <input
              type="email"
              value={info.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-slate-800"
              placeholder="info@jeonilmedia.com"
            />
          </div>
        </div>

        {/* 은행명 */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">수금 은행</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Landmark size={15} />
            </span>
            <input
              type="text"
              value={info.bankName}
              onChange={(e) => handleChange('bankName', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-slate-800"
              placeholder="신한은행, 국민은행 등"
            />
          </div>
        </div>

        {/* 계좌번호 */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">계좌번호</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <CreditCard size={15} />
            </span>
            <input
              type="text"
              value={info.bankAccount}
              onChange={(e) => handleChange('bankAccount', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-slate-800"
              placeholder="계좌번호 (하이픈 포함)"
            />
          </div>
        </div>

        {/* 예금주 */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">예금주</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Award size={15} />
            </span>
            <input
              type="text"
              value={info.bankHolder}
              onChange={(e) => handleChange('bankHolder', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-slate-800"
              placeholder="예금주명"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
