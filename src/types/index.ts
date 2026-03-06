export interface DashboardSummary {
  activeTeachers: number;
  lessonsCreated: number;
  assessmentsMade: number;
  quizzesConducted: number;
  submissionRate: number;
}

export interface Teacher {
  teacher_id: string;
  teacher_name: string;
  total_lessons: number;
  total_quizzes: number;
  total_assessments: number;
  total_classes: number;
  total_subjects: number;
}

export interface TeacherDetail extends Teacher {
  subjects: string;
  classes: string;
}

export interface TrendData {
  week: string;
  week_start_date: string;
  lessons: number;
  quizzes: number;
  assessments: number;
}
