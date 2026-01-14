// protected.js - small client-side discussion board
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth } from './auth.js';

const STORAGE_KEY = 'trymentor_posts_v1';

const postsList = document.getElementById('postsList');
const postForm = document.getElementById('postForm');
const postTitle = document.getElementById('postTitle');
const postBody = document.getElementById('postBody');
const projectNameEl = document.getElementById('projectName');
const projectLinkEl = document.getElementById('projectLink');
const codeSnippetEl = document.getElementById('codeSnippet');
const attachmentsInput = document.getElementById('attachments');
const attachmentPreview = document.getElementById('attachmentPreview');
const signedInUserEl = document.getElementById('signedInUser');
const userEmailEl = document.getElementById('userEmail');
let lastAttachments = [];

function loadPosts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (e) {
    console.error(e);
    return [];
  }
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function escapeHtml(s) {
  if (!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderPosts(currentUid) {
  const posts = loadPosts().sort((a,b) => b.createdAt - a.createdAt);
  postsList.innerHTML = '';
  const noPostsMsg = document.getElementById('noPostsMsg');
  if (posts.length === 0) {
    if (noPostsMsg) noPostsMsg.style.display = 'block';
    return;
  }
  if (noPostsMsg) noPostsMsg.style.display = 'none';
  const ul = document.createElement('ul');
  ul.className = 'posts-ul';
  posts.forEach(p => {
    const li = document.createElement('li');
    li.className = 'post-item';
    li.innerHTML = `
      <div class="post-header" style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <div><strong>${escapeHtml(p.authorName)}</strong><div class="muted" style="font-size:0.9rem">${escapeHtml(p.projectName || '')}${p.projectLink ? ' • <a href="'+escapeHtml(p.projectLink)+'" target="_blank">link</a>' : ''}</div></div>
        <span class="post-meta">${new Date(p.createdAt).toLocaleString()}</span>
      </div>
      <h4 class="post-title">${escapeHtml(p.title)}</h4>
      <p class="post-body">${escapeHtml(p.body)}</p>
    `;
    if (p.codeSnippet) {
      const pre = document.createElement('pre');
      pre.style.background = '#f7f7f9';
      pre.style.padding = '10px';
      pre.style.borderRadius = '6px';
      pre.style.overflowX = 'auto';
      pre.textContent = p.codeSnippet;
      li.appendChild(pre);
    }
    // render attachments (images inline, zips as download links)
    if (p.attachments && p.attachments.length) {
      const attachWrap = document.createElement('div');
      attachWrap.style.display = 'flex';
      attachWrap.style.flexWrap = 'wrap';
      attachWrap.style.gap = '8px';
      attachWrap.style.marginTop = '10px';
      p.attachments.forEach(a => {
        if (a.type && a.type.startsWith('image/') && a.dataUrl) {
          const img = document.createElement('img');
          img.src = a.dataUrl;
          img.style.maxWidth = '160px';
          img.style.maxHeight = '120px';
          img.style.borderRadius = '6px';
          img.style.objectFit = 'cover';
          attachWrap.appendChild(img);
        } else if (a.name) {
          const link = document.createElement('a');
          link.href = a.dataUrl || '#';
          link.textContent = a.name;
          link.target = '_blank';
          link.className = 'btn';
          attachWrap.appendChild(link);
        }
      });
      li.appendChild(attachWrap);
    }
    if (p.authorUid === currentUid) {
      const del = document.createElement('button');
      del.className = 'btn secondary-btn';
      del.textContent = 'Delete';
      del.addEventListener('click', () => {
        const remaining = loadPosts().filter(x => x.id !== p.id);
        savePosts(remaining);
        renderPosts(currentUid);
      });
      li.appendChild(del);
    }
    ul.appendChild(li);
  });
  postsList.appendChild(ul);
}

onAuthStateChanged(auth, user => {
  console.log('[protected] auth change', new Date().toISOString(), { uid: user ? user.uid : null, email: user ? user.email : null });
  if (!user) {
    // show a clear not-signed-in state in the UI
    if (signedInUserEl) signedInUserEl.textContent = 'Not signed in';
    if (userEmailEl) userEmailEl.textContent = '';
    // still render posts in read-only mode
    renderPosts(null);
    return;
  }
  signedInUserEl.textContent = user.displayName || user.email || 'User';
  userEmailEl.textContent = user.email || '';
  renderPosts(user.uid);
});

if (postForm) {
  postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = postTitle.value.trim();
    const body = postBody.value.trim();
    if (!title || !body) return alert('Please provide title and description');
    const user = auth.currentUser;
    if (!user) return alert('Please sign in');
    const posts = loadPosts();
    posts.push({
      id: 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2,8),
      title, body,
      projectName: projectNameEl ? projectNameEl.value.trim() : '',
      projectLink: projectLinkEl ? projectLinkEl.value.trim() : '',
      codeSnippet: codeSnippetEl ? codeSnippetEl.value.trim().slice(0,2000) : '',
      attachments: lastAttachments && lastAttachments.length ? lastAttachments.slice(0) : [],
      authorUid: user.uid,
      authorName: user.displayName || user.email || 'User',
      createdAt: Date.now()
    });
    savePosts(posts);
    postForm.reset();
    // clear attachment preview UI
    if (attachmentPreview) attachmentPreview.innerHTML = '';
    // clear last attachments and file input
    lastAttachments = [];
    if (attachmentsInput) attachmentsInput.value = '';
    renderPosts(user.uid);
    const msg = document.getElementById('postMessage');
    if (msg) {
      msg.textContent = 'Posted!';
      setTimeout(() => { msg.textContent = ''; }, 2500);
    }
  });
}

// Attachment handling: preview selected files and prepare for persistence
const MAX_TOTAL_ATTACHMENT_BYTES = 2 * 1024 * 1024; // 2MB total per post
if (attachmentsInput) {
  attachmentsInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files || []);
    attachmentPreview.innerHTML = '';
    lastAttachments = [];
    let total = 0;
    for (const file of files) {
      total += file.size;
      if (total > MAX_TOTAL_ATTACHMENT_BYTES) {
        const warn = document.createElement('div');
        warn.className = 'muted';
        warn.textContent = 'Attachments exceed 2MB total — extra files ignored.';
        attachmentPreview.appendChild(warn);
        break;
      }
      if (file.type && file.type.startsWith('image/')) {
        // show image preview and store dataUrl
        const reader = new FileReader();
        reader.onload = () => {
          const img = document.createElement('img');
          img.src = reader.result;
          img.style.maxWidth = '160px';
          img.style.maxHeight = '120px';
          img.style.borderRadius = '6px';
          img.style.objectFit = 'cover';
          attachmentPreview.appendChild(img);
          lastAttachments.push({ name: file.name, type: file.type, dataUrl: reader.result });
        };
        reader.readAsDataURL(file);
      } else {
        // for zip or other files, just show filename and store as dataUrl (if small)
        const li = document.createElement('div');
        li.textContent = file.name;
        li.className = 'muted';
        attachmentPreview.appendChild(li);
        try {
          const reader = new FileReader();
          reader.onload = () => {
            lastAttachments.push({ name: file.name, type: file.type, dataUrl: reader.result });
          };
          reader.readAsDataURL(file);
        } catch (err) {
          console.warn('attachment read failed', err);
        }
      }
    }
  });
}

// attachments are captured in `lastAttachments` by the input change handler and stored with each post

window._trymentor = { loadPosts, savePosts };
