// --- Tabs (mostrar A/B) ---
const tabs = document.querySelectorAll('.tab-btn');
tabs.forEach(btn => btn.addEventListener('click', () => {
  tabs.forEach(b => b.setAttribute('aria-selected', 'false'));
  btn.setAttribute('aria-selected', 'true');
  const target = btn.dataset.target;
  document.querySelectorAll('main .card').forEach(sec => {
    sec.hidden = sec.id !== target.slice(1);
  });
}));

// --- Versión A: progreso en tiempo real + borrador en localStorage (Zeigarnik) ---
const goodForm = document.getElementById('goodForm');
const fieldsA = ['name','email','pass','pass2','terms'];
const goodBar = document.getElementById('goodBar');
const goodPct = document.getElementById('goodPct');
const goodHint = document.getElementById('goodHint');
const keyDraft = 'goodFormDraft_v1';

function computeProgress(){
  let done = 0;
  fieldsA.forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    if(el.type === 'checkbox') { if(el.checked) done++; }
    else if(el.value.trim().length>0) done++;
  });
  const pct = Math.round((done / fieldsA.length) * 100);
  goodBar.style.width = pct + '%';
  goodPct.textContent = pct + '%';
  goodHint.textContent = pct<100 ? 'Estás cerca, ¡no lo dejes a medias!' : '¡Listo! Podés crear tu cuenta.';
}

goodForm.addEventListener('input', computeProgress);
goodForm.addEventListener('change', computeProgress);
computeProgress();

// Guardar borrador
document.getElementById('saveDraft').addEventListener('click', ()=>{
  const data = Object.fromEntries(new FormData(goodForm).entries());
  data.terms = document.getElementById('terms').checked;
  localStorage.setItem(keyDraft, JSON.stringify(data));
  goodHint.textContent = 'Borrador guardado. Podés continuar más tarde.';
});

// Restaurar borrador si existe
const draftRaw = localStorage.getItem(keyDraft);
if(draftRaw){
  try{
    const data = JSON.parse(draftRaw);
    if(data.name) document.getElementById('name').value = data.name;
    if(data.email) document.getElementById('email').value = data.email;
    if(data.pass) document.getElementById('pass').value = data.pass;
    if(data.pass2) document.getElementById('pass2').value = data.pass2;
    document.getElementById('terms').checked = !!data.terms;
    computeProgress();
    goodHint.textContent = 'Recuperamos tu progreso para que puedas terminar.';
  }catch(e){/* ignore */}
}

// Validación mínima + demo de submit
goodForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const p1 = document.getElementById('pass').value;
  const p2 = document.getElementById('pass2').value;
  if(p1 !== p2){
    alert('Las contraseñas no coinciden.');
    return;
  }
  localStorage.removeItem(keyDraft);
  alert('Cuenta creada con éxito (demo).');
  goodForm.reset();
  computeProgress();
});

// --- Versión B: mala experiencia intencional ---
const badForm = document.getElementById('badForm');
document.getElementById('badReset').addEventListener('click', ()=>{
  badForm.reset();
  alert('Se borró todo. No hay recuperación.');
});

// Nota: NO guardamos borrador ni mostramos progreso real a propósito (rompe Zeigarnik)
