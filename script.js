const KENYA_COUNTIES = ["Baringo","Bomet","Bungoma","Busia","Elgeyo Marakwet","Embu","Garissa","Homa Bay","Isiolo","Kajiado","Kakamega","Kericho","Kiambu","Kilifi","Kirinyaga","Kisii","Kisumu","Kitui","Kwale","Laikipia","Lamu","Machakos","Makueni","Mandera","Marsabit","Meru","Migori","Mombasa","Murang'a","Nairobi","Nakuru","Nandi","Narok","Nyamira","Nyandarua","Nyeri","Samburu","Siaya","Taita Taveta","Tana River","Tharaka Nithi","Trans Nzoia","Turkana","Uasin Gishu","Vihiga","Wajir","West Pokot"];
let properties = [];
let services = [];
let reports = [];
let offices = [];
let people = [];
let settings = {};
let featuredIndex = 0;
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
async function getJSON(path){ const res = await fetch(path); return res.json(); }
function money(n){ return new Intl.NumberFormat('en-KE').format(n); }
async function init(){
  try{
    const [p,s,r,o,set] = await Promise.all([
      getJSON('content/properties.json'), getJSON('content/services.json'), getJSON('content/reports.json'), getJSON('content/offices.json'), getJSON('content/settings.json')
    ]);
    properties = p.properties || []; services = s.services || []; reports = r.reports || []; offices = o.offices || []; people = o.people || []; settings = set || {};
    applySettings(); populateFilters(); renderFeatured(); renderProperties(properties); renderServices(); renderReports(); renderOffices(); bindEvents();
  } catch(e){ console.error(e); }
}
function applySettings(){
  if(settings.headline) $('#siteHeadline').textContent = settings.headline;
  if(settings.subheadline) $('#siteSubheadline').textContent = settings.subheadline;
  if(settings.email) $('#mailLink').href = `mailto:${settings.email}`;
  const tel = (settings.phone || '+254708766200').split('/')[0].replace(/[^+\d]/g,'');
  $('#callLink').href = `tel:${tel}`;
  if(settings.whatsapp) $('#waLink').href = `https://wa.me/${settings.whatsapp}`;
}
function populateFilters(){
  const county = $('#countyFilter');
  KENYA_COUNTIES.forEach(c=> county.insertAdjacentHTML('beforeend', `<option>${c}</option>`));
  const service = $('#serviceFilter');
  services.forEach(s => service.insertAdjacentHTML('beforeend', `<option value="${s.slug}">${s.title}</option>`));
}
function bindEvents(){
  $('.menu-toggle').addEventListener('click',()=>$('.nav').classList.toggle('open'));
  $$('.nav a').forEach(a=>a.addEventListener('click',()=>$('.nav').classList.remove('open')));
  $$('.tab').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.tab').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
    $$('.search-mode').forEach(p=>p.classList.remove('active'));
    document.querySelector(`[data-mode-panel="${btn.dataset.mode}"]`).classList.add('active');
  }));
  $('#searchBtn').addEventListener('click',()=>{ renderProperties(filterProperties()); location.hash='properties'; });
  ['dealFilter','typeFilter','countyFilter','keywordFilter','priceFilter'].forEach(id=>{$('#'+id).addEventListener('input',()=>renderProperties(filterProperties()))});
  $('#serviceSearchBtn').addEventListener('click',()=>{
    const slug = $('#serviceFilter').value; location.hash='services';
    setTimeout(()=>{ if(slug){ const item = document.querySelector(`[data-service="${slug}"]`); if(item){ item.classList.add('open'); item.scrollIntoView({behavior:'smooth', block:'center'}); }}}, 100);
  });
  $('#prevFeatured').addEventListener('click',()=>moveFeatured(-1)); $('#nextFeatured').addEventListener('click',()=>moveFeatured(1));
  $('#modalClose').addEventListener('click',()=>$('#propertyModal').close());
  setInterval(()=>moveFeatured(1), 6500);
}
function filterProperties(){
  const deal = $('#dealFilter').value.toLowerCase();
  const type = $('#typeFilter').value.toLowerCase();
  const county = $('#countyFilter').value.toLowerCase();
  const keyword = $('#keywordFilter').value.toLowerCase().trim();
  const max = Number($('#priceFilter').value || 0);
  return properties.filter(p => {
    const text = `${p.title} ${p.county} ${p.town} ${p.location} ${p.description} ${p.propertyType}`.toLowerCase();
    return (!deal || p.status === deal) && (!type || (p.propertyType||'').toLowerCase() === type) && (!county || (p.county||'').toLowerCase() === county) && (!keyword || text.includes(keyword)) && (!max || Number(p.price) <= max);
  });
}
function renderFeatured(){
  const featured = properties.filter(p=>p.featured) || properties;
  if(!featured.length) return;
  const p = featured[featuredIndex % featured.length];
  $('#featuredCard').innerHTML = `
    <img src="${(p.images && p.images[0]) || 'assets/hero-building.jpg'}" alt="${p.title}">
    <div class="featured-info">
      <span class="badge">${p.status === 'sale' ? 'For Sale' : 'For Rent'}</span>
      <h3>${p.title}</h3>
      <p class="price">${p.priceLabel || 'KES ' + money(p.price)}</p>
      <div class="meta"><span>${p.location}, ${p.county}</span><span>${p.propertyType}</span><span>${p.size}</span></div>
      <p>${p.description}</p>
      <button class="primary-btn" onclick="openProperty('${p.id}')">View Details</button>
    </div>`;
}
function moveFeatured(dir){ const f = properties.filter(p=>p.featured); if(!f.length) return; featuredIndex = (featuredIndex + dir + f.length) % f.length; renderFeatured(); }
function renderProperties(list){
  $('#resultCount').textContent = list.length;
  $('#propertyGrid').innerHTML = list.map(p=>`
    <article class="property-card">
      <img src="${(p.images && p.images[0]) || 'assets/hero-building.jpg'}" alt="${p.title}">
      <div class="property-body">
        <span class="badge">${p.status === 'sale' ? 'For Sale' : 'For Rent'}</span>
        <h3>${p.title}</h3>
        <p class="price">${p.priceLabel || 'KES ' + money(p.price)}</p>
        <div class="meta"><span>${p.location}</span><span>${p.propertyType}</span><span>${p.size}</span></div>
        <p>${p.description}</p>
        <div class="card-actions"><button class="small-btn" onclick="openProperty('${p.id}')">View Details</button><a class="small-btn" href="#contact">Enquire</a></div>
      </div>
    </article>`).join('') || `<p>No properties match your search yet. Please contact us and we will assist you directly.</p>`;
}
function openProperty(id){
  const p = properties.find(x=>x.id===id); if(!p) return;
  const gallery = (p.images||[]).map(src=>`<img src="${src}" alt="${p.title}">`).join('') || `<img src="assets/hero-building.jpg" alt="${p.title}">`;
  $('#modalContent').innerHTML = `<div class="modal-grid"><div class="modal-gallery">${gallery}</div><div class="modal-text"><span class="badge">${p.status === 'sale' ? 'For Sale' : 'For Rent'}</span><h2>${p.title}</h2><p class="price">${p.priceLabel || 'KES ' + money(p.price)}</p><div class="meta"><span>${p.location}, ${p.county}</span><span>${p.propertyType}</span><span>${p.size}</span><span>${p.bedrooms} bedrooms</span></div><p>${p.description}</p><h3>Key Features</h3><ul class="features">${(p.features||[]).map(f=>`<li>${f}</li>`).join('')}</ul><a class="primary-btn" href="#contact" onclick="document.getElementById('propertyModal').close()">Enquire About This Property</a></div></div>`;
  $('#propertyModal').showModal();
}
window.openProperty = openProperty;
function renderServices(){
  $('#servicesAccordion').innerHTML = services.map((s,i)=>`<article class="service-item" data-service="${s.slug}"><button class="service-title"><span><b>${s.icon || '•'}</b> ${s.title}</span><span>+</span></button><div class="service-panel"><p><strong>${s.summary}</strong></p><p>${s.details}</p><a class="secondary-btn" href="#contact">Request Service</a></div></article>`).join('');
  $$('.service-title').forEach(btn=>btn.addEventListener('click',()=>btn.parentElement.classList.toggle('open')));
}
function renderReports(){
  $('#reportsGrid').innerHTML = reports.map(r=>`<article class="report-card"><span class="badge">${r.category}</span><h3>${r.title}</h3><p>${r.summary}</p><a class="secondary-btn" href="${r.file}" target="_blank" rel="noopener">Open / Download</a></article>`).join('');
}
function renderOffices(){
  const officeCards = offices.map(o=>`<article class="office-card"><h3>${o.name}</h3><p><strong>${o.location}</strong></p><p>${o.county}</p><p>${o.phone}<br>${o.email}</p><a class="secondary-btn" href="${o.map}" target="_blank" rel="noopener">Open Map</a></article>`).join('');
  const peopleCards = people.map(p=>`<article class="office-card"><h3>${p.name}</h3><p><strong>${p.role}</strong></p><p>${p.office}</p><p>${p.phone}<br>${p.email}</p></article>`).join('');
  $('#officeGrid').innerHTML = officeCards + peopleCards;
}
init();
