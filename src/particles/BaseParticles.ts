
export default class BaseParticles {

    protected totalParticles;
    protected createFunc
    protected cb;
    protected particleDataArr = [];
    protected loop = true;
    protected visible = false;
    protected time = 0;
    protected delay = 0;

    constructor(totalParticles, createFunc, params, cb) {
        this.totalParticles = totalParticles;
        this.createFunc = createFunc;
        this.cb = cb;

        if (params.additive) {
            //this.blendMode = PIXI.BLEND_MODES.ADD;
        }
    }

    public init() {
        this.visible = false;
        this.time = 0;
        this.delay = 0;

        this.createParticles(this.totalParticles);
    }

    public startAnimation() {
        //PIXI.ticker.shared.remove(this.onUpdate, this);
        this.visible = true;
        this.time = 0;
        this.delay = 0;
        if (this.particleDataArr.length > 0) {
            this.resetParticles();
            //PIXI.ticker.shared.add(this.onUpdate, this);
        }
    }

    public stopEmitter() {
        this.loop = true;
    }

    public stopAnimation() {
        //PIXI.ticker.shared.remove(this.onUpdate, this);
        this.visible = false;
        if (this.particleDataArr.length > 0) {
            this.resetParticles();
        }
    }

    public resetParticles() {
        this.particleDataArr.forEach((particleData, i) => {
            particleData.configUpdated = false;
            particleData.delay = this.getDelay(),
                particleData.duration = this.getDuration()
            if (particleData.particle) {
                particleData.particle.alpha = 0;
                particleData.particle.x = 0;
                particleData.particle.y = 0;
            }
        });
    }

    public update(dt) {

        let count = 0;
        let time = this.time;
        this.particleDataArr.forEach(item => {
            if (item.duration === 0) {
                count++;
                return;
            }

            let t = (time - item.delay) / item.duration;
            if (t >= 0 && t <= 1) {
                item.particle.alpha = 1;
                if (!item.configUpdated) {
                    item.configUpdated = true;
                    this.updateConfig(item.config)
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

        if (count >= this.particleDataArr.length) {
            this.visible = false;
            //PIXI.ticker.shared.remove(this.onUpdate, this);
            this.onComplete();
        }
    }

    public getDuration() {
        return 1;
    }

    public getDelay() {
        return this.time;
    }

    private onComplete() {
        if (this.cb) {
            //this.cb();
        }
    }

    protected createParticles(totalParticles) {
        for (let i = 0; i < totalParticles; i++) {
            let particle = this.createParticle(i);
            if (particle) {
                particle.alpha = 0;
                this.particleDataArr.push({
                    particle: particle,
                    configUpdated: false,
                    config: {},
                    delay: null,
                    duration: null
                });
            }
        }
    }

    protected createParticle(index) {
        return this.createFunc ? this.createFunc(index) : null;
    }

    public updateConfig(obj) {

    }

    protected onUpdateParticle(particle, config, t) {

    }

    public kill() {
        //PIXI.ticker.shared.remove(this.onUpdate, this);
        this.particleDataArr.length = 0;
        this.cb = null;
    }
}
