
const initiCanvas = (id)=>{
    return new fabric.Canvas(id,{
        width:720,
        height:540,
        Selection: false,
    });
}

const loadImage = () => {
    const url = document.getElementById('imageUrl').value;
    fabric.Image.fromURL(url, (img) => {
        // Calculate the scale to fit the image to the canvas size
        let scale = Math.min(
            canvas.width / img.width, 
            canvas.height / img.height
        );

        img.set({
            scaleX: scale,
            scaleY: scale,
            top: 0,
            left: 0
        });

        canvas.centerObject(img);
        canvas.add(img);
        canvas.renderAll();
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
            canvas.isDrawingMode = false
            canvas.renderAll()
        }
    } else if(mode === modes.drawing){
        if (currentMode === modes.drawing){
            currentMode = ""
            canvas.isDrawingMode = true
            canvas.renderAll()
        } else{
            currentMode = modes.drawing
            canvas.isDrawingMode = true
            canvas.freeDrawingBrush.color = color
            canvas.renderAll()
        }
        

    }

}
   

 
const setPanEvents = (canvas) =>{
    canvas.on("mouse:move",(event) => {
        if (mousePressed && currentMode === modes.pan){
            canvas.setCursor("grab")
            canvas.renderAll()
            const mEvent = event.e;
            const delta = new fabric.Point(mEvent.movementX,mEvent.movementY)
            canvas.relativePan(delta)
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
 
const setColorListener = ()=> {
    const picker =document.getElementById("colorPicker" )
    picker.addEventListener("change",(event) =>{
        // console.log(event.target.value)
        color =  event.target.value
        canvas.freeDrawingBrush.color = color
        canvas.renderAll()
    } )
}

const clearCanvas = (canvas,state) => {
    state.val = canvas.toSVG()
    canvas.getObjects().forEach((o)=> {
        if(o !== canvas.backgroundImage){
            canvas.remove(o)
        }
    })
}

const restoreCanvas = (canvas,state,bgurl) =>{
    if(state.val){
        fabric.loadSVGFromString(state.val,objects =>{
            console.log(objects)
            objects=objects.filter(o=>o['xlink:href'] !== bgurl)
            canvas.add(...objects)
            canvas.renderAll()
        })
    }

}

const createRect = (canvas)=>{
    console.log("Rect")
    const canvaCenter = canvas.getCenter()
    const rect = new fabric.Rect({
        width: 100,
        height:100,
        fill:"green",
        left:canvaCenter.left,
        top:-50,
        OriginX:"center",
        OriginY:"center",
        conerColor:"black",
        objectCaching:false
    })
    canvas.add(rect)
    canvas.renderAll()
    rect.animate("top",canvaCenter.top,{
        onChange:canvas.renderAll.bind(canvas)
    })
    rect.on("selected",()=>{
        rect.set("fill","white")
        canvas.renderAll()
    })
    rect.on("deselected",()=>{
        rect.set("fill","green")
        canvas.renderAll()
    })
}

const createCirc = (canvas)=>{
    console.log("Circ")
    const canvaCenter = canvas.getCenter()
    const circle = new fabric.Circle({
        radius:50,
        fill:"red",
        left:canvaCenter.left,
        top:-50,
        OriginX:"center",
        OriginY:"center",
        conerColor:"black",
        objectCaching:false
    })
    canvas.add(circle)
    canvas.renderAll()
    circle.animate("top",canvas.height-50,{
        onChange:canvas.renderAll.bind(canvas),
        onComplete:() =>{
            circle.animate("top",canvaCenter.top,{
                onChange:canvas.renderAll.bind(canvas),
                easing:fabric.util.ease.easeOutBounce,
                    duration:250
            })
        }
    })
    circle.on("selected",()=>{
        circle.set("fill","white")
        canvas.requestRenderAll()
    })
    circle.on("deselected",()=>{
        circle.set("fill","red")
        canvas.requestRenderAll()
    })
}

const groupObjects = (canvas,group,shouldGroup) => {
    if(shouldGroup){
        const objects = canvas.getObjects()
        group.val = new fabric.Group(objects,{conerColor:"white"})
        clearCanvas(canvas)
        canvas.add(group.val)
        canvas.requestRenderAll()
    }else{
        group.val.destroy()
        const oldGroup = group.val.getObjects()
        canvas.remove(group.val)
        canvas.add(...oldGroup)
        group.val=null
        canvas.requestRenderAll()
    }

}


const canvas = initiCanvas("canvas");
const svgState={}
let mousePressed = false
let color = "#000000"
const group = {}
const bgurl="https://th.bing.com/th/id/OIP.rfbVhRZn0nAG4BnfDGastAHaFj?w=720&h=540&rs=1&pid=ImgDetMain"

let currentMode;
const modes={
    pan:"pan",
    drawing:"drawing"
}

setBackground(bgurl,canvas);

setPanEvents(canvas);

setColorListener(canvas)
