import { Scene } from 'phaser';
import { Constants } from '../constants';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;
    bird: Phaser.GameObjects.Sprite;
    pipes: Phaser.Physics.Arcade.Group;
    lowerPipe: Phaser.GameObjects.Sprite;
    upperPipe: Phaser.GameObjects.Sprite;
    totalDelta: number = 0;
    pipesHorizontalDistance: number = Constants.PIPES_HORIZONTAL_DISTANCE;
    spaceBar: Phaser.Input.Keyboard.Key | undefined;
    right: Phaser.Input.Keyboard.Key | undefined;
    left: Phaser.Input.Keyboard.Key | undefined;
    

    constructor () {
        super('Game');
    }

    create () {
        this.camera = this.cameras.main;
        this.setBackGround();
        this.setSprites();
        this.setPipes();
        this.setKeyboardValues();
        this.keybordInput();
        this.createColliders();
    }

    private createColliders() {
        this.physics.add.collider(this.bird, this.pipes, () => {
            this.scene.start('GameOver');
        });
    }

    private setKeyboardValues() {
        this.spaceBar = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.right = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.left = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    }

    private setBackGround() {
        this.camera.setBackgroundColor(0x00ff00);
        this.background = this.add.image(512, 384, 'background');
    }

    private setBirdFlap() {
        if(this.bird.body) {
            (this.bird.body as Phaser.Physics.Arcade.Body).velocity.y = Constants.FLAP_VELOCITY;
        }
    }

    private setSprites() {
        this.bird = this.physics.add.sprite(
            Constants.SCREEN_WIDTH * 0.1, 
            Constants.SCREEN_HEIGHT * 0.5, 
            'bird'
        ).setOrigin(0.5);        
        

        if (this.bird.body) {
            (this.bird.body as Phaser.Physics.Arcade.Body).gravity.y = Constants.BIRD_GRAVITY;
        }
    }

    setPipes() {
        this.pipes = this.physics.add.group();    
        for(let i = 0; i < Constants.PIPES_TO_RENDER; i++) {
            this.placePipe();
        }
    }

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
        this.pipes.setVelocityX(-170);
    }

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

    private getRightMostPipe() : number {
        let rightMostX = 0;
        this.pipes.getChildren().forEach((value: Phaser.GameObjects.GameObject) => {
            const pipe = value as Phaser.GameObjects.Sprite;
            rightMostX = Math.max(pipe.x, rightMostX);
        });
        return rightMostX;
    }

    update(time: number, delta: number): void {
        this.totalDelta += delta;        
        if(this.totalDelta < 1000) {
            return;
        }
        
        this.totalDelta = 0;
        this.recyclePipes();
        if(this.bird.y > Constants.SCREEN_HEIGHT || this.bird.y < 0) {
            this.scene.start('GameOver');
        }
    }    

    private keybordInput() {
        this.spaceBar?.on('down', () => {
            this.setBirdFlap();
        });
    }

    private get lowerPipeVerticalDistance() : number {
        return Constants.randomIntFromInterval(
            Constants.PIPE_VERTICAL_DISTANCE_RANGE[0], 
            Constants.PIPE_VERTICAL_DISTANCE_RANGE[1]
        );
    }
    
    private get upperPipeVerticalDistance() : number {
        return Constants.randomIntFromInterval(
            Constants.UPPER_PIPE_VERTICAL_DISTANCE_RANGE[0], 
            Constants.UPPER_PIPE_VERTICAL_DISTANCE_RANGE[1]
        );
    }

    private get pipesHorizontalDistanceSpawn() : number {
        return Constants.randomIntFromInterval(
            Constants.PIPES_HORIZONTAL_DISTANCE_RANGE[0], 
            Constants.PIPES_HORIZONTAL_DISTANCE_RANGE[1]
        );
    }
    
}
