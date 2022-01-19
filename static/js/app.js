const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")
const whiteCanvas = canvas.toDataURL("image/png")
const cheack = document.querySelector("[data-cheack]")

const tools = document.querySelectorAll(".tool:not([data-one-click])")

let penColor = "#000"

tools.forEach(tool=>{
    tool.addEventListener("click",()=>{
        tools.forEach(selectedTool=>{
            selectedTool.classList.remove("active")
        })
        tool.classList.add("active")
        changeColor()
    })
})

function changeColor(){
    if(penColor === "#000")
        penColor = "#fff"
    else
        penColor = "#000"
}

function cheackScreenWidth(){

    if(window.innerWidth < 450){
        canvas.width = 350
        canvas.height = 350
        Start()
    }
    else if(window.innerWidth > 450){
        canvas.width = 450
        canvas.height = 450
        Start()
    }
}

cheackScreenWidth()
window.addEventListener("resize",()=>{
    cheackScreenWidth()
})

let CanDraw = false


function happyEvent(){
    let confettiSettings = { target: 'my-canvas',clock:150,size:1 };
    let confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
    let img = document.querySelector(".popup-head img")
    img.src = "/static/images/cute.svg"
    document.getElementById("my-canvas").classList.add("active")
    document.querySelector(".popup-window").classList.add("active")
    document.querySelector(".popup-body h1").textContent= "You Draw a HAPPY Face"
    document.getElementById("result").innerText = "You Draw a HAPPY Face :)"
    // removing the confetti from the screen
    setTimeout(()=>{
        document.getElementById("my-canvas").classList.remove("active")
    },3000)
}
function sadEvent(){
    let confettiSettings = { target: 'my-canvas',clock:150,size:1,colors:[[50,50,50], [20,20,20]] };
    let confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
    let img = document.querySelector(".popup-head img")
    img.src = "/static/images/sad.svg"
    document.getElementById("my-canvas").classList.add("active")
    document.querySelector(".popup-window").classList.add("active")
    document.querySelector(".popup-body h1").textContent= "You Draw a SAD Face"
    document.getElementById("result").innerText = "You Draw a SAD Face :("
    // removing the confetti from the screen
    setTimeout(()=>{
        document.getElementById("my-canvas").classList.remove("active")
    },3000)
}

function handleWhite(){
    let confettiSettings = { target: 'my-canvas',clock:150,size:1 };
    let confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
    let img = document.querySelector(".popup-head img")
    img.src = "/static/images/cute.svg"
    document.getElementById("my-canvas").classList.add("active")
    document.querySelector(".popup-window").classList.add("active")
    document.querySelector(".popup-body h1").textContent= "Please Draw something :')"
    document.getElementById("result").innerText = "You Have to draw something :')"
    setTimeout(()=>{
        document.getElementById("my-canvas").classList.remove("active")
    },3000)
}

document.querySelector(".ok-btn").addEventListener("click",()=>{
    document.querySelector(".popup-window").classList.remove("active")
})

function makeImage(){
    // make an image html tag from canvas
    // i dont need to convert the canvas to img tag i just need to use src which is the same as dataURL
    let dataURL = canvas.toDataURL("image/png");

    // cheack if it is white image
    if(dataURL == whiteCanvas){
        document.getElementById("result").innerText = "Please Draw something :')"
        console.log("white")
        return
    }
        
    // console.log(dataURL.split(';'))
    let img = document.createElement("img")
    // let newTab = window.open('about:blank','image from canvas');
    // newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");
    img.src = dataURL
    // document.body.append(img)

    // convert img tag to file tag to send it to a server
    fetch(img.src)
    .then(res => res.blob())
    .then(blob => {
    const photo = new File([blob], 'dot.png', blob)

    // send the file from javascript
    let formData = new FormData();
    formData.append("photo", photo);
    fetch('/api/detect',
            {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "data":dataURL
                }),
            }
        ).then(res => res.json())
        .then(data => {
            if(data["face"] == "happy")
                happyEvent()
            else if(data["face"] == "sad")
                sadEvent()
            else if(data["face"] == "white")
                handleWhite()
        })
})
}

cheack.addEventListener("click",()=>{
    makeImage()
})


class Vector2D{
    constructor(){
        this.x = null;
        this.y = null;
    }
}

const mousePosition = new Vector2D()

const getMousePosition = (evt)=>{

    const rect = canvas.getBoundingClientRect();
    mousePosition.x = evt.clientX - rect.left,
    mousePosition.y = evt.clientY - rect.top
}
const getTouchPosition = (evt)=>{
    const rect = canvas.getBoundingClientRect();
    mousePosition.x = evt.touches[0].clientX - rect.left,
    mousePosition.y = evt.touches[0].clientY - rect.top
}
canvas.addEventListener("mousedown",(event)=>{
    CanDraw = true
    getMousePosition(event)
    Draw()
})
canvas.addEventListener("mousemove",(event)=>{
    getMousePosition(event)
    Draw()
})
canvas.addEventListener("mouseup",()=>{
    CanDraw = false
    context.beginPath()
})

// touch events for phones
function HandleStart(event){
    CanDraw = true
    getTouchPosition(event)
    Draw()
}

function HandleMove(event){
    getTouchPosition(event)
    Draw()
}

function HandleEnd(){
    CanDraw = false
    context.beginPath()
}

canvas.addEventListener("touchstart",HandleStart,false)
canvas.addEventListener("touchmove",HandleMove,false)
canvas.addEventListener("touchend",HandleEnd,false)

function DrawBackground() {
    context.beginPath()
    context.fillStyle = "white"
    context.fillRect(0,0,canvas.width,canvas.height)
    context.fill()
}

DrawBackground()

const Draw = ()=>{
    if(CanDraw){
        context.lineWidth = 20
        context.lineCap = "round"
        context.strokeStyle = penColor
        context.lineTo(mousePosition.x,mousePosition.y)
        context.stroke()
        context.beginPath()
        context.moveTo(mousePosition.x,mousePosition.y)
    }
    
}

function Start(){
    document.getElementById("result").innerText = ""
    context.clearRect(0,0,canvas.width,canvas.height)
    DrawBackground()
}
 
document.getElementById("start").addEventListener("click",()=>{
    Start()
})


