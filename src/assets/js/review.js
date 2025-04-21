const stars = document.querySelectorAll('.star');
const starContainer = document.getElementById('starContainer');
const goodFeedback = document.getElementById('goodFeedback');
const badFeedback = document.getElementById('badFeedback');

stars.forEach(star => {
  star.addEventListener('mouseover', () => {
    const rating = parseInt(star.getAttribute('data-rating'));
    highlightStars(rating);
  });

  star.addEventListener('mouseout', () => {
    highlightStars(0);
  });

  star.addEventListener('click', () => {
    const rating = parseInt(star.getAttribute('data-rating'));
    stars.forEach(s => s.classList.remove('selected'));
    star.classList.add('selected');
    stars.forEach(star => {
        const starRating = parseInt(star.getAttribute('data-rating'));
        if (starRating <= rating) {
        star.classList.add('selected');
        } else {
        star.classList.remove('selected');
        }
    })


    if (rating >= 4) {
      goodFeedback.style.display = 'block';
      badFeedback.style.display = 'none';
    } else {
      goodFeedback.style.display = 'none';
      badFeedback.style.display = 'block';
    }


  });
});

function highlightStars(rating) {
  stars.forEach(star => {
    const starRating = parseInt(star.getAttribute('data-rating'));
    if (starRating <= rating) {
      star.classList.add('hover');
    } else {
      star.classList.remove('hover');
    }
  });
}


function sendFeedback() {
  const message = document.querySelector('#badFeedback textarea').value.trim();
  const name = document.querySelector('#badFeedback input[type="text"]').value.trim();
  const contact = document.querySelector('#badFeedback input[type="email"]').value.trim();

  const email = "admin@montanoplumbing.ca";
  const subject = encodeURIComponent("Customer Feedback - MPC");
  const body = encodeURIComponent(
    `Customer Feedback:\n${message}\n\nName: ${name}\nContact: ${contact}`
  );

  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}