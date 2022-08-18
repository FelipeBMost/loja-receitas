import { crc16ccitt } from "crc";

const valor = '140.00'

// Código para o QRCODE
const codigo = '00020126360014BR.GOV.BCB.PIX0114+5551993392378520400005303986540'+ valor.length + valor + '5802BR5925Felipe Bolzan Mostardeiro6009SAO PAULO61080540900062070503***6304'; 

// CRC do cógido acima
let crc = crc16ccitt(codigo).toString(16).toUpperCase(); 

// Se o primeiro número do crc for 0, a função toString(16) apaga-o, então é necessário readicioná-lo
if (crc.length === 3) {
  crc = '0'+ crc
}

// Transformamos o código em URL
const encodedUri = encodeURIComponent(codigo) 
// Incluimos o crc na URL
let imgSrc = encodedUri.concat(crc); 

// Passamos a api do google que gera o QRCODE no src da nossa imagem
const googleApi = 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl='
const qrcode = googleApi.concat(imgSrc);

// Adicionamos o src à imagem no documento

document.querySelector('#qrcode').setAttribute('src', qrcode)