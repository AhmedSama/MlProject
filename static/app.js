const canvas = document.querySelector("canvas")
const cheack = document.querySelector("[data-cheack]")

// width = 1536
// height = 722

let WIDTH = 400
let HEIGHT = 400 
let CanDraw = false

canvas.width = WIDTH
canvas.height = HEIGHT



function happyEvent(){
    let confettiSettings = { target: 'my-canvas',clock:70,size:1.8 };
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
    },6000)
}
function sadEvent(){
    let confettiSettings = { target: 'my-canvas',clock:50,size:1.8,colors:[[50,50,50], [20,20,20]] };
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
    },6000)
}

function handleWhite(){
    document.getElementById("my-canvas").classList.add("active")
    document.querySelector(".popup-window").classList.add("active")
    document.querySelector(".popup-body h1").textContent= "Please Draw something :')"
    document.getElementById("result").innerText = "You Have to draw something :')"
}

document.querySelector(".ok-btn").addEventListener("click",()=>{
    document.querySelector(".popup-window").classList.remove("active")
})

function makeImage(){
    // make an image html tag from canvas
    // i dont need to convert the canvas to img tag i just need to use src which is the same as dataURL
    let dataURL = canvas.toDataURL("image/png");
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


const context = canvas.getContext("2d")

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

canvas.addEventListener("mousedown",(event)=>{
    CanDraw = true
    getMousePosition(event)
    Draw()
})
canvas.addEventListener("mousemove",(event)=>{
    getMousePosition(event)
    Draw()
})
canvas.addEventListener("mouseup",(event)=>{
    CanDraw = false
    context.beginPath()
})

const DrawBackground = ()=>{
    context.beginPath()
    context.fillStyle = "white"
    context.fillRect(0,0,WIDTH,HEIGHT)
    context.fill()
}
DrawBackground()

const Draw = ()=>{
    if(CanDraw){
        context.lineWidth = 20
        context.lineCap = "round"
        context.strokeStyle = "#000"
        context.lineTo(mousePosition.x,mousePosition.y)
        context.stroke() 
    }
    
}

const Start = ()=>{
    document.getElementById("result").innerText = ""
    context.clearRect(0,0,canvas.width,canvas.height)
    DrawBackground()
}
 
document.getElementById("start").addEventListener("click",()=>{
    Start()
})






