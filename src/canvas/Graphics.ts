
export default class Graphics {


    public static drawRect(id: string, width: number, height: number, color: string): Promise<HTMLImageElement> {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d')!;
        context.fillStyle = color;
        context.fillRect(0, 0, width, height);

        const img = new Image();
        img.id = id;
        img.src = canvas.toDataURL("image/png");

        return new Promise(resolve => {
            img.addEventListener("load", () => { resolve(img); });
        });
    }

    public static drawCirc(id: string, radius: number, color: string): Promise<HTMLImageElement> {
        const canvas = document.createElement('canvas');
        canvas.width = radius;
        canvas.height = radius;
        const circle = new Path2D();
        circle.arc(radius * 0.5, radius * 0.5, radius * 0.5, 0, 2 * Math.PI, false);
        const context = canvas.getContext('2d')!;
        context.fillStyle = color;
        context.fill(circle);

        const img = new Image();
        img.id = id;
        img.src = canvas.toDataURL("image/png");

        return new Promise(resolve => {
            img.addEventListener("load", () => { resolve(img); });
        });
    }


}
