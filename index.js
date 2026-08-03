let wt_lvl;
let ti;
let wa;
let sm;

wt_lvl = 0
ti = 24
wa = 500
sm = 0

document.getElementById("wt_lvl").textContent = wt_lvl;
document.getElementById("ti").textContent = ti;
document.getElementById("wa").textContent = wa;
document.getElementById("sm").textContent = sm;


const wt_info = document.getElementById("wt_info")
const ti_info = document.getElementById("ti_info")
const wa_info = document.getElementById("wa_info")
const mw_info = document.getElementById("mw_info")
const sm_info = document.getElementById("sm_info")
const sm_plot_info = document.getElementById("sm_plot_info")

const ti_adj = document.getElementById("ti_adj")
const ti_input = document.getElementById("ti_input")
const ti_save = document.getElementById("ti_save")
const ti_cancel = document.getElementById("ti_cancel")

const wa_adj = document.getElementById("wa_adj")
const wa_input = document.getElementById("wa_input")
const wa_save = document.getElementById("wa_save")
const wa_cancel = document.getElementById("wa_cancel")

const mw_amount = document.getElementById("mw_amount")


const wt_info_popup = document.getElementById("wt_info_popup");
const ti_info_popup = document.getElementById("ti_info_popup");
const ti_adj_popup = document.getElementById("ti_adj_popup");
const wa_info_popup = document.getElementById("wa_info_popup");
const wa_adj_popup = document.getElementById("wa_adj_popup");
const sm_info_popup = document.getElementById("sm_info_popup");
const sm_plot_info_popup = document.getElementById("sm_plot_info_popup");


wt_info.addEventListener("click", () => {
    wt_info_popup.showModal()
})
ti_info.addEventListener("click", () => {
    ti_info_popup.showModal()
})
wa_info.addEventListener("click", () => {
    wa_info_popup.showModal()
})
sm_info.addEventListener("click", () => {
    sm_info_popup.showModal()
})
sm_plot_info.addEventListener("click", () => {
    sm_plot_info_popup.showModal()
})


ti_adj.addEventListener("click", () => {
    ti_input.value = ti;
    ti_adj_popup.showModal();
})
ti_save.addEventListener("click", () => {
    const tiNew = parseInt(ti_input.value, 10);

    if (!isNaN(tiNew)) {
        ti = tiNew;
        document.getElementById("ti").textContent = ti;
        ti_adj_popup.close();
    } else {
        alert("Please enter a valid whole number.");
    }
})
ti_cancel.addEventListener("click", () => {
    ti_adj_popup.close();
})

wa_adj.addEventListener("click", () => {
    wa_input.value = wa;
    wa_adj_popup.showModal();
})
wa_save.addEventListener("click", () => {
    const waNew = parseInt(wa_input.value, 10);

    if (!isNaN(waNew)) {
        wa = waNew;
        document.getElementById("wa").textContent = wa;
        wa_adj_popup.close();
    } else {
        alert("Please enter a valid whole number.");
    }
})
wa_cancel.addEventListener("click", () => {
    wa_adj_popup.close();
})