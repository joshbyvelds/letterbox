(function(){

    // Game Settings.
    let gravity = 1,
        letterGenerateRange = [50, 1350],
        letterAirFriction = [0.25, 0.20, 0.15, 0.10, 0.075, 0.030, 0.020, 0.00],
        timeBetweenEachLetter = 1000,
        boxTypeScores = [1,5,20,30,60,100,200,500];
        letterTypes = {
            A:{ text:"A", score: 1},
            B:{ text:"B", score: 3},
            C:{ text:"C", score: 3},
            D:{ text:"D", score: 3},
            E:{ text:"E", score: 1},
            F:{ text:"F", score: 3},
            G:{ text:"G", score: 5},
            H:{ text:"H", score: 5},
            I:{ text:"I", score: 1},
            J:{ text:"J", score: 10},
            K:{ text:"K", score: 7},
            L:{ text:"L", score: 3},
            M:{ text:"M", score: 3},
            N:{ text:"N", score: 3},
            O:{ text:"O", score: 1},
            P:{ text:"P", score: 4},
            Q:{ text:"Q", score: 15},
            R:{ text:"R", score: 3},
            S:{ text:"S", score: 2},
            T:{ text:"T", score: 3},
            U:{ text:"U", score: 2},
            V:{ text:"V", score: 20},
            W:{ text:"W", score: 8},
            X:{ text:"X", score: 15},
            Y:{ text:"Y", score: 20},
            Z:{ text:"Z", score: 10},
        };

    // Engine Vars, Don't mess with these..
    let game;
    let score;
    let timeLeft;
    let letterTimeout;
    let fallingLetters;

    function init(){
        let phaserConfig = {
            type: Phaser.AUTO,
            scale: {
                mode: Phaser.Scale.NONE,
                parent: "thegame",
                width: 1400,
                height: 768,
            },

            physics: {
                default: "matter",
                matter: {
                    gravity: {
                        y: gravity
                    },
                    debug: false
                }
            },
            parent: "main",
            dom: {
                createContainer: true
            },
            scene: playGame
        };

        game = new Phaser.Game(phaserConfig);
        window.focus();
    }

    var playGame = new Phaser.Class({
        Extends: Phaser.Scene,
        initialize:

        function playGame(){
            Phaser.Scene.call(this, {key: "PlayGame"});
        },

        preload: function(){

            // loading crate image
            this.load.image("crate_0", "images/crate.jpg");
            this.load.image("crate_1", "images/crate_green.jpg");
            this.load.image("crate_2", "images/crate_blue.jpg");
            this.load.image("crate_3", "images/crate_red.jpg");
            this.load.image("crate_4", "images/crate_pink.jpg");
            this.load.image("crate_5", "images/crate_bronze.jpg");
            this.load.image("crate_6", "images/crate_silver.jpg");
            this.load.image("crate_7", "images/crate_gold.jpg");
        },

        // function to be executed once the scene has been created
        create: function(){

            let Phaser = this;
            let ground;

            function gameInit() {
                fallingLetters = [];
                setupUI();
                setupEvents();
                // Setting Matter.js physics world bounds
                Phaser.matter.world.setBounds(0, -200, game.config.width, game.config.height + 200);

                // setup platform for boxes to land on

                generateLetter();
                tick();
            }

            function tick() {
                updateUI();
                if(timeLeft === 0){
                    gameOver();
                }

                timeLeft--;
                setTimeout(tick, 1000);
            }

            function updateUI() {
                document.getElementById("ui_score").innerHTML = score;
                document.getElementById("ui_time").innerHTML = timeLeft;
            }

            function gameOver() {
                alert("Game Over");
            }

            function setupUI() {
                score = 0;
                timeLeft = 120;
            }

            function setupEvents() {
                Phaser.input.keyboard.on('keydown', function(event){checkLetter(event)});
            }

            function generateLetter(){
                let letter = {};
                let start_pos_x = (Math.random() * (letterGenerateRange[1] + letterGenerateRange[0])) - letterGenerateRange[0];

                // Get the boxes basic type..
                let type_rand = Math.floor(Math.random() * 100);
                let crate_type;

                if(type_rand < 40){
                    letter.type = 0;
                }else if(type_rand < 65){
                    letter.type = 1;
                }else if(type_rand < 80){
                    letter.type = 2;
                }else if(type_rand < 90){
                    letter.type = 3;
                }else if(type_rand < 94){
                    letter.type = 4;
                }else if(type_rand < 97){
                    letter.type = 5;
                }else if(type_rand < 99){
                    letter.type = 6;
                }else{
                    letter.type = 7;
                }

                // check to see if's a good/bad type box


                // get the boxes' actual letter
                letter.letter = randomProperty(letterTypes, true);


                let crate = Phaser.add.sprite(0, 0, "crate_" + letter.type);
                let letterText = Phaser.add.text(0, 0, letterTypes[letter.letter].text, { fontFamily: '"Roboto Condensed"', fontSize: "50px", align:"center"}).setOrigin(0.5);
                letterText.setShadow(2, 2, 'rgba(0,0,0,0.7)', 2);

                letter.sprite = Phaser.add.container(start_pos_x, -100, [crate,letterText]).setSize(64, 64);
                letter.physics = Phaser.matter.add.gameObject(letter.sprite);

                fallingLetters.push(letter);

                //console.log(fallingLetters);

                // Use air Friction to control drop speed..
                letter.physics.setFrictionAir(letterAirFriction[letter.type]);

                // Create next letter after one second..
                letterTimeout = setTimeout(generateLetter, timeBetweenEachLetter);
            }

            function checkLetter(event){
                var letter;
                var i;
                // look in falling letters list for letter that matches key
                for (i = 0; i < fallingLetters.length; i++) {
                    letter = fallingLetters[i];

                    console.log(event.key + "|" +  letter.letter);

                    if(letter.letter === event.key.toUpperCase()){
                        letter.physics.destroy();
                        letter.sprite.destroy();
                        break;
                    }
                }

                letter.physics.destroy();
                score += boxTypeScores[letter.type];
                fallingLetters.splice(i, 1);
                updateUI();
            }

             gameInit();
        }
    });

    window.onload = init();
}());


//Utility functions..
var randomProperty = function (obj, exportkey) {
    var keys = Object.keys(obj);
    var key = keys[ keys.length * Math.random() << 0];
    if(exportkey){
        return key;
    }else{
        return obj[key];
    }
};