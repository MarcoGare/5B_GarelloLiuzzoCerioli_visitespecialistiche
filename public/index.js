//import { createMiddleware } from "../middleware.js";

const tableContainer = document.getElementById('table-container');
let currentWeekOffset = 0;
let tipologiaSelez = 0;
let myToken, myKey, tipologieVisita, giorniSettimana;
let diz = {}; 

fetch('../conf.json') // carica le variabili da conf.json
  .then(response => {
    if (!response.ok) {
      console.log('Errore nel caricamento del file JSON');
    }
    return response.json();
  })
  .then(data => {
    tipologieVisita = data.tipologie;
    giorniSettimana = data.settimana;
    myToken = data.cacheToken;
    myKey = data.myKey;
    console.log(tipologieVisita, giorniSettimana, myKey, myToken);
    render();
  })
  .catch(error => console.error('Errore:', error));

function selectTipologia(index) {
  tipologiaSelez = index;
  render();
}
window.selectTipologia = selectTipologia;

function render() {
  let formattedDate = [];
  let dayCounter = 0;

  for (let i = 0; dayCounter < 5; i++) {
      const futureDate = moment().add(i + currentWeekOffset * 7, 'days');
      const dayIndex = futureDate.day();

      if (dayIndex !== 0 && dayIndex !== 6) {
          formattedDate.push({
              date: futureDate.format('YYYY-MM-DD'),
              day: giorniSettimana[dayIndex]
          });
          dayCounter++;
      }
  }

  let html = renderTipologie();
  html += '<div class="mb-2">';
  html += `<button id="precBtn" class="btn btn-outline-success">Settimana Precedente</button>`;
  html += `<button id="succBtn" class="btn btn-outline-success">Settimana Successiva</button>`;
  html += '</div>';
  html += '<table class="table table-bordered table-striped"><thead><tr><th>Ora</th>';
  formattedDate.forEach(({ day, date }) => {
      html += `<th>${day} - ${date}</th>`;
  });
  html += '</tr></thead><tbody class="table-group-divider">';

  [8, 9, 10, 11, 12].forEach((ora) => {
      html += `<tr><td>${ora}</td>`;
      formattedDate.forEach(({ date }) => {
          const key = `${tipologieVisita[tipologiaSelez]}-${date}-${ora}`;
          const disponibilita = diz[key] || 'Disponibile';
          html += `<td class="${disponibilita !== "Disponibile" ? "table-info" : ""}">${disponibilita}</td>`;
      });
      html += '</tr>';
  });

  html += '</tbody></table>';
  tableContainer.innerHTML = html;

  document.getElementById('precBtn').onclick = precSett;
  document.getElementById('succBtn').onclick = succSett;
}

function renderTipologie() {
  return `<div class="tipologie-container mb-4">` +
    tipologieVisita.map((tipologia, index) => `
      <button class="btn ${index === tipologiaSelez ? 'btn-primary' : 'btn-secondary'} mx-1" onclick="selectTipologia(${index})">
        ${tipologia}
      </button>`).join('') +
    '</div>';
}

function precSett() {
  currentWeekOffset--;
  render();
}

function succSett() {
  currentWeekOffset++;
  render();
}
