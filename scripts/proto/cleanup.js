/* ===== Old planner and fit-check links go to contact ===== */
pages.planner = () => pages.contact();
pages.check = () => pages.contact();
// No About page: send old links home
pages.about = () => { location.replace('#/'); return pages.home(); };
