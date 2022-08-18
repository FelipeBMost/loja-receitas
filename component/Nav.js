import styles from '../styles/Nav.module.css'

function nav() {
  return (
    <nav id={styles.nav}>
      <img id={styles.logo} src='/logo.png'/>
      <h1 id={styles.tituloNav}>Ana Salerno Crochet Design</h1>
    </nav>
  )
}

export default nav