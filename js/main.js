(function () {
  var root = document.documentElement;
  var toggle = document.getElementById('themeToggle');
  var themeLabel = document.getElementById('themeLabel');

  var LANG_KEY = 'cristina-portfolio-lang';
  var THEME_KEY = 'cristina-portfolio-theme';

  function getLang() {
    var saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) {}
    return saved === 'en' ? 'en' : 'es';
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderStaggerWords(el, text) {
    var baseDelay = 0.2;
    var step = 0.09;
    el.innerHTML = text.split(' ').map(function (word, i) {
      var delay = (baseDelay + i * step).toFixed(2);
      return '<span class="stagger-word" style="animation-delay:' + delay + 's">' + escapeHtml(word) + '</span>';
    }).join(' ');
  }

  function t(key, lang) {
    var dict = window.I18N && window.I18N[lang];
    if (!dict) return null;
    var parts = key.split('.');
    var node = dict;
    for (var i = 0; i < parts.length; i++) {
      if (node == null) return null;
      node = node[parts[i]];
    }
    return node;
  }

  function updateThemeLabel(lang) {
    if (!themeLabel) return;
    var theme = root.getAttribute('data-theme');
    var key = theme === 'dark' ? 'common.theme.toLight' : 'common.theme.toDark';
    var label = t(key, lang);
    if (label != null) themeLabel.textContent = label;
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    updateThemeLabel(getLang());
  }

  function applyLang(lang) {
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    root.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var val = t(el.getAttribute('data-i18n'), lang);
      if (val != null) el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var val = t(el.getAttribute('data-i18n-html'), lang);
      if (val != null) el.innerHTML = val;
    });

    document.querySelectorAll('[data-i18n-stagger]').forEach(function (el) {
      var val = t(el.getAttribute('data-i18n-stagger'), lang);
      if (val != null) renderStaggerWords(el, val);
    });

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      var isActive = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    updateThemeLabel(lang);
  }

  var savedTheme = null;
  try { savedTheme = localStorage.getItem(THEME_KEY); } catch (e) {}
  root.setAttribute('data-theme', savedTheme === 'dark' ? 'dark' : 'light');

  applyLang(getLang());

  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyLang(btn.getAttribute('data-lang'));
    });
  });

  var navToggle = document.getElementById('navToggle');
  var navPill = document.getElementById('navPill');
  if (navToggle && navPill) {
    navToggle.addEventListener('click', function () {
      var isOpen = navPill.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navPill.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navPill.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navPill.classList.contains('open')) {
        navPill.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  var shots = document.querySelectorAll('.cs-shot');
  if (shots.length) {
    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML =
      '<button class="lightbox-close" aria-label="Cerrar">&times;</button>' +
      '<img class="lightbox-img" alt="">' +
      '<p class="lightbox-caption"></p>';
    document.body.appendChild(overlay);

    var lightboxImg = overlay.querySelector('.lightbox-img');
    var lightboxCaption = overlay.querySelector('.lightbox-caption');

    var lightboxTrigger = null;
    function openLightbox(img) {
      var figure = img.closest('figure');
      var caption = figure ? figure.querySelector('figcaption') : null;
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt || '';
      lightboxCaption.textContent = caption ? caption.textContent : '';
      overlay.classList.remove('zoomed');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      lightboxTrigger = img;
      overlay.querySelector('.lightbox-close').focus();
    }
    function closeLightbox() {
      overlay.classList.remove('open');
      overlay.classList.remove('zoomed');
      if (lightboxTrigger) { lightboxTrigger.focus(); lightboxTrigger = null; }
      document.body.style.overflow = '';
    }

    lightboxImg.addEventListener('click', function (e) {
      e.stopPropagation();
      overlay.classList.toggle('zoomed');
    });

    shots.forEach(function (img) {
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.addEventListener('click', function () { openLightbox(img); });
      img.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(img);
        }
      });
    });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeLightbox();
    });
    overlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  var filterButtons = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('.card');

  if (filterButtons.length && cards.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        var filter = btn.getAttribute('data-filter');
        cards.forEach(function (card) {
          var cats = card.getAttribute('data-cat').split(' ');
          var show = filter === 'all' || cats.indexOf(filter) !== -1;
          card.classList.toggle('hidden', !show);
        });
      });
    });
  }

  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var avatarWrap = document.getElementById('avatarWrap');
  var avatarImg = avatarWrap ? avatarWrap.querySelector('.avatar') : null;
  if (avatarWrap && avatarImg && !prefersReducedMotion) {
    var maxTilt = 16;
    avatarWrap.addEventListener('mousemove', function (e) {
      var rect = avatarWrap.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      var rotateY = px * maxTilt * 2;
      var rotateX = -py * maxTilt * 2;
      avatarImg.style.transitionDuration = '60ms';
      avatarImg.style.transform = 'perspective(700px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.06)';
    });
    avatarWrap.addEventListener('mouseleave', function () {
      avatarImg.style.transitionDuration = '500ms';
      avatarImg.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

  var copyEmailBtn = document.querySelector('.copy-email-btn');
  if (copyEmailBtn) {
    var copyResetTimer = null;
    copyEmailBtn.addEventListener('click', function () {
      var email = copyEmailBtn.getAttribute('data-email');

      function showCopied() {
        var lang = getLang();
        copyEmailBtn.textContent = t('home.contact.copied', lang) || 'Copiado';
        copyEmailBtn.classList.add('is-copied');
        clearTimeout(copyResetTimer);
        copyResetTimer = setTimeout(function () {
          copyEmailBtn.textContent = t('home.contact.copy', lang) || 'Copiar';
          copyEmailBtn.classList.remove('is-copied');
        }, 1600);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(showCopied, showCopied);
      } else {
        var ta = document.createElement('textarea');
        ta.value = email;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
        showCopied();
      }
    });
  }
})();
