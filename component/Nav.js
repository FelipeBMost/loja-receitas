import styles from '../styles/Nav.module.css'

function nav() {
  return (
    <nav id={styles.nav}>
      <img id={styles.logo} src='/logo.png'/>
      <div className={styles.containerIcones}>
        <button href='https://wa.me/5551997997137'>
          <img className={styles.icones} src='./whatsapp.svg'></img>
        </button>
        
        <img className={styles.icones} src='./instagram.svg' href='#'></img>
      </div>
    </nav>
  )
}

export default nav