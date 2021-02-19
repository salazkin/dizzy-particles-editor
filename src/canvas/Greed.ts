
import { Sprite, Renderer, Node } from "dizzy-canvas";
import Graphics from "./Graphics";

export default class Greed extends Node {

    private container: Sprite = new Sprite();
    private horizontal: Sprite = new Sprite();
    private vertical: Sprite = new Sprite();

    constructor(renderer: Renderer) {
        super("greed");

        renderer.stage.addChild(this.container);
        this.container.alpha = 1;
        this.container.addChild(this.horizontal);
        this.container.addChild(this.vertical);


        Graphics.drawRect("line", 10, 1, "#333").then((img: HTMLImageElement) => {
            this.horizontal.setTexture(img);
            this.horizontal.setAnchor(0.5, 1);
            this.horizontal.width = window.innerWidth;

            this.vertical.setTexture(img);
            this.vertical.setAnchor(0.5, 1);
            this.vertical.rotation = 90;
            this.vertical.width = window.innerHeight;
        });
    }

    public updateGlobalTransform(poke: boolean): boolean {
        let poked = super.updateGlobalTransform(poke);

        this.vertical.x = Math.ceil(this.transform.global.x);
        this.vertical.y = Math.ceil(window.innerHeight * 0.5);

        this.horizontal.y = Math.ceil(this.transform.global.y);
        this.horizontal.x = Math.ceil(window.innerWidth * 0.5);
        return poked;
    }

    public resize() {
        this.vertical.y = Math.ceil(window.innerHeight * 0.5);
        this.vertical.width = Math.ceil(window.innerHeight);
        this.horizontal.x = Math.ceil(window.innerWidth * 0.5);
        this.horizontal.width = Math.ceil(window.innerWidth);
    }


}
