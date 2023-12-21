console.log("i am in index.js")


const canvas =new fabric.Canvas("canvas",{
    width:500,
    height:500,
    
});
 

canvas.renderAll();

fabric.Image.fromURL("1.png",(img)=>{
    canvas.backgroundImage= img
    canvas.renderAll()
});