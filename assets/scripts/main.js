const startScreen = document.querySelector('.overlay.start-screen')
const endScreen = document.querySelector('.overlay.end-screen')

const levelCounter = document.querySelector('.level-counter span')
const bigLevelCounter = document.querySelector('.level-counter .big')

const frame1 = document.querySelector('#dino img:nth-of-type(1)')
const frame2 = document.querySelector('#dino img:nth-of-type(2)')
const frame3 = document.querySelector('#dino img:nth-of-type(3)')

const pressSound = document.getElementById('press-sound')
const jumpSound = document.getElementById('jump-sound')
const levelSound = document.getElementById('level-sound')
const damageSound = document.getElementById('damage-sound')
const winSound = document.getElementById('win-sound')

const start = () => {
    const handleLevelUp = setInterval(() => {
        level++
        levelSound.play()

        bigLevelCounter.classList.add('up')

        setTimeout(() => {
            bigLevelCounter.classList.remove('up')
        }, 400)
        
        levelCounter.innerText = level

        if(level == 2) {
            cactus.sprite.style.animation = 'none'
            cactus.sprite.style.animation = 'scene 2s linear infinite'
        } else if(level == 3) {
            cactus.sprite.style.animation = 'none'
            cactus.sprite.style.animation = 'scene 1s linear infinite'
        } else {
            endGame('win')
        }
    }, 32000)

    const endGame = (endType) => {
        isGameOver = true

        clearInterval(handleLevelUp)

        if(endType == 'defeat') {
            dino.sprite.style.filter = 'hue-rotate(200deg) saturate(300%)'
            dino.isWalking = false

            cactus.sprite.style.animationPlayState = 'paused'

            waterBottle.sprite.style.animationPlayState = 'paused'
    
            endScreen.querySelector('h1').innerText = 'Game Over'
            endScreen.style.display = 'block'
    
            setTimeout(() => {
                dino.sprite.style.display = 'none'
            }, 50)
        } else {
            cactus.sprite.style.display = 'none'

            waterBottle.sprite.style.display = 'block'
            waterBottle.sprite.style.animation = 'scene 2s 3s linear 1'

            endScreen.querySelector('h1').innerText = 'Won!'

            setTimeout(() => {
                endScreen.style.display = 'block'

                waterBottle.sprite.style.display = 'none'

                dino.isWalking = false
    
                setTimeout(() => {
                    frame1.style.display = 'none'
                    frame3.style.display = 'block'
                }, 200)
            }, 4800)
        }
    }

    const cactus = {
        sprite: document.querySelector('.scene__cactus')
    }

    const waterBottle = {
        sprite: document.querySelector('.scene__water-bottle')
    }
    
    const dino = {
        sprite: document.getElementById('dino'),
    
        isWalking: false,
    
        isJumping: false,
    
        walkAnimation() {
            let currentFrame = 1
        
            const walkingInterval = setInterval(() => {
                if(currentFrame == 1) {
                    frame2.style.display = 'none'
                    frame1.style.display = 'block'
                    currentFrame++
                } else {
                    frame1.style.display = 'none'
                    frame2.style.display = 'block'
                    currentFrame--
                }
    
                if(!this.isWalking) {
                    clearInterval(walkingInterval)
                }
            }, 200)
        },
    
        jump() {
            if(!isGameOver) {
                if(!this.isJumping) {
                    this.isJumping = true
                    this.sprite.style.animation = 'jump .8s ease-in-out'
                    
                    jumpSound.play()
        
                    setTimeout(() => {
                        this.isJumping = false
                        this.sprite.style.animation = ''
                    }, 800)
                }
            }
        },
    
        handleCollision() {
            const checkIsCollideInterval = setInterval(() => {
                let dinoBottom = parseInt(window.getComputedStyle(this.sprite).getPropertyValue('bottom'))
                let cactusLeft = parseInt(window.getComputedStyle(cactus.sprite).getPropertyValue('left'))
                let waterBottleLeft = parseInt(window.getComputedStyle(waterBottle.sprite).getPropertyValue('left'))
                
                if(cactusLeft > 10 && cactusLeft < 90 && dinoBottom <= 70) {
                    damageSound.play()
                    clearInterval(checkIsCollideInterval)
                    endGame('defeat')
                }

                if(waterBottleLeft > 10 && waterBottleLeft < 90 && dinoBottom <= 70) {
                    clearInterval(checkIsCollideInterval)
                    waterBottle.sprite.style.animationPlayState = 'paused'
                    winSound.play()
                }
            }, 50)
        }
    }
    
    const handleKeyDown = () => {
        addEventListener('keydown', (e) => {
            if(e.keyCode === 32 || e.keyCode === 38) {
                dino.jump()
            }
        })

        document.querySelector('body').addEventListener('touchstart', () => {
            if(isGameOver == false) {
                dino.jump()
            }
        })
    }

    // Initializing sprites
    setTimeout(() => {
        dino.sprite.style.display = 'block'
        cactus.sprite.style.animation = 'scene 4s linear infinite'
    }, 50)
    
    let isGameOver = false
    let level = 1
    
    levelCounter.innerText = level

    frame3.style.display = 'none'

    dino.sprite.style.filter = 'none'
    dino.handleCollision()
    dino.sprite.style.animation = ''
    dino.isWalking = true
    dino.isJumping = false
    dino.walkAnimation()

    cactus.sprite.style.display = 'block'
    cactus.sprite.style.animation = 'none'

    waterBottle.sprite.style.animation = 'none'

    pressSound.play()

    startScreen.style.display = 'none'
    endScreen.style.display = 'none'

    handleKeyDown()
}