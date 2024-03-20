var modal = document.getElementById('simplemodal');

var Img = document.querySelector('.Yes')
var modalBtn = document.getElementById('button');
var modalBtn2 = document.getElementById('button2');

var closeBtn = document.getElementById('closeBtn');

modalBtn.addEventListener('click',openModal);
modalBtn2.addEventListener('click',openImg);
closeBtn.addEventListener('click',closeModal);
window.addEventListener('click',closeWindowmodal);

function openModal(){
    modal.style.display = 'block';
}
function openImg(){
    Img.style.display = 'block';
    console.log(123);
}
function openModal(){
    modal.style.display = 'block';
}
function closeModal(){
    modal.style.display = 'none';
}
function closeWindowmodal(e){
    if(e.target == modal){
    modal.style.display = 'none';
    Img.style.display = 'none';

    }
}