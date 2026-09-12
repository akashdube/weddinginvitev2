/**
 * Akash & Pranshi Wedding (#APForever)
 * Interactive Shower Blessings Guestbook & LocalStorage Persistence
 */

(function () {
  const form = document.getElementById('blessing-form');
  const nameInput = document.getElementById('guest-name');
  const messageInput = document.getElementById('guest-message');
  const wishesStream = document.getElementById('wishes-stream');

  const STORAGE_KEY = 'ap_wedding_wishes_v1';

  // Default initial blessings to give immediate warmth and community feeling
  const initialWishes = [
    {
      id: 1,
      name: "Sharma & Gupta Families",
      text: "Dearest Akash and Pranshi, may your bond be blessed with boundless love, laughter, and lifelong togetherness! #APForever",
      time: "Just now",
      likes: 48
    },
    {
      id: 2,
      name: "Anita Masi & Family",
      text: "Congratulations to both of you! Waiting eagerly to dance and celebrate in Moradabad. Lots of love and blessings!",
      time: "2 hours ago",
      likes: 35
    },
    {
      id: 3,
      name: "Rohan & Sneha",
      text: "Two of our favorite people are getting hitched! Counting down the days to November. Let's make it unforgettable!",
      time: "Yesterday",
      likes: 29
    }
  ];

  function getStoredWishes() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialWishes;
    } catch (e) {
      return initialWishes;
    }
  }

  function saveWishes(wishes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
    } catch (e) {
      console.warn('Could not save wishes to localStorage', e);
    }
  }

  function renderWishes() {
    if (!wishesStream) return;
    const wishes = getStoredWishes();
    wishesStream.innerHTML = '';

    wishes.forEach((w) => {
      const card = document.createElement('div');
      card.className = 'wish-item';
      card.innerHTML = `
        <div class="wish-header">
          <span class="wish-author">${escapeHtml(w.name)}</span>
          <span class="wish-time">${w.time}</span>
        </div>
        <p class="wish-text">${escapeHtml(w.text)}</p>
        <button class="wish-heart-btn" data-id="${w.id}">
          <span>❤</span>
          <span class="like-count">${w.likes}</span>
        </button>
      `;

      const heartBtn = card.querySelector('.wish-heart-btn');
      heartBtn.addEventListener('click', () => {
        w.likes += 1;
        heartBtn.classList.add('liked');
        heartBtn.querySelector('.like-count').textContent = w.likes;
        saveWishes(wishes);
        if (window.showerBlessingsPetals) window.showerBlessingsPetals();
      });

      wishesStream.appendChild(card);
    });
  }

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
        likes: 1
      };

      const wishes = getStoredWishes();
      wishes.unshift(newWish);
      saveWishes(wishes);

      renderWishes();

      // Trigger glorious celebratory petal confetti!
      if (window.showerBlessingsPetals) {
        window.showerBlessingsPetals();
      }

      nameInput.value = '';
      messageInput.value = '';
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  renderWishes();
})();
