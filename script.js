gsap.registerPlugin(ScrollTrigger);

/* ---------- custom cursor ---------- */
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx=0,my=0, rx=0, ry=0;
window.addEventListener('mousemove', e=>{
  mx=e.clientX; my=e.clientY;
  cur.style.left = mx+'px'; cur.style.top = my+'px';
});
gsap.ticker.add(()=>{
  rx += (mx-rx)*0.15; ry += (my-ry)*0.15;
  ring.style.left = rx+'px'; ring.style.top = ry+'px';
});
document.querySelectorAll('a, button, .pf-card, .service-card').forEach(el=>{
  el.addEventListener('mouseenter', ()=>ring.classList.add('big'));
  el.addEventListener('mouseleave', ()=>ring.classList.remove('big'));
});

/* ---------- magnetic buttons ---------- */
document.querySelectorAll('.magnetic').forEach(btn=>{
  btn.addEventListener('mousemove', e=>{
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width/2;
    const y = e.clientY - r.top - r.height/2;
    gsap.to(btn, {x:x*0.35, y:y*0.5, duration:0.4, ease:'power3.out'});
  });
  btn.addEventListener('mouseleave', ()=>{
    gsap.to(btn, {x:0, y:0, duration:0.5, ease:'elastic.out(1,0.4)'});
  });
});

/* ---------- hero title split reveal ---------- */
const heroTitle = document.getElementById('heroTitle');
heroTitle.innerHTML = heroTitle.innerHTML
  .split('<br>')
  .map(line => line.split(' ').map(word => `<span class="word" style="display:inline-block;overflow:hidden;vertical-align:top;"><span class="word-in" style="display:inline-block;">${word}&nbsp;</span></span>`).join(''))
  .join('<br>');
gsap.set('.word-in', {yPercent:110, opacity:0});
gsap.to('.word-in', {yPercent:0, opacity:1, duration:1.1, ease:'power4.out', stagger:0.045, delay:0.2});

gsap.from('.hero-eyebrow, .hero-sub, .hero-actions, .hero-scroll', {
  opacity:0, y:20, duration:1, stagger:0.12, delay:0.6, ease:'power3.out'
});
gsap.from('.chip', {opacity:0, scale:0.7, duration:1, stagger:0.1, delay:1, ease:'back.out(1.7)'});

/* floating chips ambient motion */
document.querySelectorAll('.chip').forEach((chip,i)=>{
  gsap.to(chip, {
    y: i%2===0 ? -16 : 16, duration: 3+i*0.4, repeat:-1, yoyo:true, ease:'sine.inOut'
  });
});

/* hero parallax on mouse */
document.querySelector('.hero').addEventListener('mousemove', e=>{
  const x = (e.clientX/window.innerWidth - 0.5);
  const y = (e.clientY/window.innerHeight - 0.5);
  gsap.to('.hero-bg', {x:x*30, y:y*20, duration:1, ease:'power2.out'});
});

/* hero scroll transform */
gsap.to('.hero-inner', {
  scale:0.92, opacity:0.3, y:-60,
  scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:true}
});
gsap.to('.hero-bg', {
  scale:1.3, scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:true}
});

/* ---------- generic reveal on scroll ---------- */
gsap.utils.toArray('.reveal').forEach(el=>{
  gsap.to(el, {
    opacity:1, y:0, duration:1, ease:'power3.out',
    scrollTrigger:{trigger:el, start:'top 85%'}
  });
});
gsap.utils.toArray('.service-card').forEach((el,i)=>{
  gsap.fromTo(el, {opacity:0, y:40}, {
    opacity:1, y:0, duration:0.8, ease:'power3.out', delay:(i%3)*0.08,
    scrollTrigger:{trigger:el, start:'top 90%'}
  });
});

/* service card tilt + spotlight */
document.querySelectorAll('.service-card').forEach(card=>{
  card.addEventListener('mousemove', e=>{
    const r = card.getBoundingClientRect();
    const px = e.clientX - r.left, py = e.clientY - r.top;
    card.style.setProperty('--mx', px+'px');
    card.style.setProperty('--my', py+'px');
    const rx = ((py/r.height)-0.5) * -10;
    const ry = ((px/r.width)-0.5) * 10;
    gsap.to(card, {rotateX:rx, rotateY:ry, duration:0.4, ease:'power2.out', transformPerspective:600});
  });
  card.addEventListener('mouseleave', ()=>gsap.to(card,{rotateX:0, rotateY:0, duration:0.6, ease:'power3.out'}));
});

/* ---------- stats counters ---------- */
document.querySelectorAll('.stat-num').forEach(el=>{
  const target = parseFloat(el.dataset.count);
  const plusEl = el.querySelector('.plus');
  const obj = {val:0};
  ScrollTrigger.create({
    trigger: el, start:'top 88%', once:true,
    onEnter:()=>{
      gsap.to(obj, {
        val: target, duration:2, ease:'power2.out',
        onUpdate:()=>{
          const display = target % 1 !== 0 ? obj.val.toFixed(1) : Math.round(obj.val);
          el.childNodes[0].nodeValue = display;
        }
      });
    }
  });
});

/* ---------- portfolio data + render ---------- */
const categories = ['short','long','gaming','football','anime','doc','ads','ecom','grading','reels','youtube','commercial'];
const catLabel = {short:'Short Form', long:'Long Form', gaming:'Gaming', football:'Football', anime:'Anime', doc:'Documentary', ads:'Ads', ecom:'eCommerce', grading:'Color Grading', reels:'Reels', youtube:'YouTube', commercial:'Commercials'};
const gradients = [
  'linear-gradient(135deg,#8EFF5A,#0d3d0d)',
  'linear-gradient(135deg,#1a1a1a,#8EFF5A)',
  'linear-gradient(135deg,#2c3d1e,#070707)',
  'linear-gradient(135deg,#8EFF5A,#111411)',
  'linear-gradient(160deg,#0f1a0c,#3c5a2b)',
  'linear-gradient(150deg,#141414,#6fd63f)'
];
const titles = ['Neon Drop', 'Studio Cut', 'Boot Room', 'Late Night', 'Overtime', 'Frame Zero', 'Match Day', 'After Hours', 'Signal', 'Loop It', 'Prime Cut', 'Wide Shot'];
const ratios = ['16/9','1/1','4/5','9/16','3/4'];

const grid = document.getElementById('portfolioGrid');
let items = [

{
    cat: "gaming",
    title: "Gaming Edit",
    video: "assets/videos/game.mp4",
    ar: "1/1"
},

{
    cat: "reels",
    title: "Insta Reel",
    video: "assets/videos/psychology.mp4",
    ar: "1/1"
},

{
    cat: "football",
    title: "Football Reel",
    video: "assets/videos/football.mp4",
    ar: "9/16"
},

{
    cat: "reels",
    title: "Reels Edit",
    video: "assets/videos/reel1.mp4",
    ar: "9/16"
},

{
    cat: "ads",
    title: "Monster Ad",
    video: "assets/videos/monster.mp4",
    ar: "1/1"
},

{
    cat: "short",
    title: "Spider-Man Edit",
    video: "assets/videos/spiderman.mp4",
    ar: "16/9"
},

{
    cat: "reels",
    title: "Reels Edit",
    video: "assets/videos/reel2.mp4",
    ar: "9/16"
},

{
    cat: "ads",
    title: "Nike Ad",
    video: "assets/videos/nike.mp4",
    ar: "1/1"
},

{
    cat: "ecom",
    title: "Ecommerce",
    video: "assets/videos/ecommerce.mp4",
    ar: "3/4"
},

{
    cat: "youtube",
    title: "Travel Vlog",
    video: "assets/videos/youtube.mp4",
    ar: "16/9"
},

{
    cat: "ads",
    title: "Starbucks Ad",
    video: "assets/videos/starbucks.mp4",
    ar: "3/4"
},

{
    cat: "anime",
    title: "Anime Edit",
    video: "assets/videos/anime.mp4",
    ar: "9/16"
}

];
function renderGrid(filter){
  grid.innerHTML = '';
  items.filter(it => filter==='all' || it.cat===filter).forEach(it=>{
    const card = document.createElement('div');
    card.className = 'pf-card';
    card.innerHTML = `
    <div class="pf-thumb" style="aspect-ratio:${it.ar};">

        <video
            class="pf-video"
            muted
            loop
            playsinline
            preload="metadata">

            <source src="${it.video}" type="video/mp4">

        </video>

        <div class="pf-play">
            <svg viewBox="0 0 24 24">
                <polygon points="6,4 20,12 6,20"/>
            </svg>
        </div>

        <div class="pf-meta">

            <div class="pf-cat">
                ${catLabel[it.cat]}
            </div>

            <div class="pf-name display">
                ${it.title}
            </div>

        </div>

    </div>

</div>`;
    grid.appendChild(card);
  });
  gsap.fromTo(grid.children, {opacity:0, y:24, scale:0.96}, {opacity:1, y:0, scale:1, duration:0.6, stagger:0.03, ease:'power3.out'});
}
renderGrid('all');
document.querySelectorAll(".pf-card").forEach(card => {

    const video = card.querySelector("video");

    // Default state
    video.muted = true;
    video.volume = 1;

    card.addEventListener("mouseenter", () => {

        // Pause and mute every other video
        document.querySelectorAll(".pf-card video").forEach(v => {
            if (v !== video) {
                v.pause();
                v.currentTime = 0;
                v.muted = true;
            }
        });

        video.muted = false;
        video.play();

    });

    card.addEventListener("mouseleave", () => {

        video.muted = true;
        video.pause();
        video.currentTime = 0;

    });

});

document.getElementById('filters').addEventListener('click', e=>{
  const pill = e.target.closest('.pill');
  if(!pill) return;
  document.querySelectorAll('.pill').forEach(p=>p.classList.remove('active'));
  pill.classList.add('active');
  renderGrid(pill.dataset.filter);
});

/* ---------- process timeline fill ---------- */
gsap.to('#timelineFill', {
  height:'100%', ease:'none',
  scrollTrigger:{trigger:'.timeline', start:'top 60%', end:'bottom 80%', scrub:true}
});
gsap.utils.toArray('.step').forEach((step,i)=>{
  gsap.fromTo(step, {opacity:0, x:-30}, {
    opacity:1, x:0, duration:0.8, ease:'power3.out',
    scrollTrigger:{trigger:step, start:'top 85%'}
  });
});

/* ---------- about rings rotate ---------- */
gsap.to('.rings span:nth-child(1)', {rotate:360, duration:20, repeat:-1, ease:'linear'});
gsap.to('.rings span:nth-child(2)', {rotate:-360, duration:30, repeat:-1, ease:'linear'});
gsap.to('.rings span:nth-child(3)', {rotate:360, duration:40, repeat:-1, ease:'linear'});