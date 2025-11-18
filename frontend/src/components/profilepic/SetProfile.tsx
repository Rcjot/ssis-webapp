const baseurl: string = import.meta.env.VITE_SUPABASE_BASEURL;
import { useRef, useState } from "react";
// import { useAuthContext } from "../auth/AuthContext";
import defaultpfp from "@/assets/defaultpfp.png";
import ProfileCropper from "./ProfileCropper";
// import profileApi from "@/api/profileApi";
import styles from "./profile.module.css";
import arrowdownicon from "@/assets/arrowdownicon.svg";
import arrowupicon from "@/assets/arrowupicon.svg";

interface setProfileProps {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    showCrop: boolean;
    setShowCrop: React.Dispatch<React.SetStateAction<boolean>>;
    student_pfp_path: string | null;
}

function SetProfile({
    canvasRef,
    showCrop,
    setShowCrop,
    student_pfp_path,
}: setProfileProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    // const canvasRef = useRef<HTMLCanvasElement>(null);
    // const { auth, fetchCredentials } = useAuthContext()!;
    const [imageSrc, setImageSrc] = useState<string>("");
    const [pfpPreview, setPfpPreview] = useState<string>(
        student_pfp_path ? `${baseurl}${student_pfp_path}` : defaultpfp
    );
    // const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
        console.log(e.target.files);
        if (!e.target.files) return;
        if (e.target.files.length === 0) return;
        const file = e.target.files[0];

        const url = URL.createObjectURL(file);
        setImageSrc(url);

        setShowCrop(true);
    }

    // async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    //     e.preventDefault();
    //     setIsSubmitting(true);
    //     if (canvasRef.current) {
    //         canvasRef.current.toBlob(
    //             async (blob) => {
    //                 if (blob) {
    //                     const formData = new FormData();

    //                     formData.append("image", blob);

    //                     // await profileApi.sendImage(formData);
    //                     // await fetchCredentials();
    //                     setIsSubmitting(false);
    //                 }
    //             },
    //             "image/jpg",
    //             0.9
    //         );
    //     }
    // }
    return (
        <>
            <div className={styles.profileForm}>
                {/* <button
                    // className="btn btn-neutral self-end"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "saving..." : "save"}
                </button> */}

                <fieldset style={{ display: "flex", flexDirection: "column" }}>
                    <input
                        ref={inputRef}
                        type="file"
                        className="d-none"
                        accept="image/"
                        onChange={handleImage}
                    />
                    <button
                        type="button"
                        className="rounded-circle"
                        style={{ background: "none", border: "none" }}
                        onClick={() => {
                            inputRef.current?.click();
                        }}
                    >
                        <img
                            src={pfpPreview}
                            alt="choose photo"
                            className={styles.profileImage}
                        />
                    </button>
                </fieldset>
                {imageSrc != "" && (
                    <button
                        type="button"
                        style={{ background: "none" }}
                        onClick={() => {
                            setShowCrop((prev) => !prev);
                        }}
                    >
                        <img
                            src={showCrop ? arrowupicon : arrowdownicon}
                            alt="togglecrop"
                        />
                    </button>
                )}
                <div className={showCrop ? "" : "d-none"}>
                    {imageSrc != "" && (
                        <ProfileCropper
                            imgSrc={imageSrc}
                            setPfpPreview={setPfpPreview}
                            canvasRef={canvasRef}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

export default SetProfile;
