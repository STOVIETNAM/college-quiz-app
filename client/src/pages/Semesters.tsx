import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { LuBookOpenCheck } from 'react-icons/lu'
import { RiAddFill } from 'react-icons/ri'
import { Link, useSearchParams } from 'react-router-dom'
import { apiGetSemesters } from '../api/semester'
import CreateSemester from '../components/CreateSemester'
import Loading from '../components/Loading'
import { queryKeys } from '../constants/query-keys'
import useAppContext from '../hooks/useAppContext'
import useDebounce from '../hooks/useDebounce'
import useLanguage from '../hooks/useLanguage'
import { PageSemestersLang } from '../models/lang'
import styles from '../styles/global/CardPage.module.css'
import css from '../utils/css'

export default function Semesters() {
	const { permissions, appLanguage } = useAppContext()
	const [searchParams, setSearchParams] = useSearchParams()
	const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
	const queryDebounce = useDebounce(searchQuery)
	const language = useLanguage<PageSemestersLang>('page.subjects')
	const [showCreatePopUp, setShowCreatePopUp] = useState(false)
	const queryClient = useQueryClient()
	const queryData = useQuery({
		queryKey: [queryKeys.PAGE_SEMESTERS, { search: queryDebounce }],
		queryFn: () => apiGetSemesters(queryDebounce)
	})
	useEffect(() => {
		if (!searchParams.get('search') && !queryDebounce) return
		if (queryDebounce === '') searchParams.delete('search')
		else searchParams.set('search', queryDebounce)
		setSearchParams(searchParams)
	}, [queryDebounce, searchParams, setSearchParams])
	const onMutateSuccess = () => {
		[queryKeys.PAGE_SEMESTERS].forEach(key => {
			queryClient.refetchQueries({ queryKey: [key] })
		})
	}
	return (
		<>
			{showCreatePopUp === true ?
				<CreateSemester
					onMutateSuccess={onMutateSuccess}
					setShowPopUp={setShowCreatePopUp}
				/> : null}
			<div className='dashboard-d'>
				{
					permissions.hasAnyFormList(['semester_create', 'semester_update', 'semester_delete'])
						?
						<div className='action-bar-d'>
							{
								permissions.has('semester_create') ?
									<div className='action-item-d'
										onClick={() => {
											setShowCreatePopUp(true)
										}}
									>
										<RiAddFill /> {language?.add}
									</div>
									: null
							}
						</div>
						: null
				}
				<div className={styles['page-content']}>
					{
						queryData.isLoading ? <Loading /> : null
					}
					<div className={styles['filter-form']}>
						<div className={styles['wrap-input-item']}>
							<label htmlFor="">{language?.filter.search}</label>
							<input
								onInput={(e) => {
									setSearchQuery(e.currentTarget.value)
								}}
								name='search'
								defaultValue={queryDebounce}
								className={css('input-d', styles['input-item'])}
								type="text" />
						</div>
					</div>
					<div className={styles['wrap-card-container']}>
						<div className={styles['card-container']}>
							{queryData.data ?
								queryData.data.map(item => {
									return (
										<Link
											to={String(item.id)}
											key={`semester-${item.id}`}
											className={css('dashboard-card-d', styles['card'])}>
											<div className={styles['card-top']}>
												{item.name}
											</div>
											<div className={styles['card-bottom']}>
												<LuBookOpenCheck />
												{
													[
														new Date(item.startDate).toLocaleDateString(appLanguage.language),
														new Date(item.endDate).toLocaleDateString(appLanguage.language),
													].join(' - ')
												}
											</div>
										</Link>
									)
								}) : null}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
