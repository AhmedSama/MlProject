const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const whiteCanvas = canvas.toDataURL("image/png")
const cheack = document.querySelector("[data-cheack]")



// ============= Image Proccessing ==============


class Color{
    constructor(r,g,b,a,x,y){
        this.r = r
        this.g = g
        this.b = b
        this.a = a
        this.x = x
        this.y = y
    }
    isEqual(color){
        return this.r === color.r && this.g === color.g && this.b === color.b  && this.a === color.a
    }
    getPos(){
        return [this.x,this.y]
    }
}
const Black = new Color(0,0,0,255)


function getImagePoints(){
    const imgData = ctx.getImageData(0,0,canvas.width,canvas.height)
    const data = imgData.data
    let index = 0
    let width = 0
    let height = 0
    const outerArray = []
    let innterArray = []
    while (index < (data.length )){
        if(width == imgData.width){
            outerArray.push(innterArray)
            innterArray = []
            width = 0
            height++
        }
        const red = data[index]
        const green = data[++index]
        const blue = data[++index]
        const alpha = data[++index]
        innterArray.push(new Color(red,green,blue,alpha,width,height))
        index++
        width++
    }
    return outerArray
}



function findX(){
    const Data = getImagePoints()
    for(let i = 0; i < Data[0].length; i++){
        for(let j = 0; j < Data.length; j++){
            if(Data[j][i].isEqual(Black)){
                return Data[j][i].getPos()[0]
            }
        }
    }
}

function findY(){
    const Data = getImagePoints()
    for(let i = 0; i < Data.length; i++){
        for(let j = 0; j < Data[0].length; j++){
            if(Data[i][j].isEqual(Black)){
                return Data[i][j].getPos()[1]
            }
        }
    }
}

function findW(){
    const Data = getImagePoints()
    for(let i = Data[0].length - 1 ; i >= 0 ; i--){
        for(let j = 0; j < Data.length; j++){
            if(Data[j][i].isEqual(Black)){
                return Data[j][i].getPos()[0]
            }
        }
    }
}


function findH(){
    const Data = getImagePoints()
    for(let i = Data.length - 1 ; i >= 0; i--){
        for(let j = 0; j < Data[0].length; j++){
            if(Data[i][j].isEqual(Black)){
                return Data[i][j].getPos()[1]
            }
        }
    }
}


function DrawRect(x,y,w,h){
    ctx.beginPath()
    ctx.lineWidth = 1
    ctx.strokeRect(x,y,w,h)
    ctx.stroke()
}



function makeCanvas(){
    let x = findX()
    // if x = undefined that means the screen is blank and there is no drawing
    if(x == undefined) return "white"
    let y = findY()
    let width = findW() - findX()
    let height = findH() - findY()

    let max = height > width ? height : width

    const canv = document.createElement("canvas")
    const context = canv.getContext("2d")
    canv.width = max
    canv.height = max
    // make the whole new canvas white 
    DrawRect(context,0,0,canv.width,canv.height)
    const imgData_ = ctx.getImageData(x,y,width,height)
    const X = (max/2) - (width/2)
    const Y = (max/2) - (height/2)
    context.putImageData(imgData_,X,Y)
    let dataURL = canv.toDataURL("image/png");
    return dataURL
}




// ============= END Image Processing ============









const tools = document.querySelectorAll(".tool:not([data-one-click])")

let penColor = "#000"

tools.forEach(tool => {
    tool.addEventListener("click", () => {
        tools.forEach(selectedTool => {
            selectedTool.classList.remove("active")
        })
        tool.classList.add("active")

        // Check the id attribute of the clicked tool
        const toolId = tool.id;
        changeColor(toolId);
    })
})

function changeColor(toolId){
    // Use a conditional statement to change the color based on the tool id
    if (toolId === "pen") {
        penColor = "#000"; // Change color to black
    } else if (toolId === "eraser") {
        penColor = "#fff"; // Change color to white
    }
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
    let img = document.querySelector(".popup-head img")
    img.src = "/static/images/cute.svg"
    document.querySelector(".popup-window").classList.add("active")
    document.querySelector(".popup-body h1").textContent= "Please Draw something :')"
    document.getElementById("result").innerText = "You Have to draw something :')"
}

document.querySelector("#ok-btn").addEventListener("click",()=>{
    document.querySelector(".popup-window").classList.remove("active")
})

function makeImage(){
    // make an image html tag from canvas
    // i dont need to convert the canvas to img tag i just need to use src which is the same as dataURL
    let dataURL = makeCanvas()

    // cheack if it is white image
    if(dataURL == "white"){
        document.getElementById("result").innerText = "Please Draw something :')"
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
    ctx.beginPath()
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
    ctx.beginPath()
}

canvas.addEventListener("touchstart",HandleStart,false)
canvas.addEventListener("touchmove",HandleMove,false)
canvas.addEventListener("touchend",HandleEnd,false)

function DrawBackground() {
    ctx.beginPath()
    ctx.fillStyle = "white"
    ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.fill()
}

DrawBackground()

const Draw = ()=>{
    if(CanDraw){
        ctx.lineWidth = 25
        ctx.lineCap = "round"
        ctx.strokeStyle = penColor
        ctx.lineTo(mousePosition.x,mousePosition.y)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(mousePosition.x,mousePosition.y)
    }
    
}

function Start(){
    document.getElementById("result").innerText = ""
    ctx.clearRect(0,0,canvas.width,canvas.height)
    DrawBackground()
}
 
document.getElementById("start").addEventListener("click",()=>{
    Start()
})


