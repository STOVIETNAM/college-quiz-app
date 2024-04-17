import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import { useState } from 'react'
import { MdOutlineCancel } from 'react-icons/md'
import { useParams } from 'react-router-dom'
import { apiGetExamById, apiUpdateExamStatus } from '../api/exam'
import Loading from '../components/Loading'
import YesNoPopUp from '../components/YesNoPopUp'
import { queryKeys } from '../constants/query-keys'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { PageExamLang } from '../models/lang'
import styles from '../styles/Exam.module.css'
import languageUtils from '../utils/languageUtils'

export default function Exam() {
	const { appLanguage, permissions } = useAppContext()
	const [showStartExamPopUp, setShowStartExamPopUp] = useState(false)
	const [showCancelExamPopUp, setShowCancelExamPopUp] = useState(false)
	const language = useLanguage<PageExamLang>('page.exam')
	const { id } = useParams()
	const handleStartExam = async () => {
		await apiUpdateExamStatus('start', String(id))
	}
	const handleCancelExam = async () => {
		await apiUpdateExamStatus('cancel', String(id))
	}
	const onMutateSuccess = () => { }
	const queryData = useQuery({
		queryKey: [queryKeys.EXAM, { id: id }],
		queryFn: () => apiGetExamById(String(id)),
	})
	return (
		<>
			{showStartExamPopUp === true ?
				<YesNoPopUp
					message={'Bắt đầu bài thi ngay ?'}
					mutateFunction={handleStartExam}
					setShowPopUp={setShowStartExamPopUp}
					onMutateSuccess={onMutateSuccess}
					langYes={language?.langYes}
					langNo={language?.langNo}
				/> : null}
			{showCancelExamPopUp === true ?
				<YesNoPopUp
					message={'Hủy bài thi ?'}
					mutateFunction={handleCancelExam}
					setShowPopUp={setShowCancelExamPopUp}
					onMutateSuccess={onMutateSuccess}
					langYes={language?.langYes}
					langNo={language?.langNo}
				/> : null}
			<div className={
				[
					'dashboard-d',
					styles['page-content']
				].join(' ')
			}>
				{
					queryData.isLoading ? <Loading /> : null
				}
				{
					queryData.data ?
						<>
							<div className={
								[
									styles['form-content']
								].join(' ')
							}>
								<div className={styles['header']}>
									<h2 className={styles['title']}>{'Bài thi'}</h2>
								</div>
								<div className={styles['exam-info']}>
									<div className={
										[
											styles['group-infos']
										].join(' ')
									}>
										<div className={styles['wrap-item']}>
											<label htmlFor='name'>{language?.name}: </label>
											<p>{queryData.data.name}</p>
										</div>
										<div className={styles['wrap-item']}>
											<label htmlFor='name'>{language?.examDate}: </label>
											<p>{new Date(queryData.data.examDate).toLocaleString(appLanguage.language)}</p>
										</div>
										<div className={styles['wrap-item']}>
											<label htmlFor='name'>{language?.examTime}: </label>
											<p>
												{moment.duration(queryData.data.examTime, 'minutes').humanize()}
											</p>
										</div>
										<div
											className={[
												styles['wrap-item'],
												styles['supervisors-container'],
											].join(' ')
											}>
											<label htmlFor='name'>{'Giám thị'}</label>
											<p>
												{queryData.data.examSupervisors.map(supervisor => {
													return (
														languageUtils.getFullName(supervisor.user.firstName, supervisor.user.lastName)
													)
												}).join(', ')
												}
											</p>
										</div>
									</div>
								</div>
								{/* <div className={styles['wrap-item']}>
									<label htmlFor='name'>{'Giám thị'}</label>
									<p>
										{queryData.data.examSupervisors.map(supervisor => {
											return (
												languageUtils.getFullName(supervisor.user.firstName, supervisor.user.lastName)
											)
										}).join(', ')
										}
									</p>
								</div> */}
								{
									permissions.hasAnyFormList(['semester_update', 'semester_delete']) ?
										<div className={styles['action-items']}>
											{
												permissions.has('semester_update') ?
													<button
														onClick={() => {
															setShowStartExamPopUp(true)
														}}
														type='button'
														className={
															[
																'action-item-d',
																// isPending ? 'button-submitting' : ''
															].join(' ')
														}
													>{'Bắt đầu'}</button> : null
											}
											{
												permissions.has('semester_delete') ?
													<button
														type='button'
														onClick={() => {
															setShowCancelExamPopUp(true)
														}}
														className={
															[
																'action-item-d-white-border-red'
															].join(' ')
														}>
														<MdOutlineCancel /> {'Hủy'}
													</button> : null
											}
										</div>
										: null
								}
							</div>
						</> : null
				}
			</div >
		</>
	)
}
