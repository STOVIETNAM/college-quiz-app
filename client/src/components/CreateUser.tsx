import { SyntheticEvent, useEffect, useState } from 'react'
import Select from 'react-select'
import {
    RxCross2
} from 'react-icons/rx'
import styles from '../styles/CreateUser.module.css'
import { reqCreateUser } from '../utils/user'
import { useMutation } from '@tanstack/react-query'

interface CreateUserProps {
    type?: 'student' | 'teacher' | 'admin'
    setInsertMode: React.Dispatch<React.SetStateAction<boolean>>
}
const options = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
];
export default function CreateUser({
    setInsertMode
}: CreateUserProps) {
    const [hide, setHide] = useState(true)
    const [gender, setGender] = useState('male')
    const handleTurnOffInsertMode = () => {
        const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
        setHide(true)
        setTimeout(() => {
            setInsertMode(false)
        }, parseInt(transitionTiming.substring(0, transitionTiming.length)))
    }
    const handleCreateUser = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault()
        const submitter = e.nativeEvent.submitter as HTMLButtonElement
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        await reqCreateUser(formData)
        if (submitter.name === 'save') handleTurnOffInsertMode()
        else form.reset()
    }
    const { mutate } = useMutation({
        mutationFn: handleCreateUser,
        onError: (e) => {
            console.log(e)
        },
    })
    console.log(gender)
    useEffect(() => {
        setHide(false)
    }, [])
    return (
        <div className={
            [
                styles['create-user-container'],
                hide ? styles['hide'] : ''
            ].join(' ')
        }>
            <div className={
                [
                    styles['create-user-form'],
                    hide ? styles['hide'] : ''
                ].join(' ')
            }>
                <div className={styles['header']}>
                    <h2 className={styles['title']}>Tạo sinh viên</h2>
                    <div className={styles['esc-button']}
                        onClick={handleTurnOffInsertMode}
                    >
                        <RxCross2 />
                    </div>
                </div>
                <form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
                    mutate(e)
                }} className={styles['form-data']}>
                    <div className={
                        [
                            styles['group-inputs']
                        ].join(' ')
                    }>
                        {/* This div wrap one input item */}
                        <div className={styles['wrap-item']}>
                            <label htmlFor="">Email</label>
                            <input
                                name='email'
                                className={
                                    [
                                        'input-d',
                                        styles['input-item']
                                    ].join(' ')
                                } type="text" />
                        </div>
                        <div className={styles['wrap-item']}>
                            <label htmlFor="">Name</label>
                            <input
                                name='name'
                                className={
                                    [
                                        'input-d',
                                        styles['input-item']
                                    ].join(' ')
                                } type="text" />
                        </div>
                        <div className={styles['wrap-item']}>
                            <label htmlFor="">shortcode</label>
                            <input
                                name='shortcode'
                                className={
                                    [
                                        'input-d',
                                        styles['input-item']
                                    ].join(' ')
                                } type="text" />
                        </div>
                    </div>
                    <div className={
                        [
                            styles['group-inputs']
                        ].join(' ')
                    }>
                        {/* This div wrap one input item */}
                        <div className={styles['wrap-item']}>
                            <label htmlFor="">Gender</label>
                            <Select
                                defaultValue={options[0]}
                                onChange={(e) => {
                                    if (e) setGender(e.value)
                                }}
                                options={options}
                            />
                        </div>
                        <div className={styles['wrap-item']}>
                            <label htmlFor="">Address</label>
                            <input
                                name='name'
                                className={
                                    [
                                        'input-d',
                                        styles['input-item']
                                    ].join(' ')
                                } type="text" />
                        </div>
                        <div className={styles['wrap-item']}>
                            <label htmlFor="">Birth date</label>
                            <input
                                name='shortcode'
                                className={
                                    [
                                        'input-d',
                                        styles['input-item']
                                    ].join(' ')
                                } type="text" />
                        </div>
                    </div>
                    <div className={styles['action-items']}>
                        <button name='save' className='action-item-d'>Save</button>
                        <button name='save-more' className='action-item-d-white'>Save more</button>
                    </div>
                </form>
            </div>
        </div>
    )
}