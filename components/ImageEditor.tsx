import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from "@/components/ui/textarea"
import CompareSlider from './CompareSlider';
import { Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import downloadPhoto from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const ImageEditor = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [mask, setMask] = useState<string | null>(null);
    const [drawing, setDrawing] = useState<boolean>(false);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>("");
    const [canvasWidth, setCanvasWidth] = useState(null);
    const [canvasHeight, setCanvasHeight] = useState(null);
    const [prompt, setPrompt] = useState<string | null>('');
    const [isBlockingMultipleCalls, setIsBlockingMultipleCalls] = useState<boolean>(false);
    const [spinner, setSpinner] = useState<boolean>(false);
    const inputRef = useRef<null | HTMLInputElement>();
    const [maskReady, setMaskReady] = useState<string | null>();
    const [imageReady, setImageReady] = useState<string | null>();
    const { toast } = useToast();


    //Have to resize images to dimensions multiple of 64 or Stability AI will not like it
    const resizeImage = async (dataURL: string) => {
        return new Promise((resolve) => {
            const img = new window.Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = Math.ceil(img.width / 64) * 64;
                canvas.height = Math.ceil(img.height / 64) * 64;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const resizedDataURL = canvas.toDataURL("image/jpeg");
                resolve(resizedDataURL);
            };
            img.src = dataURL;
        });
    };


    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {

        if (!event.target.files?.[0]) return;
        const file = event.target.files?.[0];
        const fileType = file.type;
        if (!['image/jpeg', 'image/png'].includes(fileType)) {
            toast({
                title: "Error",
                description: "Invalid file format. Please upload a JPG or PNG file."
            });
            return;
        }

        //reset the url of the generated image to hide the download buttons and comparator
        setGeneratedImageUrl(null);


        //resetomg the input so user can select the same image as before.
        event.target.value = "";

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            const img = new window.Image();
            img.onload = () => {
                setImage(img);
                setMask(null); // clear the mask when a new image is uploaded
                setGeneratedImageUrl(null);
                setSpinner(false);
            };
            img.src = e.target?.result as string;
            console.log(img.naturalHeight);
        };
        reader?.readAsDataURL(file as Blob);
    };


    const handleMouseDown = () => {
        setDrawing(true);
        if (canvasRef.current) {
            canvasRef.current.addEventListener('touchstart', handleTouchStart, { passive: false });
        }
    };

    const handleTouchStart = (event: TouchEvent) => {
        event.preventDefault();
    };

    const handleMouseUp = () => {
        setDrawing(false);
        if (canvasRef.current) {
            canvasRef.current.removeEventListener('touchstart', handleTouchStart);
        }
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
        if ('preventDefault' in event) {
            event.preventDefault();
        }
        let x: number, y: number;

        if ('offsetX' in event.nativeEvent) {
            x = event.nativeEvent.offsetX;
            y = event.nativeEvent.offsetY;
        } else if ('touches' in event.nativeEvent) {
            const canvas = canvasRef.current;
            const touch = event.nativeEvent.touches[0];
            const rect = canvas?.getBoundingClientRect();
            if (canvas && rect) {
                x = touch.clientX - rect.left;
                y = touch.clientY - rect.top;
            }
        }

        if (drawing && canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            const radius = 10; // Set the radius of the circle cursor here
            if (context) {
                context.beginPath();
                context.arc(x, y, radius, 0, Math.PI * 2);
                context.fillStyle = "rgba(0, 0, 0, 1)";
                context.fill();
                const dataURL = canvas.toDataURL();
                setMask(dataURL);
            }
        }

    };

    const handleReset = () => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                setMask(null);
            }
        }
    };

    const prepareMask = async () => {
        if (mask && image) {
            handleReset();
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (context) {
                canvas.width = imageRef.current.clientWidth;
                canvas.height = imageRef.current.clientHeight;

                // Fill the canvas with black color
                context.fillStyle = "white";
                context.fillRect(0, 0, canvas.width, canvas.height);

                // We need to send the mask as a black image with white area to be modified
                // Draw the mask area on the canvas with white color
                const maskImage = new window.Image();
                maskImage.src = mask;
                maskImage.onload = async () => {
                    context.globalCompositeOperation = "destination-out";
                    context.drawImage(maskImage, 0, 0);
                    context.globalCompositeOperation = "destination-over";
                    context.fillStyle = "black";
                    context.fillRect(0, 0, canvas.width, canvas.height);
                    const dataURL = canvas.toDataURL();
                    const resizedMask = await resizeImage(dataURL) as string;
                    setMaskReady(resizedMask);
                    setIsBlockingMultipleCalls(true);

                };
            }
        }
    };

    const handleOnSubmit = async () => {
        if (!prompt || prompt === "") return;
        setSpinner(true);

        //resizing image to current size on screen https://codesalad.dev/blog/how-to-resize-an-image-in-10-lines-of-javascript-29
        // Initialize the canvas and it's size
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set width and height
        if (!imageRef || !imageRef.current) {
            alert("please select a new image");
            return;
        }
        canvas.width = imageRef.current.clientWidth;
        canvas.height = imageRef.current.clientHeight;

        // Draw image and export to a data-uri
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        const imageReady = canvas.toDataURL('png', 1);
        const imageResized = await resizeImage(imageReady) as string;
        setImageReady(imageResized);

        prepareMask();
    }

    const handleOnLoadImage = (event) => {
        const { clientHeight, clientWidth } = event.target;
        setCanvasWidth(clientWidth);
        setCanvasHeight(clientHeight);
    }

    const generateImage = useCallback(async () => {
        if (imageReady && maskReady && isBlockingMultipleCalls) {

            let formData = new FormData();
            formData.append("originalPicture", imageReady);
            formData.append("maskPicture", maskReady);
            formData.append("prompt", prompt);


            const response = await fetch("/api/generate-stability-ai", {
                method: "POST",
                body: formData,
            });


            try {
                const responseCompleted = await response.json();
                console.log(responseCompleted, 'response completed');
                if (response.status !== 200 || responseCompleted.imageBase64 === "") {
                    setIsBlockingMultipleCalls(false);
                    setSpinner(false);

                    let errorMessage = responseCompleted?.error || responseCompleted?.errorMessage || 'there has been an error please try again.'

                    if (responseCompleted.imageBase64 === "") {
                        errorMessage = "The adult content filter has been triggered try again or use a different photo.";
                    }
                    toast({
                        title: "Error",
                        description: errorMessage
                    });

                    setSpinner(false);
                    setIsBlockingMultipleCalls(false);
                } else {
                    setGeneratedImageUrl(`data:image/png;base64,${responseCompleted.imageBase64}`);
                    setOriginalImageUrl(imageReady);
                    setTimeout(() => {
                        setSpinner(false);
                        setIsBlockingMultipleCalls(false);
                    }, 1000)
                }
            } catch (error) {
                console.log('error parsing response error', error);
                toast({
                    title: "Error",
                    description: "There is been an error with the response from the server please try again or try with a different photo."
                })
            }
        }

    }, [isBlockingMultipleCalls, prompt, toast, imageReady, maskReady])

    const triggerFileSelectPopup = () => inputRef?.current?.click();

    useEffect(() => {
        // making the canvas responsive after multiple attemps this seems to work
        const handleResize = () => {
            if (imageRef.current && imageRef.current.complete) {
                setCanvasWidth(imageRef.current.clientWidth);
                setCanvasHeight(imageRef.current.clientHeight);
                // handleReset(); on mobile reset the canvas on every scroll
            }
        }
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [image]);

    useEffect(() => {
        if (imageReady && maskReady) {
            generateImage();
        }
    }, [, isBlockingMultipleCalls, generateImage, imageReady, maskReady])

    return (
        <div className="relative w-full pb-4" >
            <div className="mb-6 flex">
                <Input type="file" accept=".jpg,.jpeg,.png" onChange={handleImageUpload} className="hidden" ref={inputRef as any} />
                <Button onClick={triggerFileSelectPopup} className="flex-auto" disabled={spinner}>
                    Upload an image
                </Button>
            </div>
            {
                (!image && !generatedImageUrl) && (
                    <div></div>
                )
            }
            {generatedImageUrl && (
                <CompareSlider
                    original={originalImageUrl!}
                    generated={generatedImageUrl!}
                />
            )}
            {(image && !generatedImageUrl) && (
                <div className="relative">
                    <Image src={image.src} alt="uploaded" width={image.naturalWidth} height={image.naturalHeight} ref={imageRef} onLoad={handleOnLoadImage} className={spinner ? "blur-lg" : ''} />

                    <canvas
                        ref={canvasRef}
                        width={canvasWidth}
                        height={canvasHeight}
                        style={{ position: 'absolute', top: 0, left: 0, cursor: 'pointer' }}
                        className={spinner ? "absolute top-0 left-0 cursor-pointer blur-lg" : "absolute top-0 left-0 cursor-pointer"}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                        onTouchStart={handleMouseDown}
                        onTouchEnd={handleMouseUp}
                        onTouchMove={handleMouseMove}
                    />

                </div>
            )}

            {
                image && (
                    <>
                        <div className="my-6">
                            <Button onClick={handleReset} className="mr-4" disabled={!mask || spinner}>Reset</Button>
                            {
                                generatedImageUrl && (
                                    <Button onClick={() => { downloadPhoto(generatedImageUrl, 'new-SnapFix') }} className="mr-4" >Download image</Button>
                                )
                            }
                        </div>
                        <div className="grid w-full gap-4 ">
                            <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={!mask || spinner} placeholder={"Be descriptive in your prompt for better results"} />
                            <Button onClick={handleOnSubmit} disabled={!mask || spinner}>
                                {isBlockingMultipleCalls && (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                    </>
                                )}
                                {
                                    !isBlockingMultipleCalls && ("Enhance Image")
                                }
                            </Button>

                        </div>
                    </>
                )
            }

        </div>
    );
};

export default ImageEditor;
