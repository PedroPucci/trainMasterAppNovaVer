# TrainMaster - Mobile/ReactNative

# **Descrição do projeto**
- O TrainMaster é uma plataforma web e mobile inovadora, destinada a gerenciar e otimizar o treinamento de funcionários em empresas.
- O objetivo é oferecer um ambiente de aprendizado online completo, acessível a qualquer hora, de qualquer lugar e em qualquer dispositivo.
- A solução possibilita que colaboradores acessem aulas, conteúdos e provas de forma prática, intuitiva e eficiente, tanto pelo navegador quanto pelo aplicativo mobile, garantindo maior flexibilidade, engajamento e continuidade no processo de capacitação.
---
# **Figma**
## **Link Figma**
- https://www.figma.com/design/pEqMKP8eGnu1SRB1vvOyxz/Projeto-Mobile-unifor?node-id=0-1&m=dev&t=ELTOTCggJ3hKR9gS-1
---
# **Projeto API**
## **Link Projeto - API**
- https://github.com/PedroPucci/TrainMaster
---
# **Solução**
## **IDE's Utilizadas**
- Visual Studio Code
- Visual Studio Community
- Postgres
---
## **Recursos do Projeto**
- **Bibliotecas**: bibliotecas que o projeto precisou, exemplo: icons, calendar.
- **Expo**: projeto criado no expo e exportado para Visual Code.
---
## **Como Executar o Projeto**
### **1. Testar na versão Web**
1. Faça o clone do projeto.
2. Abra o terminar e digite npx expo start.   
3. Tecle W e será aberto uma pagina na web.

### **2. Testar na versão Mobile**
1. Faça o clone do projeto.

**Comandos para auxiliar**
- npx expo install expo
- npx expo install react react-native
- npm install expo
3. Abra o terminar e digite expo start.   
4. Com o aplicativo do Expo instalado no celular, abra e leia o QR Code gerado.

**Observações:**
- Para testar com a API, é necessário subir a API.

### **Estrutura do Projeto**
Essa estrutura garante organização das pastas.
## **Assets**
- **Imagens**: Imagens do projeto.
## **Src**
Contém os endpoints para acesso e execução das funcionalidades:
1. Organização das pastas:
- **Components**: Possui todas as pastas dos componentes do projeto.
1. Footer: Pasta formada pelo arquivo tsx e css do componente.
2. Header: Pasta formada pelo arquivo tsx e css do componente.
3. Navigation: Pasta formada pelos arquivos de navegação entre as telas.
4. Routes: Pasta formada pelos arquivos de conexão/endpoint com a API.
5. Theme: Pasta formada pelo arquivo tsx e css do componente de temas dos componentes.
6. Utils: Pasta formada pela classe validação de campos e arquivo de máscara.
- **Screens**: Composta pelo arquivo tsx e ts de todas as telas.
- **Theme**: Pasta formada pelo arquivo tsx do componente para escurecer/clarear a tela.

TrainMaster App – Integração Contínua e Testes Automatizados

Este repositório utiliza um fluxo de CI/CD integrado entre GitHub e GitLab para garantir qualidade e confiabilidade no desenvolvimento.

🔄 Fluxo de Integração Contínua

Cada push realizado na branch main do GitHub dispara automaticamente um webhook configurado no GitLab.

O GitLab CI/CD executa a pipeline de testes automatizados, sem necessidade de gerar manualmente artefatos locais.

Os testes são executados com o Maestro, garantindo a validação da aplicação em ambiente simulado.

📊 Relatórios

Após a execução, relatórios são salvos automaticamente, permitindo análise detalhada da saúde do projeto.

Falhas em testes interrompem a pipeline e alertam a equipe de desenvolvimento.

🚀 Benefícios

Automação completa desde o push até a validação da aplicação.

Feedback rápido, evitando que falhas cheguem à produção.

Escalabilidade, permitindo que múltiplos testes rodem em paralelo.
