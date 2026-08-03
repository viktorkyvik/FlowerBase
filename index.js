//define all variables and constants
let water_tank;
let adj_water;
let adj_water_disp;
let man_water;
let man_water_disp;
let man_water_avaliable;
let sm_percent;
water_tank = 0
adj_water = 5
adj_water_disp = 5
man_water = 0
man_water_disp = 0
man_water_avaliable = true
sm_percent = 0

//plus and minus buttons
const neg_adj = document.getElementById("neg_adj")
const pos_adj = document.getElementById("pos_adj")
const neg_man = document.getElementById("neg_man")
const pos_man = document.getElementById("pos_man")

//confirm and cancel buttons
const con_adj = document.getElementById("con_adj")
const can_adj = document.getElementById("can_adj")
const con_man = document.getElementById("con_man")
const can_man = document.getElementById("can_man")

//info buttons
const info_adj = document.getElementById("info_adj")
const info_water_tank = document.getElementById("info_water_tank")
const info_man_water = document.getElementById("info_man_water")
const info_sm = document.getElementById("info_sm")
const info_sm_graph = document.getElementById("info_sm_graph")

//popup buttons
const popup_yes = document.getElementById("popup_yes")
const reset_man_water = document.getElementById("reset_man_water")

//popup dialogs
const info_adj_popup = document.getElementById("info_adj_popup")
const con_man_popup = document.getElementById("con_man_popup")
const cooldown_man_popup = document.getElementById("cooldown_man_popup")
const info_wt_popup = document.getElementById("info_wt_popup")
const info_man_water_popup = document.getElementById("info_man_water_popup")
const info_sm_popup = document.getElementById("info_sm_popup")
const info_sm_graph_popup = document.getElementById("info_sm_graph_popup")

//writes empty variables so that is says 0 instead of nothing
document.getElementById("adj_water").textContent=adj_water
document.getElementById("man_water").textContent=man_water
document.getElementById("water_tank").textContent=water_tank //todo read water tank's weight and dynamically update variable
document.getElementById("sm_percent").textContent=sm_percent //todo read soil moisure sensor's data and dynamically update senors

//what to check for if any clicks in the document
document.addEventListener("click", () => {
    //keeps counter updated every click
    document.getElementById("adj_water").textContent=adj_water_disp
    document.getElementById("man_water").textContent=man_water_disp
    if (adj_water !== adj_water_disp){
        con_adj.style.visibility = "visible"
        can_adj.style.visibility = "visible"
    } else{
        con_adj.style.visibility = "hidden"
        can_adj.style.visibility = "hidden"
    }
    if (man_water !== man_water_disp){
        con_man.style.visibility = "visible"
        can_man.style.visibility = "visible"
    } else{
        con_man.style.visibility = "hidden"
        can_man.style.visibility = "hidden"
    }
})

//functionality for popup close buttons
document.querySelectorAll(".popup_close").forEach(btn => {
    btn.addEventListener("click", () => {
        btn.closest("dialog").close();
    })
})

//functionality for water tank buttons
info_water_tank.addEventListener("click", () => {
    info_wt_popup.showModal();
})

//functionality for all adjustment buttons
neg_adj.addEventListener("click", () => {
    if (adj_water_disp > 0){
        neg_adj.disabled = true;

        adj_water_disp = adj_water_disp - 0.5

        setTimeout(() => {
            neg_adj.disabled = false
        }, 100);
    }
})
pos_adj.addEventListener("click", () => {
        pos_adj.disabled = true;

        adj_water_disp = adj_water_disp + 0.5

        setTimeout(() => {
            pos_adj.disabled = false
        }, 100);
})
con_adj.addEventListener("click", () => {
    adj_water = adj_water_disp
    //todo send signal to esp32 for update
})
can_adj.addEventListener("click", () => {
    adj_water_disp = adj_water
})
info_adj.addEventListener("click", () => {
    info_adj_popup.showModal();
})

//functionality for all manual watering buttons
info_man_water.addEventListener("click", () => {
    info_man_water_popup.showModal();    
})
neg_man.addEventListener("click", () => {
    if (man_water_disp > 0){
        neg_man.disabled = true;

        man_water_disp = man_water_disp - 0.5

        setTimeout(() => {
            neg_man.disabled = false
        }, 100);
    }
})
pos_man.addEventListener("click", () => {
        pos_man.disabled = true;

        man_water_disp = man_water_disp + 0.5

        setTimeout(() => {
            pos_man.disabled = false
        }, 100);
})
con_man.addEventListener("click", () => {
    man_water = man_water_disp
    con_man_popup.showModal();
})
reset_man_water.addEventListener("click", () => {
    man_water = 0
    man_water_disp = 0
})
popup_yes.addEventListener("click", () => {
    if (man_water_avaliable == true) {
        //todo send signal to esp32 to start watering
        con_man_popup.close()
        man_water_avaliable = false
        setTimeout(() => {
            man_water_avaliable = true
        }, 10000); //todo change the manual water cooldown to be accurate
    } else {
        con_man_popup.close()
        cooldown_man_popup.showModal()
    }
    man_water = 0
    man_water_disp = 0
})
can_man.addEventListener("click", () => {
    man_water_disp = 0
})

//soil moisture and soil moisture graph info
info_sm.addEventListener("click", () => {
    info_sm_popup.showModal();
})
info_sm_graph.addEventListener("click", () => {
    info_sm_graph_popup.showModal();
})