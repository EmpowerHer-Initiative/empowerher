// AI Inspector overlay — injected on every page by the ai-inspector
// integration. Inert unless localStorage.__aiInspect is set (via the secret
// activation route). Then: a cursor-following dot morphs into a border box
// around editable elements; clicking copies a minimal AI-editing payload.
(function () {
  var FLAG = "__aiInspect";
  var EDITABLE =
    "h1,h2,h3,h4,h5,h6,p,span,a,button,img,li,blockquote,figcaption," +
    "label,input:not([type=hidden]):not([aria-hidden=true]),textarea";
  var ACCENT = "#4f7fff";

  if (!localStorage.getItem(FLAG)) return;

  // ---------- payload ----------

  function sectionLabel(el) {
    var landmark = el.closest("section,header,footer,main,nav");
    if (!landmark) return "";
    var h = landmark.querySelector("h1,h2,h3,h4,h5,h6");
    if (h && h.textContent) {
      var words = h.textContent.trim().toLowerCase().split(/\s+/).slice(0, 3);
      return words.join(" ");
    }
    return landmark.tagName.toLowerCase();
  }

  function buildPayload(el) {
    var srcEl = el.closest("[data-ai-src]");
    var src = srcEl ? srcEl.getAttribute("data-ai-src") : "unknown";
    var head = src + (sectionLabel(el) ? " › " + sectionLabel(el) : "");
    var tag = el.tagName.toLowerCase();
    var line;
    if (tag === "img") {
      line =
        'img: src="' +
        el.getAttribute("src") +
        '" alt="' +
        (el.getAttribute("alt") || "") +
        '"';
    } else if (tag === "input" || tag === "textarea") {
      line =
        tag + ': placeholder="' + (el.getAttribute("placeholder") || "") + '"';
    } else {
      var text = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (text.length > 120) text = text.slice(0, 117) + "...";
      line = tag + ': "' + text + '"';
    }
    return head + "\n" + line + "\npush to main branch directly\nchange: ";
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback for non-secure contexts (http-only VPS before TLS).
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy")
          ? resolve()
          : reject(new Error("copy failed"));
      } catch (e) {
        reject(e);
      } finally {
        ta.remove();
      }
    });
  }

  // ---------- overlay DOM (recreated each page load — ClientRouter swaps <body>) ----------

  var dot, trail1, trail2, chip, bar;
  var chipTimer;

  function showChip(ok) {
    chip.innerHTML = ok
      ? chip.dataset.tick + "<span>Copied</span>"
      : "<span>Copy failed</span>";
    // Position via left/top — never transform: the animated `scale` property
    // composes before `transform`, which would scale the offset itself and
    // make the chip slide in from the top-left.
    chip.style.left = mouse.x + 14 + "px";
    chip.style.top = mouse.y + 14 + "px";
    chip.classList.remove("in", "out");
    void chip.offsetWidth; // restart animation
    chip.classList.add("in");
    clearTimeout(chipTimer);
    chipTimer = setTimeout(
      function () {
        chip.classList.remove("in");
        chip.classList.add("out");
      },
      ok ? 900 : 1300
    );
  }

  function makeOverlay() {
    if (document.getElementById("ai-inspect-dot")) return;

    var base =
      "position:fixed;top:0;left:0;pointer-events:none;z-index:2147483646;" +
      "will-change:transform,width,height;";

    dot = document.createElement("div");
    dot.id = "ai-inspect-dot";
    dot.style.cssText =
      base +
      "width:10px;height:10px;border-radius:50%;background:" +
      ACCENT +
      ";border:2px solid " +
      ACCENT +
      ";box-sizing:border-box;transition:background .18s ease;";

    trail1 = document.createElement("div");
    trail2 = document.createElement("div");
    [trail1, trail2].forEach(function (t, i) {
      t.style.cssText =
        base +
        "width:" +
        (6 - i * 2) +
        "px;height:" +
        (6 - i * 2) +
        "px;border-radius:50%;background:" +
        ACCENT +
        ";opacity:" +
        (0.4 - i * 0.15) +
        ";z-index:2147483645;";
    });

    // Keyframes for the chip: blur+opacity pop-in with a quick bounce, and
    // an SVG tick stroke-draw.
    var style = document.createElement("style");
    style.id = "ai-inspect-style";
    style.textContent =
      "@keyframes aiChipIn{0%{opacity:0;filter:blur(6px);scale:.6}" +
      "60%{opacity:1;filter:blur(0);scale:1.08}100%{opacity:1;filter:blur(0);scale:1}}" +
      "@keyframes aiChipOut{to{opacity:0;filter:blur(4px);scale:.85}}" +
      "@keyframes aiTick{to{stroke-dashoffset:0}}" +
      "#ai-inspect-chip.in{animation:aiChipIn .28s cubic-bezier(.34,1.56,.64,1) forwards}" +
      "#ai-inspect-chip.in svg path{animation:aiTick .25s ease-out .08s forwards}" +
      "#ai-inspect-chip.out{animation:aiChipOut .18s ease-in forwards}";
    document.head.appendChild(style);

    chip = document.createElement("div");
    chip.id = "ai-inspect-chip";
    chip.style.cssText =
      "position:fixed;top:0;left:0;pointer-events:none;z-index:2147483647;" +
      "background:#111;color:#fff;font:12px/1 system-ui,sans-serif;" +
      "padding:6px 10px;border-radius:999px;opacity:0;transform-origin:top left;" +
      "display:flex;align-items:center;gap:6px;";
    var TICK =
      '<svg width="12" height="12" viewBox="0 0 12 12" fill="none">' +
      '<path d="M2 6.5L4.8 9.3L10 3.5" stroke="#7CFFA0" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" ' +
      'stroke-dasharray="12" stroke-dashoffset="12"/></svg>';
    chip.dataset.tick = TICK;
    chip.innerHTML = TICK + "<span>Copied</span>";

    bar = document.createElement("div");
    bar.id = "ai-inspect-bar";
    bar.style.cssText =
      "position:fixed;bottom:16px;left:50%;transform:translateX(-50%);" +
      "z-index:2147483647;background:#111;color:#fff;width:max-content;" +
      "font:13px/1 system-ui,sans-serif;padding:10px 16px;" +
      "border-radius:24px;box-shadow:0 4px 16px rgba(0,0,0,.25);" +
      "transition:border-radius .3s ease;";
    // ?/× toggle: fixed square so the label swap never resizes it.
    var helpBtnStyle =
      'style="background:none;border:1px solid rgba(255,255,255,.4);' +
      "color:#fff;border-radius:999px;width:26px;height:26px;padding:0;" +
      "display:inline-flex;align-items:center;justify-content:center;" +
      'font:12px/1 system-ui,sans-serif;cursor:pointer"';
    // Panel starts EMPTY — the how-to markup only enters the DOM when "?"
    // is clicked, so its intrinsic width can never stretch the bar.
    bar.innerHTML =
      '<div style="display:flex;gap:12px;align-items:center">' +
      "<span>AI edit mode — click to copy · ⌘-click to follow links</span>" +
      '<div style="display:flex;gap:6px;align-items:center">' +
      '<button id="ai-inspect-help" ' + helpBtnStyle + ">?</button>" +
      '<button id="ai-inspect-exit" style="background:#fff;border:1px solid #fff;' +
      "color:#111;border-radius:999px;padding:4px 12px;" +
      'font:12px/1 system-ui,sans-serif;cursor:pointer">Exit</button>' +
      "</div></div>" +
      '<div id="ai-inspect-panel" style="display:grid;grid-template-rows:0fr;' +
      'transition:grid-template-rows .3s ease,margin-top .3s ease;margin-top:0"></div>';

    document.body.appendChild(trail2);
    document.body.appendChild(trail1);
    document.body.appendChild(dot);
    document.body.appendChild(chip);
    document.body.appendChild(bar);

    var exitBtn = document.getElementById("ai-inspect-exit");
    exitBtn.addEventListener("click", function () {
      localStorage.removeItem(FLAG);
      location.reload();
    });

    // Size the ?/× toggle to exactly match the Exit button's height.
    var helpBtn = document.getElementById("ai-inspect-help");
    var exitH = exitBtn.offsetHeight;
    helpBtn.style.width = exitH + "px";
    helpBtn.style.height = exitH + "px";

    // Help toggle: expands the bar into a short how-to panel. Content is
    // injected on open and removed after the close transition, so it never
    // affects the bar's width while hidden.
    var panel = document.getElementById("ai-inspect-panel");
    var HELP_HTML =
      '<div style="overflow:hidden;width:0;min-width:100%;min-height:0;' +
      "font:13px/1.6 system-ui,sans-serif;color:rgba(255,255,255,.85);" +
      'margin-bottom:6px">' +
      "<b>How to edit this site</b><br>" +
      "1. Click any text or image — its info is copied automatically.<br>" +
      "2. Paste it into your AI chat and write what you want after <b>change:</b><br>" +
      "&nbsp;&nbsp;&nbsp;<i>…change: make this heading shorter</i><br>" +
      "3. The AI edits the site for you — it goes live on the next publish.<br>" +
      "⌘-click follows links · <b>Exit</b> turns edit mode off." +
      "</div>";
    // SVG cross — the "×" text glyph doesn't optically center in the button.
    var CROSS =
      '<svg width="10" height="10" viewBox="0 0 10 10" style="display:block">' +
      '<path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="#fff" ' +
      'stroke-width="1.5" stroke-linecap="round"/></svg>';
    var closeTimer;
    document
      .getElementById("ai-inspect-help")
      .addEventListener("click", function () {
        var open = panel.style.gridTemplateRows === "1fr";
        clearTimeout(closeTimer);
        if (open) {
          panel.style.gridTemplateRows = "0fr";
          panel.style.marginTop = "0";
          bar.style.borderRadius = "24px";
          this.textContent = "?";
          closeTimer = setTimeout(function () {
            panel.innerHTML = "";
          }, 320);
        } else {
          panel.innerHTML = HELP_HTML;
          void panel.offsetHeight; // commit 0fr with content before animating
          panel.style.gridTemplateRows = "1fr";
          panel.style.marginTop = "10px";
          bar.style.borderRadius = "16px";
          this.innerHTML = CROSS;
        }
      });
  }

  // ---------- animation state ----------

  var mouse = { x: -100, y: -100 };
  var cur = { x: -100, y: -100, w: 10, h: 10, r: 5 }; // rendered state
  var t1 = { x: -100, y: -100 };
  var t2 = { x: -100, y: -100 };
  var target = null; // hovered editable element, or null = follow cursor

  function lerp(a, b, f) {
    return a + (b - a) * f;
  }

  function frame() {
    var goal;
    if (target && document.body.contains(target)) {
      var rect = target.getBoundingClientRect();
      goal = { x: rect.left, y: rect.top, w: rect.width, h: rect.height, r: 8 };
    } else {
      target = null;
      goal = { x: mouse.x - 5, y: mouse.y - 5, w: 10, h: 10, r: 5 };
    }
    var f = 0.22;
    cur.x = lerp(cur.x, goal.x, f);
    cur.y = lerp(cur.y, goal.y, f);
    cur.w = lerp(cur.w, goal.w, f);
    cur.h = lerp(cur.h, goal.h, f);
    cur.r = lerp(cur.r, goal.r, f);

    if (dot && document.body.contains(dot)) {
      dot.style.transform = "translate3d(" + cur.x + "px," + cur.y + "px,0)";
      dot.style.width = cur.w + "px";
      dot.style.height = cur.h + "px";
      dot.style.borderRadius = target ? cur.r + "px" : "50%";
      dot.style.background = target ? "transparent" : ACCENT;

      t1.x = lerp(t1.x, mouse.x - 3, 0.12);
      t1.y = lerp(t1.y, mouse.y - 3, 0.12);
      t2.x = lerp(t2.x, mouse.x - 2, 0.07);
      t2.y = lerp(t2.y, mouse.y - 2, 0.07);
      var hide = target ? "0" : "";
      trail1.style.transform = "translate3d(" + t1.x + "px," + t1.y + "px,0)";
      trail2.style.transform = "translate3d(" + t2.x + "px," + t2.y + "px,0)";
      trail1.style.opacity = hide || "0.4";
      trail2.style.opacity = hide || "0.25";
    }
    requestAnimationFrame(frame);
  }

  // ---------- events (document-level, bound once) ----------

  function editableFrom(node) {
    if (!(node instanceof Element)) return null;
    var el = node.closest(EDITABLE);
    if (!el || !el.closest("[data-ai-src]")) return null;
    if (el.closest("#ai-inspect-dot") || (bar && bar.contains(el))) return null;
    return el;
  }

  function bindOnce() {
    if (window.__aiInspectorBound) return;
    window.__aiInspectorBound = true;

    document.addEventListener(
      "mousemove",
      function (e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      },
      { passive: true }
    );

    document.addEventListener(
      "mouseover",
      function (e) {
        var el = editableFrom(e.target);
        if (el) target = el;
      },
      true
    );

    document.addEventListener(
      "mouseout",
      function (e) {
        if (
          target &&
          e.target instanceof Element &&
          e.target.closest(EDITABLE) === target
        ) {
          var to = e.relatedTarget;
          if (!(to instanceof Element) || editableFrom(to) !== target)
            target = null;
        }
      },
      true
    );

    document.addEventListener(
      "click",
      function (e) {
        // Cmd/Ctrl-click passes through untouched — lets the client follow
        // links and use the site normally while edit mode is on.
        if (e.metaKey || e.ctrlKey) return;
        var el = editableFrom(e.target);
        if (!el) return;
        e.preventDefault();
        e.stopPropagation();
        // Press feedback: scale the clicked element itself down briefly,
        // then restore its original inline transform/transition.
        var prevTransform = el.style.transform;
        var prevTransition = el.style.transition;
        el.style.transition = "transform .12s ease";
        el.style.transform = "scale(.96)";
        setTimeout(function () {
          el.style.transform = prevTransform;
          setTimeout(function () {
            el.style.transition = prevTransition;
          }, 140);
        }, 120);
        copyText(buildPayload(el)).then(
          function () {
            showChip(true);
          },
          function () {
            showChip(false);
          }
        );
      },
      true
    );

    requestAnimationFrame(frame);
  }

  function init() {
    if (!localStorage.getItem(FLAG)) return;
    makeOverlay();
    bindOnce();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  // ClientRouter swaps <body> on view transitions — recreate overlay DOM.
  document.addEventListener("astro:page-load", init);
})();
