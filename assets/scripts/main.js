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

    setScreenTitle(title) {
        this.screen.querySelector('.screen__end-screen .content h1').innerText = title
    }

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

    end() {
        this.isGameOver = true
        dino.isWalking = false
        dino.isJumping = false

        obstacle.sprite.style.animationPlayState = 'paused'

        const obstacleType = obstacle.sprite.classList[1]

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

    walk() {
        this.isWalking = true
        let currentFrame = 1
        
        const walkingInterval = setInterval(() => {
            if(currentFrame == 1) {
                this.sprite.classList.replace('frame1', 'frame2')
                currentFrame++
            } else {
                this.sprite.classList.replace('frame2', 'frame1')
                currentFrame--
            }

            if(!this.isWalking) {
                clearInterval(walkingInterval)
            }
        }, 200)
    }

    jump() {
        if(!game.isGameOver) {
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

    move() {
        this.sprite.style.animation = 'move 4s linear infinite'
    }
}

const start = () => {
    game.start()
    dino.walk()
    obstacle.move()

    handleJump()
    handleCollision()
    handleLevelUp()
}

const handleJump = () => {
    addEventListener('keydown', e => {
        if(e.keyCode === 32 || e.keyCode === 38) {
            dino.jump()
        }
    })

    document.querySelector('body').addEventListener('touchstart', () => dino.jump())
}

const handleCollision = () => {
    const checkIsCollideInterval = setInterval(() => {
        let dinoBottom = parseInt(window.getComputedStyle(dino.sprite).getPropertyValue('bottom'))
        let obstacleLeft = parseInt(window.getComputedStyle(obstacle.sprite).getPropertyValue('left'))
        
        if(obstacleLeft > 10 && obstacleLeft < 90 && dinoBottom <= 70) {
            clearInterval(checkIsCollideInterval)
            game.end()
        }
    }, 50)
}

const handleLevelUp = () => {
    const levelUp = setInterval(() => {
        levelSound.play()
        game.level++

        game.bigLevelCounter.classList.add('up')
        setTimeout(() => game.bigLevelCounter.classList.remove('up'), 400)
        
        game.miniLevelCounter.innerText = game.level

        switch(game.level) {
            case 2:
                obstacle.sprite.style.animationDuration = '2s'
                break
            case 3:
                obstacle.sprite.style.animationDuration = '1s'
                break
            case 4:
                obstacle.sprite.classList.replace('scene__obstacle--cactus', 'scene__obstacle--water-bottle')
                
                obstacle.sprite.style.animation = 'none'
                setTimeout(() => obstacle.sprite.style.animation = 'move 4s 4s linear 1', 400)
        }
    }, 32000)

    const checkIsGameOver = setInterval(() => {
        if(game.isGameOver) {
            clearInterval(levelUp)
            clearInterval(checkIsGameOver)
        }
    }, 50)
}

const game = new Game(gameScreen, levelCounter)
const dino = new Dino()
const obstacle = new Obstacle()