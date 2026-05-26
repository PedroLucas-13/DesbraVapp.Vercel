// tema.js — cola este arquivo na raiz do projeto

const body = document.body;

// Ao carregar a página, verifica se dark mode estava ativo
if (localStorage.getItem('tema') === 'dark') {
    body.classList.add('dark-mode');
}

// Aplica no botão de toggle (funciona em qualquer página)
const btnTema = document.getElementById('theme-toggle');
if (btnTema) {
    // Atualiza texto do botão conforme estado atual
    btnTema.textContent = body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';

    btnTema.addEventListener('click', () => {
        const isDark = body.classList.toggle('dark-mode');
        localStorage.setItem('tema', isDark ? 'dark' : 'light');
        btnTema.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    });
}