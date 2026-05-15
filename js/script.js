import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBaBcTaPW0Ej6kgxdO-fdtJklDuUlm37nI",
    authDomain: "taskflow-36b6b.firebaseapp.com",
    projectId: "taskflow-36b6b",
    storageBucket: "taskflow-36b6b.firebasestorage.app",
    messagingSenderId: "1038187244161",
    appId: "1:1038187244161:web:102b1d21c1fc7eae55fb80",
    measurementId: "G-C1K8D7HJ5R"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
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
    const total = cards.querySelectorAll('.card').length
    num_tarefas.innerHTML = `${total} Tarefas`
}

const renderizarTarefaNaTela = (tarefa, idNoBanco) => {
    const div = document.createElement('div')
    const categoriaMinuscula = tarefa.categoria.toLowerCase()
    const prioridadeMinuscula = tarefa.prioridade.toLowerCase()

    div.innerHTML += `<div class="card" data-category="${categoriaMinuscula}" data-prioridade="${prioridadeMinuscula}" data-date="${tarefa.data}" data-id="${idNoBanco}">
        <div class="cardHeader">
            <div class="cardRadio">
                <button><i class="fa-regular fa-circle"></i></button>
            </div>
            <div class="cardContent">
                <h3>${tarefa.titulo}</h3>
                <p>${tarefa.descricao}</p>
            </div>
                <div class="btnsCard">
                <button class="btnEditCard"><i class="fa-solid fa-pencil"></i></button>
                <button class="btnCloseCard"><i class="fa-regular fa-trash-can"></i></button>
            </div>
        </div>
        <div class="cardLevel">
            <span class="${categoriaMinuscula}">${tarefa.categoria}</span>
            <span class="${prioridadeMinuscula}">${tarefa.prioridade}</span>
        </div>
        <div class="modalData">
            <span class="dataText">${tarefa.data}</span>
        </div>
    </div>`

    cards.appendChild(div)
}

const carregarTarefas = async (userId) => {
    cards.innerHTML = ''

    const q = query(collection(db, "tarefas"), where("userId", "==", userId))
    const querySnapshot = await getDocs(q)

    querySnapshot.forEach((documento) => {
        renderizarTarefaNaTela(documento.data(), documento.id)
    })

    atualizarContador()
}

btnAdd.addEventListener('click', async () => {
    const user = auth.currentUser

    if (!user) {
        alert("Você precisa fazer login para criar tarefas!")
        return
    }

    const novaTarefa = {
        titulo: in_titulo.value,
        descricao: in_descricao.value,
        categoria: in_categoria.value,
        prioridade: in_prioridade.value,
        data: in_data.value,
        userId: user.uid
    };

    try {
        const docRef = await addDoc(collection(db, "tarefas"), novaTarefa)

        renderizarTarefaNaTela(novaTarefa, docRef.id)

        in_titulo.value = ''
        in_descricao.value = ''
        in_categoria.value = ''
        in_prioridade.value = ''
        in_data.value = ''
        modal.close()
        atualizarContador()
    } catch (e) {
        console.error("Erro ao adicionar documento: ", e)
    }
});

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
        const idNoBanco = cardParaRemover.getAttribute('data-id')

        // Deleta do Firestore usando o ID
        deleteDoc(doc(db, "tarefas", idNoBanco)).then(() => {
            cardParaRemover.remove()
            atualizarContador()
        }).catch((error) => {
            console.error("Erro ao deletar: ", error)
        })
    }

    const btnEditar = event.target.closest('.btnEditCard')

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
    const usuarioSalvo = localStorage.getItem('usuario')

    if (usuarioSalvo) {
        const confirmar = confirm("Deseja sair da sua conta?")
        if (confirmar) {
            signOut(auth).then(() => {
                localStorage.removeItem('usuario')
                btnModalLogin.innerHTML = 'U'
                loginHeaderH4.innerHTML = ''
                alert("Você saiu da conta.")
            }).catch((error) => {
                console.error("Erro ao sair:", error)
            });
        }
    } else {
        modalLogin.showModal()
    }
});
const in_usuario = document.querySelector('#in_usuario')
const in_senha = document.querySelector('#in_senha')
const loginBtn = document.querySelector('.loginBtn button')
const loginHeader = document.querySelector('.loginHeader')
const loginHeaderH4 = document.querySelector('.loginHeader h4')

loginBtn.addEventListener('click', async (e) => {
    e.preventDefault()

    const email = in_usuario.value
    const senha = in_senha.value

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, senha)

        localStorage.setItem('usuario', email)
        btnModalLogin.innerHTML = email.charAt(0).toUpperCase()
        loginHeaderH4.innerHTML = email

        modalLogin.close()
        alert("Login realizado com sucesso!")
    } catch (error) {
        console.error("Erro no login:", error.code)
        alert("E-mail ou senha incorretos.")
    }
})

const verificarLogin = () => {
    const usuarioSalvo = localStorage.getItem('usuario')

    if (usuarioSalvo) {
        loginHeaderH4.innerHTML = usuarioSalvo
        btnModalLogin.innerHTML = usuarioSalvo.charAt(0).toUpperCase()
    } else {
        modalLogin.showModal()
    }
}

verificarLogin()


const modalCadastro = document.querySelector('.modalCadastro')
const btnCadastro = document.querySelector('.criarConta button')
const btnEfetuarCadastro = document.querySelector('.btnCadastro')
const btnCloseCadastro = document.querySelector('.btnCloseCadastro')
const in_usuarioCadastro = document.querySelector('#in_usuarioCadastro')
const in_emailCadastro = document.querySelector('#in_emailCadastro')
const in_senhaCadastro = document.querySelector('#in_senhaCadastro')

btnCloseCadastro.addEventListener('click', () => {
    modalCadastro.close()
})

btnCadastro.addEventListener('click', () => {
    modalLogin.close()
    modalCadastro.showModal()
})

btnEfetuarCadastro.addEventListener('click', async (e) => {
    e.preventDefault()

    const email = in_emailCadastro.value
    const senha = in_senhaCadastro.value
    const nome = in_usuarioCadastro.value

    try {
        // Envia para o Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha)
        const user = userCredential.user

        localStorage.setItem('usuario', nome)

        alert("Conta criada com sucesso!")
        modalCadastro.close()
        verificarLogin();

    } catch (error) {
        console.error("Erro:", error.code)
        if (error.code === 'auth/weak-password') alert("A senha deve ter pelo menos 6 dígitos.")
        else if (error.code === 'auth/email-already-in-use') alert("Este e-mail já está cadastrado.")
        else alert("Erro ao cadastrar: " + error.message)
    }
})

onAuthStateChanged(auth, (user) => {
    if (user) {
        carregarTarefas(user.uid)
    } else {
        document.querySelector('.cards').innerHTML = ''
        atualizarContador()
    }
})

const btnEsqueciSenha = document.querySelector('.esquecerSenha a')

btnEsqueciSenha.addEventListener('click', async (e) => {
    e.preventDefault(); 

    const email = in_usuario.value;

    if (!email) {
        alert("Por favor, digite seu e-mail no campo 'Usuário' antes de clicar em esqueci a senha.");
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email)
        alert("Um e-mail de redefinição de senha foi enviado para: " + email + ". Verifique sua caixa de entrada (ou spam)!")
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error.code)
        if (error.code === 'auth/invalid-email') {
            alert("Por favor, digite um endereço de e-mail válido.")
        } else if (error.code === 'auth/user-not-found') {
            alert("Nenhuma conta encontrada com este e-mail.")
        } else {
            alert("Erro ao tentar redefinir a senha. Tente novamente.")
        }
    }
})