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


const aside = document.querySelector('#aside')
const overlay = document.querySelector('#overlay')
const menuHamburguer = document.querySelector('.menuHamburguer')

menuHamburguer.addEventListener('click', () => {
    aside.classList.toggle('show')
    overlay.classList.toggle('active')
})

overlay.addEventListener('click', () => {
    aside.classList.remove('show')
    overlay.classList.remove('active')
})