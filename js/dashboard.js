document.addEventListener("DOMContentLoaded", function() {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const editProfileForm = document.getElementById('editProfileForm');
    const editarPerfilBtn = document.getElementById('editarPerfilBtn');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');

    // Pega o token do localStorage
    const token = localStorage.getItem('token');

    if (token) {
        // Faz a requisição para pegar os dados do usuário
        fetch('http://localhost:8000/api/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.usuario.name) {
                // Mostra o nome do usuário
                welcomeMessage.textContent = `Bem-vindo, ${data.usuario.name}!`;

                // Preenche o formulário com os dados do usuário
                nameInput.value = data.usuario.name;
                emailInput.value = data.usuario.email;
            } else {
                // Redireciona para o login se não encontrar o usuário
                window.location.href = 'login.html';
            }
        })
        .catch(error => {
            console.log("Erro ao pegar os dados do usuário:", error);
            window.location.href = 'login.html'; // Redireciona se tiver erro
        });
    } else {
        // Redireciona para o login se não tiver token
        window.location.href = 'login.html';
    }

    // Mostra o formulário de edição quando clicar no botão "Editar Perfil"
    editarPerfilBtn.addEventListener('click', function() {
        editProfileForm.style.display = 'block';
    });

    // Envia os dados atualizados do formulário
    editProfileForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const updatedData = {
            name: nameInput.value,
            email: emailInput.value
        };

        // Faz a requisição para atualizar os dados
        fetch('http://localhost:8000/api/user', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => {
            if (response.ok) {
                alert('Dados atualizados com sucesso!');
                editProfileForm.style.display = 'none'; // Esconde o formulário depois de salvar
                welcomeMessage.textContent = `Bem-vindo, ${updatedData.name}!`;
            } else {
                alert('Erro ao atualizar os dados.');
            }
        })
        .catch(error => {
            console.log("Erro ao atualizar os dados:", error);
        });
    });
});

// Função de logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    // Pega o token do localStorage
    const token = localStorage.getItem('token');

    // Faz o logout no backend
    fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token, // Inclui o token na requisição
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Limpa o localStorage e redireciona para o login
            localStorage.clear();
            window.location.href = 'login.html';
        } else {
            console.error('Erro ao deslogar');
        }
    })
    .catch(error => {
        console.error('Erro de rede ao tentar deslogar:', error);
    });
});

// Função para redirecionar para a página de listar usuários
document.getElementById('listarBtn').addEventListener('click', function() {
    window.location.href = 'listar.html';
});
