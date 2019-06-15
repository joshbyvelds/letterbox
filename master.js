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
    let boxes;

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
                boxes = [];
                setupUI();
                setupEvents();
                // Setting Matter.js physics world bounds
                Phaser.matter.world.setBounds(0, -200, game.config.width, game.config.height + 200);

                // setup platform for boxes to land on
                Phaser.matter.add.rectangle(game.config.width / 2, game.config.height, game.config.width, 2, { label:"floor", isStatic: true, ignoreGravity: true });

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
                Phaser.matter.world.on('collisionstart', function (event, bodyA, bodyB) {checkCollision(event,bodyA,bodyB);});
                Phaser.matter.world.on('collisionend', function (event, bodyA, bodyB) {checkCollisionEnd(event,bodyA,bodyB);});
            }

            //var test = 0;

            function generateLetter(){
                let type;
                let letter;
                let start_pos_x = (Math.random() * (letterGenerateRange[1] + letterGenerateRange[0])) - letterGenerateRange[0];

                // if(test === 0){
                //     start_pos_x = 100;
                // }
                //
                // if(test === 1){
                //     start_pos_x = 160;
                // }

                // Get the boxes basic type..
                let type_rand = Math.floor(Math.random() * 100);
                let crate_type;

                if(type_rand < 40){
                    type = 0;
                }else if(type_rand < 65){
                    type = 1;
                }else if(type_rand < 80){
                    type = 2;
                }else if(type_rand < 90){
                    type = 3;
                }else if(type_rand < 94){
                    type = 4;
                }else if(type_rand < 97){
                    type = 5;
                }else if(type_rand < 99){
                    type = 6;
                }else{
                    type = 7;
                }

                // if(test === 0){
                //     type = 0;
                // }
                //
                // if(test === 1){
                //     type = 2;
                // }

                // check to see if's a good/bad type box


                // get the boxes' actual letter
                letter = randomProperty(letterTypes, true);


                let crate = Phaser.add.sprite(0, 0, "crate_" + type);
                crate.name = "box_type_image";
                let letterText = Phaser.add.text(0, 0, letterTypes[letter].text, { fontFamily: '"Roboto Condensed"', fontSize: "50px", align:"center"}).setOrigin(0.5);
                letterText.setShadow(2, 2, 'rgba(0,0,0,0.7)', 2);

                let sprite = Phaser.add.container(start_pos_x, -64, [crate,letterText]).setSize(64, 64);
                let letterBody = Phaser.matter.add.gameObject(sprite, {label: "Box", collidingWith:[]});

                // Use air Friction to control drop speed..
                letterBody.setFrictionAir(letterAirFriction[type]);

                letterBody.isFalling = true;
                letterBody.type = type;
                letterBody.letter = letter;
                boxes.push(letterBody);

                // test++;

                //console.log(letterBody);

                // Create next letter after one second..
                letterTimeout = setTimeout(generateLetter, timeBetweenEachLetter);
            }

            function checkLetter(event){
                var box;
                var i;
                // look in falling letters list for letter that matches key
                for (i = 0; i < boxes.length; i++) {
                    box = boxes[i];

                    //console.log(event.key + "|" +  letter.letter);

                    if(box.letter === event.key.toUpperCase() && box.isFalling){
                        // console.log(box);
                        score += boxTypeScores[box.type];
                        boxes.splice(i, 1);
                        box.destroy();
                        updateUI();
                        break;
                    }

                }

                // then look for boxes on ground or in stack..
            }

            function checkCollision(event, bodyA, bodyB) {

                // ** NOTE: All body collisions will be recorded here ** //

                // NOTE: All checks must have a return..

                 //console.log(bodyA);
                 //console.log(bodyB);

                let box;

                // First lets check if a falling block hits the floor..
                if(bodyA.label === "floor" || bodyB.label === "floor") {
                    box = (bodyA.label === "floor") ? bodyB : bodyA;
                    //console.log(box);
                    box.gameObject.isFalling = false;
                    box.gameObject.getByName("box_type_image").setTexture('crate_0');
                    box.type = 0;
                    return;
                }

                // Second, lets check if a box has hit another box
                if(bodyA.label === "Box" && bodyB.label === "Box") {
                    bodyA.collidingWith.push(bodyB);
                    bodyB.collidingWith.push(bodyA);
                    // console.log("On");
                    //
                    // console.log("BodyA");
                    // console.log(bodyA.collidingWith.slice(0));
                    //
                    // console.log("BodyB");
                    // console.log(bodyB.collidingWith.slice(0));

                    if (!bodyA.gameObject.isFalling || !bodyB.gameObject.isFalling) {
                        bodyA.gameObject.isFalling = false;
                        bodyB.gameObject.isFalling = false;
                        bodyA.gameObject.getByName("box_type_image").setTexture('crate_0');
                        bodyB.gameObject.getByName("box_type_image").setTexture('crate_0');
                        return;
                    }
                }
            }

            function checkCollisionEnd(event, bodyA, bodyB) {
                if(bodyA.label === "Box" && bodyB.label === "Box") {
                    bodyA.collidingWith = bodyA.collidingWith.filter(e => e !== bodyB);
                    bodyB.collidingWith = bodyB.collidingWith.filter(e => e !== bodyA);

                    //
                    // console.log("Off");
                    //
                    // console.log("BodyA");
                    // console.log(bodyA.collidingWith.slice(0));
                    //
                    // console.log("BodyB");
                    // console.log(bodyB.collidingWith.slice(0));
                }
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