# Escala armazenada em blocos comprimidos, não slot a slot

A planilha-fonte guarda um código de atividade por slot de 30 minutos (56 pessoas × ~108 slots ≈ 6 mil células). A página, porém, sempre exibiu e vai continuar exibindo blocos contínuos (ex.: "Cenografia · 06:30 → 12:00"), não slots individuais. Decidimos comprimir no momento da importação: slots consecutivos com o mesmo código, para a mesma pessoa e dia, viram uma única linha no Supabase (pessoa, dia, atividade, hora_início, hora_fim), em vez de gravar uma linha por slot bruto.

Isso reduz o volume de dados em ~20x e elimina a necessidade de recompor blocos a cada renderização da página. Não identificamos nenhum caso de uso futuro que precise da granularidade de 30 em 30 minutos — se isso mudar, a planilha original continua sendo a fonte bruta e pode ser reimportada com outra lógica.
