import { CompanyInfo, EstimatePreset } from './types';

// Default Jeonil Media Company Settings (Editable by user)
export const DEFAULT_COMPANY_INFO: CompanyInfo = {
  name: '전일미디어',
  representative: '전충일',
  regNumber: '466-30-01297',
  address: '경기도 김포시 통진읍 서암리 114 2층 전일미디어',
  phone: '010-5824-8087',
  email: 'new2020.jeonil@gmail.com',
  bankName: '국민은행',
  bankAccount: '469901-01-234567',
  bankHolder: '전일미디어',
};

// Preset estimate template modules for easy creation
export const ESTIMATE_PRESETS: EstimatePreset[] = [
  {
    id: 'preset_youtube',
    title: '유튜브 브랜드 채널 콘텐츠 제작 (기본 1편)',
    description: '전문 촬영 장비와 기획을 동반하여 기업의 공식 유튜브용 고품질 콘텐츠를 1회 제작하는 기본 패키지입니다.',
    category: 'video',
    items: [
      { name: '유튜브 콘텐츠 시나리오 기획 및 구성안 작성', spec: '1편 (5~8분 분량) / 수정 2회 회수 제한', qty: 1, price: 300000, note: '콘셉트 및 스크립트 작성' },
      { name: '현장 영상 촬영 (4K 시네마 카메라 및 기본 조명)', spec: '촬영 가용시간 4H 이내 / 촬영 스탭 1인', qty: 1, price: 600000, note: '삼각대, 핀마이크, 현장 소음 수음 포함' },
      { name: '포스트 프로덕션 (BGM 라이선스, 자막, 컷편집)', spec: '최종 납품본 1편 / 리비전 2회 포함', qty: 1, price: 500000, note: '자막 템플릿 및 모션 이펙트 삽입' },
      { name: '콘텐츠 유튜브 업로드 디자인 및 썸네일', spec: '고해상도 JPG 이미지 / 1종', qty: 1, price: 100000, note: '대표 자막 폰트 및 고품질 그래픽 합성' }
    ]
  },
  {
    id: 'preset_corporate',
    title: '기업 브랜드 홍보영상 제작 (프리미엄)',
    description: '기업의 브랜드 아이덴티티와 핵심 가치를 전달하기 위한 인트로 시네마틱 스타일 홍보영상 패키지입니다.',
    category: 'video',
    items: [
      { name: '크리에이티브 기획 및 스토리보드 제작', spec: '기획안 2종 제시 및 시나리오 집필', qty: 1, price: 1000000, note: '메인 디렉터 및 스토리작가 팅' },
      { name: '고성능 메인 촬영 및 테크니컬 장비 렌탈', spec: 'RED/Sony FS7급 바디, 조명 세트 및 무선 송수신', qty: 1, price: 1500000, note: '지미집 or 슬라이더 등 정밀 리그 포함' },
      { name: '4K 시네마 그래픽 촬영 (드론 항공 샷 포함)', spec: '촬영 인원 2인 / 전일 8H 가용', qty: 2, price: 1200000, note: '항공촬영 허가 대행 및 전문 비행감독 동반' },
      { name: '프리미엄 포스트 에디팅 & 모션 3D 그래픽', spec: '3D 로고 타이틀 무브먼트 및 세부 컷편집', qty: 1, price: 1800000, note: 'Color Grading LUT 보정 포함' },
      { name: '전문가 성우 나레이션 피 (스튜디오 대관료 포함)', spec: 'A급 나레이터 녹음 / 메인 녹음 1회', qty: 1, price: 800000, note: '한국어 전문 성우 가이드 스크립트 기반' },
      { name: '오디오 프리미엄 믹싱 및 사운드 임팩트 가피', spec: '상업용 음원 독점 라이센스 계약', qty: 1, price: 300000, note: '효과음 삽입 및 마스터링' }
    ]
  },
  {
    id: 'preset_shorts',
    title: 'TikTok / Shorts / Reels 숏폼 시리즈 (3편 일괄)',
    description: '자연스러운 전환과 높은 몰입을 위한 트렌디한 세로형 숏폼 콘텐츠 3편 묶음 제작 패키지입니다.',
    category: 'video',
    items: [
      { name: '트렌디 숏폼 콘텐츠 밈/트렌드 기획', spec: '총 3개 테마 아이디어 구성 및 스크립트', qty: 1, price: 300000, note: '릴스/쇼츠 알고리즘 최적화 포맷' },
      { name: '현장 세로형 촬영 (고성능 스마트 리그 + 전문 짐벌)', spec: '3편 연속 촬영 (가용 5H)', qty: 1, price: 500000, note: '기본 현장 수음 및 크루 1인 진행' },
      { name: '숏폼 특화 트렌디 컷 편집 (빠른 템포 및 자막 효과)', spec: '30초~60초 분량 3편 제작', qty: 3, price: 200000, note: '컷 전환, 고배속, 맞춤 폰트 자막, 스티커 삽입' }
    ]
  },
  {
    id: 'preset_event',
    title: '오프라인 세미나 / 포럼 중계 및 현장 스케치',
    description: '오프라인 세미나, 포럼, 행사 현장을 다각도로 무비 카지노하고 편집하여 기록하는 통합 패키지입니다.',
    category: 'video',
    items: [
      { name: '멀티카메라 현장 촬영 엔지니어링', spec: '카메라 3대 (메인 고정 2, 무빙 슬라이더 1)', qty: 1, price: 1200000, note: '행사 실시간 중계 스위처 포함' },
      { name: '실시간 유튜브/라이브 송출 시스템 패키지', spec: '송출 서버 및 무선 본딩 장비 운용', qty: 1, price: 1000000, note: '네트워크 대역폭 사전 테스트 체크' },
      { name: '행사 하이라이트 스케치 영상 에디팅', spec: '3분 내외 요약 스케치 / BGM 포함', qty: 1, price: 600000, note: '행사 분위기 및 스피커 발췌 싱크' }
    ]
  }
];

// Quick utilities to translate numbers to Korean text (e.g. 12,345,000 -> 일천이백삼십사만오천 원 정)
export function numberToKorean(value: number): string {
  if (value === 0 || isNaN(value)) return '영 원 정';
  
  const units = ['', '만', '억', '조', '경'];
  const nums = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  const positions = ['', '십', '백', '천'];
  
  let result = '';
  let unitIndex = 0;
  let tempVal = value;
  
  while (tempVal > 0) {
    const chunk = tempVal % 10000;
    tempVal = Math.floor(tempVal / 10000);
    
    if (chunk > 0) {
      let chunkStr = '';
      let chunkTemp = chunk;
      let posIndex = 0;
      
      while (chunkTemp > 0) {
        const digit = chunkTemp % 10;
        chunkTemp = Math.floor(chunkTemp / 10);
        
        if (digit > 0) {
          // If the digit is 1 and it's not the units place, we omit '일' (e.g., '십' instead of '일십')
          const showNum = (digit === 1 && posIndex > 0) ? '' : nums[digit];
          chunkStr = showNum + positions[posIndex] + chunkStr;
        }
        posIndex++;
      }
      
      result = chunkStr + units[unitIndex] + ' ' + result;
    }
    unitIndex++;
  }
  
  return result.trim() + '원 정';
}

// Format numbers as Korean currency (e.g. 1000 => 1,000)
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(value);
}
