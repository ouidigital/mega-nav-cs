/**
 * CodeStitch Navigation Controller (mega-menu capable)
 * -----------------------------------------------------
 * Drops into any CodeStitch project that uses #cs-navigation.
 * Adds support for real mega-menu panels (.cs-dropdown / .cs-mega) on top of
 * the stock CS pattern, while preserving CS conventions.
 */
(function () {
    "use strict";

    var BP_MOBILE_MAX = 1023.5;
    var SEL = {
        nav: "#cs-navigation",
        toggle: "#cs-navigation .cs-toggle",
        wrapper: "#cs-ul-wrapper",
        dropdown: ".cs-dropdown",
        dropButton: ".cs-dropdown-button",
        dropPanel: ".cs-drop-panel"
    };
    var CLS = { active: "cs-active", open: "cs-open", scroll: "scroll" };

    var body = document.body;
    var nav = document.querySelector(SEL.nav);
    if (!nav) return;
    var toggleBtn = nav.querySelector(SEL.toggle);
    var wrapper = nav.querySelector(SEL.wrapper) || document.getElementById("cs-ul-wrapper");

    document.documentElement.classList.remove("no-js");
    document.documentElement.classList.add("js-enabled");

    var isMobile = function () {
        return window.matchMedia("(max-width: " + BP_MOBILE_MAX + "px)").matches;
    };

    // -- Drawer (hamburger) -------------------------------------------------
    function setDrawer(open) {
        if (!toggleBtn || !nav) return;
        nav.classList.toggle(CLS.active, open);
        toggleBtn.classList.toggle(CLS.active, open);
        body.classList.toggle(CLS.open, open);
        toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
        if (wrapper && isMobile()) wrapper.inert = !open;
        if (!open) closeAllDropdowns();
    }
    if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
            setDrawer(!nav.classList.contains(CLS.active));
        });
    }

    // -- Dropdown / mega panel disclosure -----------------------------------
    function setDropdown(dropdown, open) {
        if (!dropdown) return;
        dropdown.classList.toggle(CLS.active, open);
        var btn = dropdown.querySelector(SEL.dropButton);
        var panel = dropdown.querySelector(SEL.dropPanel);
        if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
        if (panel) panel.inert = !open;
    }

    function closeAllDropdowns(root) {
        (root || nav).querySelectorAll(SEL.dropdown + "." + CLS.active).forEach(function (d) {
            setDropdown(d, false);
        });
    }

    // Click delegation on the whole document so outside-clicks also route here
    document.addEventListener("click", function (e) {
        var btn = e.target.closest && e.target.closest(SEL.dropButton);
        if (btn && nav.contains(btn)) {
            e.preventDefault();
            var dropdown = btn.closest(SEL.dropdown);
            if (!dropdown) return;
            var willOpen = !dropdown.classList.contains(CLS.active);

            // Desktop accordion: close sibling dropdowns that don't contain this one
            if (!isMobile() && willOpen) {
                nav.querySelectorAll(SEL.dropdown + "." + CLS.active).forEach(function (d) {
                    if (d !== dropdown && !d.contains(dropdown)) setDropdown(d, false);
                });
            }
            setDropdown(dropdown, willOpen);
            return;
        }

        // Click outside the nav (desktop) → close all dropdowns
        if (!isMobile() && !(e.target.closest && e.target.closest(SEL.nav))) {
            closeAllDropdowns();
        }
    });

    // Keyboard — Space / Enter on the chevron is handled by native button click
    // Escape unwinds the stack: deepest open dropdown first, then drawer
    document.addEventListener("keydown", function (e) {
        if (e.key !== "Escape") return;
        var open = Array.from(nav.querySelectorAll(SEL.dropdown + "." + CLS.active));
        if (open.length) {
            var last = open[open.length - 1];
            setDropdown(last, false);
            var lastBtn = last.querySelector(SEL.dropButton);
            if (lastBtn) lastBtn.focus();
            return;
        }
        if (isMobile() && nav.classList.contains(CLS.active)) {
            setDrawer(false);
            if (toggleBtn) toggleBtn.focus();
        }
    });

    // focusout → close a dropdown when focus leaves it entirely
    nav.addEventListener("focusout", function (e) {
        var dropdown = e.target.closest && e.target.closest(SEL.dropdown);
        if (!dropdown || !dropdown.classList.contains(CLS.active)) return;
        setTimeout(function () {
            if (!dropdown.contains(document.activeElement)) setDropdown(dropdown, false);
        }, 0);
    });

    // Scroll — add body.scroll at 100px to translate the top-bar out
    var ticking = false;
    document.addEventListener("scroll", function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
            body.classList.toggle(CLS.scroll, document.documentElement.scrollTop >= 100);
            ticking = false;
        });
    }, { passive: true });

    // Resize — reset inert state when crossing the breakpoint
    var lastMobile = isMobile();
    window.addEventListener("resize", function () {
        var nowMobile = isMobile();
        if (nowMobile === lastMobile) return;
        lastMobile = nowMobile;
        // On desktop the drawer is irrelevant; make sure everything is inert-clean
        if (!nowMobile) {
            if (wrapper) wrapper.inert = false;
            if (nav.classList.contains(CLS.active)) setDrawer(false);
        } else {
            // On mobile, drawer starts closed
            if (wrapper) wrapper.inert = !nav.classList.contains(CLS.active);
        }
        // Closed dropdown panels are inert on both viewports
        nav.querySelectorAll(SEL.dropdown).forEach(function (d) {
            var panel = d.querySelector(SEL.dropPanel);
            if (panel) panel.inert = !d.classList.contains(CLS.active);
        });
    });

    // Initial inert state — hide closed panels / drawer from AT on boot
    if (wrapper && isMobile()) wrapper.inert = true;
    nav.querySelectorAll(SEL.dropPanel).forEach(function (p) {
        p.inert = true;
    });
})();
