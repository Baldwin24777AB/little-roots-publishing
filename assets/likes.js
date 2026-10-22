// Thumbs-up next to each book's Read Free button: a click emails a "like" for that book to the Little Roots inbox.
(function () {
  var ENDPOINT = 'https://formsubmit.co/ajax/LittleRootsPublishing@gmail.com';
  var THUMB = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M7 10v11H3V10h4zm2 11h8.3a2 2 0 0 0 2-1.6l1.3-6.6A2 2 0 0 0 18.6 10H14l.8-4.2A2 2 0 0 0 12.9 3.4L9 10v11z" fill="currentColor"/></svg>';

  var style = document.createElement('style');
  style.textContent = '.like-btn{display:inline-flex;align-items:center;gap:8px;vertical-align:middle;margin-left:12px;border:1px solid #31583e;border-radius:28px;background:transparent;color:#31583e;font:inherit;font-size:13px;padding:12px 18px;cursor:pointer}' +
    '.like-btn:hover{background:#31583e14}.like-btn:focus-visible{outline:3px solid #bd6439;outline-offset:3px}' +
    '.like-btn.liked{background:#31583e;color:#fbf8ed;cursor:default}.buttons .like-btn{margin-left:0}';
  document.head.appendChild(style);

  function stored(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function store(key) { try { localStorage.setItem(key, '1'); } catch (e) {} }

  function markLiked(btn) {
    btn.classList.add('liked');
    btn.disabled = true;
    btn.innerHTML = THUMB + '<span>Thanks!</span>';
    btn.setAttribute('aria-label', 'You liked this book. Thank you!');
  }

  document.querySelectorAll('.feature').forEach(function (card) {
    var read = card.querySelector('a.button');
    var title = card.querySelector('h3');
    if (!read || !title) return;
    var book = title.textContent.trim();
    var key = 'lr-liked:' + book;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'like-btn';
    btn.innerHTML = THUMB + '<span>Like</span>';
    btn.setAttribute('aria-label', 'Like ' + book);
    read.insertAdjacentElement('afterend', btn);
    if (stored(key)) { markLiked(btn); return; }

    btn.addEventListener('click', function () {
      markLiked(btn);
      store(key);
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: 'Book like: ' + book,
          _template: 'table',
          book: book,
          message: 'A reader gave ' + book + ' a thumbs up.',
          page: location.href
        })
      }).catch(function () {});
    });
  });
})();
