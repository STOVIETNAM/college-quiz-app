import confetti from 'canvas-confetti'
import { TiArrowBack } from 'react-icons/ti'
import { useNavigate } from 'react-router-dom'
import { BASE_SCORE_SCALE } from '../config/env'
import useLanguage from '../hooks/useLanguage'
import { ExamResult } from '../models/exam'
import { ComponentScorePopUpLang } from '../models/lang'
import styles from '../styles/ScorePopUp.module.css'

type ScorePopUpProps = {
	data: ExamResult
	backURL: string
	hideConfetti?: boolean
	setShowPopUp?: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ScorePopUp({
	data,
	backURL,
	hideConfetti,
	setShowPopUp
}: ScorePopUpProps) {
	const language = useLanguage<ComponentScorePopUpLang>('component.score_pop_up')
	const navigate = useNavigate()
	const score = (data.correctCount / data.questionCount * BASE_SCORE_SCALE).toFixed(2) + `/${BASE_SCORE_SCALE}`
	const handleClosePopUp = () => {
		if (setShowPopUp) return setShowPopUp(true)
		navigate(backURL)
	}
	const renderScore = () => {
		const percent = data.correctCount / data.questionCount
		if (percent >= 0.7) return (
			<div className={[
				styles['score'],
				styles['green']
			].join(' ')}>
				{score}
			</div>
		)
		if (percent >= 0.5) return (
			<div className={[
				styles['score'],
				styles['yellow']
			].join(' ')}>
				{score}
			</div>
		)
		return (
			<div className={[
				styles['score'],
				styles['red']
			].join(' ')}>
				{score}
			</div>
		)
	}
	if (!hideConfetti) {
		confetti({
			particleCount: 100,
			startVelocity: 30,
			spread: 360,
			origin: {
				x: Math.random(),
				y: Math.random() - 0.2
			}
		})
	}
	return (
		<div className={styles['score-popup-container']}>
			<div className={styles['score-content']}>
				<div className={styles['title']}>
					<h2>{language?.examResult}</h2>
				</div>
				<div className={
					[
						styles['content-data']
					].join(' ')
				}>
					<div className={styles['group-data']}>
						{renderScore()}
						{/* {renderFace(data.correctCount, data.questionCount)} */}
						<div>{language?.numberOfCorrectQuestion}</div>
						<div className={styles['correct-count']}>{data.correctCount}/{data.questionCount}</div>
					</div>
					<div className={styles['action-items']}>
						<button
							onClick={handleClosePopUp}
							className={
								[
									'button-d'
								].join(' ')
							}>
							<TiArrowBack />
							{language?.goBack}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
