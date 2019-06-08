(function(){

    // Game Settings.
    let gravity = 1,
        letterGenerateRange = [50, 1350];
        letterAirFriction = [0.25, 0.20, 0.15, 0.10, 0.075, 0.030, 0.020, 0.00];
        timeBetweenEachLetter = 1000;

    // Engine Vars, Don't mess with these..
    let game;

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
                    }
                }
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
            this.load.image("crate", "crate.png");
        },

        // function to be executed once the scene has been created
        create: function(){

            var Phaser = this;
            var letterTimeout;

            function gameInit() {
                // setting Matter world bounds
                Phaser.matter.world.setBounds(0, -200, game.config.width, game.config.height + 200);
                generateLetter();
            }

            function generateLetter(){
                let start_pos_x = (Math.random() * (letterGenerateRange[1] + letterGenerateRange[0])) - letterGenerateRange[0];
                let crate = Phaser.add.sprite(0, 0, "crate");


                let letterBox = Phaser.add.container(start_pos_x, -100, [crate]).setSize(64, 64);
                let LetterPhysics = Phaser.matter.add.gameObject(letterBox);

                let type = null;
                let type_rand = Math.floor(Math.random() * 100);

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

                // Use air Friction to control drop speed.
                LetterPhysics.setFrictionAir(letterAirFriction[type]);

                letterTimeout = setTimeout(generateLetter, timeBetweenEachLetter);
            }

             //gameInit();
        }
    });

    window.onload = init();
}());