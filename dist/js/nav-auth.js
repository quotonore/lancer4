// nav-auth.js - lightweight auth-aware nav updater
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth } from './firebase-init.js';

function addLogoutNav(navLinks) {
  if (document.getElementById('logoutNav')) return;
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = '#';
  a.id = 'logoutNav';
  a.textContent = 'Logout';
  li.appendChild(a);
  navLinks.appendChild(li);
  a.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      // after sign out, go to login page
      window.location.href = 'login.html';
    } catch (err) {
      console.error('[nav-auth] signOut failed', err);
    }
  });
}

function addLoginNav(navLinks) {
  // don't duplicate
  if (navLinks.querySelector('a[href="login.html"]')) return;
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = 'login.html';
  a.textContent = 'Login';
  li.appendChild(a);
  navLinks.appendChild(li);
}

onAuthStateChanged(auth, (user) => {
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;
  if (user) {
    // remove login link if present
    const loginAnchor = navLinks.querySelector('a[href="login.html"]');
    if (loginAnchor && loginAnchor.parentElement) loginAnchor.parentElement.remove();
    addLogoutNav(navLinks);
  } else {
    // remove logoutNav if present
    const logout = document.getElementById('logoutNav');
    if (logout && logout.parentElement) logout.parentElement.remove();
    addLoginNav(navLinks);
  }
});
