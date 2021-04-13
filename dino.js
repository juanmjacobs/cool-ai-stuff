/*var jump = () => {
  document.dispatchEvent(
    new KeyboardEvent("keydown", { keyCode: 32 })
  );
}

var duck = () => {
  document.dispatchEvent(
    new KeyboardEvent("keydown", { key: "ArrowDown", keyCode: 40 })
  );
  setTimeout(() => {
    document.dispatchEvent(
    new KeyboardEvent("keyup", { key: "ArrowDown", keyCode: 40 })
  );}, 500)
  
    
}

setTimeout(jump,1000)
setInterval(duck,1000)
*/
let model;
function refreshface() {
  var face = document.getElementById('face');
  var faceSrc = document.getElementById('faceUrl').value || "https://accesototalnews.files.wordpress.com/2020/06/gardel7.jpg";
  face.src = faceSrc;
}
(function() {
    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        video = document.getElementById('webcam'),
        maze = document.getElementById('maze'),
        face = document.getElementById('face');
    const search = window.location.search;
    if(search.indexOf("?face=")+1) {
      const faceUrl = search.split("=")[1];
      if(faceUrl) face.src = faceUrl;
    }
    navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    
    navigator.getMedia({
        video:true,
        audio:false
    }, function(stream){
        video.srcObject = stream;
        video.play();
    }, function(error){
        //error.code
    }
    );
    video.addEventListener('play',function()
                          {
        draw(this, context,640,480);
    },false);
    let relativeOrigin;
    let firstFace;
    let lastFaceOrigPosition;
    async function draw(video,context, width, height)
    {
        //context.drawImage(video,0,0,width,height);
        context.clearRect(0, 0, width, height);

        context.drawImage(maze,0,0,width,height);
        if(!model) model = await blazeface.load();
        const returnTensors = false;
        const predictions = await model.estimateFaces(video, returnTensors);
          if (predictions.length > 0)
          {
            firstFace = !relativeOrigin;
           //console.log(predictions);
           for (let i = 0; i < 1/*predictions.length*/; i++) {
             const start = predictions[i].topLeft;
             if(firstFace) {
                relativeOrigin = [640-start[0], start[1]];
             }
             const end = predictions[i].bottomRight;
             var probability = predictions[i].probability;
             const size = [end[0] - start[0], end[1] - start[1]];
             // Render a rectangle over each detected face.
             /*context.beginPath();
             context.strokeStyle="green";
             context.lineWidth = "4";
             context.rect(start[0], start[1],size[0], size[1]);
             context.stroke();
             var prob = (probability[0]*100).toPrecision(5).toString();
             var text = prob+"%";
             context.fillStyle = "red";
             context.font = "13pt sans-serif";
             context.fillText(text,start[0]+5,start[1]+20);*/

            //context.drawImage(document.getElementById('gardel'), 33, 71, 104, 124, 21, 20, 87, 104);
            //context.drawImage(document.getElementById('gardel'), start[0], start[1],size[0], size[1], 21, 20, 87, 104);
             context.strokeStyle="green";
             context.lineWidth = "4";
             context.stroke();
            try {
              const [ x, y ] = start;
              const [ xOrig, yOrig ] = relativeOrigin;
              const movingFactor = firstFace ? 1 : 1.5//1.5; //moverse 1.5 veces mas que la cara? offset de cara anterior?
              const faceSize = 50;
              let faceX = movingFactor * (width - x);
              let faceY = movingFactor * y;
              let faceXOrig = faceX - xOrig;
              if(faceXOrig < 0) faceXOrig = 0;
              if(faceXOrig > width - faceSize) faceXOrig = width - faceSize;
              let faceYOrig = faceY - yOrig;
              console.log({faceYOrig, height})
              if(faceYOrig < 0) faceYOrig = 0;
              if(faceYOrig > height - faceSize) faceXOrig = height - faceSize;
              
              context.drawImage(face, faceXOrig , faceYOrig, faceSize, faceSize)
              lastFaceOrigPosition = [ faceXOrig, faceYOrig ];

            } catch(e) {
              console.log("Error downloading face", face.src)
            }
          }
         }
        setTimeout(draw,250,video,context,width,height);
    }
})();

