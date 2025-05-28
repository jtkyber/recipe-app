import styles from '../styles/navigation.module.scss';

function Navigation() {
	return (
		<nav className={styles.container}>
			<div className={styles.left}>
				<h2>Recipe App</h2>
			</div>
			<div className={styles.right}>
				<h4>Nav Bar Right</h4>
			</div>
		</nav>
	);
}

export default Navigation;
