var jump = () => {
  document.dispatchEvent(
    new KeyboardEvent("keydown", { keyCode: 38 })
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

//setInterval(jump,1000)
//setInterval(duck,1000)

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

    document.getElementById('canvas').style.display = search.indexOf("showCanvas")+1 ? "block" : "none" 
    console.log("canvas.style.display",canvas.style.display)

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
    let previousY;
    async function draw(video,context, width, height)
    {
        context.clearRect(0, 0, width, height);
        context.drawImage(video,0,0,width,height);        

        if(!model) model = await blazeface.load();
        const returnTensors = false;
        const predictions = await model.estimateFaces(video, returnTensors);
        if (predictions.length > 0) {
           for (let i = 0; i < 1; i++) {
              const start = predictions[i].topLeft;
              const end = predictions[i].bottomRight;
              var probability = predictions[i].probability;
              const size = [end[0] - start[0], end[1] - start[1]];
              const [ x, y ] = start;
              const hasJumped = previousY - y > 10
              //console.log("y",y, "previousY", previousY, hasJumped? "JUMP!!!!!":"");
              if(hasJumped) {
                jump();
                context.font = "100px Arial";
                context.fillText("JUMP!!!", width/4, 200);
              }
              previousY = y
          }
        }
        setTimeout(draw,50,video,context,width,height);
    }
})();

