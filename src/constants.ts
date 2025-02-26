export abstract class Constants {
    static readonly SCREEN_WIDTH: number = 800;
    static readonly SCREEN_HEIGHT: number = 600;
    static readonly VELOCITY: number = 600;
    static readonly FLAP_VELOCITY: number = -150;
    static readonly BIRD_GRAVITY: number = 300;
    static readonly PIPES_TO_RENDER: number = 10;
    static readonly PIPES_HORIZONTAL_DISTANCE: number = 0;
    static readonly PIPES_HORIZONTAL_DISTANCE_RANGE: number[] = [400, 600];
    static readonly PIPE_VERTICAL_DISTANCE_RANGE: number[] = [550, 620];
    static readonly UPPER_PIPE_VERTICAL_DISTANCE_RANGE: number[] = [-100, 100];
    static randomIntFromInterval(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
  