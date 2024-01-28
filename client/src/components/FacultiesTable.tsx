import { useState } from 'react'
import { GrFormNext, GrFormPrevious } from 'react-icons/gr'
import { SetURLSearchParams } from 'react-router-dom'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { FacultyDetail } from '../models/faculty'
import { ComponentFacultiesTableLang } from '../models/lang'
import { Pagination } from '../models/response'
import styles from '../styles/global/Table.module.css'
import languageUtils from '../utils/languageUtils'
import ViewFaculty from './ViewFaculty'

type FacultiesTableProps = {
    data?: Pagination<FacultyDetail>
    searchParams: URLSearchParams
    onMutateSuccess: () => void
    setSearchParams: SetURLSearchParams
    setSelectedRows: React.Dispatch<React.SetStateAction<Set<string | number>>>
}

export default function FacultiesTable({
    data,
    searchParams,
    onMutateSuccess,
    setSearchParams,
    setSelectedRows
}: FacultiesTableProps) {
    const { permissions } = useAppContext()
    const [checkAll, setCheckAll] = useState(false)
    const language = useLanguage<ComponentFacultiesTableLang>('component.faculties_table')
    const [viewMode, setViewMode] = useState(false)
    const [facultyId, seFacultyId] = useState<number>(0)
    const handleViewFaculty = (id: number, e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
        const target = e.target as Element
        if (target.nodeName === 'INPUT') {
            const checkBox = target as HTMLInputElement
            const perPage = Number(searchParams.get('per_page')) || 10
            if (checkBox.checked) setSelectedRows(pre => {
                pre.add(id)
                if (pre.size === perPage) setCheckAll(true)
                return structuredClone(pre)
            })
            else setSelectedRows(pre => {
                pre.delete(id)
                if (pre.size !== perPage) setCheckAll(false)
                return structuredClone(pre)
            })
            return
        }
        seFacultyId(id)
        setViewMode(true)
    }
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const currentTarget = e.currentTarget
        const selector = `.${styles['column-select']}>input`
        const allCheckBox = document.querySelectorAll(selector)
        allCheckBox.forEach(node => {
            const element = node as HTMLInputElement
            element.checked = currentTarget.checked
        })
        if (currentTarget.checked) {
            setSelectedRows(pre => {
                pre.clear()
                data && data.data.forEach(user => {
                    pre.add(user.id)
                })
                return structuredClone(pre)
            })
            setCheckAll(true)
        }
        else {
            setSelectedRows(pre => {
                pre.clear()
                return structuredClone(pre)
            })
            setCheckAll(false)
        }
    }
    return (
        <>
            {viewMode === true ?
                <ViewFaculty
                    id={facultyId}
                    onMutateSuccess={onMutateSuccess}
                    setViewMode={setViewMode}
                /> : null}
            <div className={styles['table-content']}>
                <table className={styles['main']}>
                    <>
                        <thead>
                            <tr className={styles['table-header']}>
                                {
                                    permissions.has('user_delete') ?
                                        <th className={
                                            [
                                                styles['column-select'],
                                                styles['column']
                                            ].join(' ')
                                        }>
                                            <input type="checkbox"
                                                checked={checkAll}
                                                onChange={handleSelectAll} />
                                        </th>
                                        : null
                                }
                                <th className={
                                    [
                                        styles['column'],
                                        styles['medium']
                                    ].join(' ')
                                }>{language?.header.shortcode}</th>
                                <th className={
                                    [
                                        styles['column'],
                                        styles['medium']
                                    ].join(' ')
                                }>{language?.header.name}</th>
                                <th className={
                                    [
                                        styles['column'],
                                        styles['medium']
                                    ].join(' ')
                                }>{language?.header.phoneNumber}</th>
                                <th className={
                                    [
                                        styles['column'],
                                        styles['medium']
                                    ].join(' ')
                                }>{language?.header.email}</th>
                                <th className={
                                    [
                                        styles['column'],
                                        styles['medium']
                                    ].join(' ')
                                }>
                                    {language?.header.leader}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data ?
                                    data.data.map(faculty => {
                                        return (
                                            <tr key={faculty.id}
                                                onClick={(e) => {
                                                    handleViewFaculty(faculty.id, e)
                                                }}
                                            >
                                                {
                                                    permissions.has('faculty_delete') ?
                                                        <td className={
                                                            [
                                                                styles['column'],
                                                                styles['small'],
                                                                styles['column-select']
                                                            ].join(' ')
                                                        }>
                                                            <input type="checkbox" />
                                                        </td>
                                                        : null
                                                }
                                                <td className={
                                                    [
                                                        styles['column'],
                                                        styles['medium']
                                                    ].join(' ')
                                                }>{faculty.shortcode}</td>
                                                <td className={
                                                    [
                                                        styles['column'],
                                                        styles['medium']
                                                    ].join(' ')
                                                }>{faculty.name}</td>
                                                <td className={
                                                    [
                                                        styles['column'],
                                                        styles['medium']
                                                    ].join(' ')
                                                }>{faculty.phoneNumber}</td>
                                                <td className={
                                                    [
                                                        styles['column'],
                                                        styles['medium']
                                                    ].join(' ')
                                                }>{faculty.email}</td>
                                                <td className={
                                                    [
                                                        styles['column'],
                                                        styles['medium']
                                                    ].join(' ')
                                                }>{languageUtils.getFullName(faculty.leader?.firstName, faculty.leader?.lastName)}</td>
                                            </tr>
                                        )
                                    }) : null
                            }
                        </tbody>
                    </>
                </table>
                {
                    data ?
                        <div className={styles['table-footer']}>
                            <span>
                                {data.from} - {data.to} / {data.total}
                            </span>
                            <div className={styles['table-links']}>
                                {
                                    <div className={styles['link-content']}>
                                        {data.links.map(link => {
                                            if (isNaN(Number(link.label))) return (
                                                <button key={'faculty' + link.label} className={
                                                    [
                                                        styles['next-previous'],
                                                    ].join(' ')
                                                }
                                                    onClick={() => {
                                                        if (!link.url) return
                                                        const url = new URL(link.url)
                                                        searchParams.set('page', url.searchParams.get('page') || '1')
                                                        setSearchParams(searchParams)
                                                    }}
                                                >
                                                    {link.label === '...' ? '...' : link.label.includes('Next') ? <GrFormNext /> : <GrFormPrevious />}
                                                </button>
                                            )
                                            return (
                                                <button key={'faculty' + link.label} className={
                                                    [
                                                        'button-d',
                                                        !link.active ? styles['inactive'] : ''
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
                                    </div>
                                }
                            </div>
                        </div> : null
                }
            </div>
        </>
    )
}