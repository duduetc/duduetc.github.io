# Fonte de verdade da escala continua sendo Excel, não Google Sheets

A escala hoje é mantida num arquivo Excel local ("Escala Individualizada dos Voluntários"), colado manualmente como JSON dentro do `index.html`. Consideramos migrar para Google Sheets publicado como CSV, o que eliminaria qualquer passo de build/importação (a página buscaria o CSV direto). Decidimos manter o Excel: quem organiza a escala já trabalha nesse formato e não quer migrar de ferramenta. Isso significa que toda atualização exige um passo explícito de importação (ver [0002](./0002-vercel-supabase-substituem-github-pages-estatico.md)) em vez de a página refletir a planilha instantaneamente.

## Considered Options

- Google Sheets publicado como CSV, lido em tempo real pela página (zero passo de importação, mas exige trocar de ferramenta).
- Excel + importação explícita via upload (escolhido).
