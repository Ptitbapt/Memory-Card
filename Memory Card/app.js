const cartes = document.querySelectorAll('.carte'); // Selectionne toutes les cartes dans le DOM

let carteFlipper = false; // Permet de savoir si une carte a déjà été retournée
let carte1; // 1ère carte
let carte2; // 2ème carte
let times = false; // Temps d'attente avant de retourner les cartes
let Tcarte =  cartes.length // Nombre de cartes
let compteurV = Tcarte / 2; // Compteur pour la victoire 
var grille = document.querySelector('.grille');

///////////////// AUDIO /////////////////
var coins = new Audio("audio/Coin.mp3");
coins.volume = 0.1;

var wrong = new Audio("audio/Bump.mp3");
wrong.volume = 0.2;

var clear = new Audio("audio/Clear.mp3");
clear.volume = 0.5;

var up = new Audio("audio/1up.mp3");
clear.volume = 0.01;

var Theme = new Audio("audio/MainTheme.mp3");
Theme.volume = 0.1;

Theme.play();
Theme.addEventListener('ended', function() { // Si la musique est fini la remettre à nouveau
    this.currentTime = 0;
    this.play();
}, false);  


/////////////////////////////////////////
cartes.forEach(carte => { // Pour chaque carte
    carte.addEventListener('click', flipCartes) // Ajoute un écouteur d'événement
    let random = Math.floor(Math.random() * 12); // Génère un nombre aléatoire entre 0 et 11
        for (let i = 0; i < Tcarte; i++) { 
            carte.style.order = random; // Ajoute un ordre aléatoire à la carte 
        }
});

grille.addEventListener('click', start, { once: true }); // Démarrer le timer

///////////////// TIMER //////////////////

let minute = 0; // Initialise le temps en minute
let second = 0; // Initialise le temps en seconde
let millisecond = 0; // Initialise le temps en milliseconde

let cron; // Variable pour le timer

function timer() { 
  if ((millisecond += 1) == 100) { 
    millisecond = 0;
    second++;
  }
  if (second == 60) {
    second = 0;
    minute++;
  }


  document.getElementById('minute').innerText = returnData(minute);
  document.getElementById('second').innerText = returnData(second);

}

function start() { // Démarrer le timer
    cron = setInterval(() => { timer(); }, 10);
    console.log("time start")
}
  
function pause() { // Stopper timer
    clearInterval(cron);
    console.log("time pause")
}
  
function reset() { // Redémarrer timer
  
    minute = 0;
    second = 0;
  
    document.getElementById('minute').innerText = '00';
    document.getElementById('second').innerText = '00';
  
    clearInterval(cron);

    console.log("time reset")
}


function returnData(input) {
  return input >= 10 ? input : `0${input}`
}

//////////////////////////////////////////

function flipCartes(f) { // Fonction principal pour le jeu 
    if (!times){ // Si des cartes sont retournés et ne sont pas identiques => empêche le joueur de retourner d'autres cartes
        f.target.parentNode.classList.add('active'); // Ajoute la classe active à la carte cliquée
    
        console.log(f.target.parentNode);
        console.log(compteurV);
  
        if (!carteFlipper) { // Si la carte n'a pas encore été retournée
            carteFlipper = true; // La carte est retournée
            carte1 = this; // La carte 1 est la carte cliquée
            carte1.removeEventListener('click', flipCartes); // Anticipe le double-click sur la carte

            console.log({carteFlipper});
            console.log(carte1.getAttribute('data-attr'));
            console.log(this);
    
            return; // On sort de la fonction 
        
        } else { // Si la carte a déjà été retournée
            carteFlipper = false; // La carte n'est plus retournée
            carte2 = this; // La carte 2 est la carte cliquée
            console.log(carte2.getAttribute('data-attr'));
       
        } compaisonCartes(); // On compare les cartes

        try {
            if ( compteurV == 0) { // Si toute les cartes ont été retournées
                // Créer un footer avec un bouton pour restart le jeu
               victoire();
            }
        } catch (e) {
            " " 
        }
    } 
}

function compaisonCartes(){ 
    if (carte1.getAttribute('data-attr') == carte2.getAttribute('data-attr')) { // Si les cartes sont identiques
        console.log('They match') 
        immobiliserCartes(); // On immobilise les cartes en face visible
        
        let score = document.getElementById('score').innerText;
        score = parseInt(score) + 100;
        document.getElementById('score').innerText = score

        if (compteurV == 1) {
            up.play();
        } else if (compteurV > 1) {
            coins.play();
        } 


    } else {
        console.log('They don\'t match')
        retournerCartes(); // s'ils sont différents on retourne les cartes
        carte1.addEventListener('click', flipCartes); // Remettre la 1ère carte à l'état initial
    }
}

function immobiliserCartes() { 
    carte1.removeEventListener('click', flipCartes); // Supprime l'écouteur d'événement "cliquer"
    carte2.removeEventListener('click', flipCartes); // pour les deux cartes choisis 
    compteurV = compteurV - 1; // On retire 1 au compteur de victoire
}

function retournerCartes() { 
    times = true; // On définit le temps d'attente avant de retourner les cartes
    wrong.play();
    setTimeout(() => { 
        console.log(carte1.childNodes) 
        times = false; // On enlève le temps d'attente
        carte1.childNodes[1].classList.remove('active'); // Retourne la 1ère carte
        carte2.childNodes[1].classList.remove('active'); // Retourne la 2ème carte
    }, 1000); 
}


// function notifications(message) { // Fonction pour afficher les notifications
//     document.querySelector('#notification_container').innerHTML += `
//         <div class="content"> 
//             <p>${message}</p> 
//         </div>
//     `;

//     setTimeout(function() {
//         document.querySelector('#notification_container .content').remove();
//     }, 3000);

// }

function victoire() {
    Theme.pause();
    pause();
    clear.play();
    // notifications('Vous avez gagné !');
    let footer = document.createElement('footer'); 
    let restart = document.createElement('button');
    let won = document.createElement('p');
    won.innerText = 'YOU WON !'; // Ajoute un texte au-dessus du bouton
    restart.innerText = 'Restart ?'; // Ajoute un texte au bouton
    footer.appendChild(restart); // Ajoute le bouton au footer
    document.body.appendChild(footer); // Ajoute le footer au body
    footer.appendChild(won); // Ajoute le texte au footer
    // Creation du texte //
    won.style.fontSize = '25px';
    won.style.color = '#fff';
    won.style.textAlign = 'center';
    won.style.fontFamily = "SuperMarioNes";
    won.style.position = 'absolute';
    won.style.zIndex = '1';
    won.style.top = "745px";
    // Creation du footer //
    footer.style.display = 'flex'; 
    footer.style.justifyContent = 'center';
    footer.style.alignItems = 'center';
    footer.style.marginTop = '50px';
    // Creation du bouton //
    restart.style.backgroundColor = 'transparent';
    restart.style.color = '#fff';
    restart.style.padding = '10px';
    restart.style.borderRadius = '5px';
    restart.style.cursor = 'pointer';
    restart.style.fontSize = '20px';
    restart.style.fontWeight = 'bold';
    restart.style.border = 'none';
    restart.style.outline = 'none';
    restart.style.position = 'relative';
    restart.style.display = "flex";
    restart.style.justifyContent = "center";
    restart.style.alignItems = "center";
    restart.style.fontFamily = "SuperMarioNes";
    restart.style.top="20px";
    
    
    restart.addEventListener('click', () => { // Ajoute un écouteur d'événement au bouton
        cartes.forEach(carte => {
            carte.childNodes[1].classList.remove('active'); // Retourne toute les cartes
        });
        setTimeout(() => {
        reset(); // Réinitialise le timer
        location.reload(); // Recharge la page 1 seconde après l'animation
        }, 1000); 
    });
}

/////////// Animation green shell //////////////

// var width = window.innerWidth,
//     height = window.innerHeight,
//     ratio = window.devicePixelRatio;

// var x = width / 2,
//     r = 40,
//     step = 0,
//     vx = r * 0.2;

// var sprites = new Image();
// sprites.onload = animate;
// sprites.src = "img/shell.png";



// var canvas = document.getElementById("canvas"),
//     context = canvas.getContext("2d");

// canvas.width  = width  * ratio;
// canvas.height = height * ratio;
// canvas.style.width  = width  + "px";
// canvas.style.height = height + "px";
// context.scale(ratio, ratio);
// context.imageSmoothingEnabled = false;
// context.fillStyle = "rgba(255, 255, 255, 0.25)";


// function animate() {
//     draw();
//     update();
//     requestAnimationFrame(animate);
// }


// function draw() {
//     context.fillRect(0, 0, width, height);
    
//     // Affichage
//     drawShell(x, height, r, Math.floor(step));
// }

// function drawShell(x, y, r, step) {
//     var s = r/12;
    
//     context.drawImage(sprites, 32*step, 0, 32, 32, x - 16*s, y - 26*s, 32*s, 32*s);
// }


// function update() {
//     // Mise à jour des variables
//     x += vx;
    
//     if (x < r || x > width - r) {
//         vx *= -1;
//     }
    
//     step += 0.3;
//     if (step >= 12)
//         step -= 12;
// }