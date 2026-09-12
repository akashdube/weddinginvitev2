/**
 * Akash & Pranshi Wedding (#APForever)
 * Schedule Tabs, Maps & Calendar Integration
 */

(function () {
  // Tab Switching with Smooth Sliding Indicator & Direction-Aware Slide
  const pillsWrapper = document.getElementById('tab-pills-wrapper');
  const tabButtons = document.querySelectorAll('.tab-pill-btn');
  const tabContents = document.querySelectorAll('.tab-content-card');
  let currentTabIndex = 0;

  tabButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      if (btn.classList.contains('active')) return;

      const isSlidingRight = index > currentTabIndex;
      currentTabIndex = index;

      // Update pills wrapper attribute to trigger CSS slider translate animation
      if (pillsWrapper) {
        pillsWrapper.setAttribute('data-active-tab', targetId);
      }

      // Update button states
      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Update card content states with directional slide
      tabContents.forEach((card) => {
        card.classList.remove('active', 'slide-left', 'slide-right');
        if (card.id === targetId) {
          card.classList.add('active');
          card.classList.add(isSlidingRight ? 'slide-left' : 'slide-right');
        }
      });
    });
  });

  // Calendar Integration (.ics generator & Google Calendar)
  const calendarBtn = document.getElementById('btn-add-calendar');
  if (calendarBtn) {
    calendarBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const title = encodeURIComponent("Akash & Pranshi's Wedding Celebration (#APForever)");
      const details = encodeURIComponent(
        "Join us to celebrate the wedding ceremony & reception of Akash & Pranshi!\n\nVenue: HB Klyde Premier, Rampur Road, Moradabad\nHashtag: #APForever"
      );
      const location = encodeURIComponent("HB Klyde Premier, Rampur Road, Near Arcadia Greens, Zero Point, Moradabad, UP 244001");
      const startDate = "20261120T113000Z"; // 17:00 IST is 11:30 UTC
      const endDate = "20261120T183000Z";

      // Google Calendar URL
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
      window.open(gcalUrl, '_blank');
    });
  }

  // Google Maps Deep Links
  window.openDirections = function (venueKey) {
    let query = '';
    if (venueKey === 'haldi') {
      query = encodeURIComponent("Govindnagar, Moradabad, Uttar Pradesh");
    } else if (venueKey === 'wedding') {
      query = encodeURIComponent("HB Klyde Premier, Rampur Road, Moradabad, Uttar Pradesh 244001");
    }
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(mapsUrl, '_blank');
  };

  // Copy Address with Toast Notification
  window.copyAddress = function (text) {
    navigator.clipboard.writeText(text).then(() => {
      const toast = document.getElementById('toast');
      if (toast) {
        toast.classList.add('show');
        setTimeout(() => {
          toast.classList.remove('show');
        }, 2500);
      }
    }).catch(() => {
      alert('Address copied: ' + text);
    });
  };

  // WhatsApp Share Invite
  const shareBtn = document.getElementById('btn-share-whatsapp');
  if (shareBtn) {
    shareBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentUrl = window.location.href;
      const shareMessage = encodeURIComponent(
        `🌸 *Akash & Pranshi are Getting Married!* 💍\n\nWith the heavenly blessings of our elders, we cordially invite you to celebrate our wedding festivities (#APForever).\n\n🗓️ *Dates:* 18th & 20th November 2026\n📍 *City:* Moradabad, UP\n\n✨ *Tap to open our interactive 3D wedding invitation:* \n${currentUrl}`
      );
      window.open(`https://api.whatsapp.com/send?text=${shareMessage}`, '_blank');
    });
  }
})();
