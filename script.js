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