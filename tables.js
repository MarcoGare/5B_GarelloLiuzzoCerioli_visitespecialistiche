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


export function cTable(){
  [8, 9, 10, 11, 12].forEach((ora) => {
        html += `<tr><td>${ora}</td>`;
        formattedDate.forEach(({ date }) => {
          const key = `${tipologieVisita[tipologiaSelez]}-${date}-${ora}`;
          const disponibilita = diz[key] || 'Disponibile';
          if (disponibilita !== "Disponibile"){
            html += `<td class="table-info">${disponibilita}</td>`;
          } else {
            html += `<td>${disponibilita}</td>`;
          }
          
        });
        html += '</tr>';
    });
}