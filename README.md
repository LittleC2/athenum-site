# Site da Athenum

Site institucional estático (HTML/CSS/JS puro, sem build step).

## Como abrir localmente

Abra `index.html` direto no navegador, ou rode um servidor local simples:

```
cd site
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Estrutura

- `index.html`: Home
- `servicos.html`: Serviços (Design, Tráfego pago, Sites e sistemas, Audiovisual)
- `sobre.html`: Sobre a agência e o time
- `cases.html`: Cases (placeholder até existirem projetos reais documentados)
- `contato.html`: Formulário de contato
- `assets/css/style.css`: design system (cores, tipografia, componentes)
- `assets/js/main.js`: menu mobile e destaque do link ativo na navegação
- `assets/img/`: logo e favicon

## Contato usado no site

- E-mail: `contato.athenum@gmail.com`
- WhatsApp: `+55 (21) 97664-9091` (botão flutuante em todas as páginas e link no rodapé/página de contato)

## Pendências antes de publicar

- [ ] Confirmar nomes reais dos sócios em `sobre.html` (hoje usa "Sócio: [função]")
- [ ] Substituir formulário `mailto:` por um serviço de formulário (Formspree, etc.) se quiser receber envios sem abrir o cliente de e-mail do visitante
- [ ] Preencher `cases.html` assim que houver o primeiro case real documentado
- [ ] Revisar cores/fonte com o brandkit oficial quando ele for formalizado (`MazyOS/identidade/design-guide.md` ainda marca algumas cores como "a definir")

## Deploy

Sem build step. Pode subir direto em Vercel, Netlify, Railway ou GitHub Pages apontando pra essa pasta.
