import appStyles from '~styles/App.module.css';
import styles from './styles/YesNoPopUp.module.css';

import { useMutation } from '@tanstack/react-query';
import { RxCross2 } from 'react-icons/rx';
import css from '~utils/css';
import Loading from './Loading';

type YesNoPopUpProps = {
    message: string;
    mutateFunction: () => Promise<unknown>;
    onMutateSuccess: () => void;
    setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
    langYes?: string;
    langNo?: string;
};
export default function YesNoPopUp({
    message,
    mutateFunction,
    onMutateSuccess,
    setShowPopUp,
    langYes,
    langNo
}: YesNoPopUpProps) {
    const handleClosePopUp = () => {
        setShowPopUp(false);
    };
    const mutation = useMutation({
        mutationFn: mutateFunction,
        onSuccess: () => {
            onMutateSuccess();
            handleClosePopUp();
        }
    });
    return (
        <div
            className={
                css(
                    styles.yesNoPopUpContainer,
                )
            }>
            {
                mutation.isPending ? <Loading /> : null
            }
            <div
                className={
                    css(
                        styles.yesNoPopUpForm,
                    )
                }>
                <div className={styles.header}>
                    <div
                        className={styles.escButton}
                        onClick={handleClosePopUp}
                    >
                        <RxCross2 />
                    </div>
                </div>
                <div className={styles.formData}>
                    <div className={styles.message} >
                        <div className={styles.messageContent}>
                            {message}
                        </div>
                    </div>
                    <div className={styles.actionItems}>
                        <button
                            onClick={handleClosePopUp}
                            className={
                                css(
                                    appStyles.actionItemWhiteBorderRed,
                                    mutation.isPending ? styles.pending : ''
                                )
                            }>
                            {langNo}
                        </button>
                        <button
                            onClick={() => { mutation.mutate(); }}
                            className={
                                css(
                                    appStyles.actionItemWhite,
                                    mutation.isPending ? styles.pending : ''
                                )
                            }>
                            {langYes}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
