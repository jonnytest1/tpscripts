/// <reference path="./customSlider.js" />


interface RotationTypeOptions {
    startPercent?: number,
}
interface TimedRotationTypeOptions extends RotationTypeOptions {
    onFinished(): void;
    duration: number
}


interface RotationTypeAttributes {
    rotator: any
}