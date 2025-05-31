
export interface ProblemStatement {
  title: string;
  timeLimit: string;
  memoryLimit: string;
  legend: string;
  inputs: string;
  outputs: string;
  example: string;
  notes: string;
}

export interface StatementEvaluation {
  qualityScore: number;
  isSuitable: boolean;
  feedback: string;
}

export interface GeneratedCodes {
  inputGeneratorCode?: string;
  validatorCode?: string;
  solutionCode?: string;
}

export interface FullProblemEvaluation {
  overallAssessment: string;
  errorsFound: boolean;
  suggestions: string;
}

export enum AppStep {
  USER_INPUT = 1,
  REVIEW_STATEMENT,
  REVIEW_FULL_PROBLEM,
}

export const DIFFICULTY_LEVELS_1_TO_10 = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"
] as const;
export type DifficultyValue = (typeof DIFFICULTY_LEVELS_1_TO_10)[number];

export const DIFFICULTY_DESCRIPTIONS: Record<DifficultyValue, string> = {
  "1": "입출력, 사칙연산, 조건문, 반복문, 함수, 배열, 문자열",
  "2": "브루트포스, 이분 탐색, 정수론(에라토스테네스의 체), 조합론(이항계수), 기하학(피타고라스 정리), 스택, 큐, 덱, 정렬",
  "3": "집합과 맵, 비트마스킹, 다이나믹 프로그래밍, 누적 합, 그래프 탐색(깊이 우선 탐색/너비 우선 탐색), 우선순위 큐, 그리디 알고리즘, 분할 정복, 매개 변수 탐색, 좌표 압축",
  "4": "백트래킹, 트리, 분할 정복을 이용한 거듭제곱, 최단거리 알고리즘(데이크스트라, 벨만-포드, 플로이드-워셜), 최장 공통 부분 문자열, 최장 증가 부분 수열, 배낭 문제, 0-1 bfs",
  "5": "투 포인터, 분리 집합, 위상 정렬, 최소 스패닝 트리, 기하학(선분 교차, CCW), 비트필드를 이용한 다이나믹 프로그래밍",
  "6": "모노톤 스택, 모노톤 큐, 트리 DP, 볼록 껍질, 최소 공통 조상, KMP, 강한 연결 요소, 2-SAT, 세그먼트 트리, 스위핑, 트라이",
  "7": "이분 매칭, 최대 유량, 최대 유량 최소 컷 정리, 최소 비용 최대 유량, 오프라인 쿼리, Mo's, 접미사 배열, Lazy propagation, Convex-Hull Trick, 머지 소트 트리, 매내처, 스프라그-그런디 정리, 오일러 경로 테크닉",
  "8": "고속 푸리에 변환, Heavy-light 분할, 센트로이드 분할, 아호-코라식, 분할 정복을 이용한 DP 최적화, 퍼시스턴트 세그먼트 트리, Dinic 알고리즘, 폴라드 로",
  "9": "다차원 세그먼트 트리, 커넥션 프로파일 DP, 병렬 이분 탐색, 오프라인 동적 연결성 판정, 홀의 결혼 정리, 이중 연결 요소, 정수론적 변환, 슬로프 트릭, 서큘레이션, 트리 동형 사상, 트리 압축, 불도저 트릭",
  "10": "스플레이 트리, 반평면 교집합, 평면 그래프, 키타마사, 벌래캠프, Aliens 트릭, 일반 매칭, 세그먼트 트리 beats, 히르쉬버그",
};
