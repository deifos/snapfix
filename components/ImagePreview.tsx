
import React, { useEffect, useRef } from 'react';

const ImagePreview = ({ originalImage, generatedImage, mask }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Draw the original image
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

    // Draw the generated image on top of the original image
    ctx.drawImage(generatedImage, 0, 0, canvas.width, canvas.height);

    // Draw the mask with the "source-in" composite operation
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(mask, 0, 0, canvas.width, canvas.height);

    // Draw the original image on top of the generated image and mask
    ctx.globalCompositeOperation = 'destination-over';
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
  }, [originalImage, generatedImage, mask]);

  return <canvas ref={canvasRef} />;
};

export default ImagePreview;