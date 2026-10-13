/* ==========================================================================
   AI-POWERED STUDENT ANALYTICS & SUCCESS PLATFORM
   Sample Academic & Placement Intelligence Data (KPMG Hackathon Standards)
   ========================================================================== */

const PLATFORM_DATA = {
  kpis: {
    successScore: "82.4%",
    successScoreDelta: "+4.2%",
    studentsAtRisk: 42,
    academicRiskCount: 18,
    placementRiskCount: 24,
    placementReadiness: "76.8%",
    activeInterventions: 89
  },

  // KPMG Bonus Feature 1: Student Segmentation Matrix
  segments: [
    {
      id: "high-acad-low-place",
      title: "High Academic, Low Placement",
      badge: "KPMG Focus",
      count: 28,
      desc: "CGPA > 8.5 but low aptitude & mock interview scores. High danger of placement rejection.",
      intervention: "Recommend: Coding & Mock Interview Sprint",
      isSpecialAlert: true
    },
    {
      id: "critical-risk",
      title: "Critical Academic At-Risk",
      badge: "High Alert",
      count: 14,
      desc: "Attendance < 65%, low LMS assignment completion, backlogs pending.",
      intervention: "Recommend: Faculty Counseling & Remedial Classes",
      isSpecialAlert: false
    },
    {
      id: "high-achievers",
      title: "Balanced High Achievers",
      badge: "Top Tier",
      count: 142,
      desc: "Strong academic metrics, high placement readiness, and active hackathon participation.",
      intervention: "Recommend: Fast-track Tier-1 Campus Placements",
      isSpecialAlert: false
    },
    {
      id: "placement-ready-low-acad",
      title: "High Practical Skills, Low CGPA",
      badge: "Skill Strong",
      count: 36,
      desc: "Strong GitHub & coding scores, but struggling with theoretical university semester exams.",
      intervention: "Recommend: Academic Tutoring for Exam Clearance",
      isSpecialAlert: false
    }
  ],

  // KPMG Bonus Feature 2: Explainable Score Features (SHAP values / Indicator weights)
  explainableScore: {
    studentName: "Aditya Verma",
    studentId: "CSE-2023-042",
    department: "Computer Science & Engineering",
    overallScore: 68,
    riskClassification: "Placement Risk (High Academic)",
    cgpa: "8.82",
    attendance: "89%",
    indicators: [
      { name: "Academic CGPA (8.82 / 10)", impact: "+26%", isPositive: true, width: 88 },
      { name: "Course Attendance (89%)", impact: "+18%", isPositive: true, width: 89 },
      { name: "LMS Submission Rate (94%)", impact: "+12%", isPositive: true, width: 94 },
      { name: "Mock Interview Score (42%)", impact: "-28%", isPositive: false, width: 42 },
      { name: "Coding Test Assessment (48%)", impact: "-22%", isPositive: false, width: 48 },
      { name: "Soft Skills & Communication", impact: "-14%", isPositive: false, width: 50 }
    ]
  },

  // Student Roster
  students: [
    {
      id: "CSE-2023-042",
      name: "Aditya Verma",
      dept: "CSE",
      year: "4th Year",
      cgpa: "8.82",
      attendance: "89%",
      successScore: 68,
      riskType: "Placement Risk",
      riskBadgeClass: "placement-risk",
      segment: "High Academic, Low Placement",
      status: "Review Pending"
    },
    {
      id: "ECE-2023-108",
      name: "Pooja Hegde",
      dept: "ECE",
      year: "3rd Year",
      cgpa: "6.12",
      attendance: "61%",
      successScore: 54,
      riskType: "Academic Risk",
      riskBadgeClass: "academic-risk",
      segment: "Critical Academic At-Risk",
      status: "Intervention Scheduled"
    },
    {
      id: "IT-2023-019",
      name: "Rahul Sharma",
      dept: "IT",
      year: "4th Year",
      cgpa: "9.20",
      attendance: "94%",
      successScore: 95,
      riskType: "Safe / High Achiever",
      riskBadgeClass: "safe",
      segment: "Balanced High Achievers",
      status: "Placement Ready"
    },
    {
      id: "MECH-2023-077",
      name: "Karan Patel",
      dept: "Mechanical",
      year: "3rd Year",
      cgpa: "7.45",
      attendance: "78%",
      successScore: 74,
      riskType: "Moderate",
      riskBadgeClass: "placement-risk",
      segment: "High Practical Skills, Low CGPA",
      status: "Skill Track Active"
    },
    {
      id: "CSE-2023-156",
      name: "Sneha Reddy",
      dept: "CSE",
      year: "4th Year",
      cgpa: "8.95",
      attendance: "92%",
      successScore: 92,
      riskType: "Safe / High Achiever",
      riskBadgeClass: "safe",
      segment: "Balanced High Achievers",
      status: "Placed Tier-1"
    },
    {
      id: "EEE-2023-034",
      name: "Vikram Singhania",
      dept: "EEE",
      year: "2nd Year",
      cgpa: "5.80",
      attendance: "58%",
      successScore: 49,
      riskType: "Academic Risk",
      riskBadgeClass: "academic-risk",
      segment: "Critical Academic At-Risk",
      status: "Parent Meeting Called"
    }
  ]
};
