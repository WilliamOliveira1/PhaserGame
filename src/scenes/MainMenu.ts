import { Scene, GameObjects } from 'phaser';
import { Constants } from '../constants';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;

    constructor () {
        super('MainMenu');
    }

    create () {
        this.background = this.add.image(512, 384, 'background');
        this.logo = this.add.image(Constants.SCREEN_WIDTH * 0.5, Constants.SCREEN_HEIGHT * 0.5, 'logo');
        this.title = this.add.text(Constants.SCREEN_WIDTH * 0.5, Constants.SCREEN_HEIGHT * 0.7, 'Flappy Bird Clone', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}
