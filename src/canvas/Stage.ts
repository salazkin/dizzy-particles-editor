import { Renderer, Timer, Node } from "dizzy-canvas";
import Pointer from "./Pointer";
import Greed from "./Greed";

export default class Stage {

    private stage: Node;
    private root: Node;

    private pointer: Pointer;
    private dragPointer = false;
    private dragCanvas = false;

    private greed: Greed;
    private renderer: Renderer;
    private timer: Timer;

    constructor(private canvas: HTMLCanvasElement) {
        this.renderer = new Renderer(canvas);

        this.stage = new Node("stage");
        this.root = this.stage.addChild(new Node("root"));

        this.timer = new Timer(this.onEnterFrame.bind(this));

        this.pointer = new Pointer(this.renderer);
        this.root.addChild(this.pointer);

        this.greed = new Greed(this.renderer)
        this.root.addChild(this.greed);

        document.addEventListener("mousedown", this.onMouseDown.bind(this));
        document.addEventListener("mousemove", this.onMouseMove.bind(this));
        document.addEventListener("mouseup", this.onMouseUp.bind(this));
        document.addEventListener("mouseupoutside", this.onMouseUp.bind(this));
        document.addEventListener("wheel", this.onWheel.bind(this));
        window.addEventListener("resize", this.onResize.bind(this));

        this.resetStagePosition();

        this.timer.start();
    }


    private onResize(e): void {
        this.greed.resize();
        this.renderer.resize(window.innerWidth, window.innerHeight);
    }

    private onWheel(e: WheelEvent): void {
        if (this.dragPointer) {
            this.zoomStage(this.pointer.transform.global.x, this.pointer.transform.global.y, e.deltaY / 1000);
        } else {
            this.zoomStage(e.clientX, e.clientY, e.deltaY / 1000);
        }
    }

    private onMouseMove(e: MouseEvent): void {
        if (this.dragPointer) {
            this.globalTranslate(this.pointer, e.movementX, e.movementY);
            //this.particles.setPosEnd(this.pointer.x, this.pointer.y);
        }
        if (this.dragCanvas) {
            this.dragStage(e.movementX, e.movementY);
        }
    }

    private onMouseDown(e: MouseEvent): void {
        if (e.button === 0) {
            if (this.pointer.checkPointerOver(e.clientX, e.clientY)) {
                this.dragPointer = true;
            }
        }

        if (e.button === 1) {
            this.resetStagePosition();
        }

        if (e.button === 2) {
            this.dragCanvas = true;
        }
    }

    private resetStagePosition(): void {
        this.resetStage();
        this.dragStage((window.innerWidth + 300) * 0.5, window.innerHeight * 0.5);
        this.resetPointer();
    }

    private resetPointer(): void {
        this.pointer.x = 0;
        this.pointer.y = -200;

    }
    private onMouseUp(e: MouseEvent): void {
        this.dragPointer = false;
        this.dragCanvas = false;
    }


    public zoomStage(pointerX: number, pointerY: number, zoomStep: number): void {
        let offsetX = (pointerX - this.stage.x) / this.stage.scaleX;
        let offsetY = (pointerY - this.stage.y) / this.stage.scaleY;

        let scale = this.stage.scaleX - zoomStep;

        if (scale > 0.1) {
            this.stage.scaleX = this.stage.scaleY = scale;
            this.stage.x += offsetX * zoomStep;
            this.stage.y += offsetY * zoomStep;
        }
    }

    public resetStage(): void {
        this.stage.scaleX = this.stage.scaleY = 1;
        this.stage.x = 0;
        this.stage.y = 0;
    }


    public dragStage(dx: number, dy: number): void {
        this.stage.x += dx;
        this.stage.y += dy;
    }

    public globalTranslate(target: Node, dx: number, dy: number): void {
        let ang = -target.parent.transform.global.rotation;
        let cos = Math.cos(ang);
        let sin = Math.sin(ang)

        let a = dx * cos - dy * sin;
        let b = dx * sin + dy * cos;

        target.x += a / target.parent.transform.global.scaleX;
        target.y += b / target.parent.transform.global.scaleY;
    }

    public onEnterFrame(): void {
        this.updateGlobalTransform(this.stage);
        this.renderer.present();
    }

    private updateGlobalTransform(node: Node, poke?: boolean): void {
        poke = poke || !node.transform.globalTransformUpdated;
        node.updateGlobalTransform(poke);
        for (let i = 0; i < node.children.length; i++) {
            this.updateGlobalTransform(node.children[i], poke);
        }
    }
}
