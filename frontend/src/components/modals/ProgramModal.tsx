import ProgramForm from "../forms/ProgramForms";
import type { ProgramModalType } from "../../types/programTypes";

function ProgramModal({
    onSuccess,
    modalState,
}: {
    onSuccess: () => Promise<void>;
    modalState: ProgramModalType;
}) {
    console.log("rerender", modalState.formData);
    return (
        <div>
            <ProgramForm
                onSuccess={onSuccess}
                formDataOriginal={modalState.formData}
                formType={modalState.formType}
            />
        </div>
    );
}

export default ProgramModal;
