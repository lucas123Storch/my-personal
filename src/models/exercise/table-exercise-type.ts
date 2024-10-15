import { Exercise } from "./exercise-type";

export type Day = {
  day: string;
  exercises: Exercise[];
};

export type RecordData = {
  personalId: string;
  studentId: string;
  id: string;
  days: Day[];
};
