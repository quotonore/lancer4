// nav-auth.js - lightweight auth-aware nav updater
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth } from './firebase-init.js';

// Update the existing Login link to show account name and use a dropdown for logout.
onAuthStateChanged(auth, (user) => {
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;

  // find the existing Login anchor (from HTML)
  const loginAnchor = navLinks.querySelector('a[href="login.html"]');
  if (!loginAnchor) return;

  const parentLi = loginAnchor.parentElement;

  // helper to remove any dropdown menu we added previously
  function removeDropdown() {
    if (parentLi.classList.contains('dropdown')) parentLi.classList.remove('dropdown');
    const existingMenu = parentLi.querySelector('.dropdown-menu');
    if (existingMenu) existingMenu.remove();
    // reset anchor text and href
    loginAnchor.textContent = 'Login';
    loginAnchor.href = 'login.html';
  }

  if (user) {
    // show user's displayName (fallback to email local part)
    const name = user.displayName || (user.email ? user.email.split('@')[0] : 'Account');
    loginAnchor.textContent = name;
    // clicking the name should go to protected page
    loginAnchor.href = 'protected.html';

    // ensure we don't add duplicate menu
    if (!parentLi.querySelector('.dropdown-menu')) {
      parentLi.classList.add('dropdown');
      const menu = document.createElement('ul');
      menu.classList.add('dropdown-menu');

      const item = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#';
      a.id = 'logoutNav';
      a.textContent = 'Logout';
      item.appendChild(a);
      menu.appendChild(item);
      parentLi.appendChild(menu);

      a.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          await signOut(auth);
          // after sign out, redirect to login
          window.location.href = 'login.html';
        } catch (err) {
          console.error('[nav-auth] signOut failed', err);
        }
      });
    }
  } else {
    // logged out: remove dropdown and restore Login link
    removeDropdown();
  }
});
