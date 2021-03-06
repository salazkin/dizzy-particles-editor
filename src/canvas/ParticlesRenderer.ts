
import { Sprite, Renderer, Node, Timer } from "dizzy-canvas";
import { Particles } from "dizzy-particles";
import Graphics from "./Graphics";

export default class ParticlesRenderer extends Node {

    private sprites: Sprite[] = [];
    private particles: Particles | null = null;
    private container: Sprite = new Sprite();
    private timer: Timer;

    constructor(renderer: Renderer) {
        super("particles");
        renderer.stage.addChild(this.container);
        this.timer = new Timer(this.onDrawParticles.bind(this));
        this.timer.start();
    }

    private getParticle(index: number) {
        if (this.sprites[index] === undefined) {
            let sprite: Sprite = new Sprite();
            Graphics.drawCirc("particle", 6, "#ffffff").then((img: HTMLImageElement) => {
                sprite.setTexture(img);
                sprite.setAnchor(0.5);
            });
            this.container.addChild(sprite);
            this.sprites[index] = sprite;
        }
        return this.sprites[index];
    }

    private onDrawParticles(dt: number): void {
        if (!this.particles) {
            return;
        }
        this.particles.update(dt / 1000);
        this.particles.particles.forEach((particleData, i) => {
            const particle = this.getParticle(i);
            particle.x = particleData.result.x;
            particle.y = particleData.result.y;
            particle.alpha = particleData.result.alpha;
            particle.scaleX = particleData.result.scaleX;
            particle.scaleY = particleData.result.scaleY;
            particle.setTint(particleData.result.tint, 1);
        });
    }

    public updateConfig(conf: any) {
        console.log(conf);
        if (!this.particles) {
            this.particles = new Particles(50, true, conf, () => {
                console.log("on complete!");
            });
        }
        else { //TODO add clean init
            this.particles.setData(conf);
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
