const games = [
  { sport: 'football', label: 'Football', date: 'FRI, OCT 18', status: 'FINAL', home: 'CS Eagles', away: 'Riverside', homeScore: 28, awayScore: 14, detail: 'Home • Varsity' },
  { sport: 'soccer', label: 'Soccer', date: 'TUE, OCT 22', status: 'FINAL', home: 'CS Eagles', away: 'Northview', homeScore: 3, awayScore: 1, detail: 'Home • Girls Varsity' },
  { sport: 'cross-country', label: 'Cross Country', date: 'SAT, OCT 26', status: 'RESULTS', home: 'CS Eagles', away: 'Invitational', homeScore: '2nd', awayScore: '—', detail: 'Away • Conference Meet' },
  { sport: 'soccer', label: 'Soccer', date: 'THU, OCT 31', status: 'UPCOMING', home: 'CS Eagles', away: 'East Ridge', homeScore: '—', awayScore: '—', detail: '7:00 PM • Away' },
  { sport: 'football', label: 'Football', date: 'FRI, NOV 1', status: 'UPCOMING', home: 'CS Eagles', away: 'Westfield', homeScore: '—', awayScore: '—', detail: '7:30 PM • Home' },
  { sport: 'cross-country', label: 'Cross Country', date: 'SAT, NOV 2', status: 'UPCOMING', home: 'CS Eagles', away: 'State Meet', homeScore: '—', awayScore: '—', detail: '9:00 AM • Away' }
];
const grid = document.querySelector('#score-grid');
const empty = document.querySelector('#empty-state');
const title = document.querySelector('#section-title');
function render(sport = 'all') {
  const filtered = sport === 'all' ? games : games.filter(game => game.sport === sport);
  grid.innerHTML = filtered.map(game => `<article class="score-card"><div class="card-top"><span>${game.label} · ${game.date}</span><span class="status">${game.status}</span></div><div class="matchup"><span class="team">${game.home}</span><span class="score">${game.homeScore}<span class="versus">vs</span>${game.awayScore}</span><span class="team">${game.away}</span></div><div class="card-bottom">${game.detail}</div></article>`).join('');
  empty.hidden = filtered.length > 0;
  title.textContent = sport === 'all' ? 'Latest scores' : `${games.find(g => g.sport === sport)?.label || ''} scores`;
  document.querySelectorAll('.sport-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.sport === sport));
}
document.querySelectorAll('[data-sport]').forEach(button => button.addEventListener('click', () => { render(button.dataset.sport); document.querySelector('.content-heading').scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
render();
