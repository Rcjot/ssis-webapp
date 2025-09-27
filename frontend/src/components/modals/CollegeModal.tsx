import CollegeForm from "../forms/CollegeForms";
import type { CollegeModalType } from "../../types/collegeTypes";

function CollegeModal({
    onSuccess,
    modalState,
}: {
    onSuccess: () => Promise<void>;
    modalState: CollegeModalType;
}) {
    console.log("rerender", modalState.formData);
    return (
        <div>
            <CollegeForm
                onSuccess={onSuccess}
                formDataOriginal={modalState.formData}
                formType={modalState.formType}
            />
        </div>
    );
}

export default CollegeModal;
