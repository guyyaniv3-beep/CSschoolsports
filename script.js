const starterGames = [
  { sport: 'football', label: 'Football', date: 'FRI, OCT 18', status: 'FINAL', home: 'CS Eagles', away: 'Riverside', homeScore: 28, awayScore: 14, detail: 'Home • Varsity' },
  { sport: 'soccer', label: 'Soccer', date: 'TUE, OCT 22', status: 'FINAL', home: 'CS Eagles', away: 'Northview', homeScore: 3, awayScore: 1, detail: 'Home • Girls Varsity' },
  { sport: 'track', label: 'Track & Cross Country', date: 'SAT, OCT 26', status: 'RESULTS', home: 'CS Eagles', away: 'Invitational', homeScore: '2nd', awayScore: '—', detail: 'Away • Conference Meet' },
  { sport: 'soccer', label: 'Soccer', date: 'THU, OCT 31', status: 'UPCOMING', home: 'CS Eagles', away: 'East Ridge', homeScore: '—', awayScore: '—', detail: '7:00 PM • Away' },
  { sport: 'football', label: 'Football', date: 'FRI, NOV 1', status: 'UPCOMING', home: 'CS Eagles', away: 'Westfield', homeScore: '—', awayScore: '—', detail: '7:30 PM • Home' },
  { sport: 'track', label: 'Track & Cross Country', date: 'SAT, NOV 2', status: 'UPCOMING', home: 'CS Eagles', away: 'State Meet', homeScore: '—', awayScore: '—', detail: '9:00 AM • Away' }
];
let games = JSON.parse(localStorage.getItem('cs-school-games') || 'null') || starterGames;
let selectedSport = 'all';
const grid = document.querySelector('#score-grid'), empty = document.querySelector('#empty-state'), title = document.querySelector('#section-title');
const labels = { track: 'Track & Cross Country', soccer: 'Soccer', football: 'Football' };
const descriptions = { all: 'See every CS School score and upcoming event.', track: 'Meet results, race times, and upcoming track and cross country events.', soccer: 'Match scores and upcoming boys and girls soccer games.', football: 'Final scores and upcoming varsity football games.' };
const labelFor = sport => labels[sport] || 'All sports';
const formatDate = value => { if (!value) return 'DATE TBD'; const date = new Date(`${value}T00:00:00`); return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase(); };
function saveGames() { localStorage.setItem('cs-school-games', JSON.stringify(games)); }
function gameMarkup(game, includeEdit = false) { return `<article class="mini-game"><div><strong>${game.home} <span>${game.homeScore}</span></strong><strong>${game.away} <span>${game.awayScore}</span></strong></div><small>${game.date} · ${game.status}</small>${includeEdit ? `<button class="panel-edit" data-index="${games.indexOf(game)}">Edit</button>` : ''}</article>`; }
function renderPanels() {
  document.querySelectorAll('.sport-panel').forEach(panel => {
    const sport = panel.dataset.panel;
    const sportGames = sport === 'all' ? games.slice(0, 3) : games.filter(game => game.sport === sport).slice(0, 3);
    panel.innerHTML = `<strong class="panel-title">${labelFor(sport)}</strong><p>${descriptions[sport]}</p>${sportGames.length ? `<div class="mini-games">${sportGames.map(game => gameMarkup(game, true)).join('')}</div>` : '<p class="panel-empty">No games scheduled yet.</p>'}<button class="panel-action" data-sport="${sport}">View ${sport === 'all' ? 'all sports' : 'games'} →</button>`;
  });
}
function render(sport = selectedSport) {
  selectedSport = sport;
  const filtered = sport === 'all' ? games : games.filter(game => game.sport === sport);
  grid.innerHTML = filtered.map(game => `<article class="score-card"><div class="card-top"><span>${game.label} · ${game.date}</span><span class="status">${game.status}</span></div><div class="matchup"><span class="team">${game.home}</span><span class="score">${game.homeScore}<span class="versus">vs</span>${game.awayScore}</span><span class="team">${game.away}</span></div><div class="card-bottom">${game.detail || 'Details coming soon'} <button class="edit-button" data-index="${games.indexOf(game)}">Edit</button></div></article>`).join('');
  empty.hidden = filtered.length > 0; title.textContent = sport === 'all' ? 'Latest scores' : `${labelFor(sport)} scores`;
  renderPanels();
}
function openModal(game = null, index = null) { const modal = document.querySelector('#game-modal'), form = document.querySelector('#game-form'); modal.hidden = false; document.querySelector('#modal-title').textContent = game ? 'Edit game' : 'Add a game'; form.reset(); form.dataset.editIndex = game ? index : ''; if (game) Object.entries(game).forEach(([key, value]) => { if (form.elements[key]) form.elements[key].value = value; }); else if (selectedSport !== 'all') form.elements.sport.value = selectedSport; }
function closeModal() { document.querySelector('#game-modal').hidden = true; }
document.querySelectorAll('.sport-tab').forEach(button => button.addEventListener('click', () => { render(button.dataset.sport); }));
document.querySelector('#new-game-button').addEventListener('click', () => openModal());
document.querySelector('#close-modal').addEventListener('click', closeModal); document.querySelector('#cancel-game').addEventListener('click', closeModal);
document.querySelector('#game-modal').addEventListener('click', event => { if (event.target.id === 'game-modal') closeModal(); });
document.querySelectorAll('.program-card').forEach(button => button.addEventListener('click', () => { render(button.dataset.sport); document.querySelector('.content-heading').scrollIntoView({ behavior: 'smooth' }); }));
document.addEventListener('click', event => { const view = event.target.closest('.panel-action'); if (view) render(view.dataset.sport); const edit = event.target.closest('.edit-button, .panel-edit'); if (edit) openModal(games[Number(edit.dataset.index)], Number(edit.dataset.index)); });
document.querySelector('#game-form').addEventListener('submit', event => { event.preventDefault(); const form = new FormData(event.target), game = Object.fromEntries(form.entries()); game.label = labelFor(game.sport); game.date = formatDate(game.date); const index = event.target.dataset.editIndex; if (index !== '') games[Number(index)] = game; else games.push(game); saveGames(); closeModal(); render(selectedSport); });
render();
