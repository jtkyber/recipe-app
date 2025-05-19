import styles from '../styles/navigation.module.scss';

function Navigation() {
	return (
		<nav className={styles.container}>
			<div className={styles.left}>
				<h3>Nav Bar Left</h3>
			</div>
			<div className={styles.right}>
				<h3>Nav Bar Right</h3>
			</div>
		</nav>
	);
}

export default Navigation;
