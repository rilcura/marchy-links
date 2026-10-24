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

const copyButton = document.querySelector('#copy-riot');
const copyStatus = document.querySelector('#copy-status');
let resetCopy;
copyButton.addEventListener('click', async () => {
 clearTimeout(resetCopy);
 try {
  await navigator.clipboard.writeText('march#ixora');
  copyButton.querySelector('.copy-label').textContent = 'copied ✓';
  copyStatus.textContent = 'Riot ID copied: march#ixora';
 } catch {
  copyButton.querySelector('.copy-label').textContent = 'copy ID';
  copyStatus.textContent = 'Couldn’t copy automatically. Select and copy this ID: march#ixora';
 }
 resetCopy = setTimeout(() => {
  copyButton.querySelector('.copy-label').textContent = 'copy ID';
 }, 3000);
});
