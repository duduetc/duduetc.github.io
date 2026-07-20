# Exportação de escala individual em PDF via impressão nativa do navegador

Cada voluntário poderá exportar sua própria escala em PDF. Em vez de usar uma biblioteca de geração de PDF (jsPDF, html2canvas), optamos por `window.print()` com CSS `@media print` dedicado (troca o tema escuro por um layout claro para impressão). A pessoa clica em "Baixar PDF" e usa o diálogo nativo "Salvar como PDF" do navegador/sistema.

Um leitor futuro pode estranhar a ausência de uma lib de PDF, já que ela daria um download em um clique só. Escolhemos a via nativa porque: não adiciona dependência nova, funciona inteiramente offline (reforça a resiliência a wifi ruim já buscada em [0002](./0002-vercel-supabase-substituem-github-pages-estatico.md)), e o conteúdo é só texto simples — não há necessidade de controle fino sobre o PDF que justifique o custo de manutenção de uma lib externa.
