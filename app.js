async function getCurrencies () {
  const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
  const data = await response.json();
  let result = await data;

  let title = document.querySelector('.title');
  title.innerHTML = title.innerHTML.replace('YYYY-MM-DD', result.Date.slice(0, 10));

  let rates = [];
  let previousURL = result.PreviousURL;
  
  for (let i = 0; i < 10; i++) {
    const response = await fetch('https:' + previousURL);
    const data = await response.json();
    let result = await data;
    
    rates.push(result);
    previousURL = result.PreviousURL;
  }

  render(result, rates);
}

function render (result, rates) {
  let valute = document.getElementById('valute');
  for(let currency in result.Valute) {
    let difference = (result.Valute[currency].Value - result.Valute[currency].Previous) / result.Valute[currency].Previous * 100;

    let currencyRate = ``;
    rates.forEach(rate => {
  
        currencyRate += `
          <div><span class="day">${rate.Date.slice(0, 10)}</span> <span>${rate.Valute[currency].Value}</span></div>
        ` 
    }); 

    valute.innerHTML += `
  <ul class="valute__list accordion">
    <li class="list__item item-cod tooltip">${result.Valute[currency].CharCode} <span class="tooltiptext">${result.Valute[currency].Name}</span></li>
    <li class="list__item item-rub">${result.Valute[currency].Value}</li>
    <li class="list__item item-percent">  ${difference.toFixed(1)}</li>
  </ul>
  <div class="list__item item-array panel">${currencyRate}</div>
`;
  }

  
let acc = document.getElementsByClassName("accordion");
let i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active");

        let panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}

}
getCurrencies ();
