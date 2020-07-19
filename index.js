'use strict';

let demo = document.querySelector('main');
let sourceSelector = document.querySelector('select');
let apiKey = 'aac2fb56700348119c47b8fc345873b8';

if('serviceWorker' in navigator){
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(register => console.log('Service Worker registrado com sucesso'))
            .catch(err => console.log('Falha ao registrar o Service Worker', err))
    })
    navigator.serviceWorker.oncontrollerchange = controllerChange();
} else {
    alert('Seu browser não é compativel com o Service Worker');
}

window.addEventListener('load', () =>{
    updateNewsSources('general');
});

async function updateNewsSources(result) {
  let category = await `https://newsapi.org/v2/top-headlines?country=br&category=${result}&apiKey=${apiKey}`;
  updateNews(category);
}

async function updateNews(url){
    let response = await fetch(url);
    let json = await response.json();

    demo.innerHTML = json.articles.map(article => {

        if(article.urlToImage != null && article.description != null){
            return `
                <article class="article">
                    <a href="${article.url}">
                        <h2>${article.title}</h2>
                        <img src="${article.urlToImage}" alt="${article.title}" />
                        <p>${article.description}</p>
                        <p style="font-weight: bold;">Fonte: <span style="color: #00f">${article.source.name}</span></p>
                    </a>
                </article>
            `;
        }

    }).join('\n');

}

async function controllerChange(){
    let div = await document.querySelector('#alert');
    if(localStorage.getItem('service-worker')){
        div.className = 'yellow';
        div.innerHTML = 'Atualize a página para ver o conteúdo mais novo!';
    } else {
        div.className = 'green';
        div.innerHTML = 'Offline Pronto!';
        localStorage.setItem('service-worker', 'done');
    }

    setTimeout(() => {
        div.style.opacity = 0;
    }, 5000);

}