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
- ✅ **상태 관리 시스템 구현 완료**
  - ✅ Zustand 라이브러리 추가
  - ✅ 에디터 핵심 타입 정의 (`src/types/editor.ts`)
  - ✅ 에디터 Store 구현 (`src/stores/editor-store.ts`)
  - ✅ 패널 컴포넌트에 상태 관리 연결
  - ✅ 요소 추가/삭제/선택 기본 기능 구현
  - ✅ 캔버스에서 요소 렌더링 및 시각화
- ✅ **샘플 템플릿 및 고급 기능 구현 완료**
  - ✅ 쇼핑몰 상세 페이지 샘플 템플릿 추가
  - ✅ 다양한 HTML 요소 타입 추가 메뉴 (9가지 요소)
  - ✅ 계층 구조 시각화 (들여쓰기, 부모-자식 관계)
  - ✅ 템플릿 로드 기능

### 프로젝트 설정
- **프레임워크**: Vite 6.0.5
- **언어**: TypeScript 5.6.2
- **UI 라이브러리**: React 18.3.1
- **상태 관리**: Zustand 5.0.8
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
- 상태 관리: ✅ Zustand 5.0.8 사용
- 스타일링: ✅ 순수 CSS 사용 (에디터 UI), React CSSProperties (요소 스타일)
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

### 5단계: 우측 패널 - 속성 편집 기능 (우선순위 높음)
- [ ] 선택된 요소의 스타일 속성 편집 UI
- [ ] 텍스트 내용 편집 기능
- [ ] 태그 타입 변경 기능
- [ ] 주요 CSS 속성 편집 (색상, 폰트, 크기, 여백 등)

### 6단계: HTML 내보내기 기능
- [ ] 현재 페이지를 HTML 파일로 내보내기
- [ ] 인라인 스타일 변환 로직
- [ ] 계층 구조를 올바른 HTML로 변환
- [ ] 다운로드 기능

### 7단계: 추가 기능
- [ ] 요소 드래그 앤 드롭으로 순서 변경
- [ ] 이미지 업로드 및 삽입
- [ ] 실행 취소/다시 실행 (Undo/Redo)
- [ ] 저장/불러오기 (LocalStorage)

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

---

### 4번 컨텍스트: Zustand 상태 관리 시스템 구현 (2025-10-18)

**작업 내용:**
- Zustand 5.0.8 라이브러리 설치
- 에디터 핵심 타입 정의 파일 생성 (`src/types/editor.ts`)
  - HTMLElementType: 지원하는 HTML 태그 타입 정의
  - ElementStyle: React CSSProperties 타입 사용 (타입 안정성)
  - HTMLElement: 에디터에서 사용하는 요소 구조
  - Asset: 이미지/아이콘 리소스 타입
  - CanvasState: 캔버스 줌/팬 상태
  - EditorHistory: 실행 취소/다시 실행 히스토리 (TODO)
- Zustand 기반 에디터 Store 구현 (`src/stores/editor-store.ts`)
  - 요소 관리: addElement, updateElement, deleteElement, selectElement
  - 에셋 관리: addAsset, deleteAsset
  - 캔버스 관리: setZoom, setPan, resetCanvas
  - 히스토리: undo, redo (미구현)
- 패널 컴포넌트에 상태 관리 연결
  - LeftPanel: 요소 목록 표시, 추가/삭제 버튼, 선택 기능
  - CenterCanvas: 요소 렌더링, 선택 시 하이라이트
  - RightPanel: 선택된 요소 속성 표시

**주요 결정:**
- Zustand 선택 이유: 간단한 API, 보일러플레이트 최소화, TypeScript 지원 우수
- ElementStyle을 React.CSSProperties로 정의하여 타입 안정성 확보
- 요소 삭제 시 자식 요소도 재귀적으로 삭제하는 로직 구현
- 캔버스 줌 범위 제한 (0.1 ~ 3.0)

**구현된 기능:**
- 섹션 요소 추가 버튼 (테스트용)
- 요소 클릭으로 선택
- 선택된 요소 파란색 아웃라인으로 시각화
- 요소 삭제 버튼
- 선택된 요소 정보 우측 패널에 표시

**커밋:**
- `chore: Zustand 상태 관리 라이브러리 추가`
- `feat: 에디터 핵심 타입 정의 추가`
- `feat: Zustand 기반 에디터 상태 관리 Store 구현`
- `feat: 패널 컴포넌트에 상태 관리 연결 및 기본 기능 구현`

**다음 작업 방향:**
- 다양한 HTML 요소 타입 추가 버튼 구현
- 계층 구조 (부모-자식 관계) 시각화
- 우측 패널에서 스타일 속성 편집 기능
- HTML 내보내기 기능

---

### 5번 컨텍스트: 샘플 템플릿 및 레이어 고도화 구현 (2025-10-18)

**작업 내용:**
- 쇼핑몰 상세 페이지 샘플 템플릿 생성 (`src/utils/sample-templates.ts`)
  - Header, Section, Footer 구조의 완전한 샘플 페이지
  - 14개의 요소로 구성된 실제 쇼핑몰 페이지 형태
  - 부모-자식 관계가 설정된 계층 구조
- Store에 템플릿 로드 기능 추가 (`loadTemplate`)
- LeftPanel 대폭 개선
  - 샘플 템플릿 불러오기 버튼 (초록색, 상단 배치)
  - 다양한 HTML 요소 추가 드롭다운 메뉴 (9가지 요소 지원)
  - 계층 구조 시각화 (들여쓰기로 depth 표현)
  - 자식 요소 표시 (▾ 아이콘)
- CenterCanvas 개선
  - 부모-자식 관계 올바른 렌더링
  - elements 배열에서 parentId로 자식 필터링
  - 빈 요소와 텍스트 요소 구분 처리

**지원하는 요소 타입:**
- 레이아웃: section, header, footer, div
- 헤딩: h1, h2, h3
- 텍스트: p
- 인터랙션: button

**주요 결정:**
- 샘플 템플릿으로 사용자에게 즉시 시작 가능한 경험 제공
- 요소 추가 시 기본 스타일 사전 정의 (사용자 편의성)
- 계층 구조는 들여쓰기로 시각화 (Figma 스타일)
- 드롭다운 메뉴로 많은 요소 타입 효율적 관리

**구현된 기능:**
- "📄 샘플 템플릿 불러오기" 버튼 (확인 다이얼로그 포함)
- "+ 요소 추가" 드롭다운 메뉴 (hover 효과)
- 계층 구조 트리 뷰 (들여쓰기 16px 단위)
- 자식 요소 자동 렌더링

**커밋:**
- `feat: 쇼핑몰 상세 페이지 샘플 템플릿 추가`
- `feat: Store에 템플릿 로드 기능 추가`
- `feat: 다양한 HTML 요소 추가 메뉴, 계층 구조 시각화, 샘플 템플릿 로드 기능 구현`

**다음 작업 방향:**
- 우측 패널에서 스타일 속성 편집 UI 구현
- 텍스트 내용 편집 기능
- HTML 내보내기 기능 (인라인 스타일 변환)
