import { useEffect, useState } from 'react'
import {
    RiAddFill
} from 'react-icons/ri'
import {
    BiImport,
    BiExport
} from 'react-icons/bi'
import {
    GiFemale,
    GiMale
} from 'react-icons/gi'
import {
    GrFormNext,
    GrFormPrevious,
} from 'react-icons/gr'
import CreateUser from '../components/CreateUser'
import { UsersLanguage } from '../models/lang'
import { useLanguage } from '../contexts/hooks'
import styles from '../styles/Users.module.css'
import { useQuery } from '@tanstack/react-query'
import { reqGetUsersByType } from '../utils/user'
import { useSearchParams } from 'react-router-dom'

type UsersProps = {
    type: 'student' | 'teacher' | 'admin'
}
export default function Users({
    type
}: UsersProps) {
    const [language, setLanguage] = useState<UsersLanguage>()
    const { appLanguage } = useLanguage()
    const [insertMode, setInsertMode] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const queryData = useQuery({
        queryKey: [type, searchParams.get('page') || 1],
        queryFn: () => reqGetUsersByType('admin', Number(searchParams.get('page')))
    })
    useEffect(() => {
        if (!searchParams.has('page')) {
            searchParams.set('page', '1')
            setSearchParams(searchParams)
        }
        fetch(`/langs/page.users.${appLanguage}.json`)
            .then(res => res.json())
            .then((data) => {
                setLanguage(data)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appLanguage])
    return (
        <>
            {insertMode === true ?
                <CreateUser
                    type={type}
                    setInsertMode={setInsertMode}
                /> : null}
            <div
                className={
                    [
                        'dashboard-d'
                    ].join(' ')
                }
            >
                <div className={
                    [
                        'action-bar-d'
                    ].join(' ')
                }>
                    <div className={
                        [
                            'action-item-d'
                        ].join(' ')
                    }
                        onClick={() => {
                            setInsertMode(true)
                        }}
                    >
                        <RiAddFill /> {language?.add}
                    </div>
                    <div className={
                        [
                            'action-item-d-white'
                        ].join(' ')
                    }>
                        <BiImport /> {language?.import}
                    </div>
                    <div className={
                        [
                            'action-item-d-white'
                        ].join(' ')
                    }>
                        <BiExport /> {language?.export}
                    </div>
                </div>
                <div className={styles['users-content']}>
                    <form className={styles['filter-form']}></form>
                    <div className={styles['table-content']}>
                        {/* <div className={styles['table-loading']}>Loading...</div> */}
                        {queryData.isLoading ?
                            <div className={styles['table-loading']}>Loading...</div>
                            : null}
                        <table className={styles['main']}>
                            <tbody>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Gender</th>
                                </tr>
                                {
                                    !queryData.isError && queryData.data ? queryData.data.data.map(user => {
                                        return (
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{user.name}</td>
                                                <td>{user.gender == 'male' ? <GiMale /> : <GiFemale />}</td>
                                            </tr>
                                        )
                                    }) : null
                                }
                            </tbody>
                        </table>
                        <div className={styles['table-links']}>
                            {
                                !queryData.isError && queryData.data ? (
                                    <>
                                        {queryData.data.links.map(link => {
                                            if (isNaN(Number(link.label))) return (
                                                <button key={type + link.label} className={
                                                    [
                                                        styles['next-previous']
                                                    ].join(' ')
                                                }
                                                    onClick={() => {
                                                        if (!link.url) return
                                                        const url = new URL(link.url)
                                                        searchParams.set('page', url.searchParams.get('page') || '1')
                                                        setSearchParams(searchParams)
                                                    }}
                                                >
                                                    {link.label.includes('Next') ? <GrFormNext /> : <GrFormPrevious />}
                                                </button>
                                            )
                                            return (
                                                <button key={type + link.label} className={
                                                    [
                                                        'button-d',
                                                        !link.active ? 'inactive' : ''
                                                    ].join(' ')
                                                }
                                                    onClick={() => {
                                                        if (!link.url) return
                                                        const url = new URL(link.url)
                                                        searchParams.set('page', url.searchParams.get('page') || '1')
                                                        setSearchParams(searchParams)
                                                    }}
                                                >{link.label}</button>
                                            )
                                        })}
                                    </>) : null
                            }
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}