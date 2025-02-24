import { Scene } from 'phaser';
import { Constants } from '../constants';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;

    constructor () {
        super('Game');
    }

    create () {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);
        this.add.sprite(Constants.screenWidth * 0.1, Constants.screenHeight * 0.5, 'bird');
        this.msg_text.setOrigin(0.5);

        // this.input.once('pointerdown', () => {
        //     this.scene.start('GameOver');
        // });
    }
}
