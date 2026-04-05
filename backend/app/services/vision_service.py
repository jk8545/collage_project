import cv2
import numpy as np
import urllib.request
import certifi
import base64
from typing import Tuple

def process_image(image_url: str) -> Tuple[float, str]:
    """
    Downloads the image (or decodes data URI), resizes it,
    and returns the blur variance (confidence score) along with the base64 string.
    """
    try:
        if image_url.startswith('data:image'):
            # Form: data:image/jpeg;base64,/9j/4AAQSk...
            header, encoded = image_url.split(",", 1)
            arr = np.frombuffer(base64.b64decode(encoded), dtype=np.uint8)
        else:
            req = urllib.request.urlopen(urllib.request.Request(image_url, headers={'User-Agent': 'Mozilla/5.0'}), cafile=certifi.where())
            arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
            
        image = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError("Could not decode image from URL/URI.")
        
        # Downscale max dimension to 1024px to prevent latency/VLM timeout/errors
        max_dim = 1024
        h, w = image.shape[:2]
        if max(h, w) > max_dim:
            scale = max_dim / float(max(h, w))
            image = cv2.resize(image, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        blur_variance = cv2.Laplacian(gray, cv2.CV_64F).var()
        
        # We no longer strictly threshold the image, Vision LLMs need RGB texture context!
        # Just return the resized image
        _, buffer = cv2.imencode('.jpg', image)
        base64_image = base64.b64encode(buffer).decode('utf-8')
        
        if blur_variance < 50.0:
            raise ValueError("Image is too blurry. Please upload a clear image.")
            
        confidence = min(1.0, blur_variance / 500.0)
        return round(confidence, 2), base64_image
    except Exception as e:
        raise ValueError(f"Vision preprocessing failed: {str(e)}")
