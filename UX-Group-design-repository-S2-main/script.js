function getCurrentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

function getNavigationHistory() {
  return JSON.parse(sessionStorage.getItem('navigationHistory')) || [];
}

function setNavigationHistory(history) {
  sessionStorage.setItem('navigationHistory', JSON.stringify(history));
}

function recordCurrentPage() {
  let history = getNavigationHistory();
  let currentPage = getCurrentPage();

  if (!history.length || history[history.length - 1] !== currentPage) {
    history.push(currentPage);
    setNavigationHistory(history);
  }
}

function goBack() {
  let history = getNavigationHistory();
  let currentPage = getCurrentPage();

  if (history.length > 1) {
    history.pop();
    let previousPage = history[history.length - 1];
    setNavigationHistory(history);
    window.location.href = previousPage;
    return;
  }

  if (currentPage === 'event.html') {
    window.location.href = 'browse.html';
  } else if (currentPage === 'booking-seat.html') {
    window.location.href = 'event.html';
  } else if (currentPage === 'complete-booking.html') {
    window.location.href = 'booking-seat.html';
  } else if (currentPage === 'confirmation.html') {
    window.location.href = 'complete-booking.html';
  } else if (currentPage === 'booking-date.html') {
    window.location.href = 'event.html';
  } else if (currentPage === 'payment.html') {
    window.location.href = 'booking-seat.html';
  } else if (currentPage === 'payment-methods.html' || currentPage === 'notification-settings.html') {
    window.location.href = 'profile.html';
  } else if (currentPage === 'profile.html') {
    window.location.href = 'browse.html';
  } else if (currentPage === 'saved.html' || currentPage === 'tickets.html') {
    window.location.href = 'browse.html';
  } else {
    window.location.href = 'browse.html';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  recordCurrentPage();
});

// Navigation Functions
function goToEvent() {
  window.location.href = "event.html";
}

function goToDate() {
  window.location.href = "booking-seat.html";
}

function goToSeat() {
  window.location.href = "complete-booking.html";
}

function goToPayment() {
  window.location.href = "complete-booking.html";
}

function goToConfirmation() {
  window.location.href = "confirmation.html";
}





// ===============================================
// ADDED BY AOIFE
// ===============================================


// ------------------------------
// ELEMENTS
// ------------------------------
const ticketCountEl = document.querySelector(".ticket-count");
const minusBtn = document.querySelectorAll(".step-button")[0];
const plusBtn = document.querySelectorAll(".step-button")[1];
const ticketTypeButtons = document.querySelectorAll(".ticket-type");
const seatButtons = document.querySelectorAll(".seat-circle:not(.unavailable)");
const selectedCountLabel = document.querySelector(".seat-layout-top span");
const totalPriceEl = document.querySelector(".seat-total span");

// ------------------------------
// STATE
// ------------------------------
let ticketCount = 1;
let selectedSeats = [];
let currentPrice = 65; // default (Stalls)

// ------------------------------
// HELPERS
// ------------------------------
function updateSelectedCount() {
  selectedCountLabel.textContent = `${selectedSeats.length} / ${ticketCount} Selected`;
}

function updateTotal() {
  totalPriceEl.textContent = `£${selectedSeats.length * currentPrice}`;
}

function resetSeats() {
  selectedSeats = [];
  seatButtons.forEach(btn => btn.classList.remove("selected"));
  updateSelectedCount();
  updateTotal();
}

// ------------------------------
// TICKET COUNT BUTTONS
// ------------------------------
minusBtn.addEventListener("click", () => {
  if (ticketCount > 1) {
    ticketCount--;
    ticketCountEl.textContent = ticketCount;
    resetSeats();
  }
});

plusBtn.addEventListener("click", () => {
  ticketCount++;
  ticketCountEl.textContent = ticketCount;
  resetSeats();
});

// ------------------------------
// TICKET TYPE SELECTION
// ------------------------------
ticketTypeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    ticketTypeButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const priceText = btn.querySelector("small").textContent;
    currentPrice = parseInt(priceText.replace("£", ""));

    resetSeats();
  });
});

// ------------------------------
// SEAT SELECTION
// ------------------------------
seatButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const seatNumber = btn.textContent.trim();

    if (btn.classList.contains("selected")) {
      btn.classList.remove("selected");
      selectedSeats = selectedSeats.filter(s => s !== seatNumber);
    } else {
      if (selectedSeats.length >= ticketCount) return;
      btn.classList.add("selected");
      selectedSeats.push(seatNumber);
    }

    updateSelectedCount();
    updateTotal();
  });
});

// ------------------------------
// NAVIGATION
// ------------------------------
function goToPayment() {
  if (selectedSeats.length !== ticketCount) {
    alert("Please select all required seats before continuing.");
    return;
  }
  window.location.href = "payment.html";
}

function goBack() {
  window.history.back();
}

window.goToPayment = goToPayment;
window.goBack = goBack;


function goToPayment() {
  if (selectedSeats.length !== ticketCount) {
    alert("Please select all required seats before continuing.");
    return;
  }

  // Save selected seat + price
  localStorage.setItem("selectedSeat", selectedSeats.join(", "));
  localStorage.setItem("selectedPrice", currentPrice * selectedSeats.length);

  window.location.href = "payment.html";
}


document.addEventListener("DOMContentLoaded", () => {
  const seatEl = document.querySelector(".review-seat");
  const priceEl = document.querySelector(".review-price");
  const payButton = document.querySelector(".pay-button");

  const seat = localStorage.getItem("selectedSeat");
  const price = localStorage.getItem("selectedPrice");

  if (seat) seatEl.textContent = seat;
  if (price) {
    priceEl.textContent = `£${price}`;
    payButton.textContent = `PAY £${price} →`;
  }
});








// ------------------------------
// Event UI wiring
// ------------------------------
(function () {
  // Run after DOM ready
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(() => {
    const chips = Array.from(document.querySelectorAll(".chip"));
    const eventsList = document.querySelector(".events-list");
    const cards = Array.from(document.querySelectorAll(".card"));

    // Ensure each card has a stable data-id and is focusable
    cards.forEach((card, i) => {
      if (!card.dataset.id) card.dataset.id = `evt-${i + 1}`;
      if (!card.hasAttribute("tabindex")) card.setAttribute("tabindex", "0");
    });

    // ------------------------------
    // Navigation: global goToEvent
    // ------------------------------
    // This replaces/augments your existing goToEvent so inline onclick works.
    // It stores the selected event id in sessionStorage and navigates to event.html.
    window.goToEvent = function (idOrEvent) {
      // If called with an Event object (inline onclick without args), try to infer
      if (idOrEvent && idOrEvent.target) {
        const card = idOrEvent.target.closest(".card");
        idOrEvent = card ? card.dataset.id : null;
      }

      // If no id passed, try focused element or first visible card
      if (!idOrEvent) {
        const focused = document.activeElement;
        if (focused && focused.classList && focused.classList.contains("card")) {
          idOrEvent = focused.dataset.id;
        } else {
          const firstVisible = cards.find(c => c.style.display !== "none");
          idOrEvent = firstVisible ? firstVisible.dataset.id : null;
        }
      }

      if (!idOrEvent) {
        console.warn("goToEvent: no event id found");
        return;
      }

      // Save selected event id for event.html to read
      sessionStorage.setItem("selectedEventId", idOrEvent);

      // Navigate to event page (replace with router if needed)
      window.location.href = "event.html";
    };

    // ------------------------------
    // Show / hide helpers with fade
    // ------------------------------
    const showCard = (card) => {
      card.style.display = ""; // revert to stylesheet default
      card.classList.remove("fade-out");
      card.classList.add("fade-in");
      card.style.pointerEvents = ""; // ensure clickable
    };
    const hideCard = (card) => {
      card.classList.remove("fade-in");
      card.classList.add("fade-out");
      card.style.pointerEvents = "none";
      setTimeout(() => {
        if (card.classList.contains("fade-out")) card.style.display = "none";
      }, 180);
    };

    // ------------------------------
    // Chip -> filter key
    // ------------------------------
    const chipToFilter = (chip) => {
      if (chip.dataset.filter) return chip.dataset.filter.toLowerCase();
      const text = chip.textContent.trim();
      const noEmoji = text.replace(/^[^\p{L}\p{N}]*/u, "").trim();
      return noEmoji.split(/\s+/)[0].toLowerCase();
    };

    // ------------------------------
    // Apply filter
    // ------------------------------
    const applyFilter = (filterKey) => {
      cards.forEach(card => {
        const cat = (card.dataset.category || "").toLowerCase();
        if (!cat) { showCard(card); return; }
        if (filterKey === "all" || cat === filterKey) showCard(card);
        else hideCard(card);
      });
    };

    // ------------------------------
    // Active chip visuals + ARIA
    // ------------------------------
    const setActiveChip = (targetChip) => {
      chips.forEach(c => {
        const isActive = c === targetChip;
        c.classList.toggle("active", isActive);
        c.setAttribute("aria-pressed", isActive ? "true" : "false");
        c.setAttribute("tabindex", "0");
      });
    };

    // ------------------------------
    // Wire chips: click, keyboard, arrow nav
    // ------------------------------
    chips.forEach((chip, idx) => {
      chip.setAttribute("role", "tab");
      chip.setAttribute("aria-pressed", chip.classList.contains("active") ? "true" : "false");
      chip.setAttribute("tabindex", "0");

      chip.addEventListener("click", () => {
        const filter = chipToFilter(chip);
        setActiveChip(chip);
        applyFilter(filter);
      });

      chip.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          chip.click();
        } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          const nextIdx = e.key === "ArrowRight" ? (idx + 1) % chips.length : (idx - 1 + chips.length) % chips.length;
          chips[nextIdx].focus();
        }
      });
    });

    // ------------------------------
    // Delegated click handler for events list
    // ------------------------------
    if (eventsList) {
      eventsList.addEventListener("click", (e) => {
        // Fav clicked? toggle and stop navigation
        const fav = e.target.closest(".fav");
        if (fav) {
          e.stopPropagation();
          const card = fav.closest(".card");
          const pressed = fav.getAttribute("aria-pressed") === "true";
          fav.setAttribute("aria-pressed", String(!pressed));
          // Optionally persist: localStorage.setItem(`fav_${card.dataset.id}`, String(!pressed));
          return;
        }

        // Otherwise navigate to card
        const card = e.target.closest(".card");
        if (card) {
          const id = card.dataset.id;
          if (id) window.goToEvent(id);
        }
      });
    }

    // ------------------------------
    // Keyboard activation for cards and favs
    // ------------------------------
    cards.forEach(card => {
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          // If focus is on fav, let fav handle it
          if (document.activeElement && document.activeElement.classList.contains("fav")) return;
          e.preventDefault();
          const id = card.dataset.id;
          if (id) window.goToEvent(id);
        }
      });

      const fav = card.querySelector(".fav");
      if (fav) {
        fav.setAttribute("role", "button");
        fav.setAttribute("tabindex", "0");
        fav.setAttribute("aria-pressed", fav.getAttribute("aria-pressed") === "true" ? "true" : "false");

        fav.addEventListener("click", (e) => {
          e.stopPropagation();
          const pressed = fav.getAttribute("aria-pressed") === "true";
          fav.setAttribute("aria-pressed", String(!pressed));
        });

        fav.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fav.click();
          }
        });
      }
    });

    // ------------------------------
    // Initialize: apply active chip filter on load
    // ------------------------------
    const initial = document.querySelector(".chip.active") || chips[0];
    if (initial) initial.click();
  });
})();
