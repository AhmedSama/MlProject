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
    if(x == undefined) return
    let y = findY()
    let width = findW() - findX()
    let height = findH() - findY()

    const canv = document.createElement("canvas")
    const context = canv.getContext("2d")
    canv.width = width
    canv.height = height
    const imgData_ = ctx.getImageData(x,y,width,height)
    context.putImageData(imgData_,0,0)
    document.querySelector(".copy").append(canv)
    
}


document.querySelector("[data-copy]").addEventListener("click",()=>{
    makeCanvas()
})



















