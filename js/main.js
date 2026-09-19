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

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
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
  }

  var filterButtons = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('.card');

  if (filterButtons.length && cards.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        cards.forEach(function (card) {
          var cats = card.getAttribute('data-cat').split(' ');
          var show = filter === 'all' || cats.indexOf(filter) !== -1;
          card.classList.toggle('hidden', !show);
        });
      });
    });
  }
})();
