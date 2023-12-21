console.log("i am in index.js")


const canvas =new fabric.Canvas("canvas",{
    width:500,
    height:500,
    
});
 

canvas.renderAll();

fabric.Image.fromURL("https://th.bing.com/th/id/OIP.Z_PIeIRDajXPmZHROt-T_QHaEK?rs=1&pid=ImgDetMain",(img)=>{
    canvas.backgroundImage= img
    canvas.renderAll()
});