const startScreen = document.querySelector('.overlay.start-screen')
const endScreen = document.querySelector('.overlay.end-screen')

const frame1 = document.querySelector('#dino img:nth-of-type(1)')
const frame2 = document.querySelector('#dino img:nth-of-type(2)')

const cactus = {
    sprite: document.querySelector('.scene__cactus')
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
        if(!this.isJumping) {
            this.isJumping = true
            this.sprite.style.animation = 'jump .7s ease-in-out'

            setTimeout(() => {
                this.isJumping = false
                this.sprite.style.animation = ''
            }, 700)
        }
    },

    handleCollision() {
        setInterval(() => {
            let dinoBottom = parseInt(window.getComputedStyle(this.sprite).getPropertyValue('bottom'))
            let cactusLeft = parseInt(window.getComputedStyle(cactus.sprite).getPropertyValue('left'))
        
            if(cactusLeft > 10 && cactusLeft < 90 && dinoBottom <= 70) {
                endGame('defeat')
            }
        }, 50)
    }
}

const startGame = () => {
    const handleKeyDown = () => {
        addEventListener('keydown', (e) => {
            if(e.keyCode === 32 || e.keyCode === 38) {
                dino.jump()
            }
        })
    }

    handleKeyDown()

    dino.handleCollision()
    dino.isWalking = true
    dino.isJumping = false
    dino.walkAnimation()

    cactus.sprite.style.left = '1600px'
    cactus.sprite.style.animationPlayState = 'running'
    
    startScreen.style.visibility = 'hidden'
}

const endGame = (endType) => {
    if(endType == 'defeat') {
        dino.sprite.style.filter = 'hue-rotate(200deg) saturate(300%)'
        dino.isWalking = false
        dino.isJumping = true

        cactus.sprite.style.animationPlayState = 'paused'

        endScreen.querySelector('h1').innerText = 'Game Over'
        endScreen.style.display = 'block'

        setTimeout(() => {
            dino.sprite.style.display = 'none'
        }, 50)
    } else {
        alert('won!')
    }
}

const restartGame = () => {
    location.href = '/'
}