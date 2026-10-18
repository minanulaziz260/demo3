document.addEventListener("DOMContentLoaded", function () {
  // 1. Recipient Name Detection from URL (?to=Nama+Tamu or ?u=...)
  const urlParams = new URLSearchParams(window.location.search);
  const recipientName = urlParams.get('to') || urlParams.get('u') || urlParams.get('guest');
  if (recipientName) {
    document.querySelectorAll('[data-component="recipient"]').forEach(el => {
      el.textContent = decodeURIComponent(recipientName.replace(/\+/g, ' '));
    });
  }

  // 2. Audio Background Music Controller
  const bgAudio = document.getElementById("bg-audio");
  const btnMusic = document.getElementById("btnMusic");
  const vinylIcon = btnMusic ? btnMusic.querySelector(".vinyl") : null;
  let isPlaying = false;

  function playMusic() {
    if (!bgAudio) return;
    bgAudio.play().then(() => {
      isPlaying = true;
      if (vinylIcon) {
        vinylIcon.classList.remove("vinyl-paused");
        vinylIcon.classList.add("vinyl-spinning");
      }
    }).catch(e => {
      console.log("Audio autoplay restricted:", e);
    });
  }

  function pauseMusic() {
    if (!bgAudio) return;
    bgAudio.pause();
    isPlaying = false;
    if (vinylIcon) {
      vinylIcon.classList.add("vinyl-paused");
    }
  }

  function toggleMusic() {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }

  if (btnMusic) {
    btnMusic.addEventListener("click", toggleMusic);
  }

  // Trigger music on "Buka Undangan"
  document.querySelectorAll(".play-music").forEach(btn => {
    btn.addEventListener("click", function (e) {
      playMusic();
      const target = document.querySelector("#page-0");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Hide music button slightly while scrolling, reveal on stop
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    if (btnMusic) {
      btnMusic.style.transform = "translateX(-80px)";
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        btnMusic.style.transform = "translateX(0)";
      }, 250);
    }
  });

  // 3. Countdown Timer
  const countdownEl = document.querySelector('[data-component="countdown"]');
  if (countdownEl) {
    const targetDateStr = countdownEl.getAttribute("data-datetime") || "2025-04-12T08:00:00";
    const targetDate = new Date(targetDateStr).getTime();

    const daysEl = countdownEl.querySelector(".days");
    const hoursEl = countdownEl.querySelector(".hours");
    const minutesEl = countdownEl.querySelector(".minutes");
    const secondsEl = countdownEl.querySelector(".seconds");

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        if (daysEl) daysEl.textContent = "00";
        if (hoursEl) hoursEl.textContent = "00";
        if (minutesEl) minutesEl.textContent = "00";
        if (secondsEl) secondsEl.textContent = "00";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // 4. Toast Notifications
  window.showToast = function (message) {
    const toast = document.getElementById("toast");
    const msgEl = document.getElementById("toast-message");
    if (!toast || !msgEl) return;
    msgEl.textContent = message;
    toast.classList.remove("translate-y-20", "opacity-0", "pointer-events-none");
    toast.classList.add("translate-y-0", "opacity-100");

    setTimeout(() => {
      toast.classList.add("translate-y-20", "opacity-0", "pointer-events-none");
      toast.classList.remove("translate-y-0", "opacity-100");
    }, 3000);
  };

  // 5. Copy to Clipboard
  window.copyToClipboard = function (text, label) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast((label || "Teks") + " berhasil disalin!");
      }).catch(() => fallbackCopy(text, label));
    } else {
      fallbackCopy(text, label);
    }
  };

  function fallbackCopy(text, label) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast((label || "Teks") + " berhasil disalin!");
    } catch (err) {
      showToast("Gagal menyalin teks.");
    }
    document.body.removeChild(textArea);
  }

  // 6. Navigation Menu
  const btnMenu = document.getElementById("btnMenu");
  const menuDropdown = document.getElementById("menuDropdown");

  window.toggleMenu = function () {
    if (menuDropdown) {
      menuDropdown.classList.toggle("hidden");
    }
  };

  window.closeMenu = function () {
    if (menuDropdown) {
      menuDropdown.classList.add("hidden");
    }
  };

  document.addEventListener("click", function (e) {
    if (menuDropdown && !menuDropdown.contains(e.target) && btnMenu && !btnMenu.contains(e.target)) {
      menuDropdown.classList.add("hidden");
    }
  });

  // 7. Lightbox Modal
  const lightboxModal = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");

  window.openLightbox = function (src) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxModal.classList.remove("hidden");
    lightboxModal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  window.closeLightbox = function () {
    if (!lightboxModal) return;
    lightboxModal.classList.add("hidden");
    lightboxModal.classList.remove("active");
    document.body.style.overflow = "";
  };

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeLightbox();
      closeMenu();
    }
  });

  // 8. RSVP Submission with LocalStorage
  const formRsvp = document.getElementById("form-rsvp");
  if (formRsvp) {
    formRsvp.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("rsvp-name").value.trim();
      const attendance = document.querySelector('input[name="rsvp-attendance"]:checked')?.value || "Hadir";
      const guests = document.getElementById("rsvp-guests").value;
      const message = document.getElementById("rsvp-message")?.value.trim() || "";

      const rsvpData = { name, attendance, guests, message, date: new Date().toISOString() };
      const storedRsvps = JSON.parse(localStorage.getItem("wedding_rsvps") || "[]");
      storedRsvps.push(rsvpData);
      localStorage.setItem("wedding_rsvps", JSON.stringify(storedRsvps));

      formRsvp.reset();
      const successBox = document.getElementById("rsvp-success");
      if (successBox) {
        successBox.classList.remove("hidden");
        setTimeout(() => successBox.classList.add("hidden"), 5000);
      }
      showToast("Konfirmasi RSVP Anda berhasil dikirim!");
    });
  }

  // 9. Comments / Wishes System
  const formComment = document.getElementById("form-comment");
  const commentsList = document.getElementById("comments-list");

  const defaultComments = [
    {
      name: "Andini",
      content: "Selamat atas pernikahannya! Semoga selalu diberi kebahagiaan dan cinta yang tak berkesudahan.",
      time: "2 menit yang lalu"
    },
    {
      name: "Budi",
      content: "Barakallah! Semoga menjadi keluarga sakinah, mawaddah, warahmah.",
      time: "10 menit yang lalu"
    },
    {
      name: "Lina",
      content: "Ikut bahagia melihat kalian bersatu. Semoga langgeng sampai akhir hayat!",
      time: "30 menit yang lalu"
    },
    {
      name: "Admin Website",
      content: "Selamat menempuh hidup baru untuk kedua mempelai. Sakinah Mawaddah Warahmah selalu.",
      time: "1 jam yang lalu",
      isOwner: true
    }
  ];

  function renderComments() {
    if (!commentsList) return;
    const stored = JSON.parse(localStorage.getItem("wedding_comments") || "[]");
    const all = [...stored.reverse(), ...defaultComments];

    commentsList.innerHTML = all.map(c => `
      <div class="flex gap-3 rounded-xl bg-white/90 p-4 shadow-sm border border-black/5 text-left text-gray-800 transition-all hover:shadow-md">
        <div class="flex size-9 flex-none items-center justify-center rounded-full bg-[var(--header-color)] text-white font-bold text-sm">
          ${(c.name || "A")[0].toUpperCase()}
        </div>
        <div class="grow min-w-0">
          <div class="flex items-center gap-1.5 flex-wrap">
            <h6 class="text-sm font-bold text-gray-900">${escapeHtml(c.name)}</h6>
            ${c.isOwner ? '<span class="inline-flex items-center text-[10px] bg-blue-100 text-blue-700 font-medium px-1.5 py-0.5 rounded-full">Panitia</span>' : ''}
          </div>
          <p class="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">${escapeHtml(c.content)}</p>
          <small class="text-[10px] text-gray-400 mt-1.5 block">${c.time || "Baru saja"}</small>
        </div>
      </div>
    `).join("");
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  if (formComment) {
    formComment.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("comment-name").value.trim();
      const content = document.getElementById("comment-content").value.trim();

      if (!name || !content) return;

      const newComment = {
        name: name,
        content: content,
        time: "Baru saja"
      };

      const stored = JSON.parse(localStorage.getItem("wedding_comments") || "[]");
      stored.push(newComment);
      localStorage.setItem("wedding_comments", JSON.stringify(stored));

      formComment.reset();
      renderComments();
      showToast("Ucapan Anda berhasil dikirim!");
    });
  }

  renderComments();

  // 10. Scroll Animation (IntersectionObserver)
  const animatedElements = document.querySelectorAll("[data-animation]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-animated");
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll("[data-animation]:not([data-animation="none"])").forEach(el => { el.classList.add("animate-ready"); observer.observe(el); });
  } else {
    animatedElements.forEach(el => el.classList.add("is-animated"));
  }
});

// Handle hash navigation
window.addEventListener("load", function () {
  if (window.location.hash) {
    const el = document.querySelector(window.location.hash);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 200);
    }
  }
});
