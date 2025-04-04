const apiUrl = 'http://localhost/espocrm/api/v1/CProjeto';

// Função para criar um registro (POST)
async function criarRegistro(nome) {
    try {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const submitButton = document.querySelector('#createForm button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true; // Desabilitar o botão
        }

        // Fazer a requisição para a API
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            credentials: 'include', // Incluir cookies na requisição
            body: JSON.stringify({ name: nome }) // Enviar apenas o nome
        });

        const messageDiv = document.getElementById('message'); // Div para exibir mensagens

        if (!response.ok) {
            // Exibir mensagem de erro diretamente no `messageDiv`
            const errorMessage = `Erro ao criar registro: ${response.status}`;
            if (messageDiv) {
                messageDiv.innerHTML = `<div class="alert alert-danger">${errorMessage}</div>`;
            }
            return; // Encerrar a execução da função
        }

        const result = await response.json();
        console.log('Registro criado com sucesso:', result);

        // Exibir mensagem de sucesso
        if (messageDiv) {
            messageDiv.innerHTML = `<div class="alert alert-success">Registro criado com sucesso!</div>`;
        }

        // Limpar o campo de entrada
        const inputField = document.getElementById('name');
        if (inputField) {
            inputField.value = ''; // Limpar o campo de entrada
        }

        return result;
    } catch (error) {
        // Exibir mensagem de erro no elemento `messageDiv`
        const messageDiv = document.getElementById('message');
        if (messageDiv) {
            messageDiv.innerHTML = `<div class="alert alert-danger">Erro inesperado: ${error.message}</div>`;
        }

        // Log simplificado no console
        console.error(`Erro inesperado: ${error.message}`);
    } finally {
        const submitButton = document.querySelector('#createForm button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false; // Reabilitar o botão
        }
    }
}

// Adicionar evento ao formulário de criação
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('createForm');
    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();
            const nome = document.getElementById('name').value;
            await criarRegistro(nome);
        });
    }
});

// Função para buscar registros (GET)
async function buscarRegistros() {
    try {
        const headers = new Headers();

        // Fazer a requisição para a API
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: headers,
            credentials: 'include' // Incluir cookies na requisição
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar registros: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erro ao buscar registros:', error);
    }
}

// Função para exibir registros na tabela
async function exibirRegistros() {
    try {
        const registros = await buscarRegistros();
        console.log('Registros retornados:', registros); // Inspecionar a resposta da API
        const tabela = document.getElementById('tabela-registros');

        if (tabela) {
            tabela.innerHTML = ''; // Limpar a tabela antes de preencher

            // Acessar a propriedade `list` que contém o array de registros
            const listaRegistros = registros.list || []; // Garantir que seja um array

            if (Array.isArray(listaRegistros)) {
                listaRegistros.forEach(registro => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${registro.id}</td>
                        <td>${registro.name}</td>
                        <td>${registro.createdAt}</td>
                    `;
                    tabela.appendChild(row);
                });
            } else {
                console.error('Os registros não estão em um formato de array:', listaRegistros);
            }
        }
    } catch (error) {
        console.error('Erro ao exibir registros:', error);
    }
}

// Chamar a função para exibir registros ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    exibirRegistros();
});

// Função para alterar um registro (PUT)
async function alterarRegistro(id, novoNome) {
    try {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        // Fazer a requisição para a API
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: headers,
            credentials: 'include', // Incluir cookies na requisição
            body: JSON.stringify({ name: novoNome }) // Enviar o novo nome
        });

        const messageDiv = document.getElementById('message'); // Div para exibir mensagens

        if (!response.ok) {
            // Exibir mensagem de erro diretamente no `messageDiv`
            const errorMessage = `Erro ao alterar registro: ${response.status}`;
            if (messageDiv) {
                messageDiv.innerHTML = `<div class="alert alert-danger">${errorMessage}</div>`;
            }
            return; // Encerrar a execução da função
        }

        const result = await response.json();
        console.log('Registro alterado com sucesso:', result);

        // Exibir mensagem de sucesso
        if (messageDiv) {
            messageDiv.innerHTML = `<div class="alert alert-success">Registro alterado com sucesso!</div>`;
        }

        // Limpar os campos do formulário
        const formAlterar = document.getElementById('updateForm');
        if (formAlterar) {
            formAlterar.reset(); // Limpar todos os campos do formulário
        }

        // Atualizar a tabela de registros
        await exibirRegistros();

        return result;
    } catch (error) {
        // Exibir mensagem de erro no elemento `messageDiv`
        const messageDiv = document.getElementById('message');
        if (messageDiv) {
            messageDiv.innerHTML = `<div class="alert alert-danger">Erro inesperado: ${error.message}</div>`;
        }

        // Log simplificado no console
        console.error(`Erro inesperado: ${error.message}`);
    }
}

// Adicionar evento ao formulário de alteração
document.addEventListener('DOMContentLoaded', function () {
    const formAlterar = document.getElementById('updateForm');
    if (formAlterar) {
        formAlterar.addEventListener('submit', async function (event) {
            event.preventDefault();
            const id = document.getElementById('updateId').value;
            const novoNome = document.getElementById('updateName').value;
            await alterarRegistro(id, novoNome);
        });
    }
});

// Função para deletar um registro (DELETE)
async function deletarRegistro(id) {
    try {
        const headers = new Headers();

        // Fazer a requisição para a API
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
            headers: headers,
            credentials: 'include' // Incluir cookies na requisição
        });

        const messageDiv = document.getElementById('message'); // Div para exibir mensagens

        if (!response.ok) {
            // Exibir mensagem de erro diretamente no `messageDiv`
            const errorMessage = `Erro ao deletar registro: ${response.status}`;
            if (messageDiv) {
                messageDiv.innerHTML = `<div class="alert alert-danger">${errorMessage}</div>`;
            }
            return; // Encerrar a execução da função
        }

        console.log(`Registro com ID ${id} deletado com sucesso`);

        // Exibir mensagem de sucesso
        if (messageDiv) {
            messageDiv.innerHTML = `<div class="alert alert-success">Registro deletado com sucesso!</div>`;
        }

        // Limpar o campo de entrada
        const inputField = document.getElementById('deleteId');
        if (inputField) {
            inputField.value = ''; // Limpar o campo de entrada
        }

        // Atualizar a tabela de registros
        await exibirRegistros();
    } catch (error) {
        // Exibir mensagem de erro no elemento `messageDiv`
        const messageDiv = document.getElementById('message');
        if (messageDiv) {
            messageDiv.innerHTML = `<div class="alert alert-danger">Erro inesperado: ${error.message}</div>`;
        }

        // Log simplificado no console
        console.error(`Erro inesperado: ${error.message}`);
    }
}

// Adicionar evento ao formulário de exclusão na página delete.html
document.addEventListener('DOMContentLoaded', function () {
    const formDeletar = document.getElementById('deleteForm');
    if (formDeletar) {
        formDeletar.addEventListener('submit', async function (event) {
            event.preventDefault();
            const id = document.getElementById('deleteId').value;
            await deletarRegistro(id);
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Adicionar botão de voltar ao lado dos botões das páginas
    const forms = ['createForm', 'updateForm', 'deleteForm'];
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            const voltarButton = document.getElementById(`voltarButton-${formId}`);
            if (!voltarButton) {
                const button = document.createElement('button');
                button.id = `voltarButton-${formId}`;
                button.textContent = 'Voltar';
                button.classList.add('btn', 'btn-secondary', 'ms-2'); // Estilo do botão
                button.onclick = function () {
                    window.history.back();
                };
                form.appendChild(button); // Adicionar ao lado do botão do formulário
            }
        }
    });
});