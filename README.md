# AI-Powered Student Analytics and Success Platform
### Smart Campus Analytics: Predict, Optimize & Improve Student Success (KPMG Hackathon)

A world-class, futuristic AI SaaS authentication and student decision intelligence platform designed for colleges, universities, faculty members, placement officers, and campus administrators.

---

## 🌟 Key Highlights & Design System

1. **Design Theme**:
   - Deep midnight navy blue (`#050816`) with subtle multi-layer glassmorphism (`backdrop-filter: blur(24px)`).
   - Electric blue (`#3B82F6`) and cyan highlights (`#22D3EE`).
   - Interactive HTML5 Canvas neural network with dynamic particle physics and real-time data packets.
   - Clean, modern typography using Google Font **Plus Jakarta Sans** and **JetBrains Mono**.

2. **Master Login Page**:
   - **Balanced Two-Column Layout**: Left AI branding & 3 feature highlight cards (*Intelligent Risk Detection*, *Student Success Prediction*, *Placement Readiness Insights*).
   - **Glassmorphic Login Card**: Floating glow, email and password inputs with Lucide icons, show/hide toggle.
   - **Quick Demo Profile Switcher**: One-click autofill for `Student`, `Faculty / TPO`, and `Admin / Dean`.
   - **Remember Me & Forgot Password**: Retains remembered email safely, functional modal recovery flow.
   - **Google Campus SSO & Instant Judge Access Button**.

3. **Master Registration Page**:
   - **Split-Screen Experience**: Left student success journey overview (*StudentSuccess AI*, career readiness scorecards).
   - **8 Comprehensive Form Fields**:
     1. Full Name
     2. Student Email Address
     3. Create Password
     4. Confirm Password
     5. College / University Name
     6. Department (CSE, ECE, EEE, IT, Mechanical, Civil, Other)
     7. Current Study Year (1st, 2nd, 3rd, 4th Year)
     8. Student ID / Roll Number
   - **Interactive Password Strength Meter**: 4-segment reactive color track (Weak/Fair/Good/Strong) + live rule validation.
   - **Terms & Privacy Checkbox**.
   - **Celebration Success Screen**: Displays profile summary card and smooth transition to dashboard.

4. **KPMG Hackathon Evaluation Suite & Integrated Dashboard**:
   - **7 Core Scope Pillars**: Academic, Attendance, LMS, Engagement, Placement, Skills, Feedback.
   - **Campus Success KPI Cards**: Success score, 42 targeted risk interventions, placement readiness index.
   - **KPMG Bonus Credit 1 — Student Segmentation Matrix**: Directly isolates *"High Academic, Low Placement Readiness"* students to prevent campus placement failures.
   - **KPMG Bonus Credit 2 — Explainable AI Risk Attribution**: Shows exact indicator contribution weights (SHAP values: Mock interviews -28%, Coding test -22%, CGPA +26%).
   - **Student Cohort Registry**: Searchable and filterable by department and risk flags with one-click Action Plan generation.

5. **Dual-Mode Authentication Architecture**:
   - **Smart Demo Mode**: 100% turnkey presentation ready out-of-the-box.
   - **Supabase Cloud Mode**: Complete SQL schema, RLS policies, and trigger provided in `SUPABASE_SETUP.md`.

6. **React + TypeScript Component Suite**:
   - Reusable standalone components located in `react-components/` ready for Next.js or Vite.

---

## 🚀 How to Run Locally

### Option 1: Instant Local Web Server (Python)
The local server is already running on port `5173`:
```bash
# From the project directory:
python -m http.server 5173 --bind 127.0.0.1
```
Open **[http://127.0.0.1:5173](http://127.0.0.1:5173)** in your browser.

### Option 2: Direct File Open
You can also open [index.html](file:///C:/Users/beera/.gemini/antigravity-ide/scratch/student-analytics-platform/index.html) directly in any modern browser (Chrome, Edge, Firefox, Safari).

---

## 📁 Directory Structure
```
student-analytics-platform/
├── index.html                   # Complete Single Page Web Application (Login, Register, Dashboard)
├── css/
│   ├── style.css                # Dark futuristic design tokens, glassmorphism, responsive grid
│   ├── animations.css           # Glow pulses, float states, radar sweeps, and reduced motion
│   └── dashboard.css            # KPI cards, segmentation matrix, explainable score cards
├── js/
│   ├── app.js                   # Form validation, password meter, view router, table filters
│   ├── canvas-neural.js         # 60fps canvas particle neural network & data streams
│   ├── auth-service.js          # Supabase SDK connector & Smart Demo fallback
│   └── dashboard-data.js        # KPMG student cohort dataset with explainable SHAP weights
├── react-components/            # Plug-and-play React + TypeScript source files
│   ├── LoginCard.tsx
│   ├── RegisterCard.tsx
│   ├── ForgotPasswordModal.tsx
│   ├── NeuralBackground.tsx
│   ├── types.ts
│   └── supabase.ts
├── SUPABASE_SETUP.md            # PostgreSQL table schema, RLS policies, trigger script
└── README.md                    # Project documentation
```
