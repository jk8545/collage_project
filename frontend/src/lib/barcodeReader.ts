import { BrowserMultiFormatReader } from '@zxing/browser';

export async function readBarcodeFromFile(file: File): Promise<string | null> {
    try {
        const objectUrl = URL.createObjectURL(file);
        
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = async () => {
                try {
                    const codeReader = new BrowserMultiFormatReader();
                    const result = await codeReader.decodeFromImageElement(img);
                    URL.revokeObjectURL(objectUrl);
                    resolve(result.getText());
                } catch (e) {
                    URL.revokeObjectURL(objectUrl);
                    resolve(null);
                }
            };
            img.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                resolve(null);
            };
            img.src = objectUrl;
        });
    } catch (e) {
        return null;
    }
}
