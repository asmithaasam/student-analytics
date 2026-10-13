/* ==========================================================================
   AI-POWERED STUDENT ANALYTICS & SUCCESS PLATFORM
   Main UI Controller & Interactive Form Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons if available
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // State
  let currentRole = 'student'; // 'student', 'faculty', 'admin'
  let activeView = 'login'; // 'login', 'register', 'dashboard'

  // DOM Elements - Views
  const loginView = document.getElementById('login-view');
  const registerView = document.getElementById('register-view');
  const dashboardView = document.getElementById('dashboard-view');
  const forgotModal = document.getElementById('forgot-modal');
  const supabaseModal = document.getElementById('supabase-modal');

  // DOM Elements - Navigation buttons
  const navLoginBtn = document.getElementById('nav-login-btn');
  const navRegisterBtn = document.getElementById('nav-register-btn');
  const navDashboardBtn = document.getElementById('nav-dashboard-btn');
  const brandLogoHome = document.getElementById('brand-home-link');
  const openSupabaseSettingsBtn = document.getElementById('btn-open-supabase-settings');

  // Form Elements - Login
  const loginForm = document.getElementById('login-form');
  const loginEmailInput = document.getElementById('login-email');
  const loginPasswordInput = document.getElementById('login-password');
  const loginTogglePwdBtn = document.getElementById('login-toggle-pwd');
  const rememberMeCheckbox = document.getElementById('remember-me');
  const loginSubmitBtn = document.getElementById('login-submit-btn');
  const loginErrorBanner = document.getElementById('login-error-banner');
  const loginSuccessBanner = document.getElementById('login-success-banner');
  const quickDemoStudentBtn = document.getElementById('role-student');
  const quickDemoFacultyBtn = document.getElementById('role-faculty');
  const quickDemoAdminBtn = document.getElementById('role-admin');
  const instantDemoBtn = document.getElementById('instant-demo-btn');
  const googleSignInBtn = document.getElementById('google-signin-btn');
  const switchToRegisterLink = document.getElementById('switch-to-register');
  const forgotPasswordLink = document.getElementById('forgot-password-link');

  // Form Elements - Register
  const registerForm = document.getElementById('register-form');
  const regFullNameInput = document.getElementById('reg-fullname');
  const regEmailInput = document.getElementById('reg-email');
  const regPasswordInput = document.getElementById('reg-password');
  const regConfirmPasswordInput = document.getElementById('reg-conf-password');
  const regCollegeInput = document.getElementById('reg-college');
  const regDeptSelect = document.getElementById('reg-department');
  const regYearSelect = document.getElementById('reg-year');
  const regStudentIdInput = document.getElementById('reg-student-id');
  const regTermsCheckbox = document.getElementById('reg-terms');
  const regTogglePwdBtn = document.getElementById('reg-toggle-pwd');
  const regToggleConfPwdBtn = document.getElementById('reg-toggle-conf-pwd');
  const registerSubmitBtn = document.getElementById('register-submit-btn');
  const registerErrorBanner = document.getElementById('register-error-banner');
  const switchToLoginLink = document.getElementById('switch-to-login');
  const regFormBody = document.getElementById('register-form-body');
  const regSuccessBody = document.getElementById('register-success-body');
  const regContinueDashBtn = document.getElementById('reg-continue-dash-btn');

  // Password strength elements
  const strengthBars = [
    document.getElementById('strength-bar-1'),
    document.getElementById('strength-bar-2'),
    document.getElementById('strength-bar-3'),
    document.getElementById('strength-bar-4'),
  ];
  const strengthScoreText = document.getElementById('strength-score-text');
  const critLength = document.getElementById('crit-length');
  const critUpper = document.getElementById('crit-upper');
  const critNumber = document.getElementById('crit-number');
  const critSpecial = document.getElementById('crit-special');

  // Load remembered email if present
  const rememberedEmail = localStorage.getItem('sa_remembered_email');
  if (rememberedEmail && loginEmailInput) {
    loginEmailInput.value = rememberedEmail;
    if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
  }

  // --- View Switcher ---
  function switchView(viewName) {
    activeView = viewName;
    if (loginView) loginView.classList.remove('active');
    if (registerView) registerView.classList.remove('active');
    if (dashboardView) dashboardView.classList.remove('active');

    // Hide banners
    hideBanners();

    if (viewName === 'login') {
      loginView.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'register') {
      registerView.classList.add('active');
      if (regFormBody) regFormBody.style.display = 'block';
      if (regSuccessBody) regSuccessBody.style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'dashboard') {
      dashboardView.classList.add('active');
      initDashboardView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // Navigation Event Listeners
  if (navLoginBtn) navLoginBtn.addEventListener('click', () => switchView('login'));
  if (navRegisterBtn) navRegisterBtn.addEventListener('click', () => switchView('register'));
  if (navDashboardBtn) navDashboardBtn.addEventListener('click', () => switchView('dashboard'));
  if (brandLogoHome) brandLogoHome.addEventListener('click', () => switchView('login'));
  if (switchToRegisterLink) switchToRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('register');
  });
  if (switchToLoginLink) switchToLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('login');
  });

  // --- Role Quick Selector for Hackathon Demo ---
  const demoRoleBtns = [quickDemoStudentBtn, quickDemoFacultyBtn, quickDemoAdminBtn];
  demoRoleBtns.forEach((btn) => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      demoRoleBtns.forEach((b) => b && b.classList.remove('active'));
      btn.classList.add('active');
      currentRole = btn.getAttribute('data-role');

      // Autofill demo profile for instant demonstration convenience
      if (currentRole === 'student') {
        loginEmailInput.value = 'aditya.verma@campus.edu';
        loginPasswordInput.value = 'Student@2026';
      } else if (currentRole === 'faculty') {
        loginEmailInput.value = 'prof.sharma@campus.edu';
        loginPasswordInput.value = 'Faculty@2026';
      } else if (currentRole === 'admin') {
        loginEmailInput.value = 'dean.analytics@campus.edu';
        loginPasswordInput.value = 'Chancellor@2026';
      }
    });
  });

  // Toggle Password Visibility
  function setupPasswordToggle(input, toggleBtn) {
    if (!input || !toggleBtn) return;
    toggleBtn.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      toggleBtn.innerHTML = isPassword
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    });
  }

  setupPasswordToggle(loginPasswordInput, loginTogglePwdBtn);
  setupPasswordToggle(regPasswordInput, regTogglePwdBtn);
  setupPasswordToggle(regConfirmPasswordInput, regToggleConfPwdBtn);

  // --- Password Strength Meter ---
  if (regPasswordInput) {
    regPasswordInput.addEventListener('input', () => {
      const val = regPasswordInput.value;
      const lengthValid = val.length >= 8;
      const upperValid = /[A-Z]/.test(val);
      const numberValid = /[0-9]/.test(val);
      const specialValid = /[^A-Za-z0-9]/.test(val);

      updateCriteriaPill(critLength, lengthValid);
      updateCriteriaPill(critUpper, upperValid);
      updateCriteriaPill(critNumber, numberValid);
      updateCriteriaPill(critSpecial, specialValid);

      let score = 0;
      if (lengthValid) score++;
      if (upperValid) score++;
      if (numberValid) score++;
      if (specialValid) score++;

      updateStrengthBars(score);
    });
  }

  function updateCriteriaPill(pill, isValid) {
    if (!pill) return;
    if (isValid) {
      pill.classList.add('met');
    } else {
      pill.classList.remove('met');
    }
  }

  function updateStrengthBars(score) {
    const colors = ['#F43F5E', '#F59E0B', '#3B82F6', '#10B981'];
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];

    strengthBars.forEach((bar, idx) => {
      if (!bar) return;
      if (score > idx) {
        bar.style.backgroundColor = colors[score - 1];
      } else {
        bar.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      }
    });

    if (strengthScoreText) {
      if (score === 0) {
        strengthScoreText.textContent = 'None';
        strengthScoreText.style.color = 'var(--text-muted)';
      } else {
        strengthScoreText.textContent = labels[score - 1];
        strengthScoreText.style.color = colors[score - 1];
      }
    }
  }

  // --- Form Validation Helpers ---
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setFieldError(input, errorElement, message) {
    if (input) input.classList.add('has-error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'flex';
    }
  }

  function clearFieldError(input, errorElement) {
    if (input) input.classList.remove('has-error');
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }

  function hideBanners() {
    if (loginErrorBanner) loginErrorBanner.style.display = 'none';
    if (loginSuccessBanner) loginSuccessBanner.style.display = 'none';
    if (registerErrorBanner) registerErrorBanner.style.display = 'none';
  }

  // --- Login Form Submit ---
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideBanners();

      const email = loginEmailInput.value.trim();
      const password = loginPasswordInput.value;
      const emailError = document.getElementById('login-email-error');
      const passwordError = document.getElementById('login-pwd-error');

      let isValid = true;
      clearFieldError(loginEmailInput, emailError);
      clearFieldError(loginPasswordInput, passwordError);

      if (!email) {
        setFieldError(loginEmailInput, emailError, 'Email address is required');
        isValid = false;
      } else if (!validateEmail(email)) {
        setFieldError(loginEmailInput, emailError, 'Please enter a valid academic email address');
        isValid = false;
      }

      if (!password) {
        setFieldError(loginPasswordInput, passwordError, 'Password is required');
        isValid = false;
      }

      if (!isValid) return;

      // Handle Remember Me
      if (rememberMeCheckbox && rememberMeCheckbox.checked) {
        localStorage.setItem('sa_remembered_email', email);
      } else {
        localStorage.removeItem('sa_remembered_email');
      }

      // Submit loading state
      setBtnLoading(loginSubmitBtn, true, 'Signing in...');

      try {
        const result = await window.authService.signIn({
          email,
          password,
          role: currentRole,
        });

        // Show Success
        if (loginSuccessBanner) {
          loginSuccessBanner.textContent = `✓ Access granted as ${currentRole.toUpperCase()} (${result.mode === 'supabase' ? 'Supabase Verified' : 'Smart Demo Mode'}). Redirecting to Student Analytics Dashboard...`;
          loginSuccessBanner.style.display = 'flex';
        }

        setTimeout(() => {
          setBtnLoading(loginSubmitBtn, false, 'Sign In');
          switchView('dashboard');
        }, 800);
      } catch (err) {
        setBtnLoading(loginSubmitBtn, false, 'Sign In');
        if (loginErrorBanner) {
          loginErrorBanner.textContent = `✕ Sign in error: ${err.message || 'Invalid credentials'}`;
          loginErrorBanner.style.display = 'flex';
        }
      }
    });
  }

  // Instant Demo Access Button
  if (instantDemoBtn) {
    instantDemoBtn.addEventListener('click', () => {
      loginEmailInput.value = 'demo.faculty@campus.edu';
      loginPasswordInput.value = 'DemoAccess@2026';
      currentRole = 'faculty';
      loginForm.dispatchEvent(new Event('submit'));
    });
  }

  // Google Sign In
  if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', () => {
      if (window.authService.isSupabaseConfigured()) {
        window.authService.client.auth.signInWithOAuth({ provider: 'google' });
      } else {
        // Friendly Demo Feedback
        loginEmailInput.value = 'google.verified@campus.edu';
        loginPasswordInput.value = 'GoogleSSO@2026';
        if (loginSuccessBanner) {
          loginSuccessBanner.textContent = '✓ Google Campus Single Sign-On Authenticated (Demo Mode)';
          loginSuccessBanner.style.display = 'flex';
        }
        setTimeout(() => {
          switchView('dashboard');
        }, 700);
      }
    });
  }

  // --- Registration Form Submit ---
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideBanners();

      const fullName = regFullNameInput.value.trim();
      const email = regEmailInput.value.trim();
      const password = regPasswordInput.value;
      const confPassword = regConfirmPasswordInput.value;
      const college = regCollegeInput.value.trim();
      const department = regDeptSelect.value;
      const studyYear = regYearSelect.value;
      const studentId = regStudentIdInput.value.trim();
      const termsAccepted = regTermsCheckbox.checked;

      let isValid = true;

      // Fields validation
      clearFieldError(regFullNameInput, document.getElementById('reg-name-error'));
      clearFieldError(regEmailInput, document.getElementById('reg-email-error'));
      clearFieldError(regPasswordInput, document.getElementById('reg-pwd-error'));
      clearFieldError(regConfirmPasswordInput, document.getElementById('reg-conf-pwd-error'));
      clearFieldError(regCollegeInput, document.getElementById('reg-college-error'));
      clearFieldError(regStudentIdInput, document.getElementById('reg-id-error'));

      if (!fullName) {
        setFieldError(regFullNameInput, document.getElementById('reg-name-error'), 'Full name is required');
        isValid = false;
      }

      if (!email || !validateEmail(email)) {
        setFieldError(regEmailInput, document.getElementById('reg-email-error'), 'Valid student email required');
        isValid = false;
      }

      if (!password || password.length < 8) {
        setFieldError(regPasswordInput, document.getElementById('reg-pwd-error'), 'Password must be at least 8 characters');
        isValid = false;
      }

      if (password !== confPassword) {
        setFieldError(regConfirmPasswordInput, document.getElementById('reg-conf-pwd-error'), 'Passwords do not match');
        isValid = false;
      }

      if (!college) {
        setFieldError(regCollegeInput, document.getElementById('reg-college-error'), 'College / University name required');
        isValid = false;
      }

      if (!studentId) {
        setFieldError(regStudentIdInput, document.getElementById('reg-id-error'), 'Student ID or Roll Number required');
        isValid = false;
      }

      if (!termsAccepted) {
        if (registerErrorBanner) {
          registerErrorBanner.textContent = 'Please accept the Terms of Service & Privacy Policy to proceed';
          registerErrorBanner.style.display = 'flex';
        }
        return;
      }

      if (!isValid) return;

      setBtnLoading(registerSubmitBtn, true, 'Creating Student Account...');

      try {
        const result = await window.authService.signUp({
          fullName,
          email,
          password,
          college,
          department,
          studyYear,
          studentId,
        });

        setBtnLoading(registerSubmitBtn, false, 'Create My Account');

        // Render Success Card
        if (regFormBody && regSuccessBody) {
          regFormBody.style.display = 'none';
          regSuccessBody.style.display = 'flex';

          document.getElementById('success-name-display').textContent = fullName;
          document.getElementById('success-email-display').textContent = email;
          document.getElementById('success-dept-display').textContent = `${department} (${studyYear})`;
          document.getElementById('success-id-display').textContent = studentId;
          document.getElementById('success-mode-display').textContent =
            result.mode === 'supabase' ? 'Supabase Auth (Cloud Live)' : 'Demo Session Saved';
        }
      } catch (err) {
        setBtnLoading(registerSubmitBtn, false, 'Create My Account');
        if (registerErrorBanner) {
          registerErrorBanner.textContent = `✕ Registration error: ${err.message || 'Could not complete registration'}`;
          registerErrorBanner.style.display = 'flex';
        }
      }
    });
  }

  // Continue to Dashboard after Registration
  if (regContinueDashBtn) {
    regContinueDashBtn.addEventListener('click', () => {
      switchView('dashboard');
    });
  }

  // --- Forgot Password Flow ---
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (forgotModal) forgotModal.classList.add('active');
    });
  }

  const forgotCloseBtn = document.getElementById('forgot-modal-close');
  if (forgotCloseBtn) {
    forgotCloseBtn.addEventListener('click', () => {
      if (forgotModal) forgotModal.classList.remove('active');
    });
  }

  const forgotForm = document.getElementById('forgot-form');
  if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('forgot-email-input').value.trim();
      const statusBox = document.getElementById('forgot-status-msg');
      const submitBtn = document.getElementById('forgot-submit-btn');

      if (!email || !validateEmail(email)) {
        statusBox.textContent = 'Please enter a valid registered email address.';
        statusBox.className = 'notification-banner error';
        statusBox.style.display = 'flex';
        return;
      }

      setBtnLoading(submitBtn, true, 'Sending link...');
      await window.authService.resetPassword(email);
      setBtnLoading(submitBtn, false, 'Send Reset Link');

      statusBox.textContent = `✓ Password reset link has been dispatched to ${email}. Check your inbox.`;
      statusBox.className = 'notification-banner success';
      statusBox.style.display = 'flex';

      setTimeout(() => {
        if (forgotModal) forgotModal.classList.remove('active');
      }, 2500);
    });
  }

  // --- Supabase Config Modal ---
  if (openSupabaseSettingsBtn) {
    openSupabaseSettingsBtn.addEventListener('click', () => {
      if (supabaseModal) {
        document.getElementById('cfg-supabase-url').value = window.authService.config.supabaseUrl;
        document.getElementById('cfg-supabase-key').value = window.authService.config.supabaseKey;
        supabaseModal.classList.add('active');
      }
    });
  }

  const supabaseModalClose = document.getElementById('supabase-modal-close');
  if (supabaseModalClose) {
    supabaseModalClose.addEventListener('click', () => {
      if (supabaseModal) supabaseModal.classList.remove('active');
    });
  }

  const supabaseConfigForm = document.getElementById('supabase-config-form');
  if (supabaseConfigForm) {
    supabaseConfigForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const url = document.getElementById('cfg-supabase-url').value;
      const key = document.getElementById('cfg-supabase-key').value;
      window.authService.saveSupabaseConfig(url, key);

      const statusBox = document.getElementById('cfg-status-msg');
      statusBox.textContent = url ? '✓ Supabase credentials configured successfully!' : '✓ Switched to Smart Demo Mode.';
      statusBox.className = 'notification-banner success';
      statusBox.style.display = 'flex';

      setTimeout(() => {
        if (supabaseModal) supabaseModal.classList.remove('active');
      }, 1200);
    });
  }

  // --- Helper: Button Loading State ---
  function setBtnLoading(button, isLoading, text) {
    if (!button) return;
    if (isLoading) {
      button.disabled = true;
      button.innerHTML = `<span class="spinner"></span> <span>${text}</span>`;
    } else {
      button.disabled = false;
      button.innerHTML = `<span>${text}</span> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
    }
  }

  // --- Interactive Dashboard View Rendering ---
  function initDashboardView() {
    if (typeof PLATFORM_DATA === 'undefined') return;

    // Render Segmentation Grid (KPMG Bonus feature 1)
    const segContainer = document.getElementById('dash-segmentation-container');
    if (segContainer && !segContainer.hasChildNodes()) {
      PLATFORM_DATA.segments.forEach((seg) => {
        const item = document.createElement('div');
        item.className = `segment-item ${seg.isSpecialAlert ? 'special-alert' : ''}`;
        item.innerHTML = `
          <div class="segment-header">
            <span class="segment-name">${seg.title}</span>
            <span class="segment-count-badge" style="background: rgba(59, 130, 246, 0.2); color: var(--cyan-bright);">${seg.count} Students</span>
          </div>
          <p class="segment-desc">${seg.desc}</p>
          <div class="segment-intervention-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
            ${seg.intervention}
          </div>
        `;
        item.addEventListener('click', () => {
          document.querySelectorAll('.segment-item').forEach((s) => s.classList.remove('highlighted'));
          item.classList.add('highlighted');
          filterRosterBySegment(seg.title);
        });
        segContainer.appendChild(item);
      });
    }

    // Render Explainable Score Indicators (KPMG Bonus feature 2)
    const indicatorsList = document.getElementById('dash-indicators-list');
    if (indicatorsList && !indicatorsList.hasChildNodes()) {
      PLATFORM_DATA.explainableScore.indicators.forEach((ind) => {
        const row = document.createElement('div');
        row.className = 'indicator-row';
        row.innerHTML = `
          <div class="indicator-meta">
            <span class="indicator-name">${ind.name}</span>
            <span class="indicator-impact ${ind.isPositive ? 'positive' : 'negative'}">${ind.impact}</span>
          </div>
          <div class="indicator-progress-bar">
            <div class="indicator-fill ${ind.isPositive ? 'pos' : 'neg'}" style="width: ${ind.width}%;"></div>
          </div>
        `;
        indicatorsList.appendChild(row);
      });
    }

    // Render Student Table
    renderStudentTable(PLATFORM_DATA.students);

    // Filter controls
    const searchInput = document.getElementById('roster-search');
    const deptFilter = document.getElementById('roster-dept-filter');
    const riskFilter = document.getElementById('roster-risk-filter');

    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }
    if (deptFilter) {
      deptFilter.addEventListener('change', applyFilters);
    }
    if (riskFilter) {
      riskFilter.addEventListener('change', applyFilters);
    }

    function applyFilters() {
      const q = searchInput ? searchInput.value.toLowerCase() : '';
      const dept = deptFilter ? deptFilter.value : 'all';
      const risk = riskFilter ? riskFilter.value : 'all';

      const filtered = PLATFORM_DATA.students.filter((st) => {
        const matchQ = st.name.toLowerCase().includes(q) || st.id.toLowerCase().includes(q);
        const matchDept = dept === 'all' || st.dept === dept;
        const matchRisk = risk === 'all' || (risk === 'risk' && st.riskType.includes('Risk')) || (risk === 'safe' && st.riskType.includes('Safe'));
        return matchQ && matchDept && matchRisk;
      });

      renderStudentTable(filtered);
    }

    function filterRosterBySegment(segmentName) {
      const filtered = PLATFORM_DATA.students.filter((st) => st.segment === segmentName);
      renderStudentTable(filtered.length > 0 ? filtered : PLATFORM_DATA.students);
    }

    // Dashboard Logout
    const dashLogoutBtn = document.getElementById('dash-logout-btn');
    if (dashLogoutBtn) {
      dashLogoutBtn.addEventListener('click', () => {
        window.authService.signOut();
        switchView('login');
      });
    }
  }

  function renderStudentTable(students) {
    const tbody = document.getElementById('student-roster-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (students.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No matching student records found.</td></tr>`;
      return;
    }

    students.forEach((st) => {
      const tr = document.createElement('tr');
      const scoreBadgeType = st.successScore >= 80 ? 'high' : st.successScore >= 60 ? 'medium' : 'risk';

      tr.innerHTML = `
        <td>
          <div class="student-cell">
            <div class="student-avatar">${st.name.charAt(0)}</div>
            <div>
              <div style="font-weight: 700; color: #FFFFFF;">${st.name}</div>
              <div style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono);">${st.id}</div>
            </div>
          </div>
        </td>
        <td><span style="font-weight: 600;">${st.dept}</span> (${st.year})</td>
        <td style="font-family: var(--font-mono); font-weight: 700;">${st.cgpa}</td>
        <td style="font-family: var(--font-mono);">${st.attendance}</td>
        <td>
          <span class="score-badge ${scoreBadgeType}">${st.successScore}/100</span>
        </td>
        <td>
          <span class="risk-pill ${st.riskBadgeClass}">
            ${st.riskType}
          </span>
        </td>
        <td>
          <button class="action-icon-btn" onclick="alert('Intervention Plan generated for ${st.name} [${st.id}]')">Action Plan</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
});
