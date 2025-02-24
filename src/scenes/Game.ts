import { Scene } from 'phaser';
import { Constants } from '../constants';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;
    bird: Phaser.GameObjects.Sprite;
    totalDelta: number = 0;
    spaceBar: Phaser.Input.Keyboard.Key | undefined;
    right: Phaser.Input.Keyboard.Key | undefined;
    left: Phaser.Input.Keyboard.Key | undefined;
    

    constructor () {
        super('Game');        
    }

    create () {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);
        this.bird = this.physics.add.sprite(Constants.SCREEN_WIDTH * 0.1, Constants.SCREEN_HEIGHT * 0.5, 'bird').setOrigin(0.5);
        this.spaceBar = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.right = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.left = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keybordInput();
        // this.input.once('pointerdown', () => {
        //     this.scene.start('GameOver');
        // });
    }

    private setBirdJump() {
        console.log('jump');
        if(this.bird.body) {
            (this.bird.body as Phaser.Physics.Arcade.Body).velocity.y = -100;
        }
    }

    update(time: number, delta: number): void {
        this.totalDelta += delta;
        
        if(this.totalDelta < 1000) {
            return;
        }
        console.log(this.bird.body?.velocity.y);
        this.totalDelta = 0;
        if(this.bird.y > Constants.SCREEN_HEIGHT || this.bird.y < 0) {
            this.scene.start('GameOver');
        }
    }

    private keybordInput() {
        this.spaceBar?.on('down', () => {
            this.setBirdJump();
        });

        this.right?.on('down', () => {
            if(this.bird.body) {
                (this.bird.body as Phaser.Physics.Arcade.Body).velocity.x = 100;
            }
        });

        this.right?.on('up', () => {
            if(this.bird.body) {
                (this.bird.body as Phaser.Physics.Arcade.Body).velocity.x = 0;
            }
        });

        this.left?.on('down', () => {
            if(this.bird.body) {
                (this.bird.body as Phaser.Physics.Arcade.Body).velocity.x = -100;  
            }
        });

        this.left?.on('up', () => {
            if(this.bird.body) {
                (this.bird.body as Phaser.Physics.Arcade.Body).velocity.x = 0;  
            }
        });
    }
}
