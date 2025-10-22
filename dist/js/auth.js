// Firebase imports (use centralized initialization in firebase-init.js)
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, signInWithRedirect, getRedirectResult, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth, provider } from './firebase-init.js';

console.log('[auth.js] module loaded', { auth: !!auth, provider: !!provider });

// Google Login
const googleLoginBtn = document.getElementById('googleLoginBtn');
console.log('[auth] googleLoginBtn element?', !!googleLoginBtn);
if (googleLoginBtn) {
  googleLoginBtn.addEventListener('click', async (e) => {
    console.log('[auth] googleLoginBtn click event', e);
    try {
      console.log('[auth] googleLoginBtn clicked — starting signInWithPopup');
      // Try popup first (better UX); if popup is blocked or not supported, fall back to redirect.
      const result = await signInWithPopup(auth, provider);
      if (result && result.user) {
        console.log('[auth] signInWithPopup success', result.user.uid, result.user.email);
        window.location.href = 'protected.html';
      }
    } catch (error) {
      console.warn('[auth] signInWithPopup failed, attempting redirect fallback', error && error.code ? error.code : error);
      // Known cases where popup can fail: popup-blocked, operation-not-supported-in-this-environment
      try {
        await signInWithRedirect(auth, provider);
      } catch (innerErr) {
        console.error('[auth] googleLoginBtn click error', innerErr);
        const el = document.getElementById('loginError');
        if (el) el.innerText = innerErr.message || String(innerErr);
      }
    }
  });
}

// Google Signup
const googleSignupBtn = document.getElementById('googleSignupBtn');
console.log('[auth] googleSignupBtn element?', !!googleSignupBtn);
if (googleSignupBtn) {
  googleSignupBtn.addEventListener('click', async (e) => {
    console.log('[auth] googleSignupBtn click event', e);
    try {
      console.log('[auth] googleSignupBtn clicked — starting signInWithPopup');
      const result = await signInWithPopup(auth, provider);
      if (result && result.user) {
        console.log('[auth] signInWithPopup success (signup)', result.user.uid, result.user.email);
        window.location.href = 'protected.html';
      }
    } catch (error) {
      console.warn('[auth] signInWithPopup failed for signup, attempting redirect fallback', error && error.code ? error.code : error);
      try {
        await signInWithRedirect(auth, provider);
      } catch (innerErr) {
        console.error('[auth] googleSignupBtn click error', innerErr);
        const el = document.getElementById('signupError');
        if (el) el.innerText = innerErr.message || String(innerErr);
      }
    }
  });
}

// Handle redirect results (this runs on page load after a redirect sign-in)
getRedirectResult(auth).then((result) => {
  if (result && result.user) {
    console.log('[auth] sign-in with redirect completed', result.user.uid, result.user.email);
    // Redirect to protected page after successful redirect sign-in
    window.location.href = 'protected.html';
  }
}).catch((err) => {
  // Log and show any redirect errors
  console.warn('[auth] getRedirectResult error', err && err.message ? err.message : err);
  const el = document.getElementById('loginError') || document.getElementById('signupError');
  if (el) el.innerText = err && err.message ? err.message : String(err);
});
// Global auth-state logger (helps trace unexpected sign-outs)
onAuthStateChanged(auth, (user) => {
  try {
    console.log('[auth] onAuthStateChanged', new Date().toISOString(), { uid: user ? user.uid : null, email: user ? user.email : null, displayName: user ? user.displayName : null });
  } catch (e) {
    console.log('[auth] onAuthStateChanged (error logging)', e);
  }
});

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = 'protected.html';
    } catch (error) {
      document.getElementById('loginError').innerText = error.message;
    }
  });
}

// Signup
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      window.location.href = 'protected.html';
    } catch (error) {
      document.getElementById('signupError').innerText = error.message;
    }
  });
}

// Forget Password
const forgetForm = document.getElementById('forgetPasswordForm');
if (forgetForm) {
  forgetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgetEmail').value;
    try {
      await sendPasswordResetEmail(auth, email);
      document.getElementById('forgetMessage').innerText = 'Reset link sent! Check your email.';
    } catch (error) {
      document.getElementById('forgetMessage').innerText = error.message;
    }
  });
}

// Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = 'login.html';
  });
}

// Protect protected.html
if (window.location.pathname.endsWith('protected.html')) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.warn('[auth] No user present on protected page — redirecting to login', new Date().toISOString());
      window.location.href = 'login.html';
    }
  });
}

// Export auth for other modules (protected page) to use
export { auth };
