# Vercel + Supabase substituem o GitHub Pages estático como arquitetura de publicação

A página pública hoje é 100% estática (GitHub Pages, `docs/index.html`), com a escala inteira hardcoded como array JS. Isso exigia editar HTML à mão a cada mudança. Como todos os ~56 voluntários precisam ver os dados (não só quem organiza a escala), uma ferramenta de importação puramente local/client-side não bastava — os dados importados precisam chegar a um lugar compartilhado que a página pública lê.

Decidimos: **Vercel** hospeda tanto a página pública quanto o endpoint de importação (uma Function que recebe o upload do Excel); **Supabase** é o único armazenamento de dados. Consideramos e rejeitamos: publicar de volta pro Git (a cada escala nova, alguém commitar um `data.json` gerado — mantém tudo estático, mas reintroduz o atrito manual que estamos eliminando) e usar armazenamento próprio da Vercel em vez de Supabase (evitado para não duplicar "onde os dados moram").

## Consequences

- **Importação exige senha simples** (variável de ambiente na Vercel) verificada pela Function antes de aceitar o upload — suficiente para o porte do projeto; Supabase Auth completo foi considerado excessivo.
- **Cada importação substitui os dados por completo** (delete + insert no Supabase) em vez de atualização incremental — a planilha é sempre a verdade atual, sem histórico de mudanças.
- **Líderes por atividade também moram numa tabela separada no Supabase** (não mais hardcoded no código), pela mesma razão de fundo: ninguém deveria precisar editar código pra atualizar a escala.
- A página pública passa a depender de uma chamada de rede (fetch ao Supabase) em vez de ter os dados inline — exige tratar estado de carregamento, erro de conexão, e cache local (localStorage) para tolerar wifi ruim no local do evento.
