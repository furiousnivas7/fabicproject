
const initiCanvas = (id)=>{
    return new fabric.Canvas(id,{
        width:500,
        height:500,
    });
}

const setBackground = (url,canvas)=> {
    fabric.Image.fromURL(url,(img)=> {
        canvas.backgroundImage = img
        canvas.renderAll()
    })
}

const canvas = initiCanvas("canvas");

setBackground("https://th.bing.com/th/id/OIP.Z_PIeIRDajXPmZHROt-T_QHaEK?rs=1&pid=ImgDetMain",canvas);


canvas.on("mouse:over",(event)=>{
    const mEvent = event.e;
    const delta = new fabric.Point(mEvent.movementX,mEvent.movementY)
    canvas.relativePan(delta)
})