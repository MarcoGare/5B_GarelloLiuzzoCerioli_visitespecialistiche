import { createMiddleware } from "../middleware.js";
import { cTable } from "../tables.js";

const tableContainer = document.getElementById('table-container');
let currentWeekOffset = 0;
let tipologiaSelez = 0;
let myToken, myKey, tipologieVisita, giorniSettimana;

fetch('./conf.json') // carica le variabili da conf.json
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
    console.log(tipologieVisita)
    console.log(giorniSettimana)
    console.log(myKey)
    console.log(myToken)
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
          const dayName = giorniSettimana[dayIndex];
          formattedDate.push({
              date: futureDate.format('YYYY-MM-DD'),
              day: dayName,
          });
          dayCounter++;
      }
  }
  let html = renderTipologie();
  html += '<div class="mb-2">';
  html += `<button id="precBtn" class="btn btn-outline-success">Settimana Precedente</button>`;
  html += `<button id="succBtn" class="btn btn-outline-success">Settimana Successiva</button>`;
  html += '</div>';
  html += '<table class="table table-bordered table table-striped"><thead><tr><th>Ora</th>';

  formattedDate.forEach(({ day, date }) => {
      html += `<th>${day} - ${date}</th>`;
  });
  html += '</tr></thead><tbody class="table-group-divider">';
  cTable()
  html += '</tbody></table>';
  tableContainer.innerHTML = html;

  document.getElementById('precBtn').onclick = precSett;
  document.getElementById('succBtn').onclick = succSett;
  //bottoni modali
  document.getElementById('apriBtn').onclick = () => {
    document.getElementById('prenotazioneModal').style.display = 'block'; 
};

document.getElementById('chiudiBtn').onclick = () => {
    document.getElementById('prenotazioneModal').style.display = 'none';
};

document.getElementById('cancelButton').onclick = () => {
    document.getElementById('prenotazioneModal').style.display = 'none';
};

document.getElementById("submit").onclick = () => {
    SubmForm();
}

}
function SubmForm() { //componente form 
    const data = document.getElementById('data').value;
    const ora = document.getElementById('ora').value;
    const nominativo = document.getElementById('nominativo').value;
    const esitoDiv = document.getElementById('esito');

    const data2 = moment(data)
    const dayOfWeek = data2.day();
    //console.log(data2)

    if (dayOfWeek === 0 || dayOfWeek === 6) { // 0 = Domenica, 6 = Sabato
      esitoDiv.innerHTML =
        '<div class="alert alert-warning">La clinica è chiusa durante il weekend. Seleziona un giorno della settimana.</div>';
      return; 
    }
    const key = `${tipologieVisita[tipologiaSelez]}-${data}-${ora}`;
    const disponibilita = diz[key];

    if (!disponibilita) {
        diz[key] = nominativo;
      salva(myToken, myKey).then(() => {
              console.log(diz);
                esitoDiv.innerHTML = '<div class="alert alert-success">Prenotazione aggiunta con successo!</div>';
                document.getElementById('data').value = "";
                document.getElementById('ora').value = "";
                document.getElementById('nominativo').value = "";
                render();
            })
            .catch(() => {
                esitoDiv.innerHTML ='<div class="alert alert-danger">Errore durante il salvataggio. Riprova.</div>';
            });
    } else {
        esitoDiv.innerHTML ='<div class="alert alert-danger">Slot non disponibile. Riprova.</div>';
    }
}


function renderTipologie() {
  let html = '<div class="tipologie-container mb-4">';
  tipologieVisita.forEach((tipologia, index) => {
    let buttonClass;
    if (index === tipologiaSelez) {
        buttonClass = 'btn-primary';
    } else {
        buttonClass = 'btn-secondary';
    }
    html += `<button 
              class="btn ${buttonClass} mx-1" 
              onclick="selectTipologia(${index})">
              ${tipologia}
              </button>`;
  });
  html += '</div>';
  return html;
}function precSett() {
  currentWeekOffset--;
  render();
}

function succSett() {
  currentWeekOffset++;
  render();
}