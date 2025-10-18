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
- ✅ **3-패널 레이아웃 구조 구현 완료**
  - ✅ `LeftPanel` 컴포넌트 (좌측 패널)
  - ✅ `CenterCanvas` 컴포넌트 (중앙 캔버스)
  - ✅ `RightPanel` 컴포넌트 (우측 패널)
  - ✅ CSS Grid 기반 레이아웃 스타일 (`src/styles/layout.css`)
  - ✅ Figma 스타일의 다크 테마 적용

### 프로젝트 설정
- **프레임워크**: Vite 6.0.5
- **언어**: TypeScript 5.6.2
- **UI 라이브러리**: React 18.3.1
- **린트/포맷**: ESLint 9.17.0, Prettier 3.4.2

## 주요 결정 사항

### 아키텍처
- ✅ Figma 스타일의 3-패널 레이아웃 구조 구현 완료
  - 좌측: 레이어/에셋 탭 (기본 구조 완료)
  - 중앙: WYSIWYG 캔버스 (기본 구조 완료)
  - 우측: 속성 편집기 (기본 구조 완료)
- CSS Grid 레이아웃 (280px | 1fr | 320px)
- 다크 테마 색상 스킴 (#1e1e1e 배경, #252526 패널)

### 기술 스택
- 상태 관리: 미정 (Zustand 또는 Context API 검토 예정)
- 스타일링: ✅ 순수 CSS 사용 (현재 에디터)
- 드래그 앤 드롭: 미정 (react-dnd 또는 네이티브 API 검토 예정)

### 결과물 형식 요구사항 (중요!)
- **HTML 단일 파일 내보내기**: 사용자가 작업한 결과는 단일 `.html` 파일로 추출
- **인라인 스타일만 사용**:
  - `<style>` 태그 사용 불가할 수 있음 (일부 쇼핑몰 플랫폼 제약)
  - 모든 CSS는 인라인 `style` 속성으로만 적용
  - 외부 CSS 파일 의존성 없이 독립적으로 실행 가능
- **시맨틱 HTML**: HTML5 시맨틱 태그 사용 (section, article, header, footer 등)
- **플랫폼 호환성**: 주요 쇼핑몰 플랫폼(스마트스토어, 쿠팡, 11번가 등) 호환

### 코딩 규칙
- 파일명: kebab-case
- 변수/함수명: camelCase
- 컴포넌트명: PascalCase
- 상수명: UPPER_SNAKE_CASE
- 커밋 메시지: Conventional Commits 표준 준수

## 다음 단계

### 3단계: 상태 관리 설정 (우선순위 높음)
- [ ] 상태 관리 라이브러리 선택 및 설정 (Zustand 권장)
- [ ] 핵심 상태 타입 정의
  - [ ] DOM 트리 구조 (페이지 요소 계층)
  - [ ] 선택된 요소
  - [ ] 캔버스 줌/팬 상태
  - [ ] 에셋 리스트
- [ ] 상태 관리 store 구현

### 4단계: 좌측 패널 - 레이어 탭 구현
- [ ] DOM 트리 시각화 컴포넌트
- [ ] 요소 선택 기능
- [ ] 요소 추가/삭제 기능
- [ ] 계층 구조 표시 (들여쓰기, 접기/펼치기)

### 5단계: 캔버스 기본 기능
- [ ] HTML 요소 렌더링 엔진
- [ ] 요소 선택 시각화 (하이라이트)
- [ ] 기본 줌/팬 기능

## 참고 사항
- 프로젝트는 비개발자(MD, 마케터, 디자이너)를 대상으로 함
- 시맨틱 HTML 생성이 핵심 목표
- 드래그 앤 드롭 방식의 직관적인 UI 필수

---

## 컨텍스트 히스토리

### 1번 컨텍스트: 프로젝트 초기 설정 (2025-10-18)

**작업 내용:**
- Vite + React + TypeScript 프로젝트 초기화
- package.json 및 의존성 설정
- TypeScript 설정 파일 구성 (tsconfig.json, tsconfig.app.json, tsconfig.node.json)
- Vite 설정 파일 생성 (vite.config.ts)
- ESLint 및 Prettier 설정
- .gitignore 파일 추가
- 기본 React 애플리케이션 구조 (index.html, src/main.tsx, src/App.tsx)
- README.md 및 프로젝트 문서 작성
- 기본 디렉토리 구조 생성 (components, hooks, stores, types, utils, styles)

**주요 결정:**
- Vite를 번들러로 선택 (빠른 개발 경험)
- TypeScript strict 모드 활성화
- Conventional Commits 규칙 준수

**커밋:**
- `chore: 프로젝트 의존성 설정 추가`
- `chore: TypeScript 설정 추가`
- `chore: Vite 설정 추가`
- `chore: ESLint 및 Prettier 설정 추가`
- `chore: .gitignore 파일 추가`
- `feat: 기본 React 애플리케이션 구조 추가`
- `docs: README.md 추가`
- `docs: CLAUDE.md 오타 수정 및 커밋 규칙 명확화`
- `docs: 프로젝트 컨텍스트 문서 추가`

---

### 2번 컨텍스트: 3-패널 레이아웃 구조 구현 (2025-10-18)

**작업 내용:**
- Figma 스타일의 3-패널 레이아웃 설계 및 구현
- CSS Grid 기반 레이아웃 스타일 파일 생성 (src/styles/layout.css)
- LeftPanel 컴포넌트 생성 (좌측 패널 - 레이어/에셋)
- CenterCanvas 컴포넌트 생성 (중앙 캔버스 - 편집 영역)
- RightPanel 컴포넌트 생성 (우측 패널 - 속성 편집기)
- App.tsx에 3-패널 통합 및 레이아웃 적용
- 다크 테마 색상 스킴 적용
- 전체 화면 레이아웃을 위한 index.css 수정

**주요 결정:**
- CSS Grid 레이아웃 사용 (280px | 1fr | 320px)
- 다크 테마 색상: #1e1e1e (배경), #252526 (패널), #3e3e42 (경계선)
- 각 패널을 독립된 컴포넌트로 분리 (재사용성, 유지보수성)

**커밋:**
- `style: 에디터 레이아웃 스타일 추가`
- `feat: 레이아웃 패널 컴포넌트 추가 (LeftPanel, CenterCanvas, RightPanel)`
- `feat: 3-패널 레이아웃 구조 통합`
- `docs: 2단계 레이아웃 구조 완료에 따른 컨텍스트 업데이트`

---

### 3번 컨텍스트: 결과물 형식 요구사항 추가 (2025-10-18)

**작업 내용:**
- HTML 단일 파일 내보내기 요구사항 명시
- 인라인 스타일만 사용 (style 태그 사용 불가 제약 반영)
- 쇼핑몰 플랫폼 호환성 요구사항 추가

**주요 결정:**
- 모든 CSS는 인라인 style 속성으로만 적용
- <style> 태그 사용 금지 (일부 쇼핑몰 플랫폼 제약)
- 시맨틱 HTML5 태그 사용 원칙
- 주요 쇼핑몰 플랫폼(스마트스토어, 쿠팡, 11번가) 호환성 고려

**다음 작업 방향:**
- 내보내기 기능 구현 시 인라인 스타일 변환 로직 필수
- 에디터에서는 일반 CSS 사용, 내보내기 시 인라인으로 변환하는 전략 검토
