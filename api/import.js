const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');

const ACTIVITY_LEGEND = {
  ADO: 'Adoração',
  CC: 'Coordenação de celebração',
  CEN: 'Cenografia e decoração',
  CG: 'Coordenação Geral',
  CHK: 'Checkin',
  COM: 'Comunicação',
  CON: 'Concierge',
  FIN: 'Financeiro',
  GIN: 'Gincana',
  INT: 'Intercessão',
  LAN: 'Distribuir Lanche',
  LOG: 'Logística',
  ORA: 'Oração',
  PG: 'PG',
  PS: 'Primeiros Socorros',
  QUA: 'Quartos',
  RAD: 'Rádio',
  RON: 'Ronda',
  TEC: 'Técnica',
};

const NAME_JOINER_RE = /[⁠​]/g;

function cleanName(raw) {
  return String(raw).replace(NAME_JOINER_RE, '').trim();
}

function parseWorkbook(buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const grid = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: null });

  const dayRow = grid[2] || [];
  const timeRow = grid[3] || [];

  const columns = [];
  for (let c = 1; c < dayRow.length; c++) {
    const day = dayRow[c];
    const start = timeRow[c];
    if (!day || !start) continue;
    columns.push({ col: c, day: String(day).trim(), start: String(start).trim() });
  }

  const entries = [];
  for (let r = 4; r < grid.length; r++) {
    const row = grid[r];
    if (!row) continue;
    const rawName = row[0];
    if (!rawName) continue;
    const name = cleanName(rawName);
    if (!name) continue;

    let i = 0;
    while (i < columns.length) {
      const day = columns[i].day;
      const rawCode = row[columns[i].col];
      const code = rawCode ? String(rawCode).trim() : null;
      if (!code) { i++; continue; }

      let j = i;
      while (
        j + 1 < columns.length &&
        columns[j + 1].day === day &&
        row[columns[j + 1].col] &&
        String(row[columns[j + 1].col]).trim() === code
      ) {
        j++;
      }

      let startTime = columns[i].start;
      const nextIsSameDay = j + 1 < columns.length && columns[j + 1].day === day;
      const endTime = nextIsSameDay ? columns[j + 1].start : '23:59';

      // The last column of each day is labeled with the day's closing time (23:59)
      // rather than a real start time. When it forms its own block (a different
      // code from the column before it), fall back to the previous column's start
      // so the block isn't a zero-length "23:59 -> 23:59" slot.
      if (startTime === endTime && i > 0 && columns[i - 1].day === day) {
        startTime = columns[i - 1].start;
      }

      entries.push({
        person_name: name,
        day,
        activity_code: code,
        activity_name: ACTIVITY_LEGEND[code] || code,
        start_time: startTime,
        end_time: endTime,
      });

      i = j + 1;
    }
  }

  return entries;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }

  const { password, fileBase64 } = req.body || {};

  if (!process.env.IMPORT_PASSWORD) {
    res.status(500).json({ error: 'Servidor não configurado (IMPORT_PASSWORD ausente)' });
    return;
  }
  if (!password || password !== process.env.IMPORT_PASSWORD) {
    res.status(401).json({ error: 'Senha incorreta' });
    return;
  }
  if (!fileBase64) {
    res.status(400).json({ error: 'Arquivo ausente' });
    return;
  }

  let entries;
  try {
    const buffer = Buffer.from(fileBase64, 'base64');
    entries = parseWorkbook(buffer);
  } catch (err) {
    res.status(400).json({ error: 'Não foi possível ler o arquivo .xlsx: ' + err.message });
    return;
  }

  if (entries.length === 0) {
    res.status(400).json({ error: 'Nenhum dado de escala encontrado na planilha' });
    return;
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    res.status(500).json({ error: 'Servidor não configurado (variáveis do Supabase ausentes)' });
    return;
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  const { error: delErr } = await supabase.from('schedule_entries').delete().gt('id', 0);
  if (delErr) {
    res.status(500).json({ error: 'Falha ao limpar dados antigos: ' + delErr.message });
    return;
  }

  const { error: insErr } = await supabase.from('schedule_entries').insert(entries);
  if (insErr) {
    res.status(500).json({ error: 'Falha ao gravar dados novos: ' + insErr.message });
    return;
  }

  const { error: metaErr } = await supabase
    .from('sync_meta')
    .update({ last_imported_at: new Date().toISOString() })
    .eq('id', 1);
  if (metaErr) {
    res.status(500).json({ error: 'Falha ao atualizar horário de sincronização: ' + metaErr.message });
    return;
  }

  const uniquePeople = new Set(entries.map((e) => e.person_name));
  res.status(200).json({ ok: true, people: uniquePeople.size, blocks: entries.length });
};
