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
  const [materiais, setMateriais] = useState(false)

  const toggleMateriais = () => {
    if(!materiais) {
      setMateriais(true)
    } else {
      setMateriais(false)
    }
  }

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
    noCarrinho.splice(noCarrinho.indexOf(el), 1)
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

  async function copiarCodigo(event) {
        if('clipboard' in navigator) {
          return await navigator.clipboard.writeText(event.target.value)
        } else {
          return document.execCommand('copy', true, event.target.value)
        }
  }

  return (
    <>
{/*------------------- PÁGINA PRINCIPAL / RECEITA ---------------- */}
{!carrinhoAberto &&
<>
    <div className={styles.receitaAtual} style={{backgroundImage: receita[index].imagem}}>
      <h1 className={styles.tituloReceita}>{receita[index].titulo}</h1>
    </div>
    <div className={styles.containerBotoes}>
        { index !== 0 
          ? <button className={styles.botao} style={{backgroundColor: receita[index].cor}} onPointerDown={receitaAnterior}>
              <img src='./flechaEsquerda.svg' width={25} height={25} />
              <p>Anterior</p>
            </button>
          : <div className={styles.botao}>
              <button className={styles.botaoEscondido} disabled >
              </button>
            </div>
        }
        { index < receita.length - 1
          ? <button className={styles.botao} style={{backgroundColor: receita[index].cor}} onPointerDown={proximaReceita}>
              <p>Próxima</p>
              <img src='./flechaDireita.svg' width={25} height={25} />
            </button>
          : (
            <button className={styles.botao} disabled>
            </button>
          )
        }
      </div>
    <div className={styles.descricaoReceita} style={{backgroundImage: receita[index].corLinear}}>
      { materiais
      ? <><ul className="listaMateriais">
      <li>{receita[index].lista[0]}</li>
      <li>{receita[index].lista[1]}</li>
      <li>{receita[index].lista[2]}</li>
      <li>{receita[index].lista[3]}</li>
      <li>{receita[index].lista[4]}</li>
    </ul>
    </>
      : <><p>Qt. de linha: {receita[index].texto.quantidade}m</p>
      <p>Tamanho: {receita[index].texto.tamanho}cm</p>
      <p>Valor: R${receita[index].texto.valor},00</p>
      </>
      }
      {materiais
      ? <div className={styles.botaoMateriais} style={{backgroundColor: receita[index].cor}} onClick={toggleMateriais}>Voltar</div>
      : <div className={styles.botaoMateriais} style={{backgroundColor: receita[index].cor}} onClick={toggleMateriais}>Materiais</div>
      }
    </div>

{/*--------------------------- BOTÕES ------------------------ */}
    <div className={styles.containerBotoes}>
        { noCarrinho.indexOf(index) === -1
        ? <button className={styles.botaoAdicionar} onPointerDown={mudarCarrinho}>
          <p>Adicionar ao carrinho</p>
        </button>
        : <button className={styles.botaoRemover} onPointerDown={mudarCarrinho}>
          <p>Remover do carrinho</p>
        </button>
        }
          <button className={styles.botaoCarrinho} onPointerDown={abrirFecharCarrinho}>
            <p>Ver carrinho</p>
            <span id={styles.contagemItens}>{contagem}</span>
          </button>
    </div> 
    </>
    }
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
              <button className={styles.botaoRemover} onPointerDown={() => removerDoCarrinho(el)}></button>
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
              Pagar
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
            <label htmlFor='contato'>Email / Whatsapp (DDD + Número) <br />para receber as receitas: 
              <input required type='text' id='contato' name='contato' maxLength='35'></input>
            </label>
            <label htmlFor='confirmarContato'>Digite novamente:
              <input required type='text' id='confirmarContato' name='confirmarContato' maxLength='35'></input>
            </label>
            <button>{validando ? 'Validando...' : 'Receber código Pix'}</button>
            {contatoDiferente && 
            <div>
              <span>Contatos diferentes</span>
            </div>}
            {dadosValidados && 
          <div>
            <p>Toque para copiar o código Pix.</p>
            <textarea type='text' value={codigo} readOnly rows='4' cols='35' onPointerDown={copiarCodigo}></textarea>
            <p>Após confirmação do pagamento, receberás a(s) receita(s) no formato PDF em até 12h. 
              <br />Caso não receba, entre em contato comigo no whats ou insta.
            </p>
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