// Atividade 2 - Estados e cidades com a API do IBGE
// Aluno(a): Thaíssa Victória Bianchini de Oliveira

const selectEstado = document.getElementById('estado')
const selectCidade = document.getElementById('cidade')
const qtdCidades = document.getElementById('qtdCidades')
const filtroCidade = document.getElementById('filtroCidade')
const resumo = document.getElementById('resumo')

const URL_ESTADOS = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'

let cidadesDoEstado = []

function carregarEstados() {
    fetch(URL_ESTADOS)
        .then(resposta => resposta.json())
        .then(estados => {
            console.log(estados)
            selectEstado.innerHTML = '<option value="">Selecione o estado</option>'

            estados.forEach(estado => {
                const opcao = document.createElement('option')
                opcao.value = estado.sigla
                opcao.textContent = estado.nome
                selectEstado.appendChild(opcao)
            })
        })
        .catch(() => {
            selectEstado.innerHTML = '<option value="">Erro ao carregar estados</option>'
        })
}

function preencherCidades(lista) {
    if (lista.length === 0) {
        selectCidade.innerHTML = '<option value="">Nenhuma cidade encontrada</option>'
        return
    }

    selectCidade.innerHTML = '<option value="">Selecione a cidade</option>'

    lista.forEach(cidade => {
        const opcao = document.createElement('option')
        opcao.value = cidade.nome
        opcao.textContent = cidade.nome
        selectCidade.appendChild(opcao)
    })
}

function normalizar(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

selectEstado.addEventListener('change', () => {
    const uf = selectEstado.value

    cidadesDoEstado = []
    filtroCidade.value = ''
    filtroCidade.disabled = true
    qtdCidades.textContent = ''
    qtdCidades.classList.remove('erro')

    if (uf === '') {
        selectCidade.innerHTML = '<option value="">Escolha um estado primeiro</option>'
        selectCidade.disabled = true
        return
    }

    selectCidade.innerHTML = '<option value="">Carregando...</option>'
    selectCidade.disabled = true

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
        .then(resposta => resposta.json())
        .then(cidades => {
            cidadesDoEstado = cidades.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))

            preencherCidades(cidadesDoEstado)
            selectCidade.disabled = false
            filtroCidade.disabled = false

            const nomeEstado = selectEstado.options[selectEstado.selectedIndex].text
            qtdCidades.textContent = `${nomeEstado} tem ${cidades.length} cidades.`
        })
        .catch(() => {
            selectCidade.innerHTML = '<option value="">Erro ao carregar cidades</option>'
            qtdCidades.textContent = 'Não foi possível carregar as cidades. Tente novamente.'
            qtdCidades.classList.add('erro')
        })
})

filtroCidade.addEventListener('input', () => {
    const termo = normalizar(filtroCidade.value)
    const filtradas = cidadesDoEstado.filter(cidade => normalizar(cidade.nome).includes(termo))
    preencherCidades(filtradas)
})

document.getElementById('formInscricao').addEventListener('submit', (evento) => {
    evento.preventDefault()

    const nome = document.getElementById('nome').value.trim()
    const uf = selectEstado.value
    const cidade = selectCidade.value

    if (uf === '' || cidade === '') {
        resumo.textContent = 'Escolha o estado e a cidade antes de se inscrever.'
        resumo.classList.add('erro')
        return
    }

    resumo.classList.remove('erro')
    resumo.textContent = `${nome}, de ${cidade}/${uf}, inscrito com sucesso`
})

carregarEstados()
