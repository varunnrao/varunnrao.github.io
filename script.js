(function () {
    var root = document.documentElement;

    // ----- Email (assembled at runtime to deter scrapers) -----
    document.querySelectorAll(".js-email").forEach(function (el) {
        var addr = el.dataset.user + "@" + el.dataset.domain;
        el.href = "mailto:" + addr;
        el.title = addr;
    });

    // ----- Footer year -----
    document.querySelectorAll(".js-year").forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });

    // ----- Theme toggle -----
    var themeBtn = document.querySelector(".theme-toggle");
    function currentTheme() {
        var set = root.getAttribute("data-theme");
        if (set) return set;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    function labelTheme() {
        var dark = currentTheme() === "dark";
        themeBtn.querySelector("span").textContent = dark ? "Light mode" : "Dark mode";
        themeBtn.querySelector("i").className = dark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }
    if (themeBtn) {
        labelTheme();
        themeBtn.addEventListener("click", function () {
            var next = currentTheme() === "dark" ? "light" : "dark";
            root.setAttribute("data-theme", next);
            try { localStorage.setItem("theme", next); } catch (e) {}
            labelTheme();
        });
    }

    // ----- Mobile menu -----
    var menuBtn = document.querySelector(".menu-toggle");
    var nav = document.getElementById("side-nav");
    if (menuBtn && nav) {
        menuBtn.addEventListener("click", function () {
            var open = nav.classList.toggle("open");
            menuBtn.setAttribute("aria-expanded", open);
        });
        nav.addEventListener("click", function (e) {
            if (e.target.tagName === "A") {
                nav.classList.remove("open");
                menuBtn.setAttribute("aria-expanded", "false");
            }
        });
    }

    // ----- Scrollspy -----
    var links = {};
    document.querySelectorAll(".side-nav a").forEach(function (a) {
        links[a.getAttribute("href").slice(1)] = a;
    });
    var sections = Array.prototype.filter.call(document.querySelectorAll("main section[id]"), function (s) {
        return links[s.id];
    });
    function updateActive() {
        var current = sections[0];
        var threshold = window.innerHeight * 0.4;
        sections.forEach(function (s) {
            if (s.getBoundingClientRect().top <= threshold) current = s;
        });
        // At the very bottom, highlight the last section
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
            current = sections[sections.length - 1];
        }
        Object.keys(links).forEach(function (id) {
            links[id].classList.toggle("active", current && current.id === id);
        });
    }
    window.addEventListener("scroll", updateActive, { passive: true });
    updateActive();

    // ----- News: hide the bottom fade once the list is scrolled to the end -----
    var news = document.querySelector(".news");
    var frame = document.querySelector(".news-frame");
    if (news && frame) {
        var updateFade = function () {
            frame.classList.toggle("at-end", news.scrollTop + news.clientHeight >= news.scrollHeight - 4);
        };
        news.addEventListener("scroll", updateFade, { passive: true });
        updateFade();
    }

    // ----- Publication filters -----
    var filterBtns = document.querySelectorAll(".filters button");
    var groups = document.querySelectorAll(".pub-group");
    filterBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            var f = btn.dataset.filter;
            filterBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
            groups.forEach(function (g) { g.hidden = f !== "all" && g.dataset.group !== f; });
        });
    });
})();
