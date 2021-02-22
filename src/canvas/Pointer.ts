
import { Sprite, Renderer, Node, Point, Rect } from "dizzy-canvas";
import Graphics from "./Graphics";

export default class Pointer extends Node {

    private sprite: Sprite;
    private pointerWidth: number = 20;
    private pointerHeight: number = 20;

    constructor(renderer: Renderer) {
        super("pointer");
        this.sprite = new Sprite();
        this.sprite.setAnchor(0.5);
        Graphics.drawRect("pointer", this.pointerWidth, this.pointerHeight, "#ffffff").then((img: HTMLImageElement) => {
            this.sprite.setTexture(img);
        });
        renderer.stage.addChild(this.sprite);
    }

    public checkPointerOver(x: number, y: number): boolean {
        return this.checkPointInRect({ x: x, y: y }, this.sprite.getBounds()!);
    }

    private checkPointInRect(p1: Point, rect: Rect): boolean {
        return p1.x >= rect.x && p1.x <= rect.x + rect.width && p1.y >= rect.y && p1.y <= rect.y + rect.height;
    }

    public updateGlobalTransform(poke: boolean): boolean {
        let poked = super.updateGlobalTransform(poke);
        this.sprite.x = this.transform.global.x;
        this.sprite.y = this.transform.global.y;
        this.sprite.scaleX = this.transform.global.scaleX;
        this.sprite.scaleY = this.transform.global.scaleY;
        return poked;
    }


}
