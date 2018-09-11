// app.js; Coding by Madison Estabrook
const elem = document.getElementById('my-element');
const elem2 = document.querySelector('.results')
const elem3 = document.querySelector('.numberOfClicks');
let clicked = 0;
elem.addEventListener('click', function(){
  clicked = clicked + 1;
  elem2.classList.remove('hidden');
  elem2.classList.add('show');
  elem3.innerHTML = clicked;
});
