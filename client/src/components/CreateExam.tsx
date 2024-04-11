import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Datetime from 'react-datetime'
import { RxCross2 } from 'react-icons/rx'
import { toast } from 'sonner'
import { apiCreateExam } from '../api/exam'
import { apiGetSubjectById } from '../api/subject'
import { apiGetAllUser } from '../api/user'
import { AUTO_COMPLETE_DEBOUNCE } from '../config/env'
import { queryKeys } from '../constants/query-keys'
import useDebounce from '../hooks/useDebounce'
import useLanguage from '../hooks/useLanguage'
import { CourseDetail } from '../models/course'
import { ComponentCreateExamLang } from '../models/lang'
import { UserDetail } from '../models/user'
import styles from '../styles/CreateExam.module.css'
import createFormUtils from '../utils/createFormUtils'
import languageUtils from '../utils/languageUtils'
import Loading from './Loading'

type CreateExamProps = {
	courseDetail: CourseDetail
	onMutateSuccess: () => void
	setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>
}
export default function CreateExam({
	courseDetail,
	onMutateSuccess,
	setShowPopUp
}: CreateExamProps) {
	const [hide, setHide] = useState(true)
	const [totalQuestion, setTotalQuestion] = useState(0)
	const [supervisors, setSupervisors] = useState<UserDetail[]>([])
	const [queryUser, setQueryUser] = useState('')
	const debounceQueryUser = useDebounce(queryUser, AUTO_COMPLETE_DEBOUNCE)
	const language = useLanguage<ComponentCreateExamLang>('component.create_exam')
	const handleClosePopUp = () => {
		const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
		const timing = Number(transitionTiming.replace('s', '')) * 1000
		setHide(true)
		setTimeout(() => {
			setShowPopUp(false)
		}, timing)
	}
	const formUtils = createFormUtils(styles)
	const queryData = useQuery({
		queryKey: [queryKeys.PAGE_SUBJECT, { id: courseDetail.subjectId }],
		queryFn: () => apiGetSubjectById(courseDetail.subjectId)
	})
	const userQueryData = useQuery({
		queryKey: [queryKeys.ALL_TEACHER, { search: debounceQueryUser }],
		queryFn: () => apiGetAllUser('teacher', debounceQueryUser),
	})
	const handleCreateExam = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		document.querySelector(`.${styles['form-data']}`)?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
			node.classList.remove('error')
			formUtils.getParentElement(node)?.removeAttribute('data-error')
		})
		const form = e.target as HTMLFormElement
		const formData = new FormData(form)
		supervisors.forEach(supervisor => {
			formData.append('supervisor_ids[]', String(supervisor.id))
		})
		await apiCreateExam(formData)
		handleClosePopUp()
	}
	const { mutate, isPending } = useMutation({
		mutationFn: handleCreateExam,
		onError: (error: object) => { formUtils.showFormError(error) },
		onSuccess: onMutateSuccess
	})
	useEffect(() => {
		setHide(false)
	}, [])
	return (
		<>
			<div className={
				[
					styles['create-exam-container'],
					hide ? styles['hide'] : ''
				].join(' ')
			}>
				{
					queryData.isLoading ? <Loading /> : null
				}
				{
					isPending ? <Loading /> : null
				}
				<div className={
					[
						styles['create-exam-form'],
						hide ? styles['hide'] : ''
					].join(' ')
				}>
					<div className={styles['header']}>
						<h2 className={styles['title']}>{language?.create}</h2>
						<div className={styles['esc-button']}
							onClick={handleClosePopUp}
						>
							<RxCross2 />
						</div>
					</div>
					<div className={
						[
							styles['form-content']
						].join(' ')
					}>
						<form
							onSubmit={e => { mutate(e) }}
							className={styles['form-data']}>
							<input hidden readOnly name='course_id' value={courseDetail.id} />
							<div className={
								[
									styles['group-inputs']
								].join(' ')
							}>
								<div className={styles['wrap-item']}>
									<label className={styles['required']} htmlFor='name'>{language?.name}</label>
									<input
										id='name'
										name='name'
										className={
											[
												'input-d',
												styles['input-item']
											].join(' ')
										} type='text' />
								</div>
								<div className={styles['wrap-item']}>
									<label className={styles['required']} htmlFor='exam_date'>{language?.examDate}</label>
									<Datetime
										initialValue={new Date()}
										inputProps={
											{
												id: 'exam_date',
												name: 'exam_date',
												className: [
													'input-d',
													styles['input-item']
												].join(' ')
											}
										}
										closeOnSelect={true}
										timeFormat={true}
									/>
								</div>
								<div className={styles['wrap-item']}>
									<label className={styles['required']} htmlFor='exam_time'>{language?.examTime}</label>
									<input
										onBeforeInput={(e: React.CompositionEvent<HTMLInputElement>) => {
											if (e.data === '.') e.preventDefault()
										}}
										id='exam_time'
										name='exam_time'
										min={0}
										max={60 * 60 * 24}
										className={
											[
												'input-d',
												styles['input-item']
											].join(' ')
										}
										type='number'
									/>
								</div>
								{
									queryData.data ?
										<>
											{queryData.data.chapters.sort((a, b) =>
												a.chapterNumber - b.chapterNumber
											).map(chapter => {
												const key = `chapter-${chapter.id}`
												return (
													<div
														className={styles['wrap-item']}
														key={key}
													>
														<label htmlFor={key}>
															{`${chapter.chapterNumber}. ${chapter.name} (${chapter.questionsCount} ${language?.questions})`}
														</label>
														<input
															id={key}
															onInput={(e) => {
																const target = e.currentTarget
																if (target.valueAsNumber > chapter.questionsCount) {
																	toast.error(language?.maxChapterQuestionCount
																		.replace('@name', `${chapter.chapterNumber}. ${chapter.name}`)
																		.replace('@questionNumber', String(chapter.questionsCount)))
																}
																const total = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="question_counts[]"]'))
																	.reduce((total, current) => {
																		return current.valueAsNumber ? total += current.valueAsNumber : total
																	}, 0)
																setTotalQuestion(total)
															}}
															name='question_counts[]'
															onBeforeInput={(e: React.CompositionEvent<HTMLInputElement>) => {
																if (e.data === '.') e.preventDefault()
															}}
															className={
																[
																	'input-d',
																	styles['input-item']
																].join(' ')
															}
															type='number'
															min={0}
														/>
													</div>
												)
											})}
											<div className={styles['wrap-item']}>
												<span>{language?.totalQuestions}: {totalQuestion}</span>
											</div>
											<div className={[
												styles['wrap-item'],
												styles['data-container']
											].join(' ')
											}>
												<label>{'Giám thị'}</label>
												<input
													placeholder={'Tìm Kiếm'}
													onInput={e => {
														setQueryUser(e.currentTarget.value)
													}}
													className={
														[
															'input-d',
															styles['input-item']
														].join(' ')
													} type='text' />
												<label>{'Giám thị đã tham gia'}</label>
												<ul className={
													[
														styles['joined-supervisors-container']
													].join(' ')
												}>
													{
														supervisors.map((supervisor, index) => {
															return (
																<li
																	className={
																		[
																			styles['joined-supervisor']
																		].join(' ')
																	}
																	key={`joined-supervisor-${supervisor.id}`}
																>
																	<div>
																		<span>
																			{languageUtils.getFullName(supervisor.firstName, supervisor.lastName)}
																		</span>
																		{/* <span>
																			{supervisor.faculty?.name}
																		</span> */}
																		<span
																			style={{ height: '20px' }}
																			onClick={() => {
																				const newSupervisors = structuredClone(supervisors)
																				newSupervisors.splice(index, 1)
																				setSupervisors(newSupervisors)
																			}}
																		>
																			<RxCross2 />
																		</span>
																	</div>
																</li>
															)
														})
													}
												</ul>
												<label>{'Toàn bộ giám thị'}</label>
												<ul className={styles['all-supervisor-conatiner']}>
													{userQueryData.data ?
														userQueryData.data
															.filter(user => !supervisors.find(supervisor => supervisor.id === user.id))
															.map(user => (
																<li
																	onClick={() => {
																		const newSupervisors = structuredClone(supervisors)
																		newSupervisors.push(user)
																		setSupervisors(newSupervisors)
																	}}
																	className={['dashboard-card-d', styles['card']].join(' ')}
																	key={`user-${user.id}`}
																>
																	<div className={styles['card-left']}>
																		<span>{languageUtils.getFullName(user.firstName, user.lastName)}</span>
																		<span>{user.faculty?.name}</span>
																	</div>
																</li>
															)) : null
													}
												</ul>
											</div>
										</> : null
								}
							</div>
							<div className={styles['action-items']}>
								<button name='save'
									className={
										[
											'action-item-d',
											isPending ? 'button-submitting' : ''
										].join(' ')
									}>{language?.save}</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	)
}
