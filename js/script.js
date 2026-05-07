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

btnAdd.addEventListener('click', () => {
    const div = document.createElement('div')

    div.innerHTML += `<div class="card">
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
})

cards.addEventListener('click', (evt) => {
    const btnRadio = evt.target.closest('.cardRadio button')
    
    if(btnRadio){
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

    if(btnExcluir){
        const cardParaRemover = btnExcluir.closest('.card')
        cardParaRemover.remove()
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

const botoesCategoria = document.querySelectorAll('[data-category-btn]'); // Adicione esse atributo no HTML dos botões do aside

const filtrarPorCategoria = (categoriaSelecionada) => {
    const todosCards = document.querySelectorAll('.card');

    todosCards.forEach(card => {
        const categoriaDoCard = card.getAttribute('data-category');

        if (categoriaSelecionada === 'all' || categoriaDoCard === categoriaSelecionada) {
            card.style.display = 'flex'; // Mostra o card
        } else {
            card.style.display = 'none'; // Esconde o card
        }
    });
};

// Exemplo de como chamar no botão Trabalho:
btnTrabalho.addEventListener('click', () => filtrarPorCategoria('trabalho'));