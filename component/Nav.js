import styles from '../styles/Nav.module.css'

function nav() {
  return (
    <nav id={styles.nav}>
      <img id={styles.logo} src='/logo.png'/>
      <div className={styles.containerIcones}>
        <img className={styles.icones} src='./whatsapp.svg' href='#'></img>
        <img className={styles.icones} src='./instagram.svg' href='#'></img>
      </div>
    </nav>
  )
}

export default nav