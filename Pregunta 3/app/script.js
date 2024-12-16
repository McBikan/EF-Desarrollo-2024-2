const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const backgroundMusic = document.getElementById("background-music"); //musica

const menu = document.querySelector(".menu");
const score = document.querySelector(".score");
const timeDisplay = document.querySelector(".time");

const canvas2 = document.getElementById("snake-1");
const canvas3 = document.getElementById("snake-2");

const ctx2 = canvas2.getContext("2d");
const ctx3 = canvas3.getContext("2d");

canvas2.width = 190;
canvas2.height = 80;
canvas3.width = 190;
canvas3.height = 80;
canvas.width = 650;
canvas.height = 380;

let play = false;
let scoreP = 0; // Inicializa el puntaje

let startTime; // Variable para almacenar el tiempo de inicio

let scoreSaved = false; // Variable global para guardar el estado del puntaje

function saveScore(username, scoreP, time) {
    const scoreData = {
        username: username,
        score: scoreP, // tu variable de puntaje
        time: time
    };

    fetch('/api/save-score',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(scoreData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message); // Mensaje de éxito
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

class Apple{
    constructor(position,radio,color,context){
        this.position = position;
        this.radio = radio;
        this.color = color;
        this.context = context;
    }
    draw(){
        this.context.save();
        this.context.beginPath();
        this.context.arc(this.position.x,this.position.y,this.radio,0,2*Math.PI);
        this.context.fillStyle = this.color;
        this.context.shadowColor = this.color;
        this.context.shadowBlur = 10;
        this.context.fill();
        this.context.closePath(); 
        this.context.restore();
    }
    collision(snake){
        let v1 = {
            x:this.position.x - snake.position.x,
            y:this.position.y - snake.position.y
        }
        let distance = Math.sqrt(
            (v1.x*v1.x) + (v1.y*v1.y)
        );

        if(distance < snake.radio+this.radio){
            // Cambiar posición de la manzana
           this.position = {
                x: Math.floor(Math.random() *
                     ((canvas.width-this.radio) - this.radio + 1)) + this.radio,
                y: Math.floor(Math.random() *
                     ((canvas.height-this.radio) - this.radio + 1)) + this.radio,
           }
           snake.createBody();
           scoreP++;
           score.textContent = scoreP;
           // Cambiar el color de los pequeños rectángulos
           rectangleColor = getRandomColor(); // Función para obtener un color aleatorio o predefinido
           // Aumentar la velocidad de la serpiente
           snake.velocity += 0.2;  // Incrementa la velocidad un poco cada vez que coma una manzana
           console.log('Nuevo color de fondo:', rectangleColor); // Verificar si cambia el color

           // Mostrar la poción cada vez que se han comido 5 manzanas
           if (scoreP % 5 === 0) {
            potionVisible = true;  // Hacer visible la poción
            }
        }
    }
}
class SnakeBody{
    constructor(radio,color,context,path){
        this.radio = radio;
        this.color = color;
        this.context = context;
        this.path = path;
        this.transparency = 1;
    }
    drawCircle(x,y,radio,color){
        this.context.save();
        this.context.beginPath();
        this.context.arc(x,y,radio,0,2*Math.PI);
        this.context.fillStyle = color;
        this.context.globalAlpha = this.transparency;
        this.context.shadowColor = this.color;
        this.context.shadowBlur = 10;
        this.context.fill();
        this.context.closePath();
        this.context.restore();
    }
    draw(){
        this.drawCircle(this.path.slice(-1)[0].x,this.path.slice(-1)[0].y,
            this.radio,this.color);
    }
}
class Snake {
    constructor(position,radio,color,velocity,length,pathLength,context){
        this.position = position;
        this.radio = radio;
        this.color = color;
        this.velocity = velocity;
        this.context = context;
        this.rotation = 0;
        this.transparency = 1;
        this.body = [];
        this.isDeath = false;
        this.length = length;
        this.pathLength = pathLength;
        this.keys = {
            A:false,
            D:false,
            enable: true
        }
        this.keyboard();
    }
    initBody(){
        for(let i=0; i<this.length; i++){
            let path = [];
            for(let k=0; k<this.pathLength; k++){
                path.push({
                    x: this.position.x,
                    y: this.position.y
                });
            }
            this.body.push(new SnakeBody(this.radio,this.color,this.context,path));
        }
    }
    createBody(){
        let path = [];
        for(let k=0; k<this.pathLength; k++){
            path.push({
                x: this.body.slice(-1)[0].path.slice(-1)[0].x,
                y: this.body.slice(-1)[0].path.slice(-1)[0].y
            });
        }
        this.body.push(new SnakeBody(this.radio,this.color,this.context,path));
        if(this.pathLength < 8){
            this.body.push(new SnakeBody(this.radio,this.color,this.context,[...path]));
            this.body.push(new SnakeBody(this.radio,this.color,this.context,[...path]));
            this.body.push(new SnakeBody(this.radio,this.color,this.context,[...path]));
        }
    }
    drawCircle(x,y,radio,color,shadowColor){
        this.context.save();
        this.context.beginPath();
        this.context.arc(x,y,radio,0,2*Math.PI);
        this.context.fillStyle = color;
        this.context.globalAlpha = this.transparency;
        this.context.shadowColor = shadowColor;
        this.context.shadowBlur = 10;
        this.context.fill();
        this.context.closePath();
        this.context.restore();
    }
    drawHead(){
        // Cabeza de la serpiente
    this.drawCircle(this.position.x, this.position.y, this.radio, this.color, this.color);
    
    // Ojo izquierdo
    this.drawCircle(this.position.x, this.position.y - 9, this.radio - 4, "white", "transparent");  // Blanco del ojo
    this.drawCircle(this.position.x + 1, this.position.y - 9, this.radio - 6, "black", "transparent");  // Pupila negra
    this.drawCircle(this.position.x + 3, this.position.y - 8, this.radio - 9, "white", "transparent");  // Detalle blanco
    
    // Ojo derecho
    this.drawCircle(this.position.x, this.position.y + 9, this.radio - 4, "white", "transparent");  // Blanco del ojo
    this.drawCircle(this.position.x + 1, this.position.y + 9, this.radio - 6, "black", "transparent");  // Pupila negra
    this.drawCircle(this.position.x + 3, this.position.y + 8, this.radio - 9, "white", "transparent");  // Detalle blanco

    // Fruncido de ceño (cejas)
    this.context.save();
    this.context.beginPath();
    this.context.strokeStyle = "black";  // Color del fruncido
    this.context.lineWidth = 2;  // Grosor de la línea

    // Cejas inclinadas hacia abajo para mostrar molestia
    // Cejas sobre el ojo izquierdo
    this.context.moveTo(this.position.x - 7, this.position.y - 15); // Punto de inicio (sobre el ojo izquierdo)
    this.context.lineTo(this.position.x - 5, this.position.y - 4);  // Punto final (ceja izquierda inclinada)

    // Cejas sobre el ojo derecho
    this.context.moveTo(this.position.x - 7, this.position.y + 15);  // Punto de inicio (sobre el ojo derecho)
    this.context.lineTo(this.position.x - 5, this.position.y + 4); // Punto final (ceja derecha inclinada)

    this.context.stroke();  // Dibuja las cejas
    this.context.restore();

    // Dibuja la lengua
    this.context.save();
    this.context.beginPath();
    this.context.strokeStyle = "red"; // Color de la lengua
    this.context.lineWidth = 4; // Grosor de la lengua

    // Lengua hacia adelante
    this.context.moveTo(this.position.x+10, this.position.y ); // Punto de inicio en la parte inferior de la cabeza
    this.context.lineTo(this.position.x+15, this.position.y ); // Extiende la lengua hacia adelante

    this.context.stroke(); // Dibuja la lengua
    this.context.restore();    


    }
    
    drawBody(){
        this.body[0].path.unshift({
            x: this.position.x,
            y: this.position.y
        });
        this.body[0].draw();
        for(let i = 1; i<this.body.length; i++){
            this.body[i].path.unshift(this.body[i-1].path.pop());
            this.body[i].draw();
        }
        this.body[this.body.length-1].path.pop();
    }
    draw(){
        this.context.save();
        this.context.translate(this.position.x,this.position.y);
        this.context.rotate(this.rotation);
        this.context.translate( -this.position.x, -this.position.y);
        this.drawHead();
        this.context.restore();
    }
    update(){
        if(this.isDeath){
            this.transparency -= 0.02;
            if(this.transparency<=0){
                play = false;
                menu.style.display = "flex";
                return;
            }
        }
        this.drawBody();
        this.draw();
        if(this.keys.A && this.keys.enable ){
            this.rotation -=0.04;
        }
        if(this.keys.D && this.keys.enable){
            this.rotation += 0.04;
        }
        this.position.x += Math.cos(this.rotation)*this.velocity;
        this.position.y += Math.sin(this.rotation)*this.velocity;
        this.collision();
    }
    collision(){
        // Colisión con las paredes
        if(this.position.x-this.radio <= 0 ||
            this.position.x+this.radio >= canvas.width ||
            this.position.y-this.radio <= 0 ||
            this.position.y+this.radio >= canvas.height){
            this.death();
        }

        // Colisión con el propio cuerpo
        for(let i = 4; i < this.body.length; i++){
            let segment = this.body[i];
            let distance = Math.sqrt(
                (this.position.x - segment.path[0].x) ** 2 +
                (this.position.y - segment.path[0].y) ** 2
            );
            if (distance < this.radio + segment.radio) {
                this.death();
            }
        }
    }
    death(){
        this.velocity = 0;
        this.keys.enable = false;
        this.isDeath = true;
        this.body.forEach((b)=>{
            let lastItem = b.path[b.path.length-1];
            for(let i = 0; i < b.path.length; i++){
                b.path[i] = lastItem;
            }
            b.transparency = this.transparency;
        });
        
         // Pausar la música de fondo cuando la serpiente muere
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;  // Reiniciar la música

        // Guardar el puntaje y tiempo al final del juego
        if (!this.scoreSaved) { // Solo guarda el puntaje si no se ha guardado antes
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            const username = prompt("Ingresa tu nombre de usuario:") || "Invitado"; // Pide al usuario que ingrese su nombre

            console.log(`Guardando puntaje para ${username} con puntaje: ${scoreP} y tiempo: ${elapsedTime}`); 
    
            // Llamar a la función saveScore
            saveScore(username, scoreP, elapsedTime); // Asumiendo que modificas saveScore para aceptar el puntaje y el tiempo
            this.scoreSaved = true; // Marca que el puntaje ya fue guardado
        }
    }
    drawCharacter(){
        for(let i= 1; i<= this.length; i++){
            this.drawCircle(
                this.position.x - (this.pathLength*this.velocity*i),
                this.position.y, this.radio,this.color,this.color
            );
        }
        this.drawHead();
    }
    keyboard(){
        document.addEventListener("keydown",(evt)=>{
            if(evt.key == "a" || evt.key == "A"){
                this.keys.A = true;
            }
            if(evt.key == "d" || evt.key == "D"){
                this.keys.D = true;
            }
        });
        document.addEventListener("keyup",(evt)=>{
            if(evt.key == "a" || evt.key == "A"){
                this.keys.A = false;
            }
            if(evt.key == "d" || evt.key == "D"){
                this.keys.D = false;
            }
        });
    }
}

// Mueve la variable potionVisible fuera de la clase Potion
let potionVisible = false;  // Ahora es una variable global

class Potion {
    constructor(position, radio, color, context) {
        this.position = position;
        this.radio = radio;
        this.color = color;
        this.context = context;
    }
    
    draw() {
        this.context.save();
        this.context.beginPath();
        this.context.arc(this.position.x, this.position.y, this.radio, 0, 2 * Math.PI);
        this.context.fillStyle = this.color;
        this.context.shadowColor = this.color;
        this.context.shadowBlur = 10;
        this.context.fill();
        this.context.closePath();
        this.context.restore();
    }

    collision(snake) {
        let v1 = {
            x: this.position.x - snake.position.x,
            y: this.position.y - snake.position.y
        };
        let distance = Math.sqrt(
            (v1.x * v1.x) + (v1.y * v1.y)
        );

        if (distance < snake.radio + this.radio) {
            // Reducir el tamaño de la serpiente
            if (snake.body.length > 0) {
                snake.body.pop(); // Elimina el último segmento de la serpiente
            }
            
            // Ocultar la poción hasta que se coman otras 5 manzanas
            potionVisible = false;
            
            // Cambiar posición de la poción
            this.position = {
                x: Math.floor(Math.random() * ((canvas.width - this.radio) - this.radio + 1)) + this.radio,
                y: Math.floor(Math.random() * ((canvas.height - this.radio) - this.radio + 1)) + this.radio,
            };
        }
    }

}



const snake = new Snake({x:200,y:200},11,"#FEBA39",1.5,3,12,ctx);
snake.initBody();
const snakeP1 = new Snake({x:165,y:40},11,"#FEBA39",1.5,8,12,ctx2);
snakeP1.initBody();
snakeP1.drawCharacter();
const snakeP2 = new Snake({x:165,y:40},11,"#88FC03",1.5,8,12,ctx3);
snakeP2.initBody();
snakeP2.drawCharacter();
const apple = new Apple({x:300,y:300},8,"red",ctx);
const potion = new Potion({x: 150, y: 150}, 8, "purple", ctx); // Color y posición iniciales


canvas2.addEventListener("click",()=>{
    init(3,12,"#FEBA39");
});
canvas3.addEventListener("click",()=>{
    init(3,12,"#88FC03");
});
function init(length,pathLength,color){
    snake.body.length = 0; // Restablece el cuerpo de la serpiente
    snake.color = color;
    snake.length = length;
    snake.pathLength = pathLength;
    snake.position = {x:200,y:200};  // Restablece la posición de la serpiente
    snake.isDeath = false; // Marca que la serpiente no está muerta
    snake.velocity = 1.5;  // Restablece la velocidad
    snake.transparency = 1; // Restablece la transparencia
    snake.initBody();
    snake.keys.enable = true;
    play = true; // Activa el juego nuevamente
    menu.style.display = "none"; // Oculta el menú de inicio
    scoreP = 0; // Reinicia el puntaje
    score.textContent = scoreP;
    scoreSaved = false; // Reinicia el estado del puntaje guardado
    
    startTime = Date.now(); // Establecer el tiempo de inicio


    backgroundMusic.play(); //Musica de fondo
}

// Función para obtener un color aleatorio
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  

let rectangleColor = "#0e2d45";  // Color inicial de los rectángulos

function background(){
    ctx.fillStyle = "#1B1C30"
    ctx.fillRect(0,0,canvas.width,canvas.height);
    for(let i=0; i<canvas.height; i+=80){
        for(let j=0; j<canvas.width; j+=80){
            ctx.fillStyle = rectangleColor;
            ctx.fillRect(j+10,i+10,70,70);
        }
    }
}

function update() {
    background();
    if (play) {
        snake.update();
        apple.draw();
        apple.collision(snake);

        // Actualiza el tiempo
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Tiempo en segundos
        document.querySelector(".time").textContent = elapsedTime; // Actualiza el tiempo en la pantalla

        // Dibujar y comprobar colisión de la poción solo si es visible
        if (potionVisible) {
            potion.draw();
            potion.collision(snake);
        }
        
    }
    requestAnimationFrame(update);
}
update();
