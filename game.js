const config = {
    type: Phaser.AUTO,
    width: 550,
    height: 450,
    parent: 'game-container',
    backgroundColor: "#ffffff",
    physics: { default: "arcade" },
    scene: { preload, create, update }
  };

  let player, enemies, score = 0, scoreText, active_fl = 0, num_enemies, worldBounds, gameWidth, gameHeight, total_velocity, popSound;
  
  const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');

  const game = new Phaser.Game(config);
 
  function preload() {

    this.load.audio('pop', ['pop.mp3']);

  }
  
  function create() {

    active_fl = 0;
    num_enemies = 20;
    total_velocity = 200;
    gameWidth = this.sys.game.canvas.width;
    gameHeight = this.sys.game.canvas.height;

    popSound = this.sound.add('pop');
    
    player = this.add.circle(400, 300, 12, 0x000000);
    this.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);
    player.setActive(false).setVisible(false);
  
    enemies = this.physics.add.group();
    for (let i = 0; i < num_enemies; i++) {
      let spawn = generateSpawn();
      const enemy = this.add.circle(spawn.x_pos, spawn.y_pos, 10, 0xaaaaaa);
      this.physics.add.existing(enemy);
      enemies.add(enemy);
      enemy.body.setVelocity(spawn.x_vel, spawn.y_vel);
    }
  
    scoreText = this.add.text(10, 10, "Score: 0", { font: "16px Arial", fill: "#000" });

    worldBounds = this.physics.world.bounds;
  
    this.physics.add.overlap(player, enemies, hitEnemy, null, this);
  
    // follow mouse
    this.input.on('pointermove', pointer => {
      player.x = pointer.x;
      player.y = pointer.y;
    });

    // click to start
    this.input.on('pointerdown', function (pointer) {
        if (active_fl == 0) {
            player.setActive(true).setVisible(true);
            score = 0;
            active_fl = 1;
        }
    });
  }
  
  // update - timer
  function update(time, delta) {
    if (active_fl == 1) {
        score += delta / 1000;
    }
    scoreText.setText("Score: " + score.toFixed(1));

    // respawn enemies when they are out of the canvas
    enemies.getChildren().forEach((child, index) => {
        let spriteBounds = child.getBounds();
        if (!Phaser.Geom.Rectangle.Overlaps(worldBounds, spriteBounds)) {
            updateTotalVelocity();
            let spawn = generateSpawn();
            child.x = spawn.x_pos;
            child.y = spawn.y_pos;
            child.body.setVelocity(spawn.x_vel, spawn.y_vel);
        }
    });

  }
  
  // die
  function hitEnemy() {
    //scoreText.setText("Game Over! Final Score: " + score.toFixed(1));
    if (active_fl == 1) {
        player.setActive(false).setVisible(false);
        active_fl = 0;
        popSound.play();
    }
  }

  // generate random start location and direction for enemies
  function generateSpawn() {
    const rand = Phaser.Math.Between(0, 3);
    let x_pos, y_pos, x_vel, y_vel;
    // left
    if (rand == 0) {
        x_pos = 0;
        y_pos = Phaser.Math.Between(0, gameHeight);
        y_vel = Phaser.Math.Between ((-1 * total_velocity / 2), (total_velocity / 2))
        x_vel = total_velocity - Math.abs(y_vel);
    // top
    } else if (rand == 1) {
        x_pos = Phaser.Math.Between(0, gameWidth);
        y_pos = 0;
        x_vel = Phaser.Math.Between ((-1 * total_velocity / 2), (total_velocity / 2))
        y_vel = total_velocity - Math.abs(x_vel);
    // right
    } else if (rand == 2) {
        x_pos = gameWidth;
        y_pos = Phaser.Math.Between(0, gameHeight);
        y_vel = Phaser.Math.Between ((-1 * total_velocity / 2), (total_velocity / 2))
        x_vel = -1 * (total_velocity - Math.abs(y_vel));
    // bottom
    } else {
        x_pos = Phaser.Math.Between(0, gameWidth);
        y_pos = gameHeight;
        x_vel = Phaser.Math.Between ((-1 * total_velocity / 2), (total_velocity / 2))
        y_vel = -1 * (total_velocity - Math.abs(x_vel));
    }
    return {x_pos, y_pos, x_vel, y_vel};
  }

 /*  // Function to get the selected difficulty value
  function getSelectedDifficulty() {
    for (const radio of difficultyRadios) {
      if (radio.checked) {
        return radio.value;
      }
    }
    return null; // No color selected
  }

  // Add an event listener to each radio button to detect changes
  difficultyRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const selectedDiff = getSelectedDifficulty();
      if (selectedDiff === "easy") {
        total_velocity = 100;
      } else if (selectedDiff === "hard") {
        total_velocity = 300;
      } else {
        total_velocity = 200;
      }
    });
  }); */

  function updateTotalVelocity() {
    const selectedRadio = document.querySelector('input[name="difficulty"]:checked').value;
    if (selectedRadio === "easy") {
      total_velocity = 150;
    } else if (selectedRadio === "hard") {
      total_velocity = 250;
    } else {
      total_velocity = 200;
    }
  }

  

// generate new enemies if there are less than the max
   /*while (num_enemies < max_enemies) {
        const enemy = this.add.circle(Phaser.Math.Between(0, 550), Phaser.Math.Between(0, 450), 10, 0x888888);
        this.physics.add.existing(enemy);
        enemies.add(enemy);
        enemy.body.setVelocity(150, -150);
        num_enemies += 1;
    }*/