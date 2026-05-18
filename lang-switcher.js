/**
 * ============================================================
 *  FUNA DIGITAL — lang-switcher.js
 *  Motor de traducción universal — funciona en TODOS los HTMLs
 * ------------------------------------------------------------
 *  Cómo usar en cualquier HTML:
 *  1. Añade data-i18n="clave" al elemento que quieres traducir
 *  2. Incluye al final del <body>:
 *       <script src="/translations.js"></script>
 *       <script src="/lang-switcher.js"></script>
 *  ¡Listo! El selector aparece automáticamente en todas las páginas.
 * ============================================================
 */

(function () {
  'use strict';

  /* ── Configuración ── */
  const STORAGE_KEY = 'funa_lang';
  const DEFAULT_LANG = 'en';
  const SUPPORTED = ['en', 'es', 'ar'];
  const FLAGS = { en: '🇬🇧', es: '🇪🇸', ar: '🇦🇪' };
  const LABELS = { en: 'EN', es: 'ES', ar: 'عر' };

  /* ── Detectar idioma guardado o del navegador ── */
  function detectLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
    const browser = (navigator.language || '').slice(0, 2).toLowerCase();
    if (SUPPORTED.includes(browser)) return browser;
    return DEFAULT_LANG;
  }

  /* ── Aplicar traducciones al DOM ── */
  function applyTranslations(lang) {
    const dict = window.FUNA_LANG && window.FUNA_LANG[lang];
    if (!dict) { console.warn('[Funa i18n] No hay traducciones para:', lang); return; }

    /* Dirección del texto */
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    /* Traducir todos los elementos con data-i18n */
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (!dict[key]) return;
      /* Si es input/placeholder */
      if (el.hasAttribute('placeholder')) {
        el.setAttribute('placeholder', dict[key]);
      } else {
        el.textContent = dict[key];
      }
    });

    /* Traducir atributos data-i18n-html (para HTML interno) */
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key]) el.innerHTML = dict[key];
    });

    /* Traducir atributos data-i18n-title */
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (dict[key]) el.setAttribute('title', dict[key]);
    });

    /* Actualizar meta tags de SEO dinámicamente */
    updateSEOMeta(lang);

    /* Actualizar botones del selector */
    document.querySelectorAll('.funa-lang-btn').forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      btn.classList.toggle('active', btnLang === lang);
    });

    /* Guardar preferencia */
    localStorage.setItem(STORAGE_KEY, lang);

    /* Disparar evento para scripts externos */
    document.dispatchEvent(new CustomEvent('funa:langChanged', { detail: { lang } }));
  }

  /* ── Actualizar meta SEO según idioma ── */
  function updateSEOMeta(lang) {
    const metas = {
      en: {
        title: 'Funa Digital Marketing Dubai | Growth Agency UAE',
        desc: "Dubai's boldest growth marketing agency. Lead Gen, Paid Media, Branding & AI Marketing across the UAE and GCC.",
        ogLocale: 'en_US'
      },
      es: {
        title: 'Funa Digital Marketing Dubai | Agencia de Crecimiento EAU',
        desc: 'La agencia de marketing de crecimiento más audaz de Dubái. Generación de leads, medios pagados, branding y marketing con IA en los EAU y el CCG.',
        ogLocale: 'es_ES'
      },
      ar: {
        title: 'فونا ديجيتال للتسويق دبي | وكالة النمو الإمارات',
        desc: 'وكالة تسويق النمو الأكثر جرأة في دبي. توليد العملاء المحتملين والإعلانات المدفوعة والعلامة التجارية والتسويق بالذكاء الاصطناعي عبر الإمارات ودول الخليج.',
        ogLocale: 'ar_AE'
      }
    };

    const m = metas[lang];
    if (!m) return;

    document.title = m.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', m.desc);
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) ogLocale.setAttribute('content', m.ogLocale);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', m.title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', m.desc);
  }

  /* ── Inyectar selector flotante ── */
  function injectSwitcher() {
    if (document.getElementById('funa-lang-switcher')) return;

    const currentLang = detectLang();

    const style = document.createElement('style');
    style.textContent = `
      #funa-lang-switcher {
        position: fixed;
        bottom: 90px;
        right: 24px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 6px;
        align-items: center;
      }
      .funa-lang-label {
        font-size: 9px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.35);
        font-family: monospace;
        margin-bottom: 2px;
      }
      .funa-lang-btn {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        border: 1.5px solid rgba(200,255,0,0.2);
        background: rgba(8,8,8,0.9);
        color: rgba(255,255,255,0.5);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.05em;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1px;
        transition: all 0.2s ease;
        backdrop-filter: blur(8px);
        font-family: monospace;
        line-height: 1;
      }
      .funa-lang-btn:hover {
        border-color: rgba(200,255,0,0.6);
        color: #C8FF00;
        transform: scale(1.08);
      }
      .funa-lang-btn.active {
        border-color: #C8FF00;
        background: rgba(200,255,0,0.12);
        color: #C8FF00;
        box-shadow: 0 0 16px rgba(200,255,0,0.2);
      }
      .funa-lang-btn .flag {
        font-size: 14px;
        line-height: 1;
      }
      .funa-lang-btn .code {
        font-size: 9px;
        letter-spacing: 0.1em;
      }
      /* RTL: mover el selector a la izquierda */
      [dir="rtl"] #funa-lang-switcher {
        right: auto;
        left: 24px;
      }
      /* Mobile */
      @media (max-width: 768px) {
        #funa-lang-switcher {
          bottom: 80px;
          right: 16px;
          flex-direction: row;
          gap: 8px;
        }
        .funa-lang-btn {
          width: 40px;
          height: 40px;
        }
        [dir="rtl"] #funa-lang-switcher {
          right: auto;
          left: 16px;
        }
      }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.id = 'funa-lang-switcher';
    container.setAttribute('role', 'navigation');
    container.setAttribute('aria-label', 'Language selector');

    const label = document.createElement('div');
    label.className = 'funa-lang-label';
    label.textContent = 'LANG';
    container.appendChild(label);

    SUPPORTED.forEach(lang => {
      const btn = document.createElement('button');
      btn.className = 'funa-lang-btn' + (lang === currentLang ? ' active' : '');
      btn.setAttribute('data-lang', lang);
      btn.setAttribute('aria-label', 'Switch to ' + lang.toUpperCase());
      btn.innerHTML = `<span class="flag">${FLAGS[lang]}</span><span class="code">${LABELS[lang]}</span>`;
      btn.addEventListener('click', () => applyTranslations(lang));
      container.appendChild(btn);
    });

    document.body.appendChild(container);
  }

  /* ── Inicializar ── */
  function init() {
    if (!window.FUNA_LANG) {
      console.error('[Funa i18n] translations.js no está cargado. Asegúrate de incluirlo ANTES de lang-switcher.js');
      return;
    }
    injectSwitcher();
    applyTranslations(detectLang());
  }

  /* Esperar a que el DOM esté listo */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
