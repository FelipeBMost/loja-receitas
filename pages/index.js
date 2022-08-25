import styles from '../styles/Home.module.css'
import Receita from '../component/Receitas'
import Nav from '../component/Nav'

export default function Home() {
  return (
    <main className={styles.main}>
      <Nav />
      <Receita receitas={receitas}/>
    </main>
  )
}

const receitas = [
  {
    titulo: 'Urso Kuma',
    imagem: `url(/ursoKuma.svg)`,
    src: './ursoKuma.svg',
    fundo: `url(/fundoBotoes.svg)`,
    corLinear: `linear-gradient(#8FBC8E, #F7F7F7)`,
    cor: '#8FBC8E',
    texto: {quantidade: 500, tamanho: 10, valor: 15}
  },
  {
    titulo: 'Ursa Vênus',
    imagem: `url(/ursaVenus.svg)`,
    src: './ursaVenus.svg',
    fundo: `url(/fundoBotoesRosa.svg)`,
    corLinear: `linear-gradient(#C394D3, #F7F7F7)`,
    cor: '#C394D3',
    texto: {quantidade: 700, tamanho: 20, valor: 25}
  }
];
