
export default class Graphycs {


    public static drawRect(id: string, width: number, height: number, color: string): Promise<HTMLImageElement> {
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        let context = canvas.getContext('2d');
        context.fillStyle = color;
        context.fillRect(0, 0, width, height);

        let img = new Image();
        img.id = id;
        img.src = canvas.toDataURL("image/png");

        return new Promise(resolve => {
            img.addEventListener("load", () => { resolve(img) });
        });
    }


}
