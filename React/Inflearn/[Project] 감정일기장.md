# [Project] 감정일기장
### 프로젝트 소개

---

주제는 감정 일기장이며, API 통신 없이 local storage에 저장하는 방식을 사용했습니다. 이 프로젝트의 목표는 JavaScript와 React에 대한 이해를 높이는 것이며, 배포는 Vercel을 사용했습니다. 인터넷 강의 프로젝트이지만, 디자인을 제외한 기능은 스스로 구현하였습니다.

### 작업기간

---

2024.09.17 ~ 2024.09.19

### URL

---
프로젝트 : [감정일기장](https://emotion-diary-ten-nu.vercel.app/)

CODE : [TIL/React/Inflearn/section12 at main · tnwlsdldkdlel/TIL](https://github.com/tnwlsdldkdlel/TIL/tree/main/React/Inflearn/section12)

### 기술스택

---

React.js, Javascript, HTML, CSS, Vercel

### 기능

---

- 새 일기 작성
- 새 일기 수정
- 새 일기 삭제
- 날짜 별로 일기 리스트 가져오기
- 최신 또는 오래된 순으로 정렬

### 느낀점

---

React로 처음 만든 프로젝트에서 컴포넌트 간의 관계가 복잡하게 느껴졌지만, 작성, 삭제, 정렬 기능을 구현하면서 점점 익숙해질 수 있었습니다. 특히 Props Drilling을 방지하기 위해 Context API를 도입했습니다. 상태 관리를 위해 Reducer를 사용하여 공통된 Context로 관리함으로써, Context의 활용을 완벽하게 이해할 수 있는 기회가 되었습니다.
