/**
 * Akash & Pranshi Wedding (#APforever)
 * Live Google Sheets Guestbook with Moderation Workflow
 * 
 * Flow:
 * 1. Guest writes blessing & submits.
 * 2. Blessing is saved to Google Sheet with Approved = false (hidden from website).
 * 3. Couple receives instant email notification with a 1-click link to Google Sheet.
 * 4. Couple ticks the "Approved" checkbox in Google Sheets.
 * 5. Ticked blessings appear on the website; unticked ones stay hidden.
 */

(function () {
  const form = document.getElementById('blessing-form');
  const nameInput = document.getElementById('guest-name');
  const messageInput = document.getElementById('guest-message');
  const wishesStream = document.getElementById('wishes-stream');
  const successBanner = document.getElementById('blessing-success-banner');
  let hideBannerTimer = null;

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyl_rw3ZBiOi4Ef860vagzPjrpvvLZPjZJNLHK_Gs6VSqdwSCjT_98acq4LJOBpHUu_aw/exec';
  const STORAGE_WISHES_KEY = 'ap_wedding_wishes_v5';

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

  // Render approved wishes in the UI
  function renderWishes(wishes) {
    if (!wishesStream) return;
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
      const card = document.createElement('div');
      card.className = 'wish-item';
      card.innerHTML = `
        <div class="wish-header">
          <span class="wish-author">${escapeHtml(w.name)}</span>
          <span class="wish-time">${w.time || 'Recently'}</span>
        </div>
        <p class="wish-text">${escapeHtml(w.text)}</p>
      `;

      wishesStream.appendChild(card);
    });
  }

  // Load ONLY Approved Wishes from Google Sheets (with local fallback)
  function fetchWishesFromGoogleSheet() {
    // Show cached approved wishes immediately for instant loading
    const local = getLocalWishes();
    renderWishes(local);

    // Fetch live approved wishes from Google Sheets
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
      });
  }

  // Form Submit Handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const text = messageInput.value.trim();

      if (!name || !text) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>🌸 Submitting your blessing...</span>';
      }

      // 1. Festive petal shower for instant celebratory delight
      if (window.showerBlessingsPetals) {
        window.showerBlessingsPetals();
      }

      // 2. Clear inputs immediately
      nameInput.value = '';
      messageInput.value = '';

      // 3. Post to Google Sheets (Saved with Approved = false)
      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'submit',
          name: name,
          text: text
        })
      })
      .then(() => {
        showModerationNotice();
      })
      .catch((err) => {
        console.warn('Google Sheets submission notice:', err);
        showModerationNotice();
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      });
    });
  }

  function showModerationNotice() {
    if (successBanner) {
      successBanner.style.display = 'block';
      successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Automatically auto-dismiss after 6 seconds
      if (hideBannerTimer) clearTimeout(hideBannerTimer);
      hideBannerTimer = setTimeout(() => {
        if (successBanner) successBanner.style.display = 'none';
      }, 6000);
    }
  }

  // Hide notice when guest begins typing again
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (successBanner) successBanner.style.display = 'none';
    });
  }
  if (messageInput) {
    messageInput.addEventListener('input', () => {
      if (successBanner) successBanner.style.display = 'none';
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Initial load
  fetchWishesFromGoogleSheet();

  // Periodically check for newly approved wishes every 60 seconds
  setInterval(fetchWishesFromGoogleSheet, 60000);
})();
