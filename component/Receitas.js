import styles from '../styles/Receitas.module.css';
import axios from 'axios'
import { useState } from 'react'
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
  const [validando, setValidando] = useState(false)
  const [codigo, setCodigo] = useState('')

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

  const removerDoCarrinho = (el) =>{
    noCarrinho.splice(el, 1)
    setContagem(contagem - 1)
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
      setValidando(true)
      axios.post('https://sheetdb.io/api/v1/58f61be4dda40', { 
        'data': { 
        'id': 'INCREMENT',
        'name': e.target.contato.value,
        'comment': noCarrinho,
        'age': '80',
        }
        
      }).then(() => {
        setDadosValidados(true)
        setValidando(false)
        const codigo = '00020126' + (40 + e.target.contato.value.length) + '0014BR.GOV.BCB.PIX0114+555199339237802';
        const mensagem = e.target.contato.value.length + e.target.contato.value;
        const finalDoCodigo = '5802BR5925Felipe Bolzan Mostardeiro6009SAO PAULO61080540900062070503***6304';
        if(e.target.contato.value.length < 10) {
        codigo = codigo + '0' + mensagem + '520400005303986540'+ valorTotal.length + valorTotal + finalDoCodigo
      } else {
        codigo = codigo + mensagem + '520400005303986540'+ valorTotal.length + valorTotal + finalDoCodigo;
      } 
        let crc = crc16ccitt(codigo).toString(16).toUpperCase();
        if (crc.length === 3) {
        crc = '0'+ crc
        }
        const codigoFinal = codigo + crc
        setCodigo(codigoFinal)
      }).catch(() => {
        alert('Favor, tentar novamente')
        setValidando(false)
      });
   } else {
     setDadosValidados(false)
     setContatoDiferente(true)
   }
 }

  const copiarCodigo = async (event) => {
    event.preventDefault();
      try {
        if(navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(event.target.value)
        } else {
          event.target.value.select();
        }
      } catch (e) {
        console.error('e', e)
      }
  }

  return (
    <>
{/*------------------- PÁGINA PRINCIPAL / RECEITA ---------------- */}

    <div className={styles.receitaAtual} style={{backgroundImage: receita[index].imagem}}>
      <h1 className={styles.tituloReceita}>{receita[index].titulo}</h1>
    </div>
    <div className={styles.descricaoReceita} style={{backgroundImage: receita[index].corLinear}}>
      <p>Qt. de linha: {receita[index].texto.quantidade}m</p>
      <p>Tamanho: {receita[index].texto.tamanho}cm</p>
      <p>Valor: R${receita[index].texto.valor},00</p>
      <div className={styles.materiais} style={{backgroundColor: receita[index].cor}}>Materiais</div>
    </div>

{/*--------------------------- BOTÕES ------------------------ */}
    <div className={styles.containerBotoes} style={{backgroundImage: receita[index].fundo}}>
        { noCarrinho.indexOf(index) === -1
        ? <button className={styles.botaoAdicionar} onPointerDown={mudarCarrinho}></button>
        : <button className={styles.botaoRemover} onPointerDown={mudarCarrinho}></button>
        }
      
      <div className={styles.containerFlechas}>
        { index !== 0 
          ? (
            <button className={styles.flechaEsquerda}  onPointerDown={receitaAnterior}>
            </button>
          )
          : (
            <button className={styles.flechaEsquerdaCinza} disabled >
            </button>
          )
        }
        { index < receita.length - 1
          ? (
            <button className={styles.flechaDireita} onPointerDown={proximaReceita}>
            </button>
          )
          : (
            <button className={styles.flechaDireitaCinza} disabled>
            </button>
          )
        }
      </div>
      <div className={styles.sacola} onPointerDown={abrirFecharCarrinho}>
        { noCarrinho.length >= 0
        ? (
          <button>
          <span id={styles.contagemItens}>{contagem}</span>
          </button>
        )
        : (
        <button>
        </button>)
        }
      </div>
    </div> 
    {/*------------------FIM CONTAINER BOTÕES--------------------*/}
      
    {carrinhoAberto && (
      <div className={styles.containerCarrinho}>
        <div className={styles.carrinho}>
          <div> {noCarrinho.map((el, key) => 
            <div key={key} className={styles.itemCarrinho}>
              <img width='60'src={receita[el].src}/>
              <div className={styles.textoItem}>
                <h3>{receita[el].titulo}</h3>
                <p>R$ {receita[el].texto.valor},00</p>
              </div>
              <button className={styles.botaoRemover} onPointerDown={(key) => {removerDoCarrinho(key)}}></button>
            </div>
            )}
            {contagem === 0 && <h3 className={styles.mensagemCarrinho}>Carrinho Vazio</h3>}
          </div>
          <div className={styles.botoesCarrinho}>
            <button onPointerDown={abrirFecharCarrinho}>
              Voltar
            </button>
            {contagem > 0  &&
            <button onPointerDown={finalizarCompra}>
              Finalizar
            </button>
            }
          </div>
        </div>
      </div>
    )} 

{/*-------------------------- CHECKOUT------------------------ */}

    {finalizado && 
    <div className={styles.containerCarrinho}>
      <div className={styles.carrinho}>
        <div>
          <form id={styles.formulario} onSubmit={(e) => {validarDados(e)}}>
            <p>Informe um email ou whatsapp para receber a(s) receita(s) no formato PDF em até 12h após confirmação do pagamento. Caso não receba, entre em contato.</p>
            <label htmlFor='contato'>Email / Whatsapp (DDD + Número): 
              <input required type='text' id='contato' name='contato' maxLength='35'></input>
            </label>
            <label htmlFor='confirmarContato'>Confirmar Email / Whatsapp: 
              <input required type='text' id='confirmarContato' name='confirmarContato' maxLength='35'></input>
            </label>
            <button>{validando ? 'Validando...' : 'Validar contato'}</button>
            {contatoDiferente && 
            <div>
              <span>Contatos diferentes</span>
            </div>}
            {dadosValidados && 
          <div>
            <p>Toque para copiar o código Pix.</p>
            <textarea type='text' value={codigo} readOnly rows='4' cols='35' onPointerDown={copiarCodigo}></textarea>
          </div>}
          </form>
          
        </div>
        <div className={styles.botoesCarrinho}>
          <button onPointerDown={voltarParaCarrinho}>
              Voltar
          </button>
        </div>
      </div>
    </div>
    }
    </>
  )
}