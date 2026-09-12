/**
 * Akash & Pranshi Wedding (#APForever)
 * Live Google Sheets Guestbook Integration with LocalStorage Fallback
 */

(function () {
  const form = document.getElementById('blessing-form');
  const nameInput = document.getElementById('guest-name');
  const messageInput = document.getElementById('guest-message');
  const wishesStream = document.getElementById('wishes-stream');

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyl_rw3ZBiOi4Ef860vagzPjrpvvLZPjZJNLHK_Gs6VSqdwSCjT_98acq4LJOBpHUu_aw/exec';
  const STORAGE_WISHES_KEY = 'ap_wedding_wishes_v3';
  const STORAGE_LIKES_KEY = 'ap_wedding_user_likes_v3';

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
    } catch (e) {}
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
    } catch (e) {}
  }

  // Render wishes in the UI
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
      card.innerHTML = `
        <div class="wish-header">
          <span class="wish-author">${escapeHtml(w.name)}</span>
          <span class="wish-time">${w.time || 'Recently'}</span>
        </div>
        <p class="wish-text">${escapeHtml(w.text)}</p>
        <button class="wish-heart-btn ${isLiked ? 'liked' : ''}" data-id="${w.id}">
          <span class="heart-icon">${isLiked ? '❤️' : '🤍'}</span>
          <span class="like-count">${w.likes || 0}</span>
          <span class="like-text">${isLiked ? 'Liked' : 'Like'}</span>
        </button>
      `;

      const heartBtn = card.querySelector('.wish-heart-btn');
      heartBtn.addEventListener('click', () => {
        toggleLike(w, heartBtn, wishes);
      });

      wishesStream.appendChild(card);
    });
  }

  // Toggle Like / Unlike
  function toggleLike(wish, heartBtn, allWishes) {
    let userLikes = getUserLikes();
    const wishId = wish.id;

    if (userLikes.includes(wishId)) {
      // UNLIKE
      userLikes = userLikes.filter((id) => id !== wishId);
      wish.likes = Math.max(0, (wish.likes || 1) - 1);
      heartBtn.classList.remove('liked');
      heartBtn.querySelector('.heart-icon').textContent = '🤍';
      heartBtn.querySelector('.like-text').textContent = 'Like';
    } else {
      // LIKE
      userLikes.push(wishId);
      wish.likes = (wish.likes || 0) + 1;
      heartBtn.classList.add('liked');
      heartBtn.querySelector('.heart-icon').textContent = '❤️';
      heartBtn.querySelector('.like-text').textContent = 'Liked';

      if (window.showerBlessingsPetals) {
        window.showerBlessingsPetals();
      }
    }

    heartBtn.querySelector('.like-count').textContent = wish.likes;
    saveLocalWishes(allWishes);
    saveUserLikes(userLikes);

    // Sync Like to Google Sheets in background
    if (wish.row) {
      try {
        fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'like',
            row: wish.row,
            likes: wish.likes
          })
        }).catch(() => {});
      } catch (e) {}
    }
  }

  // Load Wishes from Google Sheets (with local fallback)
  function fetchWishesFromGoogleSheet() {
    // Show local cached wishes immediately for instant mobile loading
    const local = getLocalWishes();
    renderWishes(local);

    // Fetch fresh live wishes from Google Sheets
    fetch(GOOGLE_SCRIPT_URL)
      .then((res) => res.json())
      .then((remoteWishes) => {
        if (Array.isArray(remoteWishes)) {
          saveLocalWishes(remoteWishes);
          renderWishes(remoteWishes);
        }
      })
      .catch((err) => {
        console.log('Google Sheets sync notice:', err);
        // Remains seamlessly functional with local storage
      });
  }

  // Form Submit Handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const text = messageInput.value.trim();

      if (!name || !text) return;

      const newWish = {
        id: Date.now(),
        name: name,
        text: text,
        time: "Just now",
        likes: 0
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

      nameInput.value = '';
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
      }).then(() => {
        // Refresh sheet data after 2 seconds
        setTimeout(fetchWishesFromGoogleSheet, 2000);
      }).catch((err) => {
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
