# 프로젝트 컨텍스트: 쇼핑몰 상세 페이지 에디터

## 현재 상태 (2025-10-18)

### 완료된 작업
- ✅ Vite + React + TypeScript 프로젝트 구조 설정 완료
- ✅ 개발 도구 설정 완료 (ESLint, Prettier)
- ✅ 기본 디렉토리 구조 생성
  - `src/components/` - React 컴포넌트
  - `src/hooks/` - 커스텀 React hooks
  - `src/stores/` - 상태 관리
  - `src/types/` - TypeScript 타입 정의
  - `src/utils/` - 유틸리티 함수
  - `src/styles/` - 스타일 파일
- ✅ 기본 App 컴포넌트 및 엔트리 포인트 설정

### 프로젝트 설정
- **프레임워크**: Vite 6.0.5
- **언어**: TypeScript 5.6.2
- **UI 라이브러리**: React 18.3.1
- **린트/포맷**: ESLint 9.17.0, Prettier 3.4.2

## 주요 결정 사항

### 아키텍처
- Figma 스타일의 3-패널 레이아웃 구조 예정
  - 좌측: 레이어/에셋 탭
  - 중앙: WYSIWYG 캔버스
  - 우측: 속성 편집기 (Inspector)

### 기술 스택
- 상태 관리: 미정 (Zustand 또는 Context API 검토 예정)
- 스타일링: CSS (필요시 CSS-in-JS 또는 Tailwind 검토)
- 드래그 앤 드롭: 미정 (react-dnd 또는 네이티브 API 검토 예정)

### 코딩 규칙
- 파일명: kebab-case
- 변수/함수명: camelCase
- 컴포넌트명: PascalCase
- 상수명: UPPER_SNAKE_CASE
- 커밋 메시지: Conventional Commits 표준 준수

## 다음 단계

### 2단계: 레이아웃 구조 (우선순위 높음)
- [ ] 메인 레이아웃 컴포넌트 생성
  - [ ] `LeftPanel` 컴포넌트
  - [ ] `CenterCanvas` 컴포넌트
  - [ ] `RightPanel` 컴포넌트
- [ ] 기본 Grid/Flexbox 레이아웃 구현
- [ ] 패널 리사이징 기능 (선택사항)

### 3단계: 상태 관리 설정
- [ ] 상태 관리 라이브러리 선택 및 설정
- [ ] 핵심 상태 타입 정의
  - [ ] DOM 트리 구조
  - [ ] 선택된 요소
  - [ ] 캔버스 줌/팬
  - [ ] 에셋 리스트

## 참고 사항
- 프로젝트는 비개발자(MD, 마케터, 디자이너)를 대상으로 함
- 시맨틱 HTML 생성이 핵심 목표
- 드래그 앤 드롭 방식의 직관적인 UI 필수
