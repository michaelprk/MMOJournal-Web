(function () {
  // Reads ?theme= from iframe URL and applies minimal overrides + reports height
  function getParam(name) {
    try {
      return new URLSearchParams(window.location.search).get(name) || '';
    } catch {
      return '';
    }
  }

  var theme = getParam('theme');

  // Create style element for overrides (kept separate from upstream files)
  var style = document.createElement('style');
  style.id = 'mmoj-theme-overrides';
  (document.head || document.documentElement).appendChild(style);

  function applyTheme() {
    if (theme === 'mmoj') {
      style.textContent = [
        'html,body{background:transparent!important;}',
        // Apply a translucent backdrop only to the main wrapper so text stays opaque
        '.wrapper{background: rgba(0,0,0,0.20)!important; box-shadow:none!important;}',
        'nav{background:transparent!important;}',
        '.title-text, .main-title-text{display:none!important;}',
        // Also hide the in-panel heading if present
        '.wrapper > h1{display:none!important;}',
        '.credits{display:none!important;}',
        // Buttons and chips (default dark with yellow border; active solid yellow)
        '.btn, .greenbutton, .button{background: rgba(0,0,0,.35)!important; border-color: rgba(255,203,5,.45)!important; color:#fff!important;}',
        '.btn:hover{border-color: rgba(255,203,5,.8)!important;}',
        '.btn.active, .btn:focus, .btn:active{background: rgba(255,203,5,.20)!important; color:#ffcb05!important;}',
        // Inputs
        'input, select, textarea{background: rgba(0,0,0,.40)!important; color:#fff!important; border-color: rgba(255,255,255,.25)!important;}',
        // Section accents
        '.result-move-header, legend{color:#ffcb05!important;}',
        // Trim excessive bottom space; keep small padding
        'html,body{margin:0!important;}',
        '.wrapper{padding-bottom:14px!important;}',
        '.wrapper > :last-child{margin-bottom:0!important;}',
      ].join('\n');
    } else if (theme === 'plain-dark') {
      // Keep original layout/colors, just ensure a dark solid bg
      style.textContent = [
        'html,body{background:#111!important;}',
        '.wrapper{background:#111!important;}',
      ].join('\n');
    } else {
      style.textContent = '';
    }
  }

  applyTheme();

  // Height reporter: ResizeObserver + fallback
  function postHeight() {
    var de = document.documentElement;
    var h = Math.max(
      de.scrollHeight,
      de.offsetHeight,
      de.clientHeight
    );
    try {
      parent.postMessage({ source: 'mmoj-calc', type: 'height', height: h }, '*');
    } catch (e) {}
  }

  // Observe body size changes
  try {
    var ro = new ResizeObserver(function () { postHeight(); });
    ro.observe(document.documentElement);
  } catch (e) {}

  // Mutation observer for DOM changes that may affect height
  try {
    var mo = new MutationObserver(function () { postHeight(); });
    mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
  } catch (e) {}

  // Fallback on load/resize
  window.addEventListener('load', function(){ setTimeout(postHeight, 50); setTimeout(postHeight, 250); });
  window.addEventListener('resize', function () { postHeight(); });
  // Initial fire
  setTimeout(postHeight, 10);
})();


