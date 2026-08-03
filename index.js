let wt_lvl;
let ti;
let smt;
let wa;
let mw;
let sm;
let type_active;

wt_lvl = 25.3
ti = 24
smt = 25
wa = 500
mw = 0
sm = 41
type_active = 0

document.getElementById("wt_lvl").textContent = wt_lvl;
document.getElementById("ti").textContent = ti;
document.getElementById("smt").textContent = smt;
document.getElementById("wa").textContent = wa;
document.getElementById("sm").textContent = sm;



const wt_info = document.getElementById("wt_info")
const ti_info = document.getElementById("ti_info")
const smt_info = document.getElementById("smt_info")
const wa_info = document.getElementById("wa_info")
const mw_info = document.getElementById("mw_info")
const sm_info = document.getElementById("sm_info")
const sm_plot_info = document.getElementById("sm_plot_info")

const ti_btn = document.getElementById("ti_btn")
const ti_input = document.getElementById("ti_input")
const ti_save = document.getElementById("ti_save")
const ti_cancel = document.getElementById("ti_cancel")
const changeto_smt = document.getElementById("changeto_smt")
const type_ti = document.getElementById("type_ti")

const smt_btn = document.getElementById("smt_btn")
const smt_input = document.getElementById("smt_input")
const smt_save = document.getElementById("smt_save")
const smt_cancel = document.getElementById("smt_cancel")
const changeto_ti = document.getElementById("changeto_ti")
const type_smt = document.getElementById("type_smt")

const wa_btn = document.getElementById("wa_btn")
const wa_input = document.getElementById("wa_input")
const wa_save = document.getElementById("wa_save")
const wa_cancel = document.getElementById("wa_cancel")

const mw_btn = document.getElementById("mw_btn")
const mw_input = document.getElementById("mw_input")
const mw_conf = document.getElementById("mw_conf")
const mw_canc = document.getElementById("mw_canc")
const mw_yes = document.getElementById("mw_yes")
const mw_no = document.getElementById("mw_no")

const wt_info_popup = document.getElementById("wt_info_popup");
const ti_info_popup = document.getElementById("ti_info_popup");
const ti_btn_popup = document.getElementById("ti_btn_popup");
const smt_info_popup = document.getElementById("smt_info_popup");
const smt_btn_popup = document.getElementById("smt_btn_popup");
const wa_info_popup = document.getElementById("wa_info_popup");
const wa_btn_popup = document.getElementById("wa_btn_popup");
const mw_info_popup = document.getElementById("mw_info_popup");
const mw_btn_popup = document.getElementById("mw_btn_popup");
const mw_verify_popup = document.getElementById("mw_verify_popup")
const sm_info_popup = document.getElementById("sm_info_popup");
const sm_plot_info_popup = document.getElementById("sm_plot_info_popup");


wt_info.addEventListener("click", () => {
    wt_info_popup.showModal()
})
ti_info.addEventListener("click", () => {
    ti_info_popup.showModal()
})
smt_info.addEventListener("click", () => {
    smt_info_popup.showModal()
})
wa_info.addEventListener("click", () => {
    wa_info_popup.showModal()
})
mw_info.addEventListener("click", () => {
    mw_info_popup.showModal()
})
sm_info.addEventListener("click", () => {
    sm_info_popup.showModal()
})
sm_plot_info.addEventListener("click", () => {
    sm_plot_info_popup.showModal()
})


ti_btn.addEventListener("click", () => {
    ti_input.value = ti;
    ti_btn_popup.showModal();
})
ti_save.addEventListener("click", () => {
    const tiNew = parseInt(ti_input.value, 10);

    if (!isNaN(tiNew) && tiNew > 0) {
        ti = tiNew;
        document.getElementById("ti").textContent = ti;
        ti_btn_popup.close();
    } else {
        alert("Please enter a valid whole number above 0.");
    }
})
ti_cancel.addEventListener("click", () => {
    ti_btn_popup.close();
})
changeto_smt.addEventListener("click", () => {
    type_ti.style.display = "none"
    type_smt.style.display = "block"
    type_active = 1
})

smt_btn.addEventListener("click", () => {
    smt_input.value = smt;
    smt_btn_popup.showModal();
})
smt_save.addEventListener("click", () => {
    const smtNew = parseInt(smt_input.value, 10);

    if (!isNaN(smtNew) && smtNew >= 5 && smtNew <= 100) {
        smt = smtNew;
        document.getElementById("smt").textContent = smt;
        smt_btn_popup.close();
    } else {
        alert("Please enter a valid whole number between 5 and 100.");
    }
})
smt_cancel.addEventListener("click", () => {
    smt_btn_popup.close();
})
changeto_ti.addEventListener("click", () => {
    type_smt.style.display = "none"
    type_ti.style.display = "block"
    type_active = 0
})



wa_btn.addEventListener("click", () => {
    wa_input.value = wa;
    wa_btn_popup.showModal();
})
wa_save.addEventListener("click", () => {
    const waNew = parseInt(wa_input.value, 10);

    if (!isNaN(waNew) && waNew >= 100 && waNew <= 2000) {    
        wa = waNew;
        document.getElementById("wa").textContent = wa;
        wa_btn_popup.close();
    } else {
        alert("Please enter a valid whole number between 100 and 2000.");
    }
})
wa_cancel.addEventListener("click", () => {
    wa_btn_popup.close();
})


mw_btn.addEventListener("click", () => {
    mw_input.value = 0;
    mw_btn_popup.showModal();
})
mw_conf.addEventListener("click", () => {
    const mwNew = parseInt(mw_input.value, 10);

    if (!isNaN(mwNew) && mwNew >= 100 && mwNew <= 2000) {
        mw_btn_popup.close();
        mw_verify_popup.showModal();
        mw_yes.addEventListener("click", () => {
            mw = mwNew;
            mw_verify_popup.close();
        })
        mw_no.addEventListener("click", () => {
            mw_verify_popup.close();
        })
    } else {
        alert("Please enter a valid whole number between 100 and 2000.");
    }
})
mw_canc.addEventListener("click", () => {
    mw_btn_popup.close();
})