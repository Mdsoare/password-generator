# 🔐 Password Generator

![CI Pipeline](https://github.com/Mdsoare/password-generator/actions/workflows/ci.yml/badge.svg)
[![Security Rating](https://img.shields.io/badge/Security-DevSecOps%20Hardened-green?style=flat&logo=github)](https://github.com/Mdsoare/password-generator/security/code-scanning)
![Security: CSP Compliant](https://img.shields.io/badge/Security-CSP--Compliant-success.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
<!-- Badges de Linguagens, Ecossistema e DevSecOps -->
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Dependabot](https://img.shields.io/badge/Dependabot-025E8C?style=for-the-badge&logo=dependabot&logoColor=white)
![SAST & SCA](https://img.shields.io/badge/DevSecOps-SAST%20%26%20SCA-red?style=for-the-badge&logo=shield&logoColor=white)

---

Aplicação web descentralizada e _client-side_ projetada para a geração de credenciais criptograficamente seguras. O projeto utiliza geradores de números pseudoaleatórios criptográficos (CSPRNG) e executa o cálculo de entropia e estimativas de força bruta em tempo real diretamente no navegador.

---

## Destaques de Arquitetura & Segurança

- **CSPRNG sem Modulo Bias:** Utiliza a API nativa `crypto.getRandomValues()` combinada com _Rejection Sampling_ para evitar desvios estáticos no sorteio de caracteres.

- **Embaralhamento Fisher-Yates Criptográfico:** Garante que a ordenação final da senha seja uniformemente distribuída.

- **Zero Trust & Client-Side:** Nenhuma senha, parâmetro ou telemetria é enviada para servidores externos. O processamento ocorre 100% no cliente.

- **Content Security Policy (CSP) Estrita:** Proteção contra ataques XSS e injeções de script inline.

- **Sanitização da Área de Transferência:** Limpeza automática do clipboard após a cópia da credencial para mitigar vazamentos por armazenamento temporário no SO.

---

## Métricas de Entropia

A força da credencial é calculada dinamicamente utilizando a fórmula de entropia de Shannon:

$$H = L \times \log_2(R)$$

Onde:

- $L$ = Comprimento da senha.
- $R$ = Tamanho do conjunto de caracteres ativos (_Pool Size_).

| Entropia (Bits)  | Nível de Resiliência | Cenário de Criptoanálise Estimado                                          |
| :--------------- | :------------------- | :------------------------------------------------------------------------- |
| **< 60 bits**    | Vulnerável           | Passível de quebra rápida por força bruta em hardware convencional.        |
| **60 – 79 bits** | Moderada             | Exige recursos computacionais dedicados/clusters de alto desempenho.       |
| **≥ 80 bits**    | Alta                 | Resiliente contra ataques de força bruta atuais (Trilhões de combinações). |

---

## Esteira de CI/CD (DevSecOps)

A pipeline configurada via GitHub Actions valida a integridade da aplicação a cada push ou pull request:

- SAST (Static Application Security Testing): Análise estática com `ESLint` e validação sintática do HTML via `HTMLHint`.

- Secret Detection: Varredura com `TruffleHog` para evitar o comitamento acidental de credenciais ou chaves no repositório.

- SCA (Software Composition Analysis): Análise de vulnerabilidades de dependências através do `OSV-Scanner`.

- CSP & Integrity Check: Validação de regras da CSP e integridade da estrutura de arquivos do projeto.

---

## Execução Local

Por se tratar de uma aplicação client-side sem dependências de compilação, basta clonar o repositório e abrir o arquivo index.html em qualquer navegador moderno:

    ```bash
    # Clonar o repositório

    git clone https://github.com/Mdsoare/password-generator.git

    # Acessar a pasta do projeto

    cd password-generator

    # (Opcional) Instalar dependências de desenvolvimento para rodar os linters locais

    npm ci
    npm run lint
    ```

---

## 📜 Licença

Este projeto está sob a licença [MIT](LICENSE).

---

_Desenvolvido por **Marcelo Soares** | Especialista em Segurança da Informação e Computação Forense._
