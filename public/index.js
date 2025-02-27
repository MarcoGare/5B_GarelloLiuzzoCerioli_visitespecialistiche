//import { createMiddleware } from "../middleware.js";
import { createLogin } from "../login.js";
const tableContainer = document.getElementById('table-container');
let currentWeekOffset = 0;
let tipologiaSelez = 0;
let myToken, myKey, tipologieVisita, giorniSettimana;
let diz = {}; 
createLogin();

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
          const key = `${tipologieVisita[tipologiaSelez]}/${date}/${ora}`;
          const disponibilita = diz[key] || 'Disponibile';
          if (disponibilita !== "Disponibile") {
            html += `<td class="table-info">${disponibilita}</td>`;
          } else {
            html += `<td>${disponibilita}</td>`;
          }
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


//GESTIONE MODALI
document.getElementById('apriBtn').onclick = () => {
  document.getElementById('modal').style.display = 'block';
};

document.getElementById('chiudiBtn').onclick = () => {
  document.getElementById('modal').style.display = 'none';
};

document.getElementById('cancelButton').onclick = () => {
  document.getElementById('modal').style.display = 'none';
};

document.getElementById("submit").onclick = () => {
  SubmForm();
}

//GESTIONE BOTTONI LOGIN
document.getElementById('adminBtn').onclick = () => {
  document.getElementById('loginModal').style.display = 'block';
};

document.getElementById('btn-close').onclick = () => {
  document.getElementById('loginModal').style.display = 'none';
};

document.getElementById('btn-close').onclick = () => {
  document.getElementById('loginModal').style.display = 'none';
};



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
    const key = `${tipologieVisita[tipologiaSelez]}/${data}/${ora}`;
    const disponibilita = diz[key];

    if (!disponibilita) {
        diz[key] = nominativo;
        console.log(diz);
        //IMPLEMENTARE SALVATAGGIO SU DB
        esitoDiv.innerHTML = '<div class="alert alert-success">Prenotazione aggiunta con successo!</div>';
        document.getElementById('data').value = "";
        document.getElementById('ora').value = "";
        document.getElementById('nominativo').value = "";
        render();
    } else {
        esitoDiv.innerHTML ='<div class="alert alert-danger">Slot non disponibile. Riprova.</div>';
    }
}