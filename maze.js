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
    async function draw(video,context, width, height)
    {
        //context.drawImage(video,0,0,width,height);
        context.drawImage(maze,0,0,width,height);
        if(!model) model = await blazeface.load();
        const returnTensors = false;
        const predictions = await model.estimateFaces(video, returnTensors);
          if (predictions.length > 0)
          {
           console.log(predictions);
           for (let i = 0; i < predictions.length; i++) {
             const start = predictions[i].topLeft;
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
            try {
              context.drawImage(face, start[0], start[1]-70, 50, 50)
            } catch(e) {
              console.log("Error downloading face", face.src)
            }
          }
         }
        setTimeout(draw,250,video,context,width,height);
    }
})();

