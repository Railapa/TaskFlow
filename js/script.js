// Importe as funções que você precisa dos SDKs que você precisa
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Sua configuração do Firebase (COPIE EXATAMENTE DO SEU CONSOLE)
const firebaseConfig = {
  apiKey: "AIzaSyBa8cTaPW0Ej6kgxd0-fdtJklDuUlm37nI",
  authDomain: "taskflow-36b6b.firebaseapp.com",
  projectId: "taskflow-36b6b",
  storageBucket: "taskflow-36b6b.appspot.com",
  messagingSenderId: "1038187244161",
  appId: "1:1038187244161:web:102b1d21c1fc7eae55fb80",
  measurementId: "G-C1K8D7HJ5R"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Para o login/cadastro
const db = getFirestore(app); // Para salvar as tarefas

const show = document.querySelector('.show')
const btnFiltros = document.querySelectorAll('.btnFiltros')

btnFiltros.forEach(btn => {
    btn.addEventListener('click', (evt) => {
        btnFiltros.forEach(outroBtn => {
            outroBtn.classList.remove('hoverFiltros')
        })

        btn.classList.add('hoverFiltros')
    })
})

const modal = document.querySelector('#modal')
const closeModal = document.querySelector('.closeModal')
const btnCancelar = document.querySelector('.btnCancelar')
const openModal = document.querySelector('.openModal')

closeModal.addEventListener('click', () => {
    modal.close()
})

openModal.addEventListener('click', () => {
    modal.showModal()
})

btnCancelar.addEventListener('click', () => {
    modal.close()
})


const overlay = document.querySelector('#overlay')
const aside = document.querySelector('#aside')
const menuHamburguer = document.querySelector('.menuHamburguer')

menuHamburguer.addEventListener('click', () => {
    aside.classList.toggle('show')
    overlay.classList.toggle('overlay-active')
})

overlay.addEventListener('click', () => {
    overlay.classList.remove('overlay-active')
    aside.classList.remove('show')
})

const in_titulo = document.querySelector('#in_titulo')
const in_descricao = document.querySelector('#in_descricao')
const in_categoria = document.querySelector('#in_categoria')
const in_prioridade = document.querySelector('#in_prioridade')
const in_data = document.querySelector('#in_data')
const btnAdd = document.querySelector('.btnAdd')
const cards = document.querySelector('.cards')
const num_tarefas = document.querySelector('.num_tarefas')

const text_categoria = document.querySelector('.text_categoria')
const text_prioridade = document.querySelector('.text_prioridade')
const card = document.querySelector('.card')

const atualizarContador = () => {
    const total = cards.querySelectorAll('.card').length;
    num_tarefas.innerHTML = `${total} Tarefas`;
}

btnAdd.addEventListener('click', () => {
    const div = document.createElement('div')
    const categoriaMinuscula = in_categoria.value.toLowerCase()
    const prioridade = in_prioridade.value.toLowerCase()

    div.innerHTML += `<div class="card" data-category="${categoriaMinuscula}" data-prioridade="${prioridade}" data-date="${in_data.value}">
                <div class="cardHeader">
                    <div class="cardRadio">
                        <button>
                            <i class="fa-regular fa-circle"></i>
                        </button>
                    </div>

                    <div class="cardContent">
                        <h3>${in_titulo.value}</h3>
                        <p>${in_descricao.value}</p>
                    </div>

                     <div class="btnsCard">
                        <button class="btnEditCard"><i class="fa-solid fa-pencil"></i></button>
                        <button class="btnCloseCard"><i class="fa-regular fa-trash-can"></i></button>
                    </div>
                </div>
                <div class="cardLevel">
                    <span class="${in_categoria.value.toLowerCase()}">${in_categoria.value}</span>
                    <span class="${in_prioridade.value.toLowerCase()}">${in_prioridade.value}</span>
                </div>

                <div class="modalData">
                    <span class="dataText">${in_data.value}</span>
                </div>
            </div>`




    in_titulo.value = ''
    in_descricao.value = ''
    in_categoria.value = ''
    in_prioridade.value = ''
    in_data.value = ''
    modal.close()
    cards.appendChild(div)
    atualizarContador()
})

cards.addEventListener('click', (evt) => {
    const btnRadio = evt.target.closest('.cardRadio button')

    if (btnRadio) {
        const cardPai = btnRadio.closest('.card')

        const titulo = cardPai.querySelector('h3')
        const descricao = cardPai.querySelector('p')
        const icone = btnRadio.querySelector('i')

        titulo.classList.toggle('concluida')
        descricao.classList.toggle('concluida')

        icone.classList.toggle('fa-circle')
        icone.classList.toggle('fa-circle-check')
    };

    const btnExcluir = evt.target.closest('.btnCloseCard')

    if (btnExcluir) {
        const cardParaRemover = btnExcluir.closest('.card')
        cardParaRemover.remove()
        atualizarContador()
    }

    const btnEditar = event.target.closest('.btnEditCard');

    if (btnEditar) {
        const cardEditar = btnEditar.closest('.card')

        const tituloAtual = cardEditar.querySelector('h3').innerHTML
        const descricaoAtual = cardEditar.querySelector('p').innerHTML

        in_titulo.value = tituloAtual
        in_descricao.value = descricaoAtual

        modal.showModal()

        cardEditar.remove()
    }
})


const btnTodasTarefas = document.querySelector('.btnTodasTarefas')
const btnHojeTarefas = document.querySelector('.btnHojeTarefas')
const btnImprtantesTarefas = document.querySelector('.btnImprtantesTarefas')

const btnTrabalho = document.querySelector('.btnTrabalho')
const btnEstudos = document.querySelector('.btnEstudos')
const btnPessoal = document.querySelector('.btnPessoal')

const botoesCategoria = document.querySelectorAll('[data-category-btn]')

const filtrarPorCategoria = (categoriaSelecionada) => {
    const todosCards = document.querySelectorAll('.card')

    todosCards.forEach(card => {
        const categoriaDoCard = card.getAttribute('data-category')
        const prioridadeDoCard = card.getAttribute('data-prioridade')

        if (categoriaSelecionada === 'all' || categoriaDoCard === categoriaSelecionada || prioridadeDoCard === categoriaSelecionada) {
            card.style.display = 'flex'
        } else {
            card.style.display = 'none'
        }
    })
}

btnTrabalho.addEventListener('click', () => filtrarPorCategoria('trabalho'))
btnEstudos.addEventListener('click', () => filtrarPorCategoria('estudos'))
btnPessoal.addEventListener('click', () => filtrarPorCategoria('pessoal'))
btnTodasTarefas.addEventListener('click', () => filtrarPorCategoria('all'))
btnImprtantesTarefas.addEventListener('click', () => filtrarPorCategoria('alta'))

btnHojeTarefas.addEventListener('click', () => {
    const data = new Date()
    let dia = data.getDate()
    dia = dia < 10 ? '0' + dia : dia

    let mes = data.getMonth() + 1
    mes = mes < 10 ? '0' + mes : mes

    let ano = data.getFullYear()

    let dataFormatada = `${ano}-${mes}-${dia}`

    const todosCards = document.querySelectorAll('.card')

    todosCards.forEach(card => {
        const dataCard = card.getAttribute('data-date')

        if (dataCard == dataFormatada) {
            card.style.display = 'flex'
        } else {
            card.style.display = 'none'
        }
    })
})

const in_buscar = document.querySelector('#in_buscar')

const functionFiltro = () => {
    const todosCards = document.querySelectorAll('.card')

    if (in_buscar.value != '') {
        todosCards.forEach(card => {
            let titleCard = card.querySelector('h3')
            titleCard = titleCard.textContent.toLowerCase()

            const textFilter = in_buscar.value.toLowerCase()

            if (titleCard.includes(textFilter)) {
                card.style.display = 'flex'
            } else {
                card.style.display = 'none'
            }
        })
    } else {
        todosCards.forEach(card => {
            card.style.display = 'flex'
        })
    }
}

in_buscar.addEventListener('input', functionFiltro)

const modalLogin = document.querySelector('.modalLogin')
const btnModalLogin = document.querySelector('.iconeLogin button')
const loginBtnClose = document.querySelector('.loginBtnClose')

loginBtnClose.addEventListener('click', () => {
    modalLogin.close()
})

btnModalLogin.addEventListener('click', () => {
    modalLogin.showModal()
})

const in_usuario = document.querySelector('#in_usuario')
const loginBtn = document.querySelector('.loginBtn button')
const loginHeader = document.querySelector('.loginHeader')
const loginHeaderH4 = document.querySelector('.loginHeader h4')

loginBtn.addEventListener('click', () => {
    const usuario = in_usuario.value
    localStorage.setItem('usuario', usuario)
    btnModalLogin.innerHTML = usuario.charAt(0).toUpperCase()

    loginHeaderH4.innerHTML = usuario

    modalLogin.close()
})

const verificarLogin = () => {
    const usuarioSalvo = localStorage.getItem('usuario')

    if(usuarioSalvo){
        loginHeaderH4.innerHTML = usuarioSalvo
        btnModalLogin.innerHTML = usuarioSalvo.charAt(0).toUpperCase()
    } else {
        modalLogin.showModal()
    }
}

verificarLogin()


const modalCadastro = document.querySelector('.modalCadastro')
const btnCadastro = document.querySelector('.criarConta button')
const btnCloseCadastro = document.querySelector('.btnCloseCadastro')

btnCloseCadastro.addEventListener('click', () => {
    modalCadastro.close()
})

btnCadastro.addEventListener('click', () => {
    modalLogin.close()
    modalCadastro.showModal()
})