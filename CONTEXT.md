# JUMP — Escala de Voluntários

Site que permite a cada voluntário do evento JUMP buscar seu nome e ver sua escala individual de horários durante o retiro (sexta a domingo).

## Language

**Escala**:
O conjunto de blocos de horário que um voluntário está designado a cobrir ao longo dos três dias do evento.
_Avoid_: agenda, horário (horário é só um instante/intervalo, não o conjunto todo)

**Bloco**:
Um intervalo de tempo contínuo (início–fim) em que um voluntário está designado a uma única atividade. É obtido juntando os slots de 30 minutos consecutivos da planilha-fonte que têm o mesmo código de atividade.
_Avoid_: slot, horário

**Slot**:
Uma célula da planilha-fonte: um intervalo fixo de 30 minutos (das 06:30 às 23:59) associado a um código de atividade. É a unidade bruta da planilha — não é a unidade armazenada no banco (ver [[bloco]]).

**Atividade**:
Uma das áreas de trabalho fixas em que um voluntário pode ser escalado (ex.: Cenografia e decoração, Ronda, Técnica). Identificada na planilha-fonte por um código de 3 letras.

**Código de atividade**:
A sigla de 3 letras usada na planilha-fonte para identificar uma [[atividade]].

| Código | Atividade |
|---|---|
| ADO | Adoração |
| CC | Coordenação de celebração |
| CEN | Cenografia e decoração |
| CG | Coordenação Geral |
| CHK | Checkin |
| COM | Comunicação |
| CON | Concierge |
| FIN | Financeiro |
| GIN | Gincana |
| INT | Intercessão |
| LAN | Distribuir Lanche |
| LOG | Logística |
| ORA | Oração |
| PG | PG |
| PS | Primeiros Socorros |
| QUA | Quartos |
| RAD | Rádio |
| RON | Ronda |
| TEC | Técnica |

**Líder**:
A pessoa responsável por uma [[atividade]] como um todo — diferente dos voluntários que cobrem [[bloco|blocos]] dentro dela. Não consta na planilha-fonte; é mantida separadamente.

**Voluntário**:
Uma pessoa com uma [[escala]], identificada pelo nome na planilha-fonte.

**Planilha-fonte**:
O arquivo Excel "Escala Individualizada dos Voluntários", fonte de verdade da escala: uma linha por voluntário, uma coluna por [[slot]] de 30 minutos por dia.

**Importação**:
O processo de subir a planilha-fonte atualizada e substituir por completo os dados publicados. Ver [[0002-vercel-supabase-substituem-github-pages-estatico]].
