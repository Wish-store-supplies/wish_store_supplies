
// Script for Wish design tool
const whatsappNumber = "+201110859649"; // replace if needed

function qs(sel) { return document.querySelector(sel); }
function qsa(sel) { return document.querySelectorAll(sel); }

let selections = {
  size: null,
  cover: {src: "cover1.svg", price: 0},
  paper: null,
  extras: [],
  name: ""
};

function calcTotal() {
  let total = 0;
  if (selections.size) total += Number(selections.size.price || 0);
  if (selections.cover) total += Number(selections.cover.price || 0);
  if (selections.paper) total += Number(selections.paper.price || 0);
  if (selections.extras.length) {
    selections.extras.forEach(e => total += Number(e.price || 0));
  }
  return total;
}

function updateUI() {
  const total = calcTotal();
  qs('#totalPrice').textContent = total + " ج";
  // preview
  qs('#previewCover').src = selections.cover.src || 'cover1.svg';
  qs('#previewName').textContent = selections.name.trim() || 'اسمك هنا';
  const sizeText = selections.size ? selections.size.value : '-';
  const paperText = selections.paper ? selections.paper.value : '-';
  const extrasText = selections.extras.length ? selections.extras.map(e=>e.value).join(', ') : '-';
  qs('#previewDetails').textContent = `حجم: ${sizeText} | ورق: ${paperText} | إضافات: ${extrasText}`;
}

// handle single-choice groups (size, paper)
function setupSingleChoice(groupId, key) {
  const group = qs('#' + groupId);
  group.addEventListener('click', (ev) => {
    if (!ev.target.classList.contains('option')) return;
    group.querySelectorAll('.option').forEach(btn => btn.classList.remove('selected'));
    ev.target.classList.add('selected');
    const price = Number(ev.target.dataset.price || 0);
    const value = ev.target.dataset.value || ev.target.textContent.trim();
    if (key === 'size') {
      selections.size = {price, value};
    } else if (key === 'paper') {
      selections.paper = {price, value};
    }
    updateUI();
  });
}

// cover selection (single choice but changes image)
function setupCovers() {
  const group = qs('#coverOptions');
  group.addEventListener('click', (ev) => {
    if (!ev.target.classList.contains('option')) return;
    group.querySelectorAll('.option').forEach(btn => btn.classList.remove('selected'));
    ev.target.classList.add('selected');
    const price = Number(ev.target.dataset.price || 0);
    const src = ev.target.dataset.src || 'cover1.svg';
    selections.cover = {price, src};
    updateUI();
  });
}

// extras (multi-select)
function setupExtras() {
  const group = qs('#extraOptions');
  group.addEventListener('click', (ev) => {
    if (!ev.target.classList.contains('option')) return;
    ev.target.classList.toggle('selected');
    const value = ev.target.dataset.value || ev.target.textContent.trim();
    const price = Number(ev.target.dataset.price || 0);
    const exists = selections.extras.find(e=>e.value===value);
    if (exists) {
      selections.extras = selections.extras.filter(e=>e.value!==value);
    } else {
      selections.extras.push({value, price});
    }
    updateUI();
  });
}

function setupName() {
  const inp = qs('#userName');
  inp.addEventListener('input', (e) => {
    selections.name = e.target.value;
    updateUI();
  });
}

function setupOrderButton() {
  const btn = qs('#orderBtn');
  btn.addEventListener('click', (e) => {
    const total = calcTotal();
    // Build message
    const lines = [];
    lines.push('طلب من Wish Store');
    lines.push('-----------------');
    lines.push('المنتج: نوت بوك مخصص');
    lines.push(`الحجم: ${selections.size ? selections.size.value : '-'}`);
    lines.push(`الغلاف: ${selections.cover ? selections.cover.src : '-'}`);
    lines.push(`نوع الورق: ${selections.paper ? selections.paper.value : '-'}`);
    lines.push(`الإضافات: ${selections.extras.length ? selections.extras.map(x=>x.value).join(', ') : '-'}`);
    if (selections.name && selections.name.trim().length) lines.push(`الاسم على الغلاف: ${selections.name.trim()}`);
    lines.push(`السعر الإجمالي: ${total} ج`);
    lines.push('المرسل: (اكتب اسمك وبيانات التواصل هنا)');
    const message = encodeURIComponent(lines.join('\n'));
    const waLink = `https://wa.me/${whatsappNumber.replace('+','')}?text=${message}`;
    window.open(waLink, '_blank');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupSingleChoice('sizeOptions', 'size');
  setupSingleChoice('paperOptions', 'paper');
  setupCovers();
  setupExtras();
  setupName();
  setupOrderButton();
  // initial selection defaults
  qs('#sizeOptions .option').classList.add('selected');
  selections.size = {price: Number(qs('#sizeOptions .option').dataset.price||0), value: qs('#sizeOptions .option').dataset.value||qs('#sizeOptions .option').textContent.trim()};
  qs('#coverOptions .option').classList.add('selected');
  selections.cover = {price: Number(qs('#coverOptions .option').dataset.price||0), src: qs('#coverOptions .option').dataset.src||'cover1.svg'};
  updateUI();
});
