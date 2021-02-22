
import { Sprite, Renderer, Node } from "dizzy-canvas";
import DizzyParticles from "../particles/Particles";
import Graphics from "./Graphics";

export default class ParticlesRenderer extends Node {

    private particles: DizzyParticles | null = null;
    private container: Sprite = new Sprite();

    constructor(renderer: Renderer) {
        super("particles");
        renderer.stage.addChild(this.container);
    }

    private createParticle() {
        const sprite: Sprite = new Sprite();
        Graphics.drawCirc("particle", 6, "#ffff00").then((img: HTMLImageElement) => {
            sprite.setTexture(img);
            sprite.setAnchor(0.5);
        });
        this.container.addChild(sprite);
        return sprite;
    }

    public update(dt: number) {
        if (this.particles) {
            this.particles.update(dt / 1000);
        }
    }

    public updateConfig(conf: any) {
        console.log(conf);
        if (!this.particles) {
            this.particles = new DizzyParticles(conf, this.createParticle.bind(this), () => { });
            this.particles.startAnimation();
        }
        else { //TODO add clean init
            this.particles.setData(conf);
            this.particles.stopAnimation();
            this.particles.startAnimation();
        }
    }

    public setPosEnd(x: number, y: number) {
        if (this.particles) {
            this.particles.setPosEnd(x, y);
        }
    }

    public updateGlobalTransform(poke: boolean): boolean {
        let poked = super.updateGlobalTransform(poke);
        this.container.x = this.transform.global.x;
        this.container.y = this.transform.global.y;
        this.container.scaleX = this.transform.global.scaleX;
        this.container.scaleY = this.transform.global.scaleY;

        return poked;
    }

}
