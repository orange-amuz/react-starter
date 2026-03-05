# my-app

React + TypeScript + Vite 기반의 웹 애플리케이션입니다.
도메인과 표현 계층을 분리한 구조를 사용하며, 상세 설계와 규칙은 `AGENTS.md` 및 `.cursor/rules`를 따릅니다.

## 기술 스택

- **프론트엔드**: React, TypeScript, Vite
- **상태 관리**: Redux Toolkit, React Redux
- **라우팅**: React Router DOM
- **스타일**: Styled Components
- **네트워크**: Axios
- **유효성 검증**: Zod
- **품질 도구**: ESLint, Prettier, Vitest, Testing Library
- **빌드/패키지 매니저**: Yarn

## 아키텍처 개요

응답 데이터는 아래 흐름을 따릅니다.

```text
API Response (응답 객체)
        ↓
Entity (Domain Model)
        ↓
ViewModel (Presentation Model)
        ↓
Component (Render Layer)
```

- **View**는 API 응답이나 Entity에 직접 의존하지 않고, **ViewModel + Controller 훅**만 사용합니다.
- **Controller 훅**은 API 호출, 로딩/에러 상태 관리, Entity → ViewModel 변환을 담당합니다.
- API, Entity, ViewModel, Store 등 각 레이어의 상세 규칙은 `AGENTS.md`와 `.cursor/rules/*.mdc`에 정의되어 있습니다.

## 디렉터리 구조

프로젝트의 기본 구조는 다음과 같습니다.
아래 항목은 **필요 시에만 생성**하며, 사용하지 않는 디렉터리는 만들지 않아도 됩니다.

```text
src/
├── api/         # API 레이어 (IApi, 각 도메인 API, Provider, 훅)
├── assets/      # 정적 에셋
├── constants/   # 전역 상수 및 설정
├── entities/    # Entity (Domain Model)
├── routes/      # 라우트 설정
├── types/       # 공통 타입 정의
├── view_models/ # ViewModel (Presentation Model)
└── views/       # 페이지 단위 View + Controller 훅
```

더 자세한 규칙과 예시는 `AGENTS.md`와 `.cursor/rules`(api, view_model, route 등)를 참고합니다.

## 개발 환경 설정

```bash
yarn install
```

## 사용 가능한 스크립트

- **개발 서버 실행**

  ```bash
  yarn dev
  ```

- **프로덕션 빌드**

  ```bash
  yarn build
  ```

- **빌드 결과 미리보기**

  ```bash
  yarn preview
  ```

- **테스트 실행**

  ```bash
  yarn test
  ```

- **ESLint 검사**

  ```bash
  yarn lint
  ```

- **TypeScript 타입 검사**

  ```bash
  yarn typecheck
  ```

- **코드 포맷팅 (Prettier)**

  ```bash
  yarn format
  ```

- **API 스캐폴딩 (Hygen)**

  ```bash
  yarn g:api
  ```

Storybook을 사용할 경우:

```bash
yarn storybook
```

## 규칙 요약

- 새로운 라이브러리는 `AGENTS.md`에 명시된 범위 밖에서는 추가하지 않습니다.
- API 응답은 반드시 `Entity.fromJson()`을 통해 Entity로 변환한 뒤 사용합니다.
- View는 Controller 훅이 제공하는 ViewModel과 상태/콜백에만 의존합니다.
- 변경 시에는 가능하면 `yarn lint`, `yarn typecheck`, `yarn test`를 통해 기본 검증을 수행합니다.

