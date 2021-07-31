kaboom({
  global: true,
  width: 640, 
  height: 510,
})


const spriteGeneralSettings = {
  sliceX: 24,
  sliceY: 1,
  anims: {
    main: {
      from: 0,
      to: 3,
    },
    running: {
      from: 5,
      to: 10,
    },
    jumping: {
      from: 12,
      to: 12,
    },
    death: {
      from: 14,
      to: 16,
    },
  }
}

let playerSprite = "dinoY"

const playerValues = {
  SPEED: 200,
  JUMP_FORCE: 400,
  isJumping: false,
  isRunning: false,
  isGameOver: false,
}

loadRoot("src/dino/")
loadSprite("dinoY", "sheets/tard.png", spriteGeneralSettings)
loadSprite("dinoB", "sheets/doux.png", spriteGeneralSettings)
loadSprite("dinoR", "sheets/mort.png", spriteGeneralSettings)
loadSprite("dinoG", "sheets/vita.png", spriteGeneralSettings)
loadSprite("grass", "../grass.png", {
  sliceX: 1,
  sliceY: 1,
})


scene("title", () => {
  const dinoYellow = add([sprite("dinoY"), pos(0, 0), scale(4)])
  const dinoBlue = add([sprite("dinoB"), pos(100, 0), scale(4)])
  const dinoRed = add([sprite("dinoR"), pos(200, 0), scale(4)])
  const dinoGreen = add([sprite("dinoG"), pos(300, 0), scale(4)])

  dinoYellow.play("main")
  dinoBlue.play("main")
  dinoRed.play("main")
  dinoGreen.play("main")

  add([rect(240, 30), color(255, 255, 255), origin("center"), pos(200, 160)])

  add([
    text("Dinos Bros!", 32), 
    pos(200, 115), 
    origin("center"),
  ])

  add([
    text("Select a character \n Press <<[1-4]>>!", 8),
    pos(200, 160),
    color(0, 0, 0),
    origin("center"),
  ])

  keyPress("1", () => {
    playerSprite = "dinoY"
    go("game")
  })
  keyPress("2", () => {
    playerSprite = "dinoB"
    go("game")
  })
  keyPress("3", () => {
    playerSprite = "dinoR"
    go("game")
  })
  keyPress("4", () => {
    playerSprite = "dinoG"
    go("game")
  })
})

scene("game", () => {
  let flipSprite = false
  const player = add([
    sprite(playerSprite), 
    pos(100, 0), 
    scale(2), 
    body()
  ])

  const map = addLevel([
    "                           ",
    "                           ",
    "                           ",
    "                           ",
    "                           ",
    "                           ",
    "                           ",
    "                           ",
    "                           ",
    "                           ",
    "                           ",
    "                   X       ",
    "               ======      ",
    "                           ",
    "               X           ",
    "           ======          ",
    "                           ",
    "            X       X      ",
    "===========================",
  ], {
    width: 24,
    height: 24,
    pos: vec2(0, 1),
    '=': [
      sprite('grass'),
      area(vec2(3, 4), vec2(21, 20)),
      solid()
    ],
    'X': [
      sprite('dinoR'),
      scale(2),
      area(vec2(3, 4), vec2(21, 20)),
      body(),
      'enemy'
    ]
  })

  player.on("grounded", () => {
    player.play("main")
  });

  keyPress("space", () => {
    if(player.grounded()){
      player.jump(playerValues.JUMP_FORCE)
      player.play("jumping")
      playerValues.isJumping = true      
    }
  })

  keyDown('left', () => {
    player.move(-playerValues.SPEED, 0)
    if(!playerValues.isRunning && !playerValues.isJumping) {
      player.play("running")
      playerValues.isRunning = true
    }
  })
  keyRelease('left', () => {
    player.play("main")
    playerValues.isRunning = false
  })

  keyDown('right', () => {
    player.move(playerValues.SPEED, 0)
    if(!playerValues.isRunning && !playerValues.isJumping) {
      player.play("running")
      playerValues.isRunning = true
    }
  })
  keyRelease('right', () => {    
    player.play("main")
    playerValues.isRunning = false
  })
  
  player.collides('enemy', (p, e) => {
    player.play("death")
    playerValues.isGameOver = true
    setTimeout(() => {
      go('gameOver')
    }, 500)    
  })
})

scene("gameOver", () => {
  add([rect(240, 30), color(255, 255, 255), origin("center"), pos(200, 160)])

  add([
    text("Game over", 32), 
    pos(200, 115), 
    origin("center"),
  ])

  add([
    text("Restarting game... \n please wait", 8),
    pos(200, 160),
    color(0, 0, 0),
    origin("center"),
  ])

  setTimeout(() => {
    playerValues.isGameOver = false
    go("title")
  }, 5000)
})

start("title")