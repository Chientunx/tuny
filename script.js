// Fable 5.2 — Motion Design Skills (Fixed-viewport, no scroll)
const track = document.querySelector("#projectTrack");
const showcase = document.querySelector(".showcase");
const viewport = document.querySelector("#carouselViewport");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const viewButtons = [...document.querySelectorAll(".view-button")];
const searchInput = document.querySelector("#searchInput");
const countLabel = document.querySelector("#projectCount");

// Detail panel elements
const detailCard = document.querySelector("#detailCard");
const detailIndex = document.querySelector("#detailIndex");
const detailCategory = document.querySelector("#detailCategory");
const detailTitle = document.querySelector("#detailTitle");
const detailSubtitle = document.querySelector("#detailSubtitle");
const detailRepo = document.querySelector("#detailRepo");
const detailLinkType = document.querySelector("#detailLinkType");
const detailOpenBtn = document.querySelector("#detailOpenBtn");
const heroKicker = document.querySelector("#heroKicker");

// Motion Skills Dataset
const skillsData = [
  {
    num: "01",
    tag: "SKILL",
    category: "SKILL / PRINCIPLES",
    title: "/motion-design-skill",
    subtitle: "Timing, easing and the 12 principles.",
    repo: "github.com / LottieFiles/motion-design-skill",
    linkText: "GITHUB ↗",
    linkUrl: "https://github.com/LottieFiles/motion-design-skill",
    kicker: "20 REPOS. ONE MOTION STUDIO."
  },
  {
    num: "02",
    tag: "SKILL",
    category: "SKILL / SPRINGS",
    title: "/spring-kit",
    subtitle: "Physics-based mass, tension and damping curves.",
    repo: "motion.dev / spring-kit",
    linkText: "SITE ↗",
    linkUrl: "#",
    kicker: "PHYSICS — MASS, TENSION & DAMPING."
  },
  {
    num: "03",
    tag: "SKILL",
    category: "SKILL / CHOREOGRAPHY",
    title: "/sequencer",
    subtitle: "Orchestrating staggered multi-element timeline delays.",
    repo: "github.com / fable/sequencer",
    linkText: "GITHUB ↗",
    linkUrl: "#",
    kicker: "CHOREOGRAPHY — TIMELINE DELAYS."
  },
  {
    num: "04",
    tag: "SKILL",
    category: "SKILL / VECTOR",
    title: "/hairline",
    subtitle: "Sub-pixel vector stroke interpolation and geometry.",
    repo: "skills.fable.app / hairline",
    linkText: "SITE ↗",
    linkUrl: "#",
    kicker: "VECTOR — SUB-PIXEL GEOMETRY."
  },
  {
    num: "05",
    tag: "SKILL",
    category: "SKILL / ISOMETRIC",
    title: "/anatomy",
    subtitle: "Machines as isometric figures.",
    repo: "skills.wheresryan.sh / anatomy",
    linkText: "SITE ↗",
    linkUrl: "https://skills.wheresryan.sh/anatomy",
    kicker: "SKILLS — TEACH IT SOME TASTE."
  },
  {
    num: "06",
    tag: "SKILL",
    category: "SKILL / 3D REVEAL",
    title: "/anatomy-reveal",
    subtitle: "Layered mechanical dissection and explosion rigs.",
    repo: "skills.fable.app / anatomy-reveal",
    linkText: "SITE ↗",
    linkUrl: "#",
    kicker: "3D REVEAL — MECHANICAL RIGS."
  },
  {
    num: "07",
    tag: "SKILL",
    category: "SKILL / AGENTS",
    title: "/render-agents",
    subtitle: "Autonomous background render pipeline dispatchers.",
    repo: "github.com / fable/render-agents",
    linkText: "GITHUB ↗",
    linkUrl: "#",
    kicker: "AUTONOMOUS BACKGROUND RENDERERS."
  },
  {
    num: "08",
    tag: "SKILL",
    category: "SKILL / WEBGL",
    title: "/three.js",
    subtitle: "Shader-driven 3D canvas mesh vertex morphing.",
    repo: "threejs.org / examples/motion",
    linkText: "DOCS ↗",
    linkUrl: "#",
    kicker: "WEBGL — SHADER MESH MORPHING."
  }
];

const allCards = [...track.querySelectorAll(".project-card")];
let activeFilter = "all";
let currentView = "cascade";
let currentIndex = 0;
let autoTimer = null;
let isPaused = false;
let isDragging = false;
let dragStartX = 0;
let dragDeltaX = 0;

function getFilteredCards() {
  return allCards.filter(card => {
    if (activeFilter === "all") return true;
    const tags = (card.dataset.tags || "").split(" ");
    return tags.includes(activeFilter);
  });
}

// Helper to detect mobile viewport (no horizontal animation, vertical flow)
function isMobileLayout() {
  return window.innerWidth <= 768;
}

// Position cards along the 3D diagonal cascade
function updateCardPositions(animate = true) {
  const cards = getFilteredCards();
  const total = cards.length;
  if (total === 0) return;

  // On mobile: strictly vertical layout, no horizontal cascade animation
  if (isMobileLayout()) {
    clearTimeout(autoTimer);
    cards.forEach((card) => {
      card.style.transform = "";
      card.style.transition = "";
      card.style.opacity = "";
      card.style.filter = "";
      card.style.zIndex = "";
      card.style.pointerEvents = "";
    });
    return;
  }

  const isTablet = window.innerWidth > 768 && window.innerWidth <= 1100;

  // Responsive cascade spacing step
  const stepX = isTablet ? 145 : 185;
  const stepY = isTablet ? 36 : 48;
  const stepRot = isTablet ? 3.0 : 3.5;

  cards.forEach((card, idx) => {
    // Relative position from current active index
    const rel = (idx - currentIndex + total) % total;
    const signedRel = rel > total / 2 ? rel - total : rel;

    let x = 0;
    let y = 0;
    let rotate = 0;
    let scale = 1;
    let opacity = 1;
    let zIndex = 1;
    let blur = 0;

    if (signedRel === 0) {
      // 1. Active Focus Card
      x = 0;
      y = 0;
      rotate = -2.5;
      scale = 1.0;
      zIndex = 30;
      opacity = 1;
      blur = 0;
    } else if (signedRel === 1) {
      // 2. Next Card to the right & down
      x = stepX;
      y = stepY;
      rotate = stepRot;
      scale = 0.95;
      zIndex = 29;
      opacity = 0.96;
      blur = 0;
    } else if (signedRel === 2) {
      // 3. Third Card (approaching underneath the detail panel)
      x = Math.round(stepX * 1.95);
      y = stepY * 2;
      rotate = stepRot * 2;
      scale = 0.89;
      zIndex = 28;
      opacity = 0.86;
      blur = 0.4;
    } else if (signedRel === 3) {
      // 4. Fourth Card (sliding under detail panel)
      x = Math.round(stepX * 2.85);
      y = stepY * 3;
      rotate = stepRot * 2.8;
      scale = 0.82;
      zIndex = 27;
      opacity = 0.65;
      blur = 1.2;
    } else if (signedRel > 3) {
      // Distant cascading cards underneath detail panel
      x = Math.round(stepX * 2.85 + (signedRel - 3) * 140);
      y = stepY * 3 + (signedRel - 3) * 48;
      rotate = stepRot * 2.8 + (signedRel - 3) * 2;
      scale = Math.max(0.66, 0.82 - (signedRel - 3) * 0.06);
      zIndex = Math.max(1, 26 - signedRel);
      opacity = Math.max(0, 0.45 - (signedRel - 3) * 0.12);
      blur = 2.2;
    } else if (signedRel === -1) {
      // Previous card exiting to the left — stays strictly away from main content
      x = -55;
      y = 4;
      rotate = -4;
      scale = 0.91;
      zIndex = 15;
      opacity = 0.25;
      blur = 0;
    } else {
      // Already exited past cards
      x = -110;
      y = 8;
      rotate = -6;
      scale = 0.82;
      zIndex = 10;
      opacity = 0;
      blur = 1;
    }

    card.style.transition = animate ? "transform 0.75s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease, filter 0.5s ease" : "none";
    card.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`;
    card.style.zIndex = zIndex;
    card.style.opacity = opacity;
    card.style.filter = blur > 0 ? `blur(${blur}px)` : "none";
    card.style.pointerEvents = "auto";
  });
}

// Dwell for 2 seconds after card stops, then slide to next
function scheduleNextStep() {
  clearTimeout(autoTimer);
  if (isPaused || currentView !== "cascade" || isMobileLayout()) return;
  autoTimer = setTimeout(() => {
    stepNext();
  }, 2000);
}

function stepNext() {
  if (isMobileLayout()) return;
  const cards = getFilteredCards();
  if (cards.length <= 1) return;
  currentIndex = (currentIndex + 1) % cards.length;
  updateCardPositions(true);
  scheduleNextStep();
}

function stepPrev() {
  if (isMobileLayout()) return;
  const cards = getFilteredCards();
  if (cards.length <= 1) return;
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  updateCardPositions(true);
  scheduleNextStep();
}

// Unified Card Click Handler: brings card into focus (on desktop) and opens detail popup modal
function handleCardActivation(card) {
  if (isActuallyDragging) return;
  const cardDataIndex = parseInt(card.dataset.index, 10);
  const targetIndex = isNaN(cardDataIndex) ? 0 : cardDataIndex;

  const cards = getFilteredCards();
  const idx = cards.indexOf(card);
  if (!isMobileLayout() && idx !== -1 && idx !== currentIndex) {
    clearTimeout(autoTimer);
    currentIndex = idx;
    updateCardPositions(true);
    if (!isPaused) scheduleNextStep();
  }

  // Open project detail popup modal
  openProjectModal(targetIndex);
}

// 1. Direct click listener on each card
allCards.forEach((card) => {
  card.style.cursor = "pointer";
  card.addEventListener("click", (e) => {
    if (isActuallyDragging) return;
    handleCardActivation(card);
  });
});

// 2. Delegated click on project track as fail-safe
if (track) {
  track.addEventListener("click", (e) => {
    if (isActuallyDragging) return;
    const card = e.target.closest(".project-card");
    if (card) {
      handleCardActivation(card);
    }
  });
}

// Category filtering
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.toggle("active", b === button));
    activeFilter = button.dataset.filter;
    currentIndex = 0;
    
    // Hide/show cards based on filter
    allCards.forEach(card => {
      const tags = (card.dataset.tags || "").split(" ");
      const matches = activeFilter === "all" || tags.includes(activeFilter);
      card.style.display = matches ? "block" : "none";
    });

    const activeCount = getFilteredCards().length;
    if (countLabel) countLabel.textContent = String(activeCount).padStart(2, "0");

    if (currentView === "cascade") {
      updateCardPositions(false);
      scheduleNextStep();
    } else {
      clearTimeout(autoTimer);
    }
  });
});

// View switch (Cascade Slide vs Grid View)
function setViewMode(view) {
  currentView = view;
  const heroEl = document.querySelector(".hero");
  viewButtons.forEach(b => b.classList.toggle("active", b.dataset.view === view));

  if (view === "cascade") {
    if (heroEl) heroEl.classList.remove("is-grid-view");
    if (viewport) viewport.scrollTop = 0;
    updateCardPositions(true);
    scheduleNextStep();
  } else if (view === "grid") {
    clearTimeout(autoTimer);
    if (heroEl) heroEl.classList.add("is-grid-view");
    // Xóa transform inline để CSS grid tự định dạng theo lưới 2-3 cột
    allCards.forEach(card => {
      card.style.transform = "";
      card.style.transition = "";
      card.style.opacity = "";
      card.style.filter = "";
      card.style.zIndex = "";
    });
    if (viewport) viewport.scrollTop = 0;
  }
}

viewButtons.forEach(button => {
  button.addEventListener("click", () => {
    setViewMode(button.dataset.view);
  });
});

// Detail card hover to pause auto-slide while reading
if (detailCard) {
  detailCard.addEventListener("mouseenter", () => {
    isPaused = true;
    clearTimeout(autoTimer);
  });
  detailCard.addEventListener("mouseleave", () => {
    isPaused = false;
    if (!isPointerDown) scheduleNextStep();
  });
}

// Click & Hold + Move: Pointer drag & continuous slide support (chỉ chạy ở Slide View)
let isPointerDown = false;
let isActuallyDragging = false;
let dragStartY = 0;
let startContinuousIndex = 0;
let lastMoveTime = 0;
let lastMoveX = 0;
let moveVelocity = 0;

if (viewport) {
  viewport.addEventListener("pointerdown", (e) => {
    if (currentView !== "cascade" || isMobileLayout() || isModalOpen) return;
    if (e.button !== 0) return; // Chỉ nhận chuột trái
    // Không drag nếu click vào nút, link hoặc backdrop của popup
    if (e.target.closest("button") || e.target.closest("a") || e.target.closest(".project-modal-backdrop")) return;

    isPointerDown = true;
    isActuallyDragging = false;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragDeltaX = 0;
    startContinuousIndex = currentIndex;
    lastMoveTime = Date.now();
    lastMoveX = e.clientX;
    moveVelocity = 0;

    clearTimeout(autoTimer);
  });

  viewport.addEventListener("pointermove", (e) => {
    if (!isPointerDown || currentView !== "cascade" || isMobileLayout() || isModalOpen) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;

    // Ngưỡng di chuyển để phân biệt giữa click thông thường và click & hold + drag
    if (!isActuallyDragging && Math.hypot(dx, dy) > 6) {
      isActuallyDragging = true;
      try {
        viewport.setPointerCapture(e.pointerId);
      } catch (err) {}
      document.body.classList.add("is-carousel-dragging");
    }

    if (isActuallyDragging) {
      dragDeltaX = dx;
      const now = Date.now();
      const dt = now - lastMoveTime;
      if (dt > 10) {
        moveVelocity = (e.clientX - lastMoveX) / dt;
        lastMoveTime = now;
        lastMoveX = e.clientX;
      }

      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1100;
      const stepX = isTablet ? 145 : 185;
      // Di chuyển chuột sang trái (dx < 0) -> trượt các card tiếp theo sang
      // Di chuyển chuột sang phải (dx > 0) -> trượt các card trước đó về
      const dragProgress = -dx / stepX;
      renderContinuousCards(startContinuousIndex + dragProgress);
    }
  });

  function endDrag(e) {
    if (!isPointerDown) return;
    isPointerDown = false;
    document.body.classList.remove("is-carousel-dragging");

    if (e && viewport.hasPointerCapture && viewport.hasPointerCapture(e.pointerId)) {
      try {
        viewport.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }

    const cards = getFilteredCards();
    const total = cards.length;

    if (isActuallyDragging && currentView === "cascade" && !isMobileLayout() && total > 0) {
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1100;
      const stepX = isTablet ? 145 : 185;
      const dragProgress = -dragDeltaX / stepX;

      // Gia tốc quán tính nếu thả chuột khi đang lướt nhanh
      let momentum = 0;
      if (Math.abs(moveVelocity) > 0.35) {
        momentum = moveVelocity < 0 ? 0.6 : -0.6;
      }

      let rawTarget = startContinuousIndex + dragProgress + momentum;

      // Hỗ trợ "drag từng card 1": nếu kéo dứt khoát trên 40px, đảm bảo nhảy ít nhất 1 card
      if (Math.abs(dragDeltaX) > 40 && Math.abs(rawTarget - startContinuousIndex) < 0.5) {
        rawTarget = dragDeltaX < 0 ? startContinuousIndex + 1 : startContinuousIndex - 1;
      }

      let targetIdx = Math.round(rawTarget);
      currentIndex = ((targetIdx % total) + total) % total;

      // Trượt mượt mà về card mục tiêu
      updateCardPositions(true);

      // Thả chuột thì dừng kéo và trở về trạng thái auto slide
      isPaused = false;
      scheduleNextStep();
    } else {
      // Nhấp chuột thông thường hoặc không kéo: trở về auto slide nếu ở cascade
      isPaused = false;
      if (currentView === "cascade" && !isMobileLayout()) scheduleNextStep();
    }

    // Trì hoãn 60ms để ngăn chặn sự kiện click trên card vô tình mở popup khi đang drag
    setTimeout(() => {
      isActuallyDragging = false;
      dragDeltaX = 0;
    }, 60);
  }

  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);
  window.addEventListener("pointerup", endDrag);
}

// Keyboard arrow navigation for background carousel
window.addEventListener("keydown", (e) => {
  if (isMobileLayout() || isModalOpen) return;
  if (e.key === "ArrowRight") {
    clearTimeout(autoTimer);
    stepNext();
  } else if (e.key === "ArrowLeft") {
    clearTimeout(autoTimer);
    stepPrev();
  }
});

// Resize handler (switches cleanly between desktop carousel & mobile vertical stack)
window.addEventListener("resize", () => {
  if (isMobileLayout()) {
    clearTimeout(autoTimer);
    updateCardPositions(false);
  } else if (currentView === "cascade") {
    updateCardPositions(false);
    scheduleNextStep();
  }
});

// Initial boot
updateCardPositions(false);
if (!isMobileLayout()) {
  scheduleNextStep();
}

/* ==========================================================================
   PROJECT DETAIL POPUP MODAL CONTROLLER (ĐIỀU KHIỂN POPUP CHI TIẾT DỰ ÁN)
   - Tách biệt rõ ràng, đóng khung độc lập
   - Cố định trong màn hình, chỉ scroll nội dung bên trong modal
   - Nút Close shape tròn tối giản
   - Nút Next Project & Previous Project
   - Phím tắt bàn phím: Esc (Đóng), Phím Mũi tên Trái/Phải (Next/Prev)
   ========================================================================== */

// =========================================================================
// HƯỚNG DẪN THAY ĐỔI ẢNH CHO TỪNG DỰ ÁN TRONG POPUP:
// 👉 Bạn chỉ cần thay đường dẫn ảnh trong mảng `images: [...]` (1 hoặc nhiều ảnh)
// hoặc dùng `image: "assets/projects/..."` là XONG!
// Popup sẽ tự động hiển thị toàn bộ theo Theme 1 đẹp mắt chuẩn style web.
// =========================================================================
const projectsDetailData = [
  {
    index: 0,
    kicker: "PROJECT / 01 \u2014 SELECTED WORK",
    title: "FinAI",
    subtitle: "AI-Powered Personal Finance Application",
    tags: ["UI/UX Design", "Fintech", "Mobile App"],
    role: "UI/UX Designer",
    year: "2026",
    // 👇 DANH SÁCH ẢNH & VIDEO SHOWCASE (15 items):
    images: [
      "assets/projects/01-fin-ai/behance.mp4",
      "assets/projects/01-fin-ai/finai-01.png",
      "assets/projects/01-fin-ai/finai-02.png",
      "assets/projects/01-fin-ai/finai-03.png",
      "assets/projects/01-fin-ai/finai-04.png",
      "assets/projects/01-fin-ai/finai-05.png",
      "assets/projects/01-fin-ai/finai-06.png",
      "assets/projects/01-fin-ai/finai-07.png",
      "assets/projects/01-fin-ai/finai-08.png",
      "assets/projects/01-fin-ai/finai-09.png",
      "assets/projects/01-fin-ai/finai-10.png",
      "assets/projects/01-fin-ai/finai-11.png",
      "assets/projects/01-fin-ai/finai-12.png",
      "assets/projects/01-fin-ai/finai-13.png",
      "assets/projects/01-fin-ai/finai-14.png",
    ]
  },
  {
    index: 1,
    kicker: "PROJECT / 02 \u2014 SELECTED WORK",
    title: "FitScan AI",
    subtitle: "Calorie Counter & AI Nutrition Scanner",
    tags: ["UI/UX Design", "Mobile App", "AI Product"],
    role: "UI/UX Designer",
    year: "2025",
    // 👇 DANH SÁCH ẢNH & VIDEO SHOWCASE (12 items):
    images: [
      "assets/projects/02-fitbase/fitbase-1.mp4",
      "assets/projects/02-fitbase/fitbase-2.png",
      "assets/projects/02-fitbase/fitbase-3.png",
      "assets/projects/02-fitbase/fitbase-4.png",
      "assets/projects/02-fitbase/fitbase-5.png",
      "assets/projects/02-fitbase/fitbase-6.png",
      "assets/projects/02-fitbase/fitbase-7.png",
      "assets/projects/02-fitbase/fitbase-8.png",
      "assets/projects/02-fitbase/fitbase-9.png",
      "assets/projects/02-fitbase/fitbase-10.png",
      "assets/projects/02-fitbase/fitbase-11.png",
      "assets/projects/02-fitbase/fitbase-12.png",
    ]
  },
  {
    index: 2,
    kicker: "PROJECT / 03 \u2014 SELECTED WORK",
    title: "Motion Collection",
    subtitle: "Curated motion design, micro-interactions & UI animations",
    tags: ["Motion Design", "Figma Animation", "Micro-interactions"],
    role: "Motion Designer",
    year: "2025",
    // 👇 GRID VIDEO MOTION TỰ ĐỘNG PHÁT LOOP:
    videoGrid: [
      "assets/projects/03-motion-collection/example.mp4",
      "assets/projects/03-motion-collection/motion-1.mp4",
      "assets/projects/03-motion-collection/motion-2.mp4",
      "assets/projects/03-motion-collection/motion-3.mp4",
      "assets/projects/03-motion-collection/motion-4.mp4",
      "assets/projects/03-motion-collection/motion-5.mp4",
      "assets/projects/03-motion-collection/motion-6.mp4",
      "assets/projects/03-motion-collection/motion-7.mp4",
      "assets/projects/03-motion-collection/motion-8.mp4",
      "assets/projects/03-motion-collection/motion-9.mp4",
      "assets/projects/03-motion-collection/motion-10.mp4",
    ]
  },
  {
    index: 3,
    kicker: "PROJECT / 04 \u2014 SELECTED WORK",
    title: "VYBE",
    subtitle: "Own Your Vibe \u2014 Next-gen E-Commerce Platform",
    tags: ["UI/UX Design", "E-Commerce", "Fashion"],
    role: "Lead UI/UX Designer",
    year: "2025",
    // 👇 DANH SÁCH ẢNH & VIDEO SHOWCASE (10 items):
    images: [
      "assets/projects/04-vybe/vybe-1.png",
      "assets/projects/04-vybe/vybe-2.png",
      "assets/projects/04-vybe/vybe-3.png",
      "assets/projects/04-vybe/vybe-4.png",
      "assets/projects/04-vybe/vybe-5.png",
      "assets/projects/04-vybe/vybe-6.png",
      "assets/projects/04-vybe/vybe-7.png",
      "assets/projects/04-vybe/vybe-8.png",
      "assets/projects/04-vybe/vybe-9.png",
      "assets/projects/04-vybe/vybe-10.png",
    ]
  },
  {
    index: 4,
    kicker: "PROJECT / 05 \u2014 SELECTED WORK",
    title: "FIBA",
    subtitle: "Find Your Balance \u2014 Smart Health & Wellness Tracking",
    tags: ["UI/UX Design", "Smart TV & App", "Wellness"],
    role: "Product Designer",
    year: "2024",
    // 👇 DANH SÁCH ẢNH & VIDEO SHOWCASE (15 items):
    images: [
      "assets/projects/05-fiba/TV - 1.png",
      "assets/projects/05-fiba/TV - 2.png",
      "assets/projects/05-fiba/TV - 3.png",
      "assets/projects/05-fiba/TV - 4.png",
      "assets/projects/05-fiba/TV - 5.png",
      "assets/projects/05-fiba/TV - 6.png",
      "assets/projects/05-fiba/TV - 7.png",
      "assets/projects/05-fiba/TV - 8.png",
      "assets/projects/05-fiba/TV - 9.png",
      "assets/projects/05-fiba/TV - 10.png",
      "assets/projects/05-fiba/TV - 11.png",
      "assets/projects/05-fiba/TV - 12.png",
      "assets/projects/05-fiba/TV - 13.png",
      "assets/projects/05-fiba/TV - 14.png",
      "assets/projects/05-fiba/TV - 15.png",
    ]
  },
  {
    index: 5,
    kicker: "PROJECT / 06 \u2014 SELECTED WORK",
    title: "WIKI AGENT",
    subtitle: "Token AI Analysis & Autonomous Web3 Intelligence",
    tags: ["Web 3", "Blockchain", "AI Agent"],
    role: "UI/UX Designer",
    year: "2024",
    // 👇 DANH SÁCH ẢNH & VIDEO SHOWCASE (7 items):
    images: [
      "assets/projects/06-wiki/01.png",
      "assets/projects/06-wiki/02.png",
      "assets/projects/06-wiki/03.png",
      "assets/projects/06-wiki/04.png",
      "assets/projects/06-wiki/05.png",
      "assets/projects/06-wiki/06.png",
      "assets/projects/06-wiki/07.png",
    ]
  },
  {
    index: 6,
    kicker: "PROJECT / 07 \u2014 SELECTED WORK",
    title: "LUMNIA",
    subtitle: "Seamless DeFi on Somnia \u2014 High-performance Network",
    tags: ["Web 3", "DeFi", "Blockchain"],
    role: "UI/UX Designer",
    year: "2024",
    // 👇 DANH SÁCH ẢNH & VIDEO SHOWCASE (8 items):
    images: [
      "assets/projects/07-lumnia/Section 1.png",
      "assets/projects/07-lumnia/Section 2.png",
      "assets/projects/07-lumnia/Section 3.png",
      "assets/projects/07-lumnia/Section 4.png",
      "assets/projects/07-lumnia/Section 5.png",
      "assets/projects/07-lumnia/Section 6.png",
      "assets/projects/07-lumnia/Section 7.png",
      "assets/projects/07-lumnia/Section 8.png",
    ]
  },
  {
    index: 7,
    kicker: "PROJECT / 08 \u2014 SELECTED WORK",
    title: "SMARTO2",
    subtitle: "Smart Connect - Smart Control IoT Device Platform",
    tags: ["IoT", "Mobile App", "Smart Home"],
    role: "UI/UX Designer",
    year: "2025",
    // 👇 DANH SÁCH ẢNH & VIDEO SHOWCASE (16 items):
    images: [
      "assets/projects/08-smarto2/cover.png",
      "assets/projects/08-smarto2/smarto2-1.png",
      "assets/projects/08-smarto2/smarto2-2.png",
      "assets/projects/08-smarto2/smarto2-3.png",
      "assets/projects/08-smarto2/smarto2-4.png",
      "assets/projects/08-smarto2/smarto2-5.png",
      "assets/projects/08-smarto2/smarto2-6.png",
      "assets/projects/08-smarto2/smarto2-7.png",
      "assets/projects/08-smarto2/smarto2-8.png",
      "assets/projects/08-smarto2/smarto2-9.png",
      "assets/projects/08-smarto2/smarto2-10.png",
      "assets/projects/08-smarto2/smarto2-11.png",
      "assets/projects/08-smarto2/smarto2-12.png",
      "assets/projects/08-smarto2/smarto2-13.png",
      "assets/projects/08-smarto2/smarto2-14.png",
      "assets/projects/08-smarto2/smarto2-15.png",
    ]
  },
  {
    index: 8,
    kicker: "PROJECT / 09 \u2014 SELECTED WORK",
    title: "JWAKE",
    subtitle: "Fitness & Cardio Brand Identity",
    tags: ["Branding", "Identity", "Visual Design"],
    role: "Brand Designer",
    year: "2024",
    // 👇 DANH SÁCH ẢNH & VIDEO SHOWCASE (1 item):
    images: [
      "assets/projects/09-jwake/jwake-overview.png",
    ]
  },
  {
    index: 9,
    kicker: "PROJECT / 10 \u2014 SELECTED WORK",
    title: "Aurena",
    subtitle: "Cosmetics & Beauty Brand Identity",
    tags: ["Branding", "Packaging", "Visual Design"],
    role: "Brand Designer",
    year: "2024",
    // 👇 DANH SÁCH ẢNH & VIDEO SHOWCASE (1 item):
    images: [
      "assets/projects/10-aurena/aurena-overview.png",
    ]
  },
  {
    index: 10,
    kicker: "PROJECT / 11 \u2014 SELECTED WORK",
    title: "Frefru",
    subtitle: "Fresh Fruit Healthy Beverage Brand",
    tags: ["Branding", "Packaging", "Identity"],
    role: "Brand Designer",
    year: "2024",
    // 👇 DANH SÁCH ẢNH & VIDEO SHOWCASE (1 item):
    images: [
      "assets/projects/11-frefru/frefru-overview.png",
    ]
  },
  {
    index: 11,
    kicker: "PROJECT / 12 \u2014 SELECTED WORK",
    title: "Nattea",
    subtitle: "Nature Tea Traditional Modern Blend",
    tags: ["Branding", "Packaging", "Identity"],
    role: "Brand Designer",
    year: "2024",
    // 👇 DANH SÁCH ẢNH & VIDEO SHOWCASE (1 item):
    images: [
      "assets/projects/12-nattea/nattea-overview.png",
    ]
  },
  {
    index: 12,
    kicker: "PROJECT / 13 \u2014 SELECTED WORK",
    title: "Locacaf",
    subtitle: "Location Cafe & Space Experience",
    tags: ["Branding", "Interior & Signage", "Identity"],
    role: "Brand Designer",
    year: "2024",
    // 👇 DANH SÁCH ẢNH & VIDEO SHOWCASE (1 item):
    images: [
      "assets/projects/13-locacaf/locaCaf-overview.png",
    ]
  },
  {
    index: 13,
    kicker: "PROJECT / 14 \u2014 SELECTED WORK",
    title: "Social Media Design",
    subtitle: "Creative Digital Marketing & Social Campaign Graphics",
    tags: ["Graphic Design", "Social Media", "Marketing"],
    role: "Graphic Designer",
    year: "2025",
    layout: "grid-2", // 👈 Chia view popup dạng lưới 2 cột
    // 👇 DANH SÁCH ẢNH & VIDEO SHOWCASE (16 items):
    images: [
      "assets/projects/14-social-media/freelance-1.png",
      "assets/projects/14-social-media/freelance-2.png",
      "assets/projects/14-social-media/freelance-3.png",
      "assets/projects/14-social-media/freelance-4.png",
      "assets/projects/14-social-media/freelance-5.png",
      "assets/projects/14-social-media/freelance-6.png",
      "assets/projects/14-social-media/freelance-7.png",
      "assets/projects/14-social-media/freelance-8.png",
      "assets/projects/14-social-media/freelance-9.png",
      "assets/projects/14-social-media/freelance-10.png",
      "assets/projects/14-social-media/freelance-11.png",
      "assets/projects/14-social-media/freelance-12.png",
      "assets/projects/14-social-media/freelance-13.png",
      "assets/projects/14-social-media/freelance-14.png",
      "assets/projects/14-social-media/freelance-15.png",
      "assets/projects/14-social-media/freelance-16.png",
    ]
  },
];

// Modal DOM References
const modalBackdrop = document.querySelector("#projectModal");
const modalBody = document.querySelector("#modalBody");
const modalCloseBtn = document.querySelector("#modalCloseBtn");
const modalPrevBtn = document.querySelector("#modalPrevBtn");
const modalNextBtn = document.querySelector("#modalNextBtn");
const modalFooterPrevBtn = document.querySelector("#modalFooterPrevBtn");
const modalFooterNextBtn = document.querySelector("#modalFooterNextBtn");

const modalKicker = document.querySelector("#modalKicker");
const modalTitle = document.querySelector("#modalTitle");
const modalSubtitle = document.querySelector("#modalSubtitle");
const modalTags = document.querySelector("#modalTags");
const modalRole = document.querySelector("#modalRole");
const modalYear = document.querySelector("#modalYear");
const modalShowcaseContent = document.querySelector("#modalShowcaseContent");
const modalFooterPrevLabel = document.querySelector("#modalFooterPrevLabel");
const modalFooterNextLabel = document.querySelector("#modalFooterNextLabel");

let currentModalIndex = 0;
let isModalOpen = false;

// Cập nhật nội dung hiển thị trong modal theo index dự án
function renderModalProject(index) {
  const total = projectsDetailData.length;
  currentModalIndex = ((index % total) + total) % total;
  const project = projectsDetailData[currentModalIndex];
  if (!project) return;

  if (modalKicker) modalKicker.textContent = project.kicker;
  if (modalTitle) modalTitle.textContent = project.title;
  if (modalSubtitle) modalSubtitle.textContent = project.subtitle;
  if (modalRole) modalRole.textContent = project.role;
  if (modalYear) modalYear.textContent = project.year;

  // Render Tags
  if (modalTags) {
    modalTags.innerHTML = (project.tags || [])
      .map(tag => `<span class="modal-tag-pill">${tag}</span>`)
      .join("");
  }

  // Render Showcase Cards (100% Theme 1 duy nhất - Hỗ trợ cả Video Grid 3 cột và Danh sách Ảnh `images`)
  if (modalShowcaseContent) {
    if (Array.isArray(project.videoGrid) && project.videoGrid.length > 0) {
      // Hiển thị dạng lưới 3 cột Motion Video (Autoplay & Loop)
      modalShowcaseContent.innerHTML = `
        <div class="showcase-block">
          <div class="showcase-card">
            <div class="modal-video-grid">
              ${project.videoGrid.map(v => `
                <div class="modal-video-item">
                  <video src="${v}" autoplay loop muted playsinline></video>
                </div>
              `).join("")}
            </div>
          </div>
          <p class="showcase-caption">01 / Motion Design Showcase & Interactive Loops</p>
        </div>
      `;
    } else if (project.layout === "grid-2" || project.gridCols === 2 || (Array.isArray(project.tags) && project.tags.some(t => /graphic/i.test(t)))) {
      // Hiển thị dạng lưới 2 cột (Dành cho Graphic Design / Social Media Showcase)
      const rawList = Array.isArray(project.images) && project.images.length > 0
        ? project.images
        : (typeof project.image === "string" && project.image ? [project.image] : ["assets/projects/fin-ai/thumb.png"]);

      modalShowcaseContent.innerHTML = `
        <div class="showcase-block">
          <div class="showcase-card">
            <div class="modal-gallery-grid-2">
              ${rawList.map((item, idx) => {
                const imgUrl = typeof item === "string" ? item : (item.image || item.url || "");
                const isVideo = imgUrl.endsWith('.mp4') || imgUrl.endsWith('.webm');
                return `
                  <div class="modal-gallery-item">
                    ${isVideo 
                      ? `<video src="${imgUrl}" autoplay loop muted playsinline></video>`
                      : `<img src="${imgUrl}" alt="${project.title} - ${idx + 1}" loading="lazy">`
                    }
                  </div>
                `;
              }).join("")}
            </div>
          </div>
          <p class="showcase-caption">01 / Graphic Design & Social Media Collection (${rawList.length} items)</p>
        </div>
      `;
    } else {
      let rawList = [];
      if (Array.isArray(project.images) && project.images.length > 0) {
        rawList = project.images;
      } else if (typeof project.image === "string" && project.image) {
        rawList = [project.image];
      } else if (Array.isArray(project.showcases) && project.showcases.length > 0) {
        rawList = project.showcases;
      } else {
        rawList = ["assets/projects/fin-ai/thumb.png"];
      }

      modalShowcaseContent.innerHTML = rawList
        .map((item, idx) => {
          const imgUrl = typeof item === "string" ? item : (item.image || item.url || "");
          const caption = typeof item === "object" && item.caption ? item.caption : `0${idx + 1} / Showcase`;
          const headline = typeof item === "object" && item.headline ? item.headline : "";
          const badge = typeof item === "object" && item.badgeText ? item.badgeText : "";
          const badgeUrl = typeof item === "object" && item.badgeUrl ? item.badgeUrl : "#";
          const isVideo = imgUrl.endsWith('.mp4') || imgUrl.endsWith('.webm');
          const mediaHtml = isVideo
            ? `<video src="${imgUrl}" autoplay loop muted playsinline controls style="max-width: 100%; height: auto; border-radius: 18px; display: block; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);"></video>`
            : `<img src="${imgUrl}" alt="${project.title}" loading="lazy">`;

          return `
            <div class="showcase-block">
              <div class="showcase-card">
                ${headline ? `<h4 class="showcase-headline">${headline}</h4>` : ""}
                <div class="showcase-media">
                  ${mediaHtml}
                </div>
                ${badge ? `<a href="${badgeUrl}" target="_blank" rel="noopener noreferrer" class="showcase-badge">${badge}</a>` : ""}
              </div>
              ${caption ? `<p class="showcase-caption">${caption}</p>` : ""}
            </div>
          `;
        })
        .join("");
    }
  }

  // Cập nhật tên dự án trên nút Next / Previous ở footer
  const prevIdx = (currentModalIndex - 1 + total) % total;
  const nextIdx = (currentModalIndex + 1) % total;
  if (modalFooterPrevLabel) modalFooterPrevLabel.textContent = `Previous: ${projectsDetailData[prevIdx].title}`;
  if (modalFooterNextLabel) modalFooterNextLabel.textContent = `Next: ${projectsDetailData[nextIdx].title}`;

  // Reset scroll về đỉnh modal mỗi khi đổi dự án
  if (modalBody) {
    modalBody.scrollTop = 0;
  }
}

// Mở modal chi tiết dự án
function openProjectModal(index = 0) {
  isModalOpen = true;
  document.body.classList.add("modal-open");
  if (modalBackdrop) {
    modalBackdrop.classList.add("is-open");
    modalBackdrop.setAttribute("aria-hidden", "false");
  }
  renderModalProject(index);
}

// Đóng modal chi tiết dự án
function closeProjectModal() {
  isModalOpen = false;
  document.body.classList.remove("modal-open");
  if (modalBackdrop) {
    modalBackdrop.classList.remove("is-open");
    modalBackdrop.setAttribute("aria-hidden", "true");
  }
}

// Chuyển sang dự án kế tiếp
function stepModalNext() {
  const total = projectsDetailData.length;
  currentModalIndex = (currentModalIndex + 1) % total;
  renderModalProject(currentModalIndex);
}

// Chuyển về dự án trước đó
function stepModalPrev() {
  const total = projectsDetailData.length;
  currentModalIndex = (currentModalIndex - 1 + total) % total;
  renderModalProject(currentModalIndex);
}

// Gắn sự kiện điều khiển Modal
if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", closeProjectModal);
}
if (modalNextBtn) {
  modalNextBtn.addEventListener("click", stepModalNext);
}
if (modalPrevBtn) {
  modalPrevBtn.addEventListener("click", stepModalPrev);
}
if (modalFooterNextBtn) {
  modalFooterNextBtn.addEventListener("click", stepModalNext);
}
if (modalFooterPrevBtn) {
  modalFooterPrevBtn.addEventListener("click", stepModalPrev);
}

// Đóng khi click vào vùng mờ (backdrop) bên ngoài khung popup
if (modalBackdrop) {
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) {
      closeProjectModal();
    }
  });
}

// Phím tắt bàn phím khi modal đang mở:
// - Esc: Đóng popup
// - Mũi tên Phải: Next Project
// - Mũi tên Trái: Previous Project
window.addEventListener("keydown", (e) => {
  if (!isModalOpen) return;
  if (e.key === "Escape") {
    closeProjectModal();
  } else if (e.key === "ArrowRight") {
    stepModalNext();
  } else if (e.key === "ArrowLeft") {
    stepModalPrev();
  }
});
/* ==================== END PROJECT DETAIL POPUP MODAL CONTROLLER ==================== */