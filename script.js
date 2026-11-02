document.addEventListener('DOMContentLoaded', () => {
  // Мобільне меню
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Фільтр таблиці за рівнем безпеки
  const filters = document.getElementById('filters');
  if (filters) {
    filters.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-f]');
      if (!btn) return;
      filters.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      const f = btn.dataset.f;
      document.querySelectorAll('#rows tr').forEach(tr => {
        tr.style.display = (f === 'all' || tr.dataset.l === f) ? '' : 'none';
      });
    });
  }

  // Графіки
  if (typeof Chart === 'undefined' || !document.getElementById('cDebt')) return;

  const C = { opt: '#15803d', uns: '#ca8a04', dan: '#ea580c', cri: '#dc2626', abs: '#7f1d1d', blue: '#002776', green: '#00623a', yellow: '#ffdf00' };
  Chart.defaults.font.family = '"Segoe UI", system-ui, sans-serif';
  Chart.defaults.maintainAspectRatio = false;

  const line = (label, data, color) => ({ label, data, borderColor: color, backgroundColor: color, borderWidth: 2, pointRadius: 4, tension: 0.2 });
  const threshold = (label, value, n, color) => ({ type: 'line', label, data: Array(n).fill(value), borderColor: color, borderDash: [6, 4], borderWidth: 2, pointRadius: 0 });
  const bar = (label, data, colors) => ({ type: 'bar', label, data, backgroundColor: colors, borderRadius: 4 });

  // Борг
  new Chart('cDebt', {
    type: 'line',
    data: {
      labels: ['2020', '2022', '2023', '2024'],
      datasets: [line('Борг, % ВВП', [98.71, 79.10, 83.03, 81.86], C.abs), threshold('Поріг 60 %', 60, 4, C.opt)]
    },
    options: { scales: { y: { min: 40, max: 110 } } }
  });

  // Покриття імпорту
  new Chart('cCover', {
    type: 'bar',
    data: {
      labels: ['2023', '2024'],
      datasets: [bar('Коефіцієнт покриття', [1.14, 1.016], [C.opt, C.opt]), threshold('Поріг 1,0', 1, 2, C.abs)]
    },
    options: { scales: { y: { min: 0.8, max: 1.25 } } }
  });

  // Урожайність
  new Chart('cGrain', {
    type: 'bar',
    data: {
      labels: ['2023', '2024'],
      datasets: [bar('Урожайність, ц/га', [53.37, 50.03], [C.opt, C.opt]), threshold('Нижня межа 45', 45, 2, C.uns), threshold('Верхня межа 55', 55, 2, C.uns)]
    },
    options: { scales: { y: { min: 40, max: 60 } } }
  });

  // Тривалість життя
  new Chart('cLife', {
    type: 'bar',
    data: {
      labels: ['Жінки', 'Чоловіки'],
      datasets: [bar('Років', [79.15, 72.95], [C.opt, C.uns]), threshold('Оптимум від 78', 78, 2, C.opt)]
    },
    options: { scales: { y: { min: 65, max: 82 } } }
  });

  // Смертність немовлят
  new Chart('cInfant', {
    type: 'bar',
    data: {
      labels: ['Дівчатка (≈)', 'Хлопчики'],
      datasets: [bar('‰', [10.9, 13.8], [C.cri, C.abs]), threshold('Поріг 11 ‰', 11, 2, C.blue)]
    },
    options: { scales: { y: { min: 0, max: 16 } } }
  });

  // Розподіл рівнів
  new Chart('cLevels', {
    type: 'doughnut',
    data: {
      labels: ['Оптимальний', 'Незадовільний', 'Небезпечний', 'Критичний', 'Абсолютна небезпека'],
      datasets: [{ data: [3, 1, 1, 1, 3], backgroundColor: [C.opt, C.uns, C.dan, C.cri, C.abs] }]
    },
    options: { plugins: { legend: { position: 'bottom' } } }
  });
});
