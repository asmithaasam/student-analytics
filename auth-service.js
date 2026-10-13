/* ==========================================================================
   AI-POWERED STUDENT ANALYTICS & SUCCESS PLATFORM
   Authentication & Supabase Service Layer
   ========================================================================== */

class AuthService {
  constructor() {
    this.config = {
      supabaseUrl: localStorage.getItem('sa_supabase_url') || '',
      supabaseKey: localStorage.getItem('sa_supabase_key') || '',
    };
    this.client = null;
    this.currentUser = null;
    this.initSupabaseClient();
  }

  initSupabaseClient() {
    if (this.config.supabaseUrl && this.config.supabaseKey && window.supabase) {
      try {
        this.client = window.supabase.createClient(this.config.supabaseUrl, this.config.supabaseKey);
        console.log('✓ Supabase Client initialized with custom credentials');
      } catch (err) {
        console.warn('Could not initialize Supabase Client:', err);
        this.client = null;
      }
    }
  }

  isSupabaseConfigured() {
    return Boolean(this.client);
  }

  saveSupabaseConfig(url, key) {
    if (url) localStorage.setItem('sa_supabase_url', url.trim());
    else localStorage.removeItem('sa_supabase_url');

    if (key) localStorage.setItem('sa_supabase_key', key.trim());
    else localStorage.removeItem('sa_supabase_key');

    this.config.supabaseUrl = url ? url.trim() : '';
    this.config.supabaseKey = key ? key.trim() : '';
    this.initSupabaseClient();
  }

  // Sign In Flow
  async signIn({ email, password, role = 'student' }) {
    // Artificial latency for realistic feedback
    await new Promise((r) => setTimeout(r, 650));

    if (this.isSupabaseConfigured()) {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      this.currentUser = data.user;
      return {
        user: data.user,
        mode: 'supabase',
      };
    }

    // Demo Mode handling
    // Realistic demo validation
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    // Demo user profile
    this.currentUser = {
      id: 'demo-user-' + Math.random().toString(36).substring(2, 9),
      email: email,
      role: role,
      user_metadata: {
        full_name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        role: role,
      },
    };

    return {
      user: this.currentUser,
      mode: 'demo',
    };
  }

  // Registration Flow
  async signUp({ email, password, fullName, college, department, studyYear, studentId }) {
    await new Promise((r) => setTimeout(r, 850));

    if (this.isSupabaseConfigured()) {
      const { data, error } = await this.client.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            college_name: college,
            department: department,
            study_year: studyYear,
            student_id: studentId,
            role: 'student',
          },
        },
      });
      if (error) throw error;

      // Also insert into student_profiles table if configured
      if (data.user) {
        try {
          await this.client.from('student_profiles').insert([
            {
              id: data.user.id,
              full_name: fullName,
              email: email,
              college_name: college,
              department: department,
              study_year: studyYear,
              student_id: studentId,
            },
          ]);
        } catch (dbErr) {
          console.warn('Profile table insert warning:', dbErr);
        }
      }

      this.currentUser = data.user;
      return { user: data.user, mode: 'supabase' };
    }

    // Demo Mode Sign Up
    this.currentUser = {
      id: 'student-' + Math.random().toString(36).substring(2, 9),
      email: email,
      role: 'student',
      user_metadata: {
        full_name: fullName,
        college_name: college,
        department: department,
        study_year: studyYear,
        student_id: studentId,
      },
    };

    return {
      user: this.currentUser,
      mode: 'demo',
    };
  }

  // Password Reset Request Flow
  async resetPassword(email) {
    await new Promise((r) => setTimeout(r, 650));
    if (this.isSupabaseConfigured()) {
      const { error } = await this.client.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      return true;
    }
    // Demo Mode
    return true;
  }

  signOut() {
    if (this.isSupabaseConfigured()) {
      this.client.auth.signOut();
    }
    this.currentUser = null;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

window.authService = new AuthService();
