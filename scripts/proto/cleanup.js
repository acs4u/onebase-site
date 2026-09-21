/* ===== No planner or fit-check section: the homepage goes straight from the ranges to software, and "not sure" CTAs book a call ===== */
teaserHTML = function(){ return ''; };
(() => { const i = NAV.findIndex(x => x[1] === '#/planner'); if (i > -1) NAV.splice(i, 1); })();
pages.planner = () => pages.contact();
pages.check = () => pages.contact();
