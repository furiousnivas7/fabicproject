
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
    saveCanvasState()
}


const setBackground = (url,canvas)=> {
    fabric.Image.fromURL(url,(img)=> {
        canvas.backgroundImage = img
        canvas.renderAll()
    })
    saveCanvasState()
    
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
        saveCanvasState()
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
        
        saveCanvasState()
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
    saveCanvasState()
    
    canvas.on("mouse:down",(event)=>{
        mousePressed = true;
        if (currentMode === modes.pan){
            canvas.setCursor("grab")
            canvas.renderAll()
        }
    })
    saveCanvasState()
    
    canvas.on("mouse:up",(event)=>{
        mousePressed = false
        canvas.setCursor("default")
        canvas.renderAll()
    })
    saveCanvasState()
}
 
const setColorListener = ()=> {
    const picker =document.getElementById("colorPicker" )
    picker.addEventListener("change",(event) =>{
        // console.log(event.target.value)
        color =  event.target.value
        canvas.freeDrawingBrush.color = color
        canvas.renderAll()
    } )
    saveCanvasState()
}

const clearCanvas = (canvas,state) => {
    state.val = canvas.toJSON()
    canvas.getObjects().forEach((o)=> {
        if(o !== canvas.backgroundImage){
            canvas.remove(o)
        }
    })
    saveCanvasState()
}

const restoreCanvas=(canvas,state,bgurl) =>{
    if(state.val){
        canvas.loadFromJSON(state.val,objects =>{
            console.log("restore")
            // objects = objects.filter(o=>o['xlink:href'] !== bgurl)
            console.log(objects)
            console.log(state)
            // canvas.clear()
            // canvas.add(...objects)
            canvas.renderAll()
            console.log(JSON.stringify(canvas))
        })
    }
    saveCanvasState()

}

const createRect = (canvas)=>{
    console.log("Rect")
    const canvaCenter = canvas.getCenter()
    const rect = new fabric.Rect({
        width: 100,
        height:100,
        fill:color,
        left:canvaCenter.left,
        top:-50,
        OriginX:"center",
        OriginY:"center",
        conerColor:color,
        objectCaching:false
    })

    canvas.add(rect)
    canvas.renderAll()
    rect.animate("top",canvaCenter.top,{
        onChange:canvas.renderAll.bind(canvas)
    })
    saveCanvasState()
    rect.on("selected",()=>{
        rect.set("fill","white")
        canvas.renderAll()
    })
    rect.on("deselected",()=>{
        rect.set("fill","green")
        canvas.renderAll()
    })
    saveCanvasState()
}

const createCirc = (canvas)=>{
    console.log("Circ")
    const canvaCenter = canvas.getCenter()
    const circle = new fabric.Circle({
        radius:50,
        fill:color,
        left:canvaCenter.left,
        top:-50,
        OriginX:"center",
        OriginY:"center",
        conerColor:color,
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
    saveCanvasState()
    circle.on("selected",()=>{
        circle.set("fill","white")
        canvas.requestRenderAll()
    })
    circle.on("deselected",()=>{
        circle.set("fill","red")
        canvas.requestRenderAll()
    })
    saveCanvasState()
}

const groupObjects = (canvas,group,shouldGroup) => {
    if(shouldGroup){
        const objects = canvas.getObjects();
        if (objects.length > 0) {
            group.val = new fabric.Group(objects,{conerColor:"white"});
            // canvas.clear(canvas);
            canvas.add(group.val);
            canvas.requestRenderAll();
        }saveCanvasState()
    }else{
        if (group.val) {
            const oldGroup = group.val.getObjects();
            canvas.remove(group.val);
            group.val=null;
            canvas.add(...oldGroup);
            canvas.requestRenderAll();
        }
    }
    saveCanvasState()

}
function saveCanvasState() {
    // Remove future states if any
    if (currentHistoryIndex < canvasHistory.length - 1) {
        canvasHistory = canvasHistory.slice(0, currentHistoryIndex + 1);
    }
    // Save the current state
    canvasHistory.push(JSON.stringify(canvas));
    console.log(JSON.stringify(canvas))
    currentHistoryIndex++;
}
function undoCanvasAction() {
    if (currentHistoryIndex === 0 || canvasHistory[currentHistoryIndex-1] === bgurl) return;
    console.log("undo")
    currentHistoryIndex--;
    canvas.loadFromJSON(canvasHistory[currentHistoryIndex], () => {
        canvas.renderAll();
        // Handle any necessary callbacks after undo

    });
    // saveCanvasState()
}

function redoCanvasAction() {
    if (currentHistoryIndex >= canvasHistory.length - 1) return;
    console.log("redo")
    currentHistoryIndex++;
    canvas.loadFromJSON(canvasHistory[currentHistoryIndex], () => {
        canvas.renderAll();
        // Handle any necessary callbacks after redo
    });
    // saveCanvasState()
}




const imgAdded = (e)=>{
    console.log(e)
    const inputElem = document.getElementById("myImg")
    const file = inputElem.files[0];
    reader.readAsDataURL(file)
    saveCanvasState()
}

const canvas = initiCanvas("canvas");
const svgState={}
let mousePressed = false
let color = "#000000"
const group = {}
const bgurl="https://th.bing.com/th/id/OIP.rfbVhRZn0nAG4BnfDGastAHaFj?w=720&h=540&rs=1&pid=ImgDetMain"
let canvasHistory = [];
let currentHistoryIndex = -1;

let currentMode;
const modes={
    pan:"pan",
    drawing:"drawing"
}
const reader = new FileReader()
setBackground(bgurl,canvas);

setPanEvents(canvas);

setColorListener(canvas)
const inputfile = document.getElementById("myImg");
inputfile.addEventListener ("change",imgAdded)
 

reader.addEventListener("load",() =>{
    fabric.Image.fromURL(reader.result,img=>{
        canvas.add(img)
        canvas.requestRenderAll()
    })
})
canvas.on('object:modified', function() {
    saveCanvasState();
});