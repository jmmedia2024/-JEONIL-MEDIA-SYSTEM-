import React from 'react';
import { CustomerInfo } from '../types';
import { User, Phone, Mail, MapPin, Briefcase } from 'lucide-react';

interface CustomerInfoFormProps {
  info: CustomerInfo;
  onChange: (info: CustomerInfo) => void;
}

export const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({ info, onChange }) => {
  const handleChange = (key: keyof CustomerInfo, value: string) => {
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
          <h2 className="font-bold text-slate-800 text-sm">수신처 정보 (고객)</h2>
          <p className="text-[11px] text-slate-400">견적을 받으실 귀하/귀사 정보를 기재합니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 고객사명 */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">고객사(기관/단체)명</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Briefcase size={15} />
            </span>
            <input
              type="text"
              value={info.company}
              onChange={(e) => handleChange('company', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-slate-800"
              placeholder="예: 한국콘텐츠진흥원, 개인"
            />
          </div>
        </div>

        {/* 담당자명 */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">수신인 / 담당자 성명</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <User size={15} />
            </span>
            <input
              type="text"
              value={info.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-slate-800"
              placeholder="홍길동 주임 귀하"
            />
          </div>
        </div>

        {/* 연락처 */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">고객 연락처</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Phone size={15} />
            </span>
            <input
              type="text"
              value={info.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-slate-800"
              placeholder="010-0000-0000"
            />
          </div>
        </div>

        {/* 이메일 */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">고객 이메일</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Mail size={15} />
            </span>
            <input
              type="email"
              value={info.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-slate-800"
              placeholder="client@company.com"
            />
          </div>
        </div>

        {/* 주소 */}
        <div className="md:col-span-2">
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">고객 주소 (선택)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <MapPin size={15} />
            </span>
            <input
              type="text"
              value={info.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-slate-800"
              placeholder="고객사 도로명 혹은 지번 주소"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
