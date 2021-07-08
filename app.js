//canvas setup
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

var score = 0;
var gameFrame = 0;
ctx.font = "30px Georgia";

//mouse interactivity
const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false,
}

const canvasPosition = canvas.getBoundingClientRect();      //canvas does not start at pt(0, 0)
canvas.addEventListener("mousedown", function(event){
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
    // console.log(mouse.x, mouse.y);
})

canvas.addEventListener("mouseup", function(event){
    mouse.click = false;
})

//players
class Player{
    constructor(){
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 498;
        this.spriteHeight = 327;
    }

    update(){
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        if(mouse.x != this.x){
            this.x -=dx/20;
        }
        if(mouse.y != this.y){
            this.y -= dy/20;
        }
    }

    draw(){
        if (mouse.click){
            ctx.strokeStyle = "white"
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            ctx.closePath()
        }

        ctx.fillStyle = "pink";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2)
        ctx.fill();
        ctx.closePath();
    }

}

const player = new Player();

//bubbles
const bubblesArray = [];

class Bubble {
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 50;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
    }

    update(){
        this.y -= this.speed;

        var dx = this.x - player.x;
        var dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }

    draw(){
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill();
        ctx.closePath();
    }
}

//sound
const bubblePop1 = document.createElement("audio");
bubblePop1.src = "resources/bubbles-single2.wav";
bubblePop1.setAttribute("crossOrigin", "anonymous");

const bubblePop2 = document.createElement("audio");
bubblePop2.src = "resources/pop.ogg";
bubblePop2.setAttribute("crossOrigin", "anonymous");


function handleBubbles(){
    if(gameFrame % 50 === 0){
        bubblesArray.push(new Bubble());
    }

    bubblesArray.forEach(function(bubble, i){
        bubble.update();
        bubble.draw();
    })

    bubblesArray.forEach(function(bubble, i){
        if(bubble.y < 0 - bubble.radius){
            bubblesArray.splice(i, 1);
            i--;
        }

        //collision
        if(bubble.distance < bubble.radius + player.radius){
            if(!bubble.counted){
                score += 1;
                if(bubble.sound == "sound1"){
                    bubblePop1.play();
                } 
                if(bubble.sound == "sound2"){
                    bubblePop2.play();
                }
                bubblesArray.splice(i, 1);
                i--;
                bubble.counted = true;
            }
     
        }
    })
}


//animation loop
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update()
    player.draw();
    handleBubbles()

    ctx.fillStyle = "grey";
    ctx.fillText("Score: " + score, 10, 30)

    gameFrame++;
    requestAnimationFrame(animate)
}

animate();