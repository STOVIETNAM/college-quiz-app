import appStyles from '~styles/App.module.css';
import styles from '~styles/CreateModel.module.css';

import { apiCreateSubject } from '~api/subject';
import { useMutation } from '@tanstack/react-query';
import { SyntheticEvent, useEffect, useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';
import Loading from '~components/Loading';
import CSS_TIMING from '~constants/css-timing';
import useLanguage from '~hooks/useLanguage';
import createFormUtils from '~utils/createFormUtils';
import css from '~utils/css';

type CreateSubjectProps = {
    onMutateSuccess: () => void;
    setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CreateSubject({
    onMutateSuccess,
    setShowPopUp
}: CreateSubjectProps) {
    const language = useLanguage('component.create_subject');
    const [hide, setHide] = useState(true);
    const handleClosePopUp = () => {
        setHide(true);
        setTimeout(() => {
            setShowPopUp(false);
        }, CSS_TIMING.TRANSITION_TIMING_FAST);
    };
    const formUtils = createFormUtils(styles);
    const handleCreateFaculty = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault();
        document.querySelector(`.${styles['form-data']}`)?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
            node.classList.remove('error');
            formUtils.getParentElement(node)?.removeAttribute('data-error');
        });
        const submitter = e.nativeEvent.submitter as HTMLButtonElement;
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        await apiCreateSubject(formData);
        if (submitter.name === 'save') handleClosePopUp();
        else form.reset();
    };
    const { mutate, isPending } = useMutation({
        mutationFn: handleCreateFaculty,
        onError: (error) => { formUtils.showFormError(error); },
        onSuccess: onMutateSuccess
    });
    useEffect(() => {
        setHide(false);
    }, []);
    return (
        <div className={
            css(
                styles['create-model-container'],
                hide ? styles['hide'] : ''
            )
        }>
            {
                isPending ? <Loading /> : null
            }
            <div className={
                css(
                    styles['create-model-form'],
                    hide ? styles['hide'] : ''
                )
            }>
                <div className={styles['header']}>
                    <h2 className={styles['title']}>{language?.create}</h2>
                    <div className={styles['esc-button']}
                        onClick={handleClosePopUp}
                    >
                        <RxCross2 />
                    </div>
                </div>
                <div className={styles['form-content']}>
                    <form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
                        mutate(e);
                    }}
                        onInput={(e) => { formUtils.handleOnInput(e); }}
                        className={styles['form-data']}>
                        <div className={styles['group-inputs']}>
                            <div className={styles['wrap-item']}>
                                <label className={appStyles['required']} htmlFor='shortcode'>{language?.shortcode}</label>
                                <input
                                    id='shortcode'
                                    name='shortcode'
                                    className={css(appStyles['input-d'], styles['input-item'])}
                                    type='text' />
                            </div>
                            <div className={styles['wrap-item']}>
                                <label className={appStyles['required']} htmlFor='name'>{language?.name}</label>
                                <input
                                    id='name'
                                    name='name'
                                    className={css(appStyles['input-d'], styles['input-item'])}
                                    type='text' />
                            </div>
                        </div>
                        <div className={styles['action-items']}>
                            <button name='save'
                                className={
                                    css(
                                        appStyles['action-item-d'],
                                        isPending ? appStyles['button-submitting'] : ''
                                    )
                                }>
                                <FiSave />{language?.save}
                            </button>
                            <button name='save-more'
                                className={
                                    css(
                                        appStyles['action-item-white-d'],
                                        isPending ? appStyles['button-submitting'] : ''
                                    )
                                }>
                                <FiSave />{language?.saveMore}
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
}
