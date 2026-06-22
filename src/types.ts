export interface EstimateItem {
  id: string;
  name: string;        // 품목명 (e.g., 홍보영상 촬영, 디렉팅 피 등)
  spec: string;        // 규격 및 사양 (e.g., 4K 1회, 10분 내외 등)
  qty: number;         // 수량
  price: number;       // 단가
  note: string;        // 비고
}

export interface CompanyInfo {
  name: string;           // 상호 (전일미디어)
  representative: string; // 대표자명
  regNumber: string;      // 사업자등록번호
  address: string;        // 주소
  phone: string;          // 전화번호
  email: string;          // 이메일
  bankName: string;       // 은행명
  bankAccount: string;    // 계좌번호
  bankHolder: string;     // 예금주
}

export interface CustomerInfo {
  name: string;           // 담당자명 또는 상호
  company: string;        // 고객사명
  phone: string;          // 연락처
  email: string;          // 이메일
  address: string;        // 주소
}

export interface Estimate {
  id: string;
  estimateNumber: string; // 견적번호
  title: string;          // 건명 (견적 제목)
  date: string;           // 견적일자
  validityDays: number;   // 유효기간 (e.g., 30일)
  customer: CustomerInfo;
  company: CompanyInfo;
  items: EstimateItem[];
  discount: number;       // 할인금액
  taxIncluded: boolean;   // 부가세 포함 여부
  taxRate: number;        // 부가세율 (기본 10)
  notes: string;         // 주요 사항 또는 특이사항
  status: 'draft' | 'issued' | 'cancelled';
  createdAt: string;
}

export interface EstimatePreset {
  id: string;
  title: string;
  description: string;
  category: 'video' | 'design' | 'marketing' | 'rental';
  items: Omit<EstimateItem, 'id'>[];
}
