import { Scene } from 'phaser';
import { Constants } from '../constants';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;
    bird: Phaser.GameObjects.Sprite;
    pipes: Phaser.Physics.Arcade.Group;
    lowerPipe: Phaser.GameObjects.Sprite;
    upperPipe: Phaser.GameObjects.Sprite;
    totalDelta: number = 0;
    score: number = 0;
    bestScore: number = 0;
    scoreText: Phaser.GameObjects.Text;
    bestScoreText: Phaser.GameObjects.Text;
    pipesVelocity: number = -170;
    pipesHorizontalDistance: number = Constants.PIPES_HORIZONTAL_DISTANCE;
    spaceBar: Phaser.Input.Keyboard.Key | undefined;
    right: Phaser.Input.Keyboard.Key | undefined;
    left: Phaser.Input.Keyboard.Key | undefined;
    

    constructor () {
        super('Game');
    }

    /**
     * When initializing the scene always will be called the init method
     * All the data that needs to be initialized before the scene starts should be placed here
     */
    init() {
        this.bestScore = localStorage.getItem('bestScore') ? parseInt(localStorage.getItem('bestScore') as string) : 0;
        this.score = 0;
        this.pipesVelocity = -170;
    }

    /**
     * This method is called once per game step while the scene is running.
     * @param time The current time. Either a High Resolution Timer value 
     * if it comes from Request Animation Frame, or Date.now if using SetTimeout.
     * @param delta The delta time in ms since the last frame. 
     * This is a smoothed and capped value based on the FPS rate. 
     */
    update(time: number, delta: number): void {
        // Check if the bird passed between pipes
        this.pipes.getChildren().forEach((pipe: Phaser.GameObjects.GameObject, index: number) => {
            const pipeSprite = pipe as Phaser.GameObjects.Sprite;
            if (pipeSprite.x < this.bird.x && !pipeSprite.getData('passed')) {
                pipeSprite.setData('passed', true);
                if(index % 2 === 0) {
                    this.updateScore();
                }

                if(index % 5 === 0) {
                    this.pipesVelocity -= 30;
                }
            }
        });

        this.totalDelta += delta;        
        if(this.totalDelta < 1000) {
            return;
        }

        this.totalDelta = 0;
        this.recyclePipes();
        if(this.bird.y > Constants.SCREEN_HEIGHT || this.bird.y < 0) {
            if(this.score > this.bestScore) {
                localStorage.setItem('bestScore', this.score.toString());
            }
            this.scene.start('GameOver');
        }
    }

    /**
     * Place preloaded objects into a game at the start of the game.
     */
    create () {
        this.camera = this.cameras.main;
        this.setBackGround();
        this.setSprites();
        this.setPipes();
        this.setKeyboardValues();
        this.keybordInput();
        this.createColliders();
        this.createScore();        
    }

    /**
     * Create the colliders for the game scene
     */
    private createColliders() {
        this.physics.add.collider(this.bird, this.pipes, () => {
            if(this.score > this.bestScore) {
                localStorage.setItem('bestScore', this.score.toString());
            }
            this.scene.start('GameOver');
        });
    }

    /**
     * Set the keyboard values that can be used to action
     */
    private setKeyboardValues() {
        this.spaceBar = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.right = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.left = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    }

    /**
     * Set the background image
     */
    private setBackGround() {
        this.camera.setBackgroundColor(0x00ff00);
        this.background = this.add.image(512, 384, 'background');
    }

    /**
     * Set the bird velocity to flap
     * Also set the bird animation
     */
    private setBirdFlap() {
        if(this.bird.body) {
            this.anims.create({
                key: 'fly',
                frames: this.anims.generateFrameNumbers('bird', { start: 9, end: 15}),
                // 24 fps default, it will play animation consisting of 24 frames in 1 second
                // in case of framerate 2 and sprite of 8 frames animations will play in
                // 4 sec; 8 / 2 = 4
                frameRate: 8,
                // repeat infinitely
                repeat: -1
              })
    
              this.bird.play('fly');
            (this.bird.body as Phaser.Physics.Arcade.Body).velocity.y = Constants.FLAP_VELOCITY;
        }
    }

    /**
     * Set the bird sprite
     */
    private setSprites() {
        this.bird = this.physics.add.sprite(
            Constants.SCREEN_WIDTH * 0.1, 
            Constants.SCREEN_HEIGHT * 0.5, 
            'bird'
        )
        .setFlipX(true)
        .setScale(2)        
        .setOrigin(0.5);
        // change the body size of the bird to be more accurate in the collision
        (this.bird as Phaser.Physics.Arcade.Sprite).setBodySize(this.bird.width, this.bird.height - 6);
        

        if (this.bird.body) {
            (this.bird.body as Phaser.Physics.Arcade.Body).gravity.y = Constants.BIRD_GRAVITY;
        }
    }

    /**
     * Set the first pipes to be rendered
     */
    private setPipes() {
        this.pipes = this.physics.add.group();    
        for(let i = 0; i < Constants.PIPES_TO_RENDER; i++) {
            this.placePipe();
        }
    }

    /**
     * Place the pipes in the scene
     */
    private placePipe() {
        let rightMostPositionx = this.getRightMostPipe();
        this.pipesHorizontalDistance = rightMostPositionx + this.pipesHorizontalDistanceSpawn;
        this.upperPipe = this.pipes.create(
            this.pipesHorizontalDistance, 
            this.upperPipeVerticalDistance,
            'pipe'
        ).setOrigin(0.5);

        this.lowerPipe = this.pipes.create(
            this.pipesHorizontalDistance, 
            this.upperPipe.y + this.lowerPipeVerticalDistance,
            'pipe'
        ).setOrigin(0.5);
        this.upperPipe.setZ(-10);
        this.lowerPipe.setZ(-10);
        // The velocity is set for the group of pipes
        this.pipes.setVelocityX(this.pipesVelocity);
    }

    /**
     * Recycle the pipes when they are out of the screen
     */
    private recyclePipes() {
        const tempPipes: Phaser.GameObjects.Sprite[] = [];
        this.pipes.getChildren().forEach((value: Phaser.GameObjects.GameObject) => {
            const pipe = value as Phaser.GameObjects.Sprite;
            if (pipe.getBounds().right <= 0) {
                tempPipes.push(pipe);
                if (tempPipes.length === 2) {
                    this.placePipe();
                }
            }
        });
    }

    /**
     * Get the right most pipe x position in the scene
     * @returns the right most pipe x position in the scene
     */
    private getRightMostPipe() : number {
        let rightMostX = 0;
        this.pipes.getChildren().forEach((value: Phaser.GameObjects.GameObject) => {
            const pipe = value as Phaser.GameObjects.Sprite;
            rightMostX = Math.max(pipe.x, rightMostX);
        });
        return rightMostX;
    }        

    /**
     * Set the bird flap when the space bar is pressed
     */
    private keybordInput() {
        this.spaceBar?.on('down', () => {
            this.setBirdFlap();
        });
    }

    /**
     * Get the lower pipe vertical distance
     * @returns the lower pipe vertical distance
     */
    private get lowerPipeVerticalDistance() : number {
        return Constants.randomIntFromInterval(
            Constants.PIPE_VERTICAL_DISTANCE_RANGE[0], 
            Constants.PIPE_VERTICAL_DISTANCE_RANGE[1]
        );
    }
    
    /**
     * Get the upper pipe vertical distance
     * @returns the upper pipe vertical distance
     */
    private get upperPipeVerticalDistance() : number {
        return Constants.randomIntFromInterval(
            Constants.UPPER_PIPE_VERTICAL_DISTANCE_RANGE[0], 
            Constants.UPPER_PIPE_VERTICAL_DISTANCE_RANGE[1]
        );
    }

    /**
     * Get the pipes horizontal distance spawn
     * @returns the pipes horizontal distance
     */
    private get pipesHorizontalDistanceSpawn() : number {
        return Constants.randomIntFromInterval(
            Constants.PIPES_HORIZONTAL_DISTANCE_RANGE[0], 
            Constants.PIPES_HORIZONTAL_DISTANCE_RANGE[1]
        );
    }
    
    /**
     * Create the score text
     */
    private createScore() {
        this.scoreText = this.add.text(10, 10, `Score: ${this.score}`, { fontSize: '32px', color: '#000' });
        this.scoreText.z = 10;
        this.bestScoreText = this.add.text(10, 35, `Best Score: ${this.bestScore}`, { fontSize: '18px', color: '#000' });
        this.bestScoreText.z = 10;
    }

    /**
     * Update the score text
     */
    private updateScore() {
        this.score ++;
        this.scoreText.setText(`Score: ${this.score}`);
    }
}
