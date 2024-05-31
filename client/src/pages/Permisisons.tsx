import { useQuery } from '@tanstack/react-query'
import { LuUsers2 } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import { apiGetRolePermissionCount } from '../api/role-permission'
import Loading from '../components/Loading'
import { queryKeys } from '../constants/query-keys'
import useLanguage from '../hooks/useLanguage'
import styles from '../styles/Permissions.module.css'
import css from '../utils/css'

export default function Permisisons() {
	const language = useLanguage('page.permissions')
	const queryData = useQuery({
		queryKey: [queryKeys.PAGE_PERMISSIONS],
		queryFn: apiGetRolePermissionCount
	})
	return (
		<div className={css('dashboard-d', styles['permission-container'])}>
			{
				queryData.isLoading ? <Loading /> : null}
			{
				queryData.data ?
					<div className={styles['permission-content']}>
						<ul className={styles['list-conatiner']}>
							{
								queryData.data.map((item) => {
									return (
										<li className={styles['list-item']}
											key={`role-${item.id}`}>
											<Link
												className={styles['list-anchor']}
												to={item.id.toString()}>
												<div className={styles['item-left']}>
													<LuUsers2 />
													<span className={styles['name']}>
														{item.displayName}
													</span>
												</div>
												<div className={styles['item-right']}>
													<span
														className={styles['name']}
													>{language?.permissionsCount}</span>
													<span
														className={styles['name']}
													>
														{item.permissionsCount}
													</span>
												</div>
											</Link>
										</li>
									)
								})
							}
						</ul>
					</div>
					: null
			}
		</div>
	)
}
