const charPools = {
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower: "abcdefghijklmnopqrstuvwxyz",
    num: "0123456789",
    sym: "!@#$%^&*()_+-=[]{}|;:,.<>?"
};

const lengthSlider = document.getElementById('passLength');
let clearClipboardTimeout = null;

document.addEventListener('DOMContentLoaded', () => {
    lengthSlider.addEventListener('input', () => {
        document.getElementById('lengthVal').textContent = lengthSlider.value;
    });

    document.getElementById('genBtn').addEventListener('click', generateSecurePassword);
    document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
    document.getElementById('clearBtn').addEventListener('click', clearPasswordDisplay);

    resetDisplayState();
});

/**
 * Reseta a exibição para o estado padrão inicial
 */
function resetDisplayState() {
    const display = document.getElementById('passwordDisplay');
    display.textContent = "Clique em 'Gerar Nova Senha'";
    updateEntropyMetrics(0);
}

/**
 * Limpa a senha da tela e sanitiza o clipboard
 */
function clearPasswordDisplay() {
    resetDisplayState();

    // Sobreve o clipboard para garantir que a credencial não fique salva na memória do sistema
    navigator.clipboard.writeText("").catch(() => {
        // Trata a rejeição caso a janela esteja sem foco
    });

    if (clearClipboardTimeout) {
        clearTimeout(clearClipboardTimeout);
        clearClipboardTimeout = null;
    }
}

/**
 * Gera um inteiro aleatório não enviesado (Unbiased CSPRNG) utilizando Rejection Sampling
 */
function getRandomInt(max) {
    if (max <= 0) return 0;

    const limit = Math.floor(0xFFFFFFFF / max) * max;
    const randomBuffer = new Uint32Array(1);

    do {
        window.crypto.getRandomValues(randomBuffer);
    } while (randomBuffer[0] >= limit);

    return randomBuffer[0] % max;
}

/**
 * Algoritmo Fisher-Yates seguro para embaralhar o array usando CSPRNG
 */
function secureShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = getRandomInt(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateSecurePassword() {
    const length = parseInt(lengthSlider.value, 10);
    const useUpper = document.getElementById('chkUpper').checked;
    const useLower = document.getElementById('chkLower').checked;
    const useNum = document.getElementById('chkNum').checked;
    const useSym = document.getElementById('chkSym').checked;

    const activePools = [];
    let combinedPool = "";

    if (useUpper) { activePools.push(charPools.upper); combinedPool += charPools.upper; }
    if (useLower) { activePools.push(charPools.lower); combinedPool += charPools.lower; }
    if (useNum) { activePools.push(charPools.num); combinedPool += charPools.num; }
    if (useSym) { activePools.push(charPools.sym); combinedPool += charPools.sym; }

    const display = document.getElementById('passwordDisplay');

    if (activePools.length === 0 || length < activePools.length) {
        display.textContent = "[Erro: Comprimento insuficiente ou nenhuma opção selecionada]";
        updateEntropyMetrics(0);
        return;
    }

    const passwordChars = [];

    // 1. Garante pelo menos 1 caractere de cada categoria escolhida
    activePools.forEach(pool => {
        const idx = getRandomInt(pool.length);
        passwordChars.push(pool.charAt(idx));
    });

    // 2. Preenche o restante do comprimento com o pool combinado sem modulo bias
    while (passwordChars.length < length) {
        const idx = getRandomInt(combinedPool.length);
        passwordChars.push(combinedPool.charAt(idx));
    }

    // 3. Embaralha para evitar padrões previsíveis
    const finalPassword = secureShuffle(passwordChars).join('');

    display.textContent = finalPassword;

    // Cálculo de entropia baseada no tamanho do pool único
    const poolSize = combinedPool.length;
    const entropyBits = Math.floor(length * (Math.log2(poolSize)));
    updateEntropyMetrics(entropyBits);
}

function updateEntropyMetrics(bits) {
    const label = document.getElementById('entropyLabel');
    const bar = document.getElementById('entropyBar');
    const timeLabel = document.getElementById('crackTimeLabel');
    const panel = document.getElementById('entropyPanel');

    if (bits === 0) {
        label.textContent = "Entropia: 0 Bits";
        bar.style.width = "0%";
        bar.style.backgroundColor = "var(--border)";
        panel.style.borderColor = "var(--border)";
        timeLabel.textContent = "Aguardando geração de senha...";
        return;
    }

    label.textContent = `Entropia: ${bits} Bits`;
    const percentage = Math.min((bits / 128) * 100, 100);
    bar.style.width = `${percentage}%`;

    if (bits < 60) {
        bar.style.backgroundColor = "var(--danger)";
        panel.style.borderColor = "var(--danger)";
        timeLabel.textContent = "Força Bruta Estimada: Vulnerável (Quebra em minutos por clusters domésticos).";
    } else if (bits < 80) {
        bar.style.backgroundColor = "var(--warning)";
        panel.style.borderColor = "var(--warning)";
        timeLabel.textContent = "Força Bruta Estimada: Força moderada (Exige semanas para quebra em supercomputadores).";
    } else {
        bar.style.backgroundColor = "var(--success)";
        panel.style.borderColor = "var(--success)";
        timeLabel.textContent = "Força Bruta Estimada: Excelente resiliência (Trilhões de anos usando tecnologia atual).";
    }
}

function copyToClipboard() {
    const txt = document.getElementById('passwordDisplay').textContent;

    if (txt.startsWith("[Erro") || txt.startsWith("Clique em")) return;

    navigator.clipboard.writeText(txt).then(() => {
        const btn = document.getElementById('copyBtn');
        btn.textContent = "Copiado!";
        btn.style.backgroundColor = "var(--success)";

        // Limpa a área de transferência automaticamente após 45 segundos por segurança
        if (clearClipboardTimeout) clearTimeout(clearClipboardTimeout);
        clearClipboardTimeout = setTimeout(() => {
            navigator.clipboard.writeText("");
        }, 45000);

        setTimeout(() => {
            btn.textContent = "Copiar";
            btn.style.backgroundColor = "var(--accent)";
        }, 1500);
    });
}