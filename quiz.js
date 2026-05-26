const SUPABASE_URL = 'https://mpiswctnjueijrledhbu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1waXN3Y3RuanVlaWpybGVkaGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNTY0MTEsImV4cCI6MjA5NDczMjQxMX0.S4RHJ792vC35LFTet-EEFFiRUNKOiDD2DP2QCKImPy8';

const questions = [
    {
        q: "Qual cachoeira fica na divisa de Batalha e Esperantina, formada pelas águas do Rio Longá?",
        opts: ["Pedra Branca", "Cachoeira do Xixá", "Cachoeira do Urubu", "Cachoeira do Almeida"],
        ans: 2,
        points: 10
    },
    {
        q: "Por que a Cachoeira do Urubu recebeu esse nome?",
        opts: [
            "Por causa da cor escura da pedra",
            "Pois urubus se reúnem durante a piracema para comer peixes",
            "Em homenagem a um morador antigo",
            "Por causa da vegetação ao redor"
        ],
        ans: 1,
        points: 15
    },
    {
        q: "Qual é a melhor época para visitar a Cachoeira do Urubu com segurança para banho?",
        opts: ["Agosto a dezembro", "Maio a julho", "Janeiro e fevereiro", "O ano todo igualmente"],
        ans: 1,
        points: 10
    },
    {
        q: "A Cachoeira do Xixá foi eleita uma das:",
        opts: [
            "10 maravilhas do Nordeste",
            "5 cachoeiras mais altas do Brasil",
            "7 Maravilhas do Piauí",
            "Patrimônios históricos do Brasil"
        ],
        ans: 2,
        points: 15
    },
    {
        q: "O nome 'Xixá' vem de:",
        opts: [
            "Uma lenda indígena local",
            "Uma planta nativa do cerrado piauiense de flores avermelhadas",
            "Um rio que passa pela região",
            "O nome do fundador do município"
        ],
        ans: 1,
        points: 10
    },
    {
        q: "A que distância do centro de Batalha fica a Cachoeira do Xixá?",
        opts: ["3 km", "6 km", "9 km", "15 km"],
        ans: 2,
        points: 10
    },
    {
        q: "A Pedra Branca é conhecida principalmente por:",
        opts: [
            "Suas quedas d'água de 12 metros",
            "Sua piscina natural de águas cristalinas cercada por rochas",
            "Ser a maior pedra do Piauí",
            "Sua localização no topo de uma serra"
        ],
        ans: 1,
        points: 10
    },
    {
        q: "Qual cachoeira fica a apenas 300 metros da Cachoeira do Xixá?",
        opts: ["Cachoeira do Urubu", "Cachoeira do Canta Galo", "Cachoeira do Almeida", "Pedra Branca"],
        ans: 2,
        points: 15
    },
    {
        q: "A Cachoeira dos Almeidas possui qual diferencial em relação às outras da região?",
        opts: [
            "É a maior cachoeira do Piauí",
            "Não possui quedas altas, mas tem cascatas acessíveis para crianças e adultos",
            "É a única com entrada paga",
            "Fica dentro de uma reserva federal"
        ],
        ans: 1,
        points: 15
    },
    {
        q: "Qual prato típico é servido no restaurante da Cachoeira dos Almeidas?",
        opts: [
            "Baião de dois e carne de sol",
            "Galinhada caipira e peixada de surubim do Rio Longá",
            "Frango assado e pirão",
            "Buchada de bode e sarapatel"
        ],
        ans: 1,
        points: 20
    }
];

const letters = ['A', 'B', 'C', 'D'];
let current = 0;
let score = 0;
let answered = false;
let sessionPoints = 0;

async function addToGlobalScore(amount) {
    try {
        const res = await fetch(SUPABASE_URL + '/rest/v1/rpc/increment', {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount })
        });
        console.log('Resposta Supabase:', res.status);
    } catch (e) {
        console.error('Erro ao adicionar score:', e);
    }
}

function render() {
    const q = questions[current];
    const pct = Math.round((current / questions.length) * 100);

    document.getElementById('prog-fill').style.width = pct + '%';
    document.getElementById('prog-current').textContent = 'Pergunta ' + (current + 1) + ' de ' + questions.length;
    document.getElementById('prog-pts').textContent = score + ' pts';
    document.getElementById('quiz-question').textContent = q.q;
    document.getElementById('quiz-feedback').textContent = '';
    document.getElementById('quiz-next').style.display = 'none';
    answered = false;

    const optsEl = document.getElementById('quiz-options');
    optsEl.innerHTML = '';
    q.opts.forEach((o, i) => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.innerHTML = '<span class="opt-letter">' + letters[i] + '</span>' + o;
        btn.onclick = () => selectAnswer(i, btn);
        optsEl.appendChild(btn);
    });
}

function selectAnswer(i, btn) {
    if (answered) return;
    answered = true;

    const q = questions[current];
    const allBtns = document.querySelectorAll('.opt-btn');
    allBtns.forEach(b => (b.disabled = true));

    const feedbackEl = document.getElementById('quiz-feedback');

    if (i === q.ans) {
        btn.classList.add('correct');
        score += q.points;
        sessionPoints += q.points;
        document.getElementById('prog-pts').textContent = score + ' pts';
        feedbackEl.textContent = '✓ Correto! +' + q.points + ' pontos';
        feedbackEl.style.color = '#16a34a';
    } else {
        btn.classList.add('wrong');
        allBtns[q.ans].classList.add('correct');
        feedbackEl.textContent = '✗ Errado! A resposta correta está marcada em verde.';
        feedbackEl.style.color = '#dc2626';
    }

    document.getElementById('quiz-next').style.display = 'inline-block';
}

document.getElementById('quiz-next').addEventListener('click', () => {
    current++;
    if (current < questions.length) {
        render();
    } else {
        showResult();
    }
});

async function showResult() {
    document.getElementById('quiz-screen').style.display = 'none';

    if (sessionPoints > 0) {
        await addToGlobalScore(sessionPoints);
    }

    const total = questions.reduce((acc, q) => acc + q.points, 0);
    const pct = Math.round((score / total) * 100);

    let msg = '';
    if (pct === 100) msg = 'Perfeito! Você acertou tudo e mostrou que conhece muito bem a nossa região!';
    else if (pct >= 70) msg = 'Muito bem! Você tem um ótimo conhecimento sobre Batalha e o Piauí.';
    else if (pct >= 40) msg = 'Bom esforço! Vale explorar mais sobre as riquezas naturais da nossa região.';
    else msg = 'Que tal visitar os locais e aprender mais? Cada cachoeira tem sua história!';

    const pointsLine = sessionPoints > 0
        ? '<div class="result-points-badge">+' + sessionPoints + ' pontos adicionados ao score global!</div>'
        : '<div class="result-points-badge">Nenhum ponto conquistado desta vez.</div>';

    document.getElementById('result-screen').innerHTML =
        '<div class="result-card">' +
        '<p style="font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;font-weight:600;margin-bottom:8px;">Resultado Final</p>' +
        '<div class="result-score-num">' + score + '</div>' +
        '<p class="result-score-sub">' + pct + '% de aproveitamento · ' + score + ' de ' + total + ' pontos possíveis</p>' +
        pointsLine +
        '<p class="result-msg">' + msg + '</p>' +
        '<div class="result-buttons">' +
        '<button class="tema" onclick="restartQuiz()">Tentar novamente</button>' +
        '<a href="score.html" class="tema" style="text-decoration:none;">Ver placar global</a>' +
        '</div></div>';

    document.getElementById('result-screen').style.display = 'block';
}

function restartQuiz() {
    current = 0;
    score = 0;
    sessionPoints = 0;
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    render();
}

render();
