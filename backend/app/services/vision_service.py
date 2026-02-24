import cv2
import numpy as np
import urllib.request
import certifi
import base64
from typing import Tuple

def process_image(image_url: str) -> Tuple[float, str]:
    """
    Downloads the image, converts to grayscale, applies adaptive thresholding,
    and returns the blur variance (confidence score) along with the base64 string.
    """
    try:
        req = urllib.request.urlopen(urllib.request.Request(image_url, headers={'User-Agent': 'Mozilla/5.0'}), cafile=certifi.where())
        arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
        image = cv2.imdecode(arr, -1)
        if image is None:
            raise ValueError("Could not decode image from URL.")
        
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        blur_variance = cv2.Laplacian(gray, cv2.CV_64F).var()
        
        # Adaptive Thresholding for better OCR
        processed = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )
        
        _, buffer = cv2.imencode('.jpg', processed)
        base64_image = base64.b64encode(buffer).decode('utf-8')
        
        if blur_variance < 50.0:
            raise ValueError("Image is too blurry. Please upload a clear image.")
            
        confidence = min(1.0, blur_variance / 500.0)
        return round(confidence, 2), base64_image
    except Exception as e:
        raise ValueError(f"Vision preprocessing failed: {str(e)}")
