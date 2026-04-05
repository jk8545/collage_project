import { BrowserMultiFormatReader } from '@zxing/browser';

export async function readBarcodeFromFile(file: File): Promise<string | null> {
    try {
        const objectUrl = URL.createObjectURL(file);
        
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                // Yield to main thread so React UI can render "Analyzing..." loader
                setTimeout(async () => {
                    try {
                        const codeReader = new BrowserMultiFormatReader();
                        
                        // Enforce a strict 3-second timeout on barcode extraction
                        const timeoutPromise = new Promise<null>((res) => setTimeout(() => res(null), 3000));
                        const decodePromise = codeReader.decodeFromImageElement(img)
                            .then(res => res.getText())
                            .catch(() => null);
                            
                        const result = await Promise.race([decodePromise, timeoutPromise]);
                        
                        URL.revokeObjectURL(objectUrl);
                        resolve(result);
                    } catch (e) {
                        URL.revokeObjectURL(objectUrl);
                        resolve(null);
                    }
                }, 100);
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
