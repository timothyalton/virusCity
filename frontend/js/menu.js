const form = document.querySelector("form#sim-var")



function openNav() {
    let sideNav = document.getElementById("mySideNav")
    sideNav.style.width = "250px";
    // console.log("clicked")
}

function closeNav() {
    let sideNav = document.getElementById("mySideNav")
    sideNav.style.width = "0";
    // console.log("clicked")Mar
}


form.addEventListener("submit", () => {
    prohibitedActions = []
    event.preventDefault()
    let school = event.target[0].checked
    let work = event.target[1].checked
    let shopping = event.target[2].checked
    let gym = event.target[3].checked

    if (school) {
        prohibitedActions.push("go to school")
    }
    if (work) {
        prohibitedActions.push("go to work")
    }
    if (shopping) {
        prohibitedActions.push("go shopping")
    }

    if (gym) {
        prohibitedActions.push("go to gym")
    }
})
