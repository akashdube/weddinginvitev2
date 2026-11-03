/**
 * Akash & Pranshi Wedding (#APforever)
 * Live Google Sheets Guestbook Integration with Background Liked-By Tracking
 * (UI only displays clean Like counter; Liked-By names are stored privately in Google Sheet)
 */

(function () {
  const form = document.getElementById('blessing-form');
  const nameInput = document.getElementById('guest-name');
  const messageInput = document.getElementById('guest-message');
  const wishesStream = document.getElementById('wishes-stream');

  // Name Capture Modal UI elements
  const likeNameModal = document.getElementById('like-name-modal');
  const likeNameForm = document.getElementById('like-name-form');
  const likeGuestNameInput = document.getElementById('like-guest-name-input');
  const likeNameModalClose = document.getElementById('like-name-modal-close');
  const likeNameModalCancel = document.getElementById('like-name-modal-cancel');
  const likeNameModalAnon = document.getElementById('like-name-modal-anon');

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyl_rw3ZBiOi4Ef860vagzPjrpvvLZPjZJNLHK_Gs6VSqdwSCjT_98acq4LJOBpHUu_aw/exec';
  const STORAGE_WISHES_KEY = 'ap_wedding_wishes_v3';
  const STORAGE_LIKES_KEY = 'ap_wedding_user_likes_v3';
  const STORAGE_GUEST_NAME_KEY = 'ap_wedding_guest_name_v1';

  let pendingLikeAction = null;

  // Retrieve stored guest identity
  function getGuestName() {
    try {
      const stored = localStorage.getItem(STORAGE_GUEST_NAME_KEY);
      if (stored && stored.trim()) return stored.trim();
    } catch (e) { }

    if (nameInput && nameInput.value.trim()) {
      return nameInput.value.trim();
    }
    return '';
  }

  function setGuestName(name) {
    const cleanName = (name || '').trim();
    try {
      if (cleanName) {
        localStorage.setItem(STORAGE_GUEST_NAME_KEY, cleanName);
      }
    } catch (e) { }

    if (nameInput && !nameInput.value.trim() && cleanName) {
      nameInput.value = cleanName;
    }
  }

  // Pre-fill input if name already known
  const initialName = getGuestName();
  if (initialName && nameInput && !nameInput.value) {
    nameInput.value = initialName;
  }

  function getLocalWishes() {
    try {
      const stored = localStorage.getItem(STORAGE_WISHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  function saveLocalWishes(wishes) {
    try {
      localStorage.setItem(STORAGE_WISHES_KEY, JSON.stringify(wishes));
    } catch (e) { }
  }

  function getUserLikes() {
    try {
      const stored = localStorage.getItem(STORAGE_LIKES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  function saveUserLikes(likes) {
    try {
      localStorage.setItem(STORAGE_LIKES_KEY, JSON.stringify(likes));
    } catch (e) { }
  }

  // Helper to extract clean array of liker names for sheet sync
  function getLikedByList(wish) {
    if (!wish) return [];
    if (Array.isArray(wish.likedBy)) {
      return wish.likedBy.map((n) => String(n).trim()).filter(Boolean);
    }
    if (typeof wish.likedBy === 'string' && wish.likedBy.trim()) {
      return wish.likedBy.split(',').map((n) => n.trim()).filter(Boolean);
    }
    return [];
  }

  // Render wishes in the UI (pure, clean design without public liker names)
  function renderWishes(wishes) {
    if (!wishesStream) return;
    const userLikes = getUserLikes();
    wishesStream.innerHTML = '';

    if (!wishes || wishes.length === 0) {
      wishesStream.innerHTML = `
        <div class="empty-wishes-state">
          <span class="empty-icon">🌸</span>
          <p class="empty-title">Be the first to shower blessings on Akash & Pranshi!</p>
          <span class="empty-subtitle">Leave your love and warm wishes above.</span>
        </div>
      `;
      return;
    }

    wishes.forEach((w) => {
      const isLiked = userLikes.includes(w.id);
      const card = document.createElement('div');
      card.className = 'wish-item';
      card.dataset.id = String(w.id);

      card.innerHTML = `
        <div class="wish-header">
          <span class="wish-author">${escapeHtml(w.name)}</span>
          <span class="wish-time">${w.time || 'Recently'}</span>
        </div>
        <p class="wish-text">${escapeHtml(w.text)}</p>
        <button type="button" class="wish-heart-btn ${isLiked ? 'liked' : ''}" data-id="${w.id}">
          <span class="heart-icon">${isLiked ? '❤️' : '🤍'}</span>
          <span class="like-count">${w.likes || 0}</span>
          <span class="like-text">${isLiked ? 'Liked' : 'Like'}</span>
        </button>
      `;

      const heartBtn = card.querySelector('.wish-heart-btn');
      heartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleHeartClick(w, card, wishes);
      });

      wishesStream.appendChild(card);
    });
  }

  // Handle Heart Click (Check name or ask)
  function handleHeartClick(wish, card, allWishes) {
    const userLikes = getUserLikes();
    const isLiked = userLikes.includes(wish.id);

    if (isLiked) {
      // Unliking - does not require asking for name
      const guestName = getGuestName();
      toggleLike(wish, card, allWishes, guestName, false);
    } else {
      // Liking - check if we know who is liking
      const guestName = getGuestName();
      if (guestName) {
        toggleLike(wish, card, allWishes, guestName, true);
      } else {
        // Prompt for guest's name first so it gets recorded in Google Sheet
        openNameModal({
          title: 'Shower Your Love',
          desc: 'Please share your name so Akash & Pranshi know who liked this blessing:',
          defaultName: '',
          onConfirm: (enteredName) => {
            if (enteredName) {
              setGuestName(enteredName);
            }
            toggleLike(wish, card, allWishes, enteredName || '', true);
          }
        });
      }
    }
  }

  // Toggle Like / Unlike execution
  function toggleLike(wish, card, allWishes, guestName, isLiking) {
    let userLikes = getUserLikes();
    let likedBy = getLikedByList(wish);
    const wishId = wish.id;
    const cleanGuest = (guestName || '').trim();

    if (isLiking) {
      if (!userLikes.includes(wishId)) {
        userLikes.push(wishId);
      }

      if (cleanGuest) {
        const alreadyListed = likedBy.some((n) => n.toLowerCase() === cleanGuest.toLowerCase());
        if (!alreadyListed) {
          likedBy.push(cleanGuest);
        }
      }

      wish.likes = Math.max((wish.likes || 0) + 1, likedBy.length);
      wish.likedBy = likedBy;

      if (window.showerBlessingsPetals) {
        window.showerBlessingsPetals();
      }
    } else {
      // Unliking
      userLikes = userLikes.filter((id) => id !== wishId);

      if (cleanGuest) {
        likedBy = likedBy.filter((n) => n.toLowerCase() !== cleanGuest.toLowerCase());
      }
      wish.likes = Math.max(0, (wish.likes || 1) - 1);
      wish.likedBy = likedBy;
    }

    // Update UI Elements on Card (only the heart button and count)
    if (card) {
      const heartBtn = card.querySelector('.wish-heart-btn');
      if (heartBtn) {
        if (isLiking) {
          heartBtn.classList.add('liked');
          heartBtn.querySelector('.heart-icon').textContent = '❤️';
          heartBtn.querySelector('.like-text').textContent = 'Liked';
        } else {
          heartBtn.classList.remove('liked');
          heartBtn.querySelector('.heart-icon').textContent = '🤍';
          heartBtn.querySelector('.like-text').textContent = 'Like';
        }
        heartBtn.querySelector('.like-count').textContent = wish.likes;
      }
    }

    saveLocalWishes(allWishes);
    saveUserLikes(userLikes);

    // Sync Like & Liked-By to Google Sheets privately
    if (wish.row) {
      try {
        fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'like',
            row: wish.row,
            likes: wish.likes,
            userName: cleanGuest,
            likedBy: wish.likedBy.join(', ')
          })
        }).catch(() => { });
      } catch (e) { }
    }
  }

  // Name Prompt Modal Controller
  function openNameModal({ title, desc, defaultName, onConfirm }) {
    if (!likeNameModal) {
      const fallback = prompt(desc || 'Enter your name:', defaultName || '');
      if (fallback !== null) onConfirm(fallback.trim());
      return;
    }

    const titleEl = document.getElementById('like-name-title');
    const descEl = likeNameModal.querySelector('.blessing-modal-desc');

    if (titleEl && title) titleEl.textContent = title;
    if (descEl && desc) descEl.textContent = desc;

    if (likeGuestNameInput) {
      likeGuestNameInput.value = defaultName || '';
    }

    pendingLikeAction = onConfirm;
    likeNameModal.style.display = 'flex';
    setTimeout(() => {
      if (likeGuestNameInput) likeGuestNameInput.focus();
    }, 100);
  }

  function closeNameModal() {
    if (likeNameModal) {
      likeNameModal.style.display = 'none';
    }
    pendingLikeAction = null;
  }

  if (likeNameForm) {
    likeNameForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = likeGuestNameInput ? likeGuestNameInput.value.trim() : '';
      if (!entered) return;

      const action = pendingLikeAction;
      closeNameModal();
      if (action) action(entered);
    });
  }

  if (likeNameModalClose) {
    likeNameModalClose.addEventListener('click', closeNameModal);
  }

  if (likeNameModalCancel) {
    likeNameModalCancel.addEventListener('click', closeNameModal);
  }

  if (likeNameModalAnon) {
    likeNameModalAnon.addEventListener('click', () => {
      const action = pendingLikeAction;
      closeNameModal();
      if (action) action('');
    });
  }

        // Close modal on clicking backdrop or Escape key
        if (likeNameModal) {
          likeNameModal.addEventListener('click', (e) => {
            if (e.target === likeNameModal) {
              likeNameModal.style.display = 'none';
            }
          });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (likeNameModal) likeNameModal.style.display = 'none';
    }
  });

  // Merge remote and local wishes without losing local likedBy info
  function mergeRemoteWishes(localWishes, remoteWishes) {
    if (!Array.isArray(remoteWishes)) return localWishes;
    const localMap = new Map();
    (localWishes || []).forEach((w) => {
      if (w.id) localMap.set(String(w.id), w);
      if (w.row) localMap.set('row_' + w.row, w);
    });

    return remoteWishes.map((rw) => {
      const localMatch = localMap.get(String(rw.id)) || (rw.row ? localMap.get('row_' + rw.row) : null);
      let likedBy = getLikedByList(rw);
      if (likedBy.length === 0 && localMatch) {
        likedBy = getLikedByList(localMatch);
      }

      return {
        ...rw,
        likes: Math.max(rw.likes || 0, likedBy.length),
        likedBy: likedBy
      };
    });
  }

  // Load Wishes from Google Sheets (with local fallback)
  function fetchWishesFromGoogleSheet() {
    const local = getLocalWishes();
    renderWishes(local);

    fetch(GOOGLE_SCRIPT_URL)
      .then((res) => res.json())
      .then((remoteWishes) => {
        if (Array.isArray(remoteWishes)) {
          const merged = mergeRemoteWishes(local, remoteWishes);
          saveLocalWishes(merged);
          renderWishes(merged);
        }
      })
      .catch((err) => {
        console.log('Google Sheets sync notice:', err);
      });
  }

  // Form Submit Handler for New Blessings
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const text = messageInput.value.trim();

      if (!name || !text) return;

      // Remember guest name for background liking
      setGuestName(name);

      const newWish = {
        id: Date.now(),
        name: name,
        text: text,
        time: 'Just now',
        likes: 0,
        likedBy: []
      };

      // 1. Optimistic immediate UI update
      const currentWishes = getLocalWishes();
      currentWishes.unshift(newWish);
      saveLocalWishes(currentWishes);
      renderWishes(currentWishes);

      // 2. Trigger celebratory petal shower
      if (window.showerBlessingsPetals) {
        window.showerBlessingsPetals();
      }

      messageInput.value = '';

      // 3. Post to Google Sheets
      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          name: name,
          text: text
        })
      })
        .then(() => {
          setTimeout(fetchWishesFromGoogleSheet, 2000);
        })
        .catch((err) => {
          console.warn('Google Sheets write notice:', err);
        });
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Initial load
  fetchWishesFromGoogleSheet();
})();
