export interface IParticle {
    x: number;
    y: number;
    alpha: number;
    scaleX: number;
    scaleY: number;
}

type ParticleData<T> = {
    configUpdated: boolean,
    delay: number,
    duration: number,
    particle: IParticle;
    config: T;
};

export default abstract class BaseParticles<T> {

    protected particleDataArr: ParticleData<T>[] = [];
    protected loop: boolean = true;
    //protected visible = false;
    protected time: number = 0;
    protected delay: number = 0;
    protected cb: Function | undefined | null;
    constructor(protected totalParticles: number, protected createFunc: (index: number) => IParticle, params: { onComplete?: () => void; additive?: boolean; }) {
        this.cb = params.onComplete;
        if (params.additive) {
            //this.blendMode = PIXI.BLEND_MODES.ADD;
        }
    }

    public init(): void {
        //this.visible = false;
        this.time = 0;
        this.delay = 0;

        this.createParticles(this.totalParticles);
    }

    public startAnimation(): void {
        //PIXI.ticker.shared.remove(this.onUpdate, this);
        //this.visible = true;
        this.time = 0;
        this.delay = 0;
        if (this.particleDataArr.length > 0) {
            this.resetParticles();
            //PIXI.ticker.shared.add(this.onUpdate, this);
        }
    }

    public stopEmitter(): void {
        this.loop = true;
    }

    public stopAnimation(): void {
        //PIXI.ticker.shared.remove(this.onUpdate, this);
        //this.visible = false;
        if (this.particleDataArr.length > 0) {
            this.resetParticles();
        }
    }

    public resetParticles(): void {
        this.particleDataArr.forEach((particleData, i) => {
            particleData.configUpdated = false;
            particleData.delay = this.getDelay(),
                particleData.duration = this.getDuration();
            if (particleData.particle) {
                particleData.particle.alpha = 0;
                particleData.particle.x = 0;
                particleData.particle.y = 0;
            }
        });
    }

    public update(dt: number): void {
        const time = this.time;
        let count = 0;
        this.particleDataArr.forEach(item => {
            if (item.duration === 0) {
                count++;
                return;
            }

            const t = (time - item.delay) / item.duration;

            if (t >= 0 && t <= 1) {
                item.particle.alpha = 1;
                if (!item.configUpdated) {
                    item.configUpdated = true;
                    this.updateConfig(item.config);
                }

                this.onUpdateParticle(item.particle, item.config, t);
            } else {
                item.configUpdated = false;
                item.particle.alpha = 0;
            }

            if (time >= item.delay + item.duration) {
                if (this.loop) {
                    item.duration = this.getDuration();
                    item.delay = this.getDelay();
                } else {
                    count++;
                    item.duration = 0;
                    item.particle.alpha = 0;
                }
            }
        });

        this.delay = 0;
        this.time += dt;
        ;

        if (count >= this.particleDataArr.length) {
            //this.visible = false;
            //PIXI.ticker.shared.remove(this.onUpdate, this);
            this.onComplete();
        }
    }

    public getDuration(): number {
        return 1;
    }

    public getDelay(): number {
        return this.time;
    }

    private onComplete(): void {
        if (this.cb) {
            this.cb();
        }
    }

    protected createParticles(totalParticles: number) {
        for (let i = 0; i < totalParticles; i++) {
            const particle = this.createParticle(i);
            if (particle) {
                particle.alpha = 0;
                this.particleDataArr.push({
                    particle: particle,
                    configUpdated: false,
                    delay: 0,
                    duration: 0,
                    config: <T>{}
                });
            }
        }
    }

    protected createParticle(index: number): IParticle | null {
        return this.createFunc ? this.createFunc(index) : null;
    }

    abstract updateConfig(config: T): void;

    abstract onUpdateParticle(particle: IParticle, config: T, t: number): void;

    public kill() {
        //PIXI.ticker.shared.remove(this.onUpdate, this);
        this.particleDataArr.length = 0;
        this.cb = null;
    }
}
