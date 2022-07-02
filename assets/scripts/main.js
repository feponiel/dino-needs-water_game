const dino_sprite = document.getElementById('dino')
const cactus_sprite = document.querySelector('.scene__cactus')

const handleKeyDown = () => {
    addEventListener('keydown', (e) => {
        if(e.keyCode === 32 || e.keyCode === 38) {
            dino.jump()
        }
    })
}

const dino = {
    sprite: dino_sprite,

    isJumping: false,

    walkAnimation() {
        const frame1 = document.querySelector('#dino img:nth-of-type(1)')
        const frame2 = document.querySelector('#dino img:nth-of-type(2)')
        let currentFrame = 1
    
        setInterval(() => {
            if(currentFrame == 1) {
                frame2.style.display = 'none'
                frame1.style.display = 'block'
                currentFrame++
            } else {
                frame1.style.display = 'none'
                frame2.style.display = 'block'
                currentFrame--
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
            let cactusLeft = parseInt(window.getComputedStyle(cactus_sprite).getPropertyValue('left'))
        
            if(cactusLeft > 10 && cactusLeft < 90 && dinoBottom <= 70) {
                alert('game over')
            }
        }, 50)
    }
}

dino.walkAnimation()
dino.handleCollision()
handleKeyDown()

/* this.sprite.style.animationPlayState = 'paused' */

// se quando o cacto estiver proximo da posição left:0 o dinossauro estiver proximo da bottom:0
// ele morre (significa que o cacto está embaixo dele)