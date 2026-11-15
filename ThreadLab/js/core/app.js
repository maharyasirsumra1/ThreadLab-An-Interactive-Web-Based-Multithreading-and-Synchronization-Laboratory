import {initRanges,initSegments,getRuns,text} from './ui.js';
import {initTheme} from './theme.js';
import {initPremiumMotion} from './animations.js';
initTheme();
initRanges();initSegments();
const menu=document.getElementById('mobileMenu'),sidebar=document.getElementById('sidebar'),backdrop=document.getElementById('sidebarBackdrop');
function closeNav(){sidebar?.classList.remove('is-open');backdrop?.classList.remove('is-visible');menu?.setAttribute('aria-expanded','false')}
menu?.addEventListener('click',()=>{const open=!sidebar.classList.contains('is-open');sidebar.classList.toggle('is-open',open);backdrop.classList.toggle('is-visible',open);menu.setAttribute('aria-expanded',String(open))});backdrop?.addEventListener('click',closeNav);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNav()});
const obs=('IntersectionObserver'in window)?new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('in-view');obs.unobserve(entry.target)}},{threshold:.08,rootMargin:'0px 0px 50px 0px'}):null;document.querySelectorAll('.reveal').forEach(el=>obs?obs.observe(el):el.classList.add('in-view'));
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduced && matchMedia('(pointer:fine)').matches){document.querySelectorAll('.tilt-card').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(1050px) rotateX(${(-y*2.5).toFixed(2)}deg) rotateY(${(x*3.5).toFixed(2)}deg) translateY(-2px)`});card.addEventListener('pointerleave',()=>{card.style.transform=''})})}
const dateEl=document.getElementById('topDate');if(dateEl)dateEl.textContent=new Date().toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'});
const savedEl=document.getElementById('savedCount');if(savedEl)text(savedEl,getRuns().length);
initPremiumMotion();
