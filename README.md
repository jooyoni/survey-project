추가중인 설문 내용들을 리스트 형태로 저장하고 있는 전역 상태값 었어야 함

설문 생성중 각 설문들은 drag and drop으로 순서를 변경할 수 있어야 함

각 설문은 다른 특정 설문에서 특정 답변 시에 노출 혹은 필수 처리가 가능해야 함

각 추가중인 설문의 필요 데이터

id:number; isShow: boolean | 다른 질문 리스트; isRequired: boolean | 다른 질문
리스트; question:string;  
type:"객관식" | "체크박스" | "단답형" | "장문형" | "범위"; options:{
title:string; target:number | null; }[] | null;

id : 질문 고유 id

isSHow : boolean | 다른 질문 리스트 중 질문을 선택하면 해당 질문의 옵션들이 노출
노출된 옵션 중 택 1 하게 되면 해당 질문의 옵션이 선택됐을 떄만 보여지도록 처리

isRequired : boolean | 다른 질문 리스트 중 질문을 선택하면 해당 질문의 옵션들이
노출 노출된 옵션 중 택 1 하게 되면 해당 질문의 옵션이 선택됐을 떄만 필수이도록
처리

question : 질문 내용

type : { 객관식 : 보기 중 1개 선택 체크박스 : 보기 중 여러 개 선택 단답형 : 단답
장문형 : 장문 답변 범위 : input:range }

options: type = 객관식 | 체크박스 일 때 (여러개중 1 혹은 여러 개 선택){ title :
옵션 이름 target : 해당 옵션 선택 시 이동할 타겟 질문의 id }
