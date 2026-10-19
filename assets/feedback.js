// Floating message bubble: visitors send reviews, feedback and suggestions to the Little Roots inbox.
(function () {
  var EMAIL = 'LittleRootsPublishing@gmail.com';
  var ENDPOINT = 'https://formsubmit.co/ajax/' + EMAIL;

  var css = '' +
    '.lr-bubble{position:fixed;right:18px;bottom:18px;z-index:1001;width:70px;height:70px;border-radius:50%;border:0;padding:0;background:transparent;color:#fbf8ed;cursor:pointer;transition:transform .2s}.lr-core{position:relative;z-index:1;width:100%;height:100%;border-radius:50%;background:#31583e;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 18px #203b2940,0 0 0 3px #f5c542}' +
    '.lr-bubble:hover{transform:scale(1.06)}.lr-bubble:before{content:"";position:absolute;inset:-26px;z-index:0;border-radius:50%;pointer-events:none;background:repeating-conic-gradient(from 0deg,#ffc72ccc 0deg 9deg,#ffc72c00 9deg 30deg);-webkit-mask:radial-gradient(circle,#000 38%,transparent 70%);mask:radial-gradient(circle,#000 38%,transparent 70%);animation:lr-rays 14s linear infinite}.lr-bubble:after{content:"";position:absolute;inset:-10px;z-index:0;border-radius:50%;pointer-events:none;background:radial-gradient(circle,#ffd65c99 40%,#ffd65c00 72%);animation:lr-glow 2.6s ease-in-out infinite}@keyframes lr-rays{to{transform:rotate(360deg)}}@keyframes lr-glow{0%,100%{opacity:.55;transform:scale(.95)}50%{opacity:1;transform:scale(1.08)}}@media(prefers-reduced-motion:reduce){.lr-bubble:before,.lr-bubble:after{animation:none}}.lr-bubble svg{width:34px;height:34px}' +
    '.lr-panel{position:fixed;right:18px;bottom:100px;z-index:1001;width:min(340px,calc(100vw - 32px));max-height:calc(100vh - 110px);overflow:auto;background:#fbf8ed;color:#253f32;border:1px solid #dce0cf;border-radius:16px;box-shadow:0 18px 50px #203b2933;padding:20px;font:15px/1.45 system-ui,sans-serif}' +
    '.lr-panel[hidden]{display:none}.lr-panel h2{font:400 24px/1.1 Georgia,serif;margin:0 0 4px}.lr-panel p{margin:0 0 14px;color:#61685e;font-size:14px}' +
    '.lr-panel label{display:block;font-size:12px;letter-spacing:.5px;text-transform:uppercase;margin:10px 0 4px;color:#405539}' +
    '.lr-panel input,.lr-panel select,.lr-panel textarea{width:100%;box-sizing:border-box;font:inherit;font-size:16px;color:#253f32;background:#fff;border:1px solid #c9d1bd;border-radius:10px;padding:9px 11px}' +
    '.lr-panel textarea{min-height:110px;resize:vertical}.lr-panel input:focus,.lr-panel select:focus,.lr-panel textarea:focus{outline:2px solid #bd6439;outline-offset:1px}' +
    '.lr-send{margin-top:14px;width:100%;border:0;border-radius:28px;background:#31583e;color:#fbf8ed;font:inherit;padding:12px;cursor:pointer}.lr-send:disabled{opacity:.6;cursor:default}' +
    '.lr-close{float:right;border:0;background:transparent;font-size:24px;line-height:1;color:#253f32;cursor:pointer;padding:0 2px}' +
    '.lr-hp{position:absolute;left:-9999px}.lr-note{margin-top:12px;font-size:14px}.lr-note a{color:#31583e}' +
    '.lr-bubble:focus-visible,.lr-close:focus-visible,.lr-send:focus-visible{outline:3px solid #bd6439;outline-offset:3px}' +
    '@media(max-width:600px){.lr-bubble{right:14px;bottom:14px;width:64px;height:64px}.lr-bubble svg{width:31px;height:31px}.lr-panel{right:14px;bottom:90px}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var wrap = document.createElement('div');
  wrap.innerHTML = '' +
    '<button class="lr-bubble" type="button" aria-label="Send us a message" aria-expanded="false" aria-controls="lr-panel">' +
      '<span class="lr-core"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/><path d="M8.5 11h7M8.5 14h4"/></svg></span>' +
    '</button>' +
    '<div class="lr-panel" id="lr-panel" role="dialog" aria-labelledby="lr-title" hidden>' +
      '<button class="lr-close" type="button" aria-label="Close">×</button>' +
      '<h2 id="lr-title">Say hello</h2>' +
      '<p>Share a review, feedback, a suggestion, or anything else. Anthony reads every message.</p>' +
      '<form class="lr-form" novalidate>' +
        '<label for="lr-type">What kind of message?</label>' +
        '<select id="lr-type" name="type"><option>Review</option><option>Feedback</option><option>Suggestion</option><option>Other</option></select>' +
        '<label for="lr-name">Your name (optional)</label><input id="lr-name" name="name" autocomplete="name">' +
        '<label for="lr-email">Your email (optional, for a reply)</label><input id="lr-email" name="email" type="email" autocomplete="email">' +
        '<label for="lr-message">Message</label><textarea id="lr-message" name="message" required></textarea>' +
        '<input class="lr-hp" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">' +
        '<button class="lr-send" type="submit">Send message</button>' +
        '<div class="lr-note" role="status" aria-live="polite"></div>' +
      '</form>' +
    '</div>';
  document.body.appendChild(wrap);

  var bubble = wrap.querySelector('.lr-bubble');
  var panel = wrap.querySelector('.lr-panel');
  var form = wrap.querySelector('.lr-form');
  var note = wrap.querySelector('.lr-note');
  var send = wrap.querySelector('.lr-send');

  function setOpen(open) {
    panel.hidden = !open;
    bubble.setAttribute('aria-expanded', String(open));
    if (open) form.querySelector('textarea').focus();
  }
  bubble.addEventListener('click', function () { setOpen(panel.hidden); });
  wrap.querySelector('.lr-close').addEventListener('click', function () { setOpen(false); bubble.focus(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { setOpen(false); bubble.focus(); } });

  function mailtoLink(type, message) {
    return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Website ' + type.toLowerCase()) + '&body=' + encodeURIComponent(message);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = {
      type: form.elements.type.value,
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      message: form.elements.message.value.trim()
    };
    if (!data.message) { note.textContent = 'Please write a message first.'; form.elements.message.focus(); return; }
    if (data.email && !form.elements.email.checkValidity()) { note.textContent = 'That email address doesn\'t look right.'; form.elements.email.focus(); return; }
    if (form.elements._honey.value) return;

    send.disabled = true;
    note.textContent = 'Sending…';
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: 'Little Roots website: ' + data.type,
        _template: 'table',
        'Message type': data.type,
        name: data.name || '(not given)',
        email: data.email || '(not given)',
        message: data.message,
        page: location.href
      })
    }).then(function (r) { return r.json().then(function (j) { if (!r.ok || String(j.success) !== 'true') throw new Error('send failed'); }); })
      .then(function () {
        form.reset();
        note.textContent = 'Thank you! Your message is on its way.';
      })
      .catch(function () {
        note.innerHTML = 'Sorry, that didn\'t send. You can <a href="' + mailtoLink(data.type, data.message) + '">email us instead</a>.';
      })
      .then(function () { send.disabled = false; });
  });
})();
