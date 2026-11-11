# andrecury-dev

Código do site [blog.andrecury.dev.br](https://blog.andrecury.dev.br): projetos, blog e o radar semanal de artigos de IA.

Next.js com geração estática. Os textos ficam em `content/` (MDX para blog e projetos, JSON para o radar).

## Rodar

    npm install
    npm run dev      # http://localhost:3040, com os rascunhos visíveis
    npm test         # testes de lib/
    npm run e2e      # testes de ponta a ponta contra o build de produção

Os comentários usam as Discussions deste repositório, pelo giscus.
