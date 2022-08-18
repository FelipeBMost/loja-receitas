import Receita from '../component/Receita'
import styles from '../styles/Home.module.css'
import Nav from '../component/Nav'

export default function Home() {
  return (
    <main>
      <Nav />
      <Receita receitas={receitas}/>
    </main>
  )
}

const receitas = [
  {
    titulo: 'Ursinho Kuma',
    imagem: `url(/kuma.jpeg)`,
    src: './kuma.jpeg',
    texto: {quantidade: 500, tamanho: 10, valor: 15}
  },
  {
    titulo: 'Ursinha Vênus',
    imagem: `url(/venus.png)`,
    src: './venus.png',
    texto: {quantidade: 700, tamanho: 20, valor: 25}
  },
  {
    titulo: 'Coelhinho',
    imagem: `url(/icone1.png)`,
    src: './icone1.png',
    texto: {quantidade: 900, tamanho: 30, valor: 40}
  },
];