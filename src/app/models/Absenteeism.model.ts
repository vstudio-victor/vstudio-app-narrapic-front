export interface AbsenteeismData {
  sick: number;
  holiday: number;
  other: number;
}

export interface DayData {
  day: number | null;
  date: string | null;
  departmentId: string;
  absenteeism: AbsenteeismData;
  total: number;
}

export interface BackendResponse {
  date: string;
  departmentId: string;
  absenteeism: AbsenteeismData;
  total: number;
}

export interface MonthData {
  name: string;
  monthIndex: number;
  weeks: DayData[][];
}
