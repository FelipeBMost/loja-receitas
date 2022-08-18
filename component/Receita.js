import styles from '../styles/Galeria.module.css';
import { useState } from 'react'
import axios from 'axios'
import { crc16ccitt } from "crc";

export default function Receita ({ receitas}) {
  const [index, setIndex] = useState(0)
  const [noCarrinho] = useState([])
  const [contagem, setContagem] = useState(0)
  const [receita] = useState([...receitas])
  const [carrinhoAberto, setCarrinhoAberto] = useState(false)
  const [finalizado, setFinalizado] = useState(false)
  const [valorTotal, setValorTotal] = useState(0)
  const [contatoDiferente, setContatoDiferente] = useState(false)
  const [dadosValidados, setDadosValidados] = useState(false)

  const proximaReceita = () => {
    if(index !== receita.length - 1 && carrinhoAberto) {
      setCarrinhoAberto(false)
      setIndex(index+1)
    } else if (index !== receita.length - 1) {
      setIndex(index+1)
    }
  }

  const receitaAnterior = () => {
    if(index !== 0 && carrinhoAberto) {
      setCarrinhoAberto(false)
      setIndex(index-1)
    } else if (index !== 0) {
      setIndex(index-1)
    }
  }
  
  const mudarCarrinho = () => {
    if(noCarrinho.indexOf(index) === -1){
      noCarrinho.push(index)
      setContagem(contagem + 1)
    } else if (noCarrinho.length > 1) {
      noCarrinho.splice(noCarrinho.indexOf(index), 1)
      setContagem(contagem - 1)
    } else if (noCarrinho.length === 1) {
      noCarrinho.splice(noCarrinho.indexOf(index), 1)
      setContagem(contagem - 1)
      setCarrinhoAberto(false) 
    }
  }

  const abrirFecharCarrinho = () => {
    if(carrinhoAberto === true) {
      setCarrinhoAberto(false)
    } else if(carrinhoAberto === false) {
      setCarrinhoAberto(true)
    } 
  }

  const finalizarCompra = () => {
    setCarrinhoAberto(false)
    setFinalizado(true)
    const total = noCarrinho
      .map((el) => {return receita[el].texto.valor})
      .reduce((x, y) => x + y)
      setValorTotal(total.toString() + '.00')
  }

  const voltarParaCarrinho = () => {
    setCarrinhoAberto(true)
    setFinalizado(false)
    setDadosValidados(false)
  }

  
    
  

 const validarDados = (e) => {
   e.preventDefault();
   setContatoDiferente(false)
   setDadosValidados(false)
   if(e.target.contato.value === e.target.confirmarContato.value){
     axios.post('https://sheetdb.io/api/v1/58f61be4dda40', { 
        'data': { 
        'id': 'INCREMENT',
        'name': e.target.contato.value,
        'comment': noCarrinho,
        'age': '80',
        }
        
      }).then(response => {
        setDadosValidados(true)
      }).catch(error => {
        alert('Favor tentar novamente')
      });
   } else {
     setDadosValidados(false)
     setContatoDiferente(true)
   }
 }

  const copiarCodigo = () => {
      const codigo = '00020126360014BR.GOV.BCB.PIX0114+5551993392378520400005303986540'+ valorTotal.length + valorTotal + '5802BR5925Felipe Bolzan Mostardeiro6009SAO PAULO61080540900062070503***6304'
      let crc = crc16ccitt(codigo).toString(16).toUpperCase();
      if (crc.length === 3) {
      crc = '0'+ crc
      }
      const codigoFinal = codigo + crc
      navigator.clipboard.writeText(codigoFinal).then(() => {
        alert('Copiado para a Área de Transferência')
      }) 

  }

  return (
    <>
{/*------------------- PÁGINA PRINCIPAL / RECEITA ---------------- */}

    <div id='galeria' className={styles.galeria} style={{backgroundImage: receita[index].imagem}}>
      <h2 id={styles.tituloReceita}>{receita[index].titulo}</h2>
    </div>
    <div id={styles.descricaoReceita}>
      <p>Quantidade de linha: {receita[index].texto.quantidade}m</p>
      <p>Tamanho: {receita[index].texto.tamanho}cm</p>
      <p>Valor: R${receita[index].texto.valor},00</p>
      <div id={styles.maisInformacoes}>Mais informações...</div>
    </div>

{/*----------------------------- BOTÕES -------------------------- */}
    
    <div className={styles.container}>
      <button onPointerDown={mudarCarrinho}>
      { noCarrinho.indexOf(index) === -1
      ? <img src='./sacolaMais.png' /> 
      : <img src='./sacolaMenos.png' />
      }
      </button>
      <div className={styles.container}>
        { index !== 0 
          ? (
            <button onPointerDown={receitaAnterior}>
            <img src='./dotArrowLeft.png' />
            </button>
          )
          : (
            <button disabled >
            <img src='./dotArrowLeftGray.png' />
            </button>
          )
        }
        { index < receita.length - 1
          ? (
            <button onPointerDown={proximaReceita}>
            <img src='./dotArrowRight.svg' />
            </button>
          )
          : (
            <button disabled>
            <img src='./dotArrowRightGray.png' />
            </button>
          )
        }
      
      </div>
      <div className={styles.container}>
        { noCarrinho.length > 0
        ? (
          <button id={styles.sacola} onPointerDown={abrirFecharCarrinho}>
          <img src='./bag.svg' />
          <span id={styles.contagemItens}>{contagem}</span>
          </button>
        )
        : (
        <button id={styles.sacola}>
        </button>)
        }
        
      </div>
    </div>
    <div className={styles.containerSpan}>
      {noCarrinho.indexOf(index) === -1
      ? <span>Adicionar</span>
      : <span>Remover</span>
    }
      <div className={styles.containerSpan}>
        <span>
          Anterior
        </span>
        <span>
          Proxima
        </span>
      </div>
      <span>
        {noCarrinho.length > 0 && 'Sacola'}
      </span>
    </div>
    {/*-------------------------- CARRINHO------------------------ */}

    {carrinhoAberto && (
      <div className={styles.carrinho}>
        <div> {noCarrinho.map((el, key) => 
          <div key={key} className={styles.itemCarrinho}>
            <img width='60'src={receita[el].src}/>
            <div className={styles.textoItem}>
              <h3>{receita[el].titulo}</h3>
              <p>R$ {receita[el].texto.valor},00</p>
            </div>   
          </div>
          )}
        </div>
        <div className={styles.botoesCarrinho}>
          <button onPointerDown={abrirFecharCarrinho}>
            Voltar
          </button>
          <button onPointerDown={finalizarCompra}>
              Finalizar
          </button>
        </div>
      </div>
    )} 

{/*-------------------------- CHECKOUT------------------------ */}

    {finalizado && 
      <div className={styles.carrinho}>
        <div>
          <form id={styles.formulario} onSubmit={(e) => {validarDados(e)}}>
            <p>Informe um email ou whatsapp para receber a(s) receita(s) no formato PDF em até 24h. Caso não receba, entre em contato.</p>
            <label htmlFor='contato'>Email / Whatsapp (DDD + Número): 
              <input required type='text' id='contato' name='contato'></input>
            </label>
            <label htmlFor='confirmarContato'>Confirmar Email / Whatsapp: 
              <input required type='text' id='confirmarContato' name='confirmarContato'></input>
            </label>
            <button>Validar contato</button>
            {contatoDiferente && 
            <div>
              <span>Contatos diferentes</span>
            </div>}
          </form>
          {dadosValidados && 
          <div className={styles.containerPix}>
            <p>Toque no botão para copiar o código Pix.</p>
            <button onPointerDown={copiarCodigo}>Copiar código Pix</button>
          </div>}
          
        </div>
        <div className={styles.botoesCarrinho}>
          <button onPointerDown={voltarParaCarrinho}>
              Voltar
          </button>
        </div>
      </div>
        }
    </>
  )
}