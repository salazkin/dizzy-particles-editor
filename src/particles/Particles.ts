import BaseParticles from "./BaseParticles";

export default class Particles extends BaseParticles {

    private config;
    private posStart = { x: 0, y: 0 };
    private posEnd = { x: 0, y: 0 };
    private curveLen = 20;
    private curveSeg = 1 / (this.curveLen - 1);

    private correctedTintArr;

    constructor(config, createFunc, cb) {
        super(config.particles, createFunc, { additive: config.additive }, cb);
        this.config = config;
        console.log(config)

        super.init();
    }

    set posStartX(value) {
        this.posStart.x = value;
    }

    set posStartY(value) {
        this.posStart.y = value;
    }

    set posEndX(value) {
        this.posEnd.x = value;
    }

    set posEndY(value) {
        this.posEnd.y = value;
    }

    setPosStart(x, y) {
        this.posStart.x = x;
        this.posStart.y = y;
    }

    setPosEnd(x, y) {
        this.posEnd.x = x;
        this.posEnd.y = y;
    }

    /*public updateConfig(config) {
        this.correctedTintArr = null;
        this.config = config;
    }*/

    startAnimation(posStart?, posEnd?) {
        if (posStart) {
            this.setPosStart(posStart.x, posStart.y);
        }
        if (posEnd) {
            this.setPosEnd(posEnd.x, posEnd.y);
        }
        this.loop = this.getValue("loop");
        super.startAnimation();
    }

    getDuration() {
        return this.getValue("duration");
    }

    getDelay() {
        this.delay += this.getValue("delay");
        return this.time + this.delay;
    }

    updateConfig(obj) {
        let startX = this.posStart.x + this.getValue("posStartOffsetX");
        let startY = this.posStart.y + this.getValue("posStartOffsetY");
        let endX = this.posEnd.x + this.getValue("posEndOffsetX");
        let endY = this.posEnd.y + this.getValue("posEndOffsetY");

        obj.posStart = { x: startX, y: startY }
        obj.posEnd = { x: endX, y: endY }
        obj.cp1 = null;
        obj.cp2 = null;

        let cp1Mag = this.getValue("posControlPoint1Mag");
        let cp2Mag = this.getValue("posControlPoint2Mag");

        if (cp1Mag !== 0 || cp2Mag !== 0) {
            let dx = endX - startX;
            let dy = endY - startY
            let ang = Math.atan2(dx, dy);
            let angle1 = ang + Utils.degreeToRadians(this.getValue("posControlPoint1Angle"));
            let angle2 = -(Math.PI - ang) + Utils.degreeToRadians(this.getValue("posControlPoint2Angle"));

            let dist = Math.sqrt(dx * dx + dy * dy);

            obj.cp1 = { x: startX + Math.sin(angle1) * dist * cp1Mag, y: startY + Math.cos(angle1) * dist * cp1Mag };
            obj.cp2 = { x: endX + Math.sin(angle2) * dist * cp2Mag, y: endY + Math.cos(angle2) * dist * cp2Mag };
            if (obj.curve) {
                obj.curve.length = 0;
            } else {
                obj.curve = [];
            }
        }

        obj.alphaFrom = this.getValue("alphaFrom");
        obj.alphaTo = this.getValue("alphaTo");
        obj.alphaYoYo = this.getValue("alphaYoYo");

        if (this.config.tint) {
            if (this.config.tintInterpolate && Array.isArray(this.config.tint) && this.config.tint.length > 1) {
                if (!this.correctedTintArr) {
                    this.correctedTintArr = Utils.getInterpolatedColors(this.config.tint, 5);
                }
                obj.tint = this.correctedTintArr;
            } else {
                obj.tint = this.getValue("tint");
            }
        }

        obj.scaleFrom = this.getValue("scaleFrom");
        obj.scaleTo = this.getValue("scaleTo");
        obj.scaleYoYo = this.getValue("scaleYoYo");
        obj.rotationSpeed = Utils.degreeToRadians(this.getValue("rotationSpeed"));
    }

    sum(...arr) {
        return arr.map(key => this.getValue(key)).reduce((accumulator, currentValue) => accumulator + currentValue);
    }

    getValue(key) {
        if (Array.isArray(this.config[key])) {
            let arr = this.config[key];
            let index = arr.length > 1 ? Math.floor(Math.random() * arr.length) : 0;
            if (Array.isArray(arr[index])) {
                let min = arr[index][0];
                let max = arr[index][1];
                return Math.random() * (max - min) + min;
            } else {
                return arr[index];
            }
        } else {
            return this.config[key] || 0;
        }
    }

    onUpdateParticle(particle, config, t) {
        let yoyoTime = t * (1 - t) * 2;

        particle.alpha = config.alphaFrom + (config.alphaTo - config.alphaFrom) * (config.alphaYoYo ? yoyoTime : t);
        particle.scale = Utils.interpolate(config.scaleYoYo ? yoyoTime : t, config.scaleFrom, config.scaleTo);

        if (config.curve) {
            const from = Math.floor(t / this.curveSeg);
            const to = from + 1;

            if (config.curve[from] === undefined) {
                config.curve[from] = from === 0 ? config.posStart : {}
            }

            if (config.curve[to] === undefined) {
                config.curve[to] = to === this.curveLen - 1 ? config.posEnd : {}
            }

            if (from !== 0) {
                Utils.setPositionOnCurve(config.curve[from], from * this.curveSeg, config.posStart, config.posEnd, config.cp1, config.cp2);
            }

            if (to !== this.curveLen - 1) {
                Utils.setPositionOnCurve(config.curve[to], to * this.curveSeg, config.posStart, config.posEnd, config.cp1, config.cp2);
            }

            Utils.setPositionOnLine(particle, (t % this.curveSeg) / this.curveSeg, config.curve[from], config.curve[to]);
        } else {
            Utils.setPositionOnLine(particle, t, config.posStart, config.posEnd);
 
        }

        if (config.rotationSpeed !== 0) {
            particle.rotation += config.rotationSpeed;
        } else {
            particle.rotation = 0;
        }

        if (config.tint) {
            if (Array.isArray(config.tint)) {
                let seg = 1 / (config.tint.length - 1);
                particle.tint = config.tint[Math.floor(t / seg)]
            } else {
                particle.tint = config.tint;
            }
        }
    }
}




const Utils = {
    getRotationOnCurve(t, p1, p2, cp1, cp2) {
        const t2 = t * t;
        const dx = 3 * Math.pow(1 - t, 2) * (cp1.x - p1.x) + 6 * (1 - t) * t * (cp2.x - cp1.x) + 3 * t2 * (p1.y - cp2.x);
        const dy = 3 * Math.pow(1 - t, 2) * (cp1.y - p1.y) + 6 * (1 - t) * t * (cp2.y - cp1.y) + 3 * t2 * (p2.y - cp2.y);
        return Math.atan2(dx, dy);
    },

    hexToRgb(color) {
        let arr = [];
        for (let i = 2; i >= 0; i--) {
            let c = color.substring(color.length - i * 2 - 2, color.length - i * 2);
            arr.push(parseInt(c, 16))
        }
        return arr;
    },

    rgbToHex(arr, prefix) {
        return prefix + arr.map(v => this.hexValue(v)).join("");
    },
    //export_skip
    getInterpolatedColors(hexArr, steps) {
        let arr = hexArr.map(hex => this.hexToHsl(hex));
        let out = [];
        let step = 1 / steps;
        for (let i = 0; i < steps + 1; i++) {
            let t = Math.min(step * i, 1);
            let seg = 1 / (arr.length - 1);
            let index = Math.min(Math.floor(t / seg), arr.length - 2);
            let c1 = arr[index];
            let c2 = arr[index + 1];
            out.push(this.hslToHex(c1.map((c, i) => this.interpolate(t, c, c2[i], i === 0))));
        }
        return out;
    },

    interpolate(t, v1, v2, minDist?) {
        if (!minDist) {
            return v1 + (v2 - v1) * t;
        }
        const a = Math.min(v1, v2);
        const b = Math.max(v1, v2);
        const dist1 = b - a;
        const dist2 = 1 - b + a
        if (dist1 < dist2) {
            return a + dist1 * t;
        } else {
            return (b + dist2 * t) % 1;
        }
    },

    hexToHsl(hex) {
        let r = parseInt(hex.substring(hex.length - 6, hex.length - 4), 16) / 255;
        let g = parseInt(hex.substring(hex.length - 4, hex.length - 2), 16) / 255;
        let b = parseInt(hex.substring(hex.length - 2, hex.length), 16) / 255;
        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let l = (max + min) / 2;
        let s = 0;
        let h = 0;
        if (max !== min) {
            let d = max - min;
            s = l < 0.5 ? d / (max + min) : d / (2 - max - min);
            if (r == max) {
                h = (g - b) / d + (g < b ? 6 : 0);
            } else if (g == max) {
                h = 2 + (b - r) / d;
            } else {
                h = 4 + (r - g) / d;
            }
        }
        h /= 6;
        return [h, s, l]; //[0,1] range
    },

    hslToHex(arr) {
        let h = arr[0];
        let s = arr[1];
        let l = arr[2];
        let r, g, b;
        if (s == 0) {
            r = g = b = l;
        } else {
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;

            r = Math.round(this.hueToRgb(h + 1 / 3, p, q) * 255);
            g = Math.round(this.hueToRgb(h, p, q) * 255);
            b = Math.round(this.hueToRgb(h - 1 / 3, p, q) * 255);
        }
        return "0x" + this.hexValue(r) + this.hexValue(g) + this.hexValue(b);
    },

    hueToRgb(t, p, q) {
        if (t < 0) {
            t += 1;
        }
        if (t > 1) {
            t -= 1;
        }
        if (t < 1 / 6) {
            return p + (q - p) * 6 * t;
        }
        if (t < 1 / 2) {
            return q
        }
        if (t < 2 / 3) {
            return p + (q - p) * (2 / 3 - t) * 6;
        }
        return p;
    },

    hexValue(v) {
        return ("0" + v.toString(16)).slice(-2);
    },

    degreeToRadians(degrees) {
        return degrees * Math.PI / 180;
    },

    radiansToDegree(radians) {
        return radians * 180 / Math.PI;
    },

    setPositionOnLine(target, t, p0, p1) {
        target.x = p0.x + (p1.x - p0.x) * t;
        target.y = p0.y + (p1.y - p0.y) * t;
    },

    setPositionOnCurve(target, t, p1, p2, cp1, cp2) {
        const t2 = t * t;
        const t3 = t * t * t;
        target.x = Math.pow(1 - t, 3) * p1.x + 3 * Math.pow(1 - t, 2) * t * cp1.x + 3 * (1 - t) * t2 * cp2.x + t3 * p2.x;
        target.y = Math.pow(1 - t, 3) * p1.y + 3 * Math.pow(1 - t, 2) * t * cp1.y + 3 * (1 - t) * t2 * cp2.y + t3 * p2.y;
    }

}

