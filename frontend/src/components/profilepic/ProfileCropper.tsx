import React, { useRef, useState } from "react";
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    type PercentCrop,
    convertToPixelCrop,
} from "react-image-crop";
import setCanvasPreview from "./SetCanvasPreview";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 75;

function ProfileCropper({
    imgSrc,
    setPfpPreview,
    canvasRef,
}: {
    imgSrc: string;
    setPfpPreview: React.Dispatch<React.SetStateAction<string>>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) {
    const imgRef = useRef<HTMLImageElement>(null);
    const [crop, setCrop] = useState<PercentCrop>();

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        const cropWidthInPercent = (MIN_DIMENSION / width) * 100;
        console.log(width, height);
        const crop = makeAspectCrop(
            {
                unit: "%",
                width: cropWidthInPercent,
            },
            ASPECT_RATIO,
            width,
            height
        );
        const centeredCrop = centerCrop(crop, width, height);
        setCrop(centeredCrop);
    }

    function onCrop() {
        if (imgRef.current && canvasRef.current && crop) {
            setCanvasPreview(
                imgRef.current,
                canvasRef.current,
                convertToPixelCrop(
                    crop,
                    imgRef.current?.width,
                    imgRef.current?.height
                )
            );
            const dataUrl = canvasRef.current.toDataURL();
            setPfpPreview(dataUrl);
            console.log(dataUrl);
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
            <ReactCrop
                crop={crop}
                circularCrop
                keepSelection
                aspect={ASPECT_RATIO}
                minWidth={MIN_DIMENSION}
                onChange={(_pixelCrop, percentCrop) => {
                    setCrop(percentCrop);
                }}
            >
                <img
                    src={imgSrc}
                    alt="upload"
                    ref={imgRef}
                    // className="min-h-[250px] !max-h-[300px] !max-w-[300px] sm:!max-h-[500px] sm:!max-w-[500px]"
                    style={{
                        maxHeight: "400px",
                        maxWidth: "400px",
                        minHeight: "250px",
                    }}
                    onLoad={onImageLoad}
                />
            </ReactCrop>
            {imgRef.current && (
                <button
                    className="btn btn-primary"
                    onClick={onCrop}
                    type="button"
                >
                    crop image
                </button>
            )}
            {crop && (
                <canvas
                    ref={canvasRef}
                    className="mt-4"
                    style={{
                        marginTop: "4rem",
                        objectFit: "contain",
                        width: MIN_DIMENSION,
                        height: MIN_DIMENSION,
                        display: "none",
                    }}
                />
            )}
        </div>
    );
}
export default ProfileCropper;
