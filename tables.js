export function cTable(formattedDate, tipologieVisita, tipologiaSelez, diz) {
  let html = "";
  [8, 9, 10, 11, 12].forEach((ora) => {
      html += `<tr><td>${ora}</td>`;
      formattedDate.forEach(({ date }) => {
          const key = `${tipologieVisita[tipologiaSelez]}-${date}-${ora}`;
          const disponibilita = diz[key] || 'Disponibile';
          html += `<td class="${disponibilita !== 'Disponibile' ? 'table-info' : ''}">${disponibilita}</td>`;
      });
      html += '</tr>';
  });
  return html;
}
