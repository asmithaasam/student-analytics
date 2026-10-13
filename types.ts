export type UserRole = 'student' | 'faculty' | 'admin';

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  collegeName: string;
  department: 'CSE' | 'ECE' | 'EEE' | 'IT' | 'Mechanical' | 'Civil' | 'Other';
  studyYear: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
  studentId: string;
  cgpa?: number;
  attendanceRate?: number;
  successScore?: number;
  riskClassification?: 'Safe' | 'Academic Risk' | 'Placement Risk' | 'Critical';
}

export interface AuthState {
  user: StudentProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isDemoMode: boolean;
}

export interface MetricKPI {
  title: string;
  value: string;
  delta: string;
  isPositive: boolean;
  subtext: string;
}

export interface ExplainableIndicator {
  name: string;
  impact: string;
  isPositive: boolean;
  weightPercent: number;
}
