
const initiCanvas = (id)=>{
    return new fabric.Canvas(id,{
        width:500,
        height:500,
        Selection: false,
    });
}

const setBackground = (url,canvas)=> {
    fabric.Image.fromURL(url,(img)=> {
        canvas.backgroundImage = img
        canvas.renderAll()
    })
}

const toggleMode = (mode) =>{
    if (mode === modes.pan){
        if (currentMode === modes.pan){
            currentMode = ""
        } else{
            currentMode = modes.pan
        }
    } else if(mode === modes.drawing){
        if (currentMode === modes.drawing){
            currentMode = ""
        } else{
            currentMode = modes.drawing
        }
        console.log(mode)

    }

    }
   

 
const setPanEvents = (canvas) =>{
    canvas.on("mouse:over",(event)=>{
        if (mousePressed && currentMode === modes.pan){
            canvas.setCursor("grab")
            canvas.renderAll()
            const mEvent = event.e;
            const delta = new fabric.Point(mEvent.movementX,mEvent.movementY)
            canvas.relativePan(delta)
        }else if(mousePressed && currentMode === modes.drawing){
            canvas.isDrawing = true
            canvas.renderAll()
        }
    })
    
    canvas.on("mouse:down",(event)=>{
        mousePressed = true;
        if (currentMode === modes.pan){
            canvas.setCursor("grab")
            canvas.renderAll()
        }
    })
    
    canvas.on("mouse:up",(event)=>{
        mousePressed = false
        canvas.setCursor("default")
        canvas.renderAll()
    })

}

const canvas = initiCanvas("canvas");
let mousePressed = false;

let currentMode;
const modes={
    pan:"pan",
    drawing:"drawing"
}

setBackground("https://th.bing.com/th/id/OIP.Z_PIeIRDajXPmZHROt-T_QHaEK?rs=1&pid=ImgDetMain",canvas);

setPanEvents(canvas);

