import { useEffect } from 'react'
import {
    AiOutlineQuestionCircle,
    AiOutlineUser
} from 'react-icons/ai'
import {
    PiBooks,
    PiChalkboardTeacherLight,
    PiExam,
    PiStudent,
} from 'react-icons/pi'
import {
    RxDashboard
} from 'react-icons/rx'
import {
    SiGoogleclassroom
} from 'react-icons/si'
import { Link } from 'react-router-dom'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { ComponentNavBarLang } from '../models/lang'
import styles from '../styles/NavBar.module.css'

export default function NavBar() {
    const { DOM, navBarFeatures } = useAppContext()
    const language = useLanguage<ComponentNavBarLang>('component.navbar')
    const navBarItems = [
        {
            name: language?.dashboard,
            to: '',
            icon: <RxDashboard />,
            isActive: true
        },
        {
            name: language?.profile,
            to: 'profile',
            icon: <AiOutlineUser />,
            isActive: true
        },
        {
            name: language?.teachers,
            to: 'teachers',
            icon: <PiChalkboardTeacherLight />,
            isActive: navBarFeatures.items.includes('user_view')
        },
        {
            name: language?.students,
            to: 'students',
            icon: <PiStudent />,
            isActive: navBarFeatures.items.includes('user_view')
        },
        {
            name: language?.subjects,
            to: 'subjects',
            icon: <PiBooks />,
            isActive: navBarFeatures.items.includes('subject_view')
        },
        {
            name: language?.courses,
            to: 'courses',
            icon: <SiGoogleclassroom />,
            isActive: navBarFeatures.items.includes('course_view')
        },
        {
            name: language?.questions,
            to: 'questions',
            icon: <AiOutlineQuestionCircle />,
            isActive: navBarFeatures.items.includes('question_view')
        },
        {
            name: language?.exams,
            to: 'exams',
            icon: <PiExam />,
            isActive: navBarFeatures.items.includes('exam_view')
        },
    ]
    useEffect(() => {
        function updateSize() {
            if (window.innerWidth < 800) DOM.sideBarRef.current?.classList.add(styles['hide'])
            else DOM.sideBarRef.current?.classList.remove(styles['hide'])
        }
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [DOM.sideBarRef])
    useEffect(() => {
        const currentFeature = navBarItems.find(feature => {
            return feature.to === window.location.pathname.split('/')[1]
        })
        if (currentFeature?.name) document.title = currentFeature.name
        if (currentFeature?.name && DOM.titleRef.current) {
            DOM.titleRef.current.textContent = currentFeature?.name + ' • ' + document.title
        }
    })
    return (
        <div ref={DOM.sideBarRef} className={
            [
                styles['nav-bar'],
                window.innerWidth < 800 ? styles['hide'] : ''
            ].join(' ')
        }>
            <ul className={styles['list']}>{
                navBarItems.map((feature, index) => {
                    if (feature.isActive === false) return
                    return (
                        <li onClick={e => {
                            e.currentTarget.querySelector('a')?.click()
                            if (window.innerWidth < 800) DOM.sideBarRef.current?.classList.add(styles['hide'])
                        }} key={index} className={
                            [
                                styles['list-item'],
                                feature.to === window.location.pathname.split('/')[1] ? styles['current'] : ''
                            ].join(' ')
                        }>
                            {feature.icon}
                            <Link to={feature.to}>{feature.name}</Link>
                        </li>
                    )
                })
            }</ul>
        </div>
    )
}