// Deterministic decorative star field. No tracking or external scripts.
const sky=document.querySelector('.sky');
for(let i=0;i<52;i++){
 const star=document.createElement('span');
 star.textContent=i%4===0?'✦':'★';
 star.style.left=((i*37+7)%103-3)+'%';
 star.style.top=((i*23+3)%107-5)+'%';
 star.style.fontSize=(i%9===0?145:18+(i*17)%58)+'px';
 star.style.setProperty('--turn',((i*29)%60-30)+'deg');
 sky.append(star);
}
