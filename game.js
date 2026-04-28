enchant();
window.onload = function() {
	let gameWidth = 320;
	let gameHeight = 350;
	let headerHeight = 60;
	var core = new Core(gameWidth, gameHeight);
	core.fps = 30;
	core.preload('./image/chara1.png'
		,'./image/icon0.png'
		,'./image/gameover.png'
		,'./image/map0.png'
		,'./image/start.png'
	);
	core.onload = function() {
		var scene = new Scene();
		scene.backgroundColor = '#000000';
		
		let titleLabel = new Label('Chase the Thing!!!');
		titleLabel.color = '#ffffff';
		titleLabel.width = core.width;
		titleLabel.textAlign = "center";
		titleLabel.x = 0;
		titleLabel.y = 2;
		scene.addChild(titleLabel);

		let score=0;
		let scoreLabel = new Label('Score: ' + score);
		scoreLabel.color = '#ffffff';
		scoreLabel.font = "10px Arial";
		scoreLabel.x = 0;
		scoreLabel.y = 20;
		scene.addChild(scoreLabel);

		let gameOverImage = new Sprite(189, 97);
		let gameOver = false;
		gameOverImage.image = core.assets['./image/gameover.png'];
		gameOverImage.x = (gameWidth - gameOverImage.width) / 2;
		gameOverImage.y = (gameHeight - gameOverImage.height) / 2;

		let startImage = new Sprite(236, 48);
		startImage.image = core.assets['./image/start.png'];
		startImage.x = (gameWidth - startImage.width) / 2;
		startImage.y = (gameHeight - startImage.height) / 2;
		scene.addChild(startImage);

		let flash = new Sprite(gameWidth, gameHeight);
		flash.backgroundColor = '#4400ff';
		flash.opacity = 0;
		flash.x = 0;
		flash.y = 0;

		let flashForStar = new Sprite(gameWidth, gameHeight);
		flashForStar.backgroundColor = '#ff0000';
		flashForStar.opacity = 0;
		flashForStar.x = 0;
		flashForStar.y = 0;
		

		let timer = 5;
		let timerLabel = new Label('Time: ' + timer);
		timerLabel.color = '#ffffff';
		timerLabel.font = "10px Arial";
		timerLabel.x = gameWidth - 40;
		timerLabel.y = 20;
		scene.addChild(timerLabel);


// 	Game objects
		let gameLayer = new Group();
		gameLayer.x = 0;
		gameLayer.y = headerHeight;
		scene.addChild(gameLayer);
		//map
		let map = new Map(16, 16);
		map.image = core.assets['./image/map0.png'];
		let data = [];
		for (let y = 0; y < 20; y++) {
			let row = [];
			for (let x = 0; x < 20; x++) {
				row.push(0);
			}
			data.push(row);
		}
		map.loadData(data);
		gameLayer.addChild(map);
		
		//chara
		let chara = new Sprite(32, 32);
		let walkAnim = [0,0,0,0,1,1,1,1,0,0,0,0,2,2,2,2];
		let deathAnim = [0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3];
		chara.image = core.assets['./image/chara1.png'];
		chara.x = gameWidth / 2 - 16;
		chara.y = gameHeight - 32;
		gameLayer.addChild(chara);

		//name shit
		let playerName = new Label('YAN MYO KYAW');
		playerName.color = '#ffffff';
		playerName.font = "7px Arial";
		// playerName.x = chara.x;
		// playerName.y = gameHeight - 70;
		//gameLayer.addChild(playerName);

		let bombSpeed = core.fps / 2;
		let thingSpeed = core.fps + (core.fps / 3);
		let starSpeed = Math.floor(Math.random() * 100 + 2000);
		let starEaten = false;

		function screenFlash() {
			flash.opacity = 0.3;
		}

		function starFlash() {
			flashForStar.opacity = 0.2;
		}

		// function respawnThing() {
		// 	do {
		// 		//thing.frame = Math.floor(Math.random() * (24)) + 10;
		// 		thing.frame = 29; //watermelon
		// 		thing.x = Math.random() * (gameWidth - thing.width);
		// 		thing.y = Math.random() * (gameHeight - headerHeight - thing.height);
		// 	} while (thing.within(chara, 30));
		// 	gameLayer.addChild(thing);
		// }
		// respawnThing();

		// let bombs = [];
		// let bombCount = 20;
		// for (let i = 0; i < bombCount; i++) {
		// 	let bomb = new Sprite(16, 16);
		// 	bomb.image = core.assets['./image/icon0.png'];
		// 	bomb.frame = 24;
		// 	let valid = false;
		// 	do {
		// 		bomb.x = Math.random() * (gameWidth - bomb.width);
		// 		bomb.y = Math.random() * (gameHeight - headerHeight - bomb.height);
		// 		valid = true;
				
		// 		if (bomb.within(chara, 30) || bomb.within(thing, 30)) {
		// 			valid = false;
		// 			continue;
		// 		}
				
		// 		for (let j = 0; j < bombs.length; j++) {
		// 			if (bomb.within(bombs[j], 30)) {
		// 				valid = false;
		// 				break;
		// 			}
		// 		}
		// 	} while (!valid);

		// 	bombs.push(bomb);
		
		//}
		
		// remixBombs = function() {
		// 	for (let i = 0; i < bombs.length; i++) {
		// 		let bomb = bombs[i];
		// 		let valid = false;
		// 		do {
		// 			bomb.x = Math.random() * (gameWidth - bomb.width);
		// 			bomb.y = Math.random() * (gameHeight - headerHeight - bomb.height);
		// 			valid = true;
					
		// 			if (bomb.within(chara, 30) || bomb.within(thing, 30)) {
		// 				valid = false;
		// 				continue;
		// 			}
					
		// 			for (let j = 0; j < bombs.length; j++) {
		// 				if (i !== j && bomb.within(bombs[j], 30)) {
		// 					valid = false;
		// 					break;
		// 				}
		// 			}
		// 		} while (!valid);
		// 	}
		// }
		core.replaceScene(scene);

		//anything moving
		scene.onenterframe = function() {
			scene.addChild(startImage);
			if (core.frame > 50) {
				scene.removeChild(startImage);
			}
			
			if(gameOver) {
				gameLayer.addChild(flash);
				screenFlash();
				chara.frame = deathAnim[core.frame % deathAnim.length];
				return;
			}

			if (starEaten) {
				gameLayer.addChild(flashForStar);
				starFlash();
			}

			
			//bomb
			if(core.frame % bombSpeed == 0){
				let bomb = new Sprite(16, 16);
				bomb.image = core.assets['./image/icon0.png'];

				bomb.frame = 24;

				bomb.x = chara.x + (Math.random() * 300 - 150);
				bomb.y = 0;
				gameLayer.addChild(bomb);
				bomb.onenterframe = function() {
					if (gameOver) return;
					this.y += 2;
					if (this.y > gameHeight || this.x < 0 || this.x > gameWidth - this.width) {
						gameLayer.removeChild(this);
					}
					if (chara.within(this, 17)) {
						if (starEaten) {
							gameOver = false;
							score ++;
							scoreLabel.text = 'Score: ' + score;
							gameLayer.removeChild(this);

							return;
						}
						gameOver = true;
						scene.addChild(gameOverImage);
						//core.stop();
					}					
					
				}
				
			}
			//thing
			if(core.frame % thingSpeed == 0 && core.frame > 10){

				let thing = new Sprite(16, 16);
				thing.image = core.assets['./image/icon0.png'];
				thing.frame = 29; //watermelon
				thing.x = Math.random() * (gameWidth - thing.width);
				thing.y = 0;
				gameLayer.addChild(thing);
				thing.onenterframe = function() {
					if (gameOver) return;
					this.y += 2;
					if (this.y > gameHeight || this.x < 0 || this.x > gameWidth - this.width) {
						gameLayer.removeChild(this);
					}
					if (chara.within(this, 20)) {
						if (!starEaten) {
							score++;
							timer = 5;
						}else {
							score += 2;
						}
						if (score % 10 == 0) bombSpeed -= 2;
						if (bombSpeed < 5) bombSpeed = 5;

						scoreLabel.text = 'Score: ' + score;
						gameLayer.removeChild(this);
					}					
					
				}
			}
			//star
			//for test
			//if(core.frame % starSpeed == 0){
			if(core.frame % starSpeed == 0 && core.frame > 10){

				let star = new Sprite(16, 16);
				star.image = core.assets['./image/icon0.png'];
				star.frame = 30;
				star.x = Math.random() * (gameWidth - star.width);
				star.y = 0;
				gameLayer.addChild(star);
				star.onenterframe = function() {
					if (gameOver) return;
					this.y += 2;
					if (this.y > gameHeight || this.x < 0 || this.x > gameWidth - this.width) {
						gameLayer.removeChild(this);
					}
					if (chara.within(this, 20)) {
						starEaten = true;
						timer = 10;
						gameLayer.removeChild(this);
					}
				}
			}
			//timer
			timer -= 1 / core.fps;
			timerLabel.text = 'Time: ' + Math.ceil(timer);
			if (timer <= 0) {
				if (starEaten) {
					starEaten = false;
					gameLayer.removeChild(flashForStar);
					timer = 5;
				}else {
				gameOver = true;
				scene.addChild(gameOverImage);
				//core.stop();
				}
			}
			let moving = false;
			if (core.input.left) {
				moving = true;
				chara.scaleX = -1;
				chara.x -= 2;
			}
			if (core.input.right) {
				moving = true;
				chara.scaleX = 1;
				chara.x += 2;
			}

			
			// if (core.input.up) {
			// 	moving = true;
			// 	chara.y -= 4;
			// }
			// if (core.input.down) {
			// 	moving = true;
			// 	chara.y += 4;
			// }
			
			//move animation
			if (moving && starEaten) {
				chara.frame = 4;
			}
			else if (starEaten) {
				chara.frame = 4;
			}
			else if (moving) {
				chara.frame = walkAnim[core.frame % walkAnim.length];
			}
			else {
				chara.frame = 0;
			}

			//chara boundary check
			if (chara.x < 0) chara.x = 0;
			if (chara.x > gameWidth - chara.width) chara.x = gameWidth - chara.width;
			if (chara.y < 0) chara.y = 0;
			if (chara.y > gameHeight - headerHeight - chara.height) chara.y = gameHeight - headerHeight - chara.height;
			playerName.x = chara.x - 10;
			playerName.y = chara.y - 10;
			// for (let i = 0; i < bombs.length; i++) {
			// 	let bomb = bombs[i];
			// 	if (chara.within(bomb, 20)) {
			// 		gameOver = true;
			// 		scene.addChild(gameOverImage);
			// 	 core.stop();
			// 	}
			// }
		}

	}
	core.start();
}