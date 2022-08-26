const gameScreen = document.getElementById('screen')
const levelCounter = document.querySelector('.level-counter')

const pressSound = document.getElementById('press-sound')
const jumpSound = document.getElementById('jump-sound')
const levelSound = document.getElementById('level-sound')
const damageSound = document.getElementById('damage-sound')
const winSound = document.getElementById('win-sound')

class Game {
    constructor(screen, levelCounter) {
        this.isGameOver = false
        this.level = 3

        this.screen = screen
        this.miniLevelCounter = levelCounter.querySelector('.mini span')
        this.bigLevelCounter = levelCounter.querySelector('.big')
    }

    // Changes the title of the end screen
    setScreenTitle(title) {
        this.screen.querySelector('.screen__end-screen .content h1').innerText = title
    }

    // Starts the game
    start() {
        pressSound.play()

        this.isGameOver = false
        this.level = 1
        this.miniLevelCounter.innerText = this.level

        this.screen.removeAttribute('class')
        
        dino.sprite.setAttribute('class', 'frame1')
        dino.sprite.style.display = 'block'
        
        obstacle.sprite.classList.replace('scene__obstacle--water-bottle', 'scene__obstacle--cactus')
    }

    // Ends the game
    end() {
        this.isGameOver = true
        dino.isWalking = false
        dino.isJumping = false

        obstacle.sprite.style.animationPlayState = 'paused'

        const obstacleType = obstacle.sprite.classList[1]

        // Changing the end of the game based on the obstacle type
        switch(obstacleType) {
            case 'scene__obstacle--cactus':
                damageSound.play()

                dino.sprite.classList.add('hit')

                setTimeout(() => {
                    dino.sprite.classList.remove('hit')
                    dino.sprite.style.display = 'none'
                }, 50)

                setTimeout(() => obstacle.sprite.style.animation = 'none', 1000)

                this.setScreenTitle('Game Over')

                break
            case 'scene__obstacle--water-bottle':
                winSound.play()

                obstacle.sprite.style.animation = 'none'

                dino.sprite.setAttribute('class', 'frame3')

                setTimeout(() => dino.sprite.style.display = 'none', 1000)

                this.setScreenTitle('Won!')
        }

        setTimeout(() => this.screen.classList.add('screen--end'), 1000)
    }
}

class Dino {
    constructor() {
        this.sprite = document.getElementById('dino')
        this.isWalking = false
        this.isJumping = false
    }

    // Make the dinosaur walk
    walk() {
        this.isWalking = true
        let currentFrame = 1
        
        const walkingInterval = setInterval(() => {
            // If the frame is equal to 1 it changes to 2 and vice versa
            if(currentFrame == 1) {
                this.sprite.classList.replace('frame1', 'frame2')
                currentFrame++
            } else {
                this.sprite.classList.replace('frame2', 'frame1')
                currentFrame--
            }

            // If the dinosaur is not walking, the animation stops playing
            if(!this.isWalking) {
                clearInterval(walkingInterval)
            }
        }, 200)
    }

    // Make the dinosaur jump
    jump() {
        // If the game is not over and the dinosaur jump is not turned off, check if he is already
        // jumping, if not, make him jump
        if(!game.isGameOver && dino.isJumping != null) {
            if(!this.isJumping) {
                jumpSound.play()
                this.isJumping = true
                this.sprite.classList.add('jump')
    
                setTimeout(() => {
                    this.isJumping = false
                    this.sprite.classList.remove('jump')
                }, 800)
            }
        }
    }
}

class Obstacle {
    constructor() {
        this.sprite = document.querySelector('.scene__obstacle')
    }

    // Initialize obstacle movement animation
    move() {
        this.sprite.style.animation = 'move 4s linear infinite'
    }
}

// Initialize the primary functions for the game to begin
const start = () => {
    game.start()
    dino.walk()
    obstacle.move()

    handleJump()
    handleCollision()
    handleLevelUp()
}

// Handle jump events
const handleJump = () => {
    addEventListener('keydown', e => {
        // If you press "SPACE" or "ARROW UP" key, the dinosaur will jump
        if(e.keyCode === 32 || e.keyCode === 38) {
            dino.jump()
        }
    })

    // If you are on the mobile device and click on the screen, the dinosaur will jump
    document.querySelector('body').addEventListener('touchstart', () => dino.jump())
}

// Handle with the dinosaur collision on obstacle
const handleCollision = () => {
    const checkIsCollideInterval = setInterval(() => {
        let dinoBottom = parseInt(window.getComputedStyle(dino.sprite).getPropertyValue('bottom'))
        let obstacleLeft = parseInt(window.getComputedStyle(obstacle.sprite).getPropertyValue('left'))
        
        // Delimiting hitboxes and making the game end if they collide
        if(obstacleLeft > 10 && obstacleLeft < 90 && dinoBottom <= 70) {
            clearInterval(checkIsCollideInterval)
            game.end()
        }
    }, 50)
}

// Handle with the level up
const handleLevelUp = () => {
    const levelUp = setInterval(() => {
        levelSound.play()
        game.level++

        game.bigLevelCounter.classList.add('up')
        setTimeout(() => game.bigLevelCounter.classList.remove('up'), 400)
        
        game.miniLevelCounter.innerText = game.level

        // Changing the game and the behavior of obstacles based on the level
        switch(game.level) {
            case 2:
                obstacle.sprite.style.animationDuration = '2s'
                break
            case 3:
                obstacle.sprite.style.animationDuration = '1s'
                break
            case 4:
                dino.isJumping = null

                obstacle.sprite.classList.replace('scene__obstacle--cactus', 'scene__obstacle--water-bottle')
                
                obstacle.sprite.style.animation = 'none'
                setTimeout(() => obstacle.sprite.style.animation = 'move 4s 4s linear 1', 400)
        }
    }, 32000)

    // Function that checks if the game is over every 50ms
    const checkIsGameOver = setInterval(() => {
        // If the game is over, stop leveling up
        if(game.isGameOver) {
            clearInterval(levelUp)
            clearInterval(checkIsGameOver)
        }
    }, 50)
}

// Instantiating the main objects of the game
const game = new Game(gameScreen, levelCounter)
const dino = new Dino()
const obstacle = new Obstacle()