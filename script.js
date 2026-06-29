const POSITION_RULES = {
  S: { label: 'Setter', max: 1 },
  PH: { label: 'Outside Hitter', max: 2 },
  MB: { label: 'Middle', max: 2 },
  OPP: { label: 'Opposite', max: 1 },
  L: { label: 'Libero', max: 1 }
};

const POSITION_LABELS = {
  S: 'Setter',
  PH: 'Outside Hitter',
  MB: 'Middle',
  OPP: 'Opposite',
  L: 'Libero'
};

const POSITION_ORDER = ['S', 'PH', 'MB', 'OPP', 'L'];

const spinButton = document.getElementById('spinButton');
const clubName = document.getElementById('clubName');
const playerContainer = document.getElementById('playerContainer');
const mainContainer = document.querySelector('main');

const teamSlots = {
  setter: null,
  pin1: null,
  pin2: null,
  middle1: null,
  middle2: null,
  opposite: null,
  libero: null
};

const team = {
  S: null,
  PH: [],
  MB: [],
  OPP: null,
  L: null
};

let draftQueue = [];
let availablePlayers = [];
let currentClub = null;
let isSpinning = false;
let isDraftComplete = false;
let rerollUsed = false;
let spinLocked = false;
let rerollButton = null;
let progressValue = null;
let spinTimer = null;

function shuffleArray(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

function buildDraftQueue() {
  const clubs = [...new Set(players.map((player) => player.club))];
  const roundOne = shuffleArray(clubs);
  const roundTwo = shuffleArray(clubs);

  return [...roundOne, ...roundTwo];
}

function getPositionCount(position) {
  if (position === 'PH') {
    return team.PH.length;
  }

  if (position === 'MB') {
    return team.MB.length;
  }

  return team[position] ? 1 : 0;
}

function isPositionFull(position) {
  return getPositionCount(position) >= POSITION_RULES[position].max;
}

function isPlayerDrafted(player) {
  return availablePlayers.every((availablePlayer) => availablePlayer.id !== player.id);
}

function canSelectPlayer(player) {
  if (isPlayerDrafted(player)) {
    return false;
  }

  return !isPositionFull(player.position);
}

function isTeamComplete() {
  return POSITION_ORDER.every((position) => getPositionCount(position) === POSITION_RULES[position].max);
}

function getTeamPlayerForSlot(position, slotIndex = 0) {
  if (position === 'PH') {
    return team.PH[slotIndex] || null;
  }

  if (position === 'MB') {
    return team.MB[slotIndex] || null;
  }

  if (position === 'S') {
    return team.S;
  }

  if (position === 'OPP') {
    return team.OPP;
  }

  return team.L;
}

function getDraftedCount() {
  return [team.S, ...team.PH, ...team.MB, team.OPP, team.L].filter(Boolean).length;
}

function updateStatusPanels() {
  if (progressValue) {
    progressValue.textContent = `${getDraftedCount()} / 7 Selected`;
  }

  renderCourtSlots();
  renderSpinButton();
  updateRerollButton();
}

function buildStatusPanel() {
  const teamPanel = document.querySelector('.team-panel');

  if (!teamPanel) {
    return;
  }

  const intro = teamPanel.querySelector('.team-panel__intro');
  const statusPanel = document.createElement('section');
  statusPanel.className = 'draft-status';
  statusPanel.innerHTML = `
    <div class="draft-status__item">
      <h3>Draft Progress</h3>
      <p id="draftProgressValue">0 / 7 Selected</p>
    </div>
  `;

  teamPanel.insertBefore(statusPanel, intro ? intro.nextSibling : null);
  progressValue = document.getElementById('draftProgressValue');
}

function buildCourtLayout() {
  const teamPanel = document.querySelector('.team-panel');

  if (!teamPanel) {
    return;
  }

  const courtShell = document.createElement('div');
  courtShell.className = 'court-shell';
  const court = document.createElement('div');
  court.className = 'volleyball-court';

  const slotConfig = [
    { key: 'setter', id: 'setter', label: 'Setter', position: 'S' },
    { key: 'pin1', id: 'pin1', label: 'Outside 1', position: 'PH', slotIndex: 0 },
    { key: 'pin2', id: 'pin2', label: 'Outside 2', position: 'PH', slotIndex: 1 },
    { key: 'middle1', id: 'middle1', label: 'Middle 1', position: 'MB', slotIndex: 0 },
    { key: 'middle2', id: 'middle2', label: 'Middle 2', position: 'MB', slotIndex: 1 },
    { key: 'opposite', id: 'opposite', label: 'Opposite', position: 'OPP' },
    { key: 'libero', id: 'libero', label: 'Libero', position: 'L' }
  ];

  slotConfig.forEach(({ key, id }) => {
    const slot = document.createElement('div');
    slot.id = id;
    slot.className = 'court-slot';
    teamSlots[key] = slot;
    court.appendChild(slot);
  });

  courtShell.appendChild(court);
  teamPanel.appendChild(courtShell);
}

function renderCourtSlots() {
  const slotConfig = [
    { id: 'setter', label: 'Setter', position: 'S' },
    { id: 'pin1', label: 'Outside 1', position: 'PH', slotIndex: 0 },
    { id: 'pin2', label: 'Outside 2', position: 'PH', slotIndex: 1 },
    { id: 'middle1', label: 'Middle 1', position: 'MB', slotIndex: 0 },
    { id: 'middle2', label: 'Middle 2', position: 'MB', slotIndex: 1 },
    { id: 'opposite', label: 'Opposite', position: 'OPP' },
    { id: 'libero', label: 'Libero', position: 'L' }
  ];

  slotConfig.forEach(({ id, label, position, slotIndex = 0 }) => {
    const slot = teamSlots[id];
    const player = getTeamPlayerForSlot(position, slotIndex);

    slot.classList.toggle('is-filled', Boolean(player));
    slot.classList.toggle('is-empty', !player);

    if (player) {
      slot.innerHTML = `<strong>${label}</strong><div>${player.name}</div><small>${player.club}</small>`;
      return;
    }

    slot.innerHTML = `<strong>${label}</strong><div>—</div><small>Open</small>`;
  });
}

function getRosterPlayers() {
  return [team.S, ...team.PH, ...team.MB, team.OPP, team.L].filter(Boolean);
}

function getWeightedOverall() {
  const setterOverall = team.S?.overall || 0;
  const outsideAverage = team.PH.length
    ? team.PH.reduce((total, player) => total + (player.overall || 0), 0) / team.PH.length
    : 0;
  const middleAverage = team.MB.length
    ? team.MB.reduce((total, player) => total + (player.overall || 0), 0) / team.MB.length
    : 0;
  const oppositeOverall = team.OPP?.overall || 0;
  const liberoOverall = team.L?.overall || 0;

  return (setterOverall * 0.2) + (outsideAverage * 0.25) + (middleAverage * 0.25) + (oppositeOverall * 0.15) + (liberoOverall * 0.15);
}

function getChemistryBonus() {
  const clubCounts = getRosterPlayers().reduce((counts, player) => {
    counts[player.club] = (counts[player.club] || 0) + 1;
    return counts;
  }, {});

  let bonus = 0;

  Object.values(clubCounts).forEach((count) => {
    if (count >= 3) {
      bonus += 2;
    } else if (count === 2) {
      bonus += 1;
    }
  });

  return Math.min(5, bonus);
}

function getComboEffects(roster) {
  const rosterIds = new Set(roster.map((player) => player.id));
  const triggered = [];
  let totalDelta = 0;

  const comboDefinitions = [
    { label: 'Elite Core', ids: [1, 18, 43], delta: 8 },
    { label: 'Balanced Star Crew', ids: [2, 19, 44], delta: 7 },
    { label: 'Backcourt Anchor', ids: [3, 20, 45], delta: 6 },
    { label: 'Disaster Unit', ids: [35, 60, 67, 78, 89], delta: -14 },
    { label: 'Last-Place Mix', ids: [37, 62, 66, 80, 89], delta: -11 },
    { label: 'Rough Around the Edges', ids: [39, 65, 77, 80, 89], delta: -9 }
  ];

  comboDefinitions.forEach((combo) => {
    const matchCount = combo.ids.filter((id) => rosterIds.has(id)).length;
    if (matchCount >= Math.ceil(combo.ids.length / 2)) {
      totalDelta += combo.delta;
      triggered.push(`${combo.label}: ${combo.delta > 0 ? '+' : ''}${combo.delta}`);
    }
  });

  const averageOverall = roster.length
    ? roster.reduce((total, player) => total + (player.overall || 0), 0) / roster.length
    : 0;

  if (averageOverall >= 95) {
    totalDelta += 4;
    triggered.push('High-end roster: +4');
  } else if (averageOverall <= 80) {
    totalDelta -= 10;
    triggered.push('Low-end roster: -10');
  }

  const weakCount = roster.filter((player) => (player.overall || 0) < 82).length;
  if (weakCount >= 4) {
    totalDelta -= 8;
    triggered.push('Too many weak picks: -8');
  }

  return { totalDelta, triggered };
}

function calculateTeamScore() {
  const weightedOverall = getWeightedOverall();
  const chemistryBonus = getChemistryBonus();
  const comboEffects = getComboEffects(getRosterPlayers());
  return Number(Math.max(40, Math.min(115, weightedOverall + chemistryBonus + comboEffects.totalDelta)).toFixed(1));
}

function getEvaluationBand(score) {
  if (score >= 105) {
    return { record: '18–0', grade: 'S+', tier: 'Dynasty' };
  }

  if (score >= 100) {
    return { record: '17–1', grade: 'S', tier: 'Championship Favourite' };
  }

  if (score >= 96) {
    return { record: '16–2', grade: 'A+', tier: 'Elite' };
  }

  if (score >= 92) {
    return { record: '15–3', grade: 'A', tier: 'Championship Contender' };
  }

  if (score >= 88) {
    return { record: '14–4', grade: 'A-', tier: 'Strong Finals Team' };
  }

  if (score >= 84) {
    return { record: '13–5', grade: 'B+', tier: 'Finals Team' };
  }

  if (score >= 80) {
    return { record: '12–6', grade: 'B', tier: 'Playoff Team' };
  }

  if (score >= 76) {
    return { record: '11–7', grade: 'B-', tier: 'Average' };
  }

  if (score >= 72) {
    return { record: '10–8', grade: 'C+', tier: 'Developing' };
  }

  if (score >= 68) {
    return { record: '9–9', grade: 'C', tier: 'Rebuilding' };
  }

  if (score >= 60) {
    return { record: '1–17', grade: 'F+', tier: 'Rebuild Required' };
  }

  return { record: '0–18', grade: 'F', tier: 'Disaster' };
}

function getStars(value) {
  return '⭐'.repeat(Math.max(1, Math.min(5, Math.round(value / 20))));
}

function getStrengthsAndWeaknesses() {
  const setterScore = team.S?.overall || 0;
  const blockingScore = ((team.MB[0]?.overall || 0) + (team.MB[1]?.overall || 0) + (team.OPP?.overall || 0)) / 3;
  const passingScore = ((team.S?.overall || 0) + (team.L?.overall || 0)) / 2;
  const servingScore = ((team.PH[0]?.overall || 0) + (team.PH[1]?.overall || 0) + (team.MB[0]?.overall || 0) + (team.MB[1]?.overall || 0) + (team.OPP?.overall || 0)) / 5;
  const attackScore = ((team.PH[0]?.overall || 0) + (team.PH[1]?.overall || 0) + (team.OPP?.overall || 0)) / 3;

  const categories = [
    { label: 'Setting', value: setterScore },
    { label: 'Blocking', value: blockingScore },
    { label: 'Passing', value: passingScore },
    { label: 'Serving', value: servingScore },
    { label: 'Attack', value: attackScore }
  ];

  const sorted = [...categories].sort((left, right) => right.value - left.value);
  const strengths = sorted.slice(0, 3).map((category) => `${getStars(category.value)} ${category.label}`);

  const weakest = sorted[sorted.length - 1];
  const secondWeakest = sorted[sorted.length - 2];
  const weaknesses = [weakest.label, secondWeakest.label];

  return { strengths, weaknesses };
}

function renderEvaluationScreen() {
  const score = calculateTeamScore();
  const band = getEvaluationBand(score);
  const { strengths } = getStrengthsAndWeaknesses();
  const roster = getRosterPlayers();
  const comboEffects = getComboEffects(roster);
  const bestPick = [...roster].sort((left, right) => (right.overall || 0) - (left.overall || 0))[0];
  const injuryLines = [
    'The training staff said the team was “just tired”, which is a very polite way to say the libero forgot how to land.',
    'One of the middles got so excited they tried to spike the scoreboard and missed badly.',
    'The opposite got a mysterious ankle tweak that only appeared after a dramatic celebration.',
    'The setter was brilliant until the coffee wore off and the whole offence got suspiciously optimistic.'
  ];
  const lossLines = [
    'The squad came out firing, then promptly discovered that confidence is not a real defensive system.',
    'The match was lost in the second set when everyone tried to be the hero at once.',
    'The team played with heart, but the heart was clearly on a different court.',
    'They had talent, but the chemistry looked like it was still waiting for the bus.'
  ];
  const comment = `${bestPick?.name || 'The star'} was the only one who looked like they had a plan, and ${injuryLines[Math.floor(Math.random() * injuryLines.length)]} ${lossLines[Math.floor(Math.random() * lossLines.length)]}`;

  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';
  overlay.innerHTML = `
    <div class="popup-card" style="font-family:Segoe UI, Arial, sans-serif;">
      <div style="font-size:0.95rem;letter-spacing:0.24em;text-transform:uppercase;color:#4fb0ff;margin-bottom:0.65rem;">TEAM COMPLETE</div>
      <div style="font-size:1.2rem;font-weight:700;margin-bottom:0.95rem;">[ Volleyball Court ]</div>

      <div style="display:grid;gap:0.45rem;text-align:left;margin-bottom:0.9rem;">
        <div style="display:flex;justify-content:space-between;gap:1rem;padding:0.55rem 0.7rem;border-bottom:1px solid rgba(255,255,255,0.08);">
          <span style="color:#95a4b8;">Projected Record</span>
          <strong>${band.record}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;gap:1rem;padding:0.55rem 0.7rem;border-bottom:1px solid rgba(255,255,255,0.08);">
          <span style="color:#95a4b8;">Games Won</span>
          <strong>15 / 18</strong>
        </div>
        <div style="display:flex;justify-content:space-between;gap:1rem;padding:0.55rem 0.7rem;border-bottom:1px solid rgba(255,255,255,0.08);">
          <span style="color:#95a4b8;">Overall</span>
          <strong>${score.toFixed(1)}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;gap:1rem;padding:0.55rem 0.7rem;border-bottom:1px solid rgba(255,255,255,0.08);">
          <span style="color:#95a4b8;">Grade</span>
          <strong>${band.grade}</strong>
        </div>
      </div>

      <div style="text-align:left;margin-bottom:0.95rem;">
        <div style="font-size:0.82rem;letter-spacing:0.2em;text-transform:uppercase;color:#4fb0ff;margin-bottom:0.45rem;">Strengths</div>
        <div style="display:grid;gap:0.35rem;">
          ${strengths.slice(0, 3).map((item) => `<div style="padding:0.45rem 0.6rem;border-radius:10px;background:rgba(255,255,255,0.03);">${item}</div>`).join('')}
        </div>
      </div>

      <div style="text-align:left;margin-bottom:0.95rem;">
        <div style="font-size:0.82rem;letter-spacing:0.2em;text-transform:uppercase;color:#4fb0ff;margin-bottom:0.45rem;">Combo Impact</div>
        <div style="display:grid;gap:0.35rem;">
          ${comboEffects.triggered.length ? comboEffects.triggered.map((item) => `<div style="padding:0.45rem 0.6rem;border-radius:10px;background:rgba(255,255,255,0.03);">${item}</div>`).join('') : '<div style="padding:0.45rem 0.6rem;border-radius:10px;background:rgba(255,255,255,0.03);">No special combinations landed.</div>'}
        </div>
      </div>

      <div style="text-align:left;margin-bottom:0.95rem;">
        <div style="font-size:0.82rem;letter-spacing:0.2em;text-transform:uppercase;color:#4fb0ff;margin-bottom:0.45rem;">Your Team</div>
        <div style="display:grid;gap:0.35rem;">
          ${roster.map((player) => `<div style="padding:0.45rem 0.6rem;border-radius:10px;background:rgba(255,255,255,0.03);">${player.name} — ${POSITION_LABELS[player.position]}</div>`).join('')}
        </div>
      </div>

      <div style="text-align:left;margin-bottom:0.95rem;padding:0.7rem 0.8rem;border-radius:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);">
        <div style="font-size:0.82rem;letter-spacing:0.2em;text-transform:uppercase;color:#4fb0ff;margin-bottom:0.35rem;">Post-Game Comment</div>
        <div style="line-height:1.45;">${comment}</div>
      </div>

      <a class="play-again-btn" href="index.html" style="width:100%;max-width:100%;">PLAY AGAIN</a>
    </div>
  `;

  document.body.appendChild(overlay);
}

function renderSpinButton() {
  if (isDraftComplete || isTeamComplete()) {
    spinButton.innerHTML = '🏆 TEAM EVALUATED';
    spinButton.classList.add('is-complete');
    spinButton.disabled = false;
    return;
  }

  if (spinLocked) {
    spinButton.innerHTML = '🔒 AUTO DRAFTING';
    spinButton.classList.add('is-locked');
    spinButton.disabled = true;
    return;
  }

  spinButton.innerHTML = '🎡 SPIN CLUB';
  spinButton.classList.remove('is-complete');
  spinButton.classList.remove('is-locked');
  spinButton.disabled = false;
}

function getDelayClass(index) {
  const cappedOffset = Math.min(index, 12);
  return `is-visible-${cappedOffset}`;
}

function getAvailablePlayersForClub(club) {
  return availablePlayers
    .filter((player) => player.club === club)
    .sort((left, right) => left.name.localeCompare(right.name));
}

function renderPlayersForClub() {
  playerContainer.innerHTML = '';

  if (!currentClub) {
    playerContainer.innerHTML = '<p class="draft-tip">Press SPIN CLUB to reveal a club.</p>';
    return;
  }

  const clubPlayers = getAvailablePlayersForClub(currentClub);

  if (!clubPlayers.length) {
    playerContainer.innerHTML = '<p class="draft-tip">No available players remain for this club.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();

  clubPlayers.forEach((player, index) => {
    const card = document.createElement('article');
    card.className = 'player-card';

    const isDisabled = !canSelectPlayer(player);
    if (isDisabled) {
      card.classList.add('is-disabled');
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'player-select-button';
    button.disabled = isDisabled;
    button.innerHTML = `
      <h3>${player.name}</h3>
      <p>${POSITION_LABELS[player.position]}</p>
      <p>${player.club}</p>
    `;

    button.addEventListener('click', () => handlePlayerSelection(player));
    card.appendChild(button);
    card.classList.add(getDelayClass(index));
    fragment.appendChild(card);
  });

  playerContainer.appendChild(fragment);

  requestAnimationFrame(() => {
    Array.from(playerContainer.children).forEach((card) => {
      card.classList.add('is-visible');
    });
  });
}

function assignPlayerToTeam(player) {
  if (player.position === 'PH') {
    team.PH.push(player);
    return;
  }

  if (player.position === 'MB') {
    team.MB.push(player);
    return;
  }

  if (player.position === 'S') {
    team.S = player;
    return;
  }

  if (player.position === 'OPP') {
    team.OPP = player;
    return;
  }

  team.L = player;
}

function animateClubReveal() {
  clubName.classList.remove('is-visible');
  void clubName.offsetWidth;
  clubName.classList.add('is-visible');
}

function clearSpinTimer() {
  if (spinTimer) {
    window.clearTimeout(spinTimer);
    spinTimer = null;
  }
}

function finishClubSpin(chosenClub) {
  isSpinning = false;
  currentClub = chosenClub;
  clubName.textContent = chosenClub;
  animateClubReveal();
  updateStatusPanels();
  renderPlayersForClub();
}

function startClubSpin() {
  if (isSpinning || isDraftComplete || isTeamComplete()) {
    return;
  }

  if (!draftQueue.length) {
    isDraftComplete = true;
    currentClub = null;
    clubName.textContent = 'Draft Complete';
    animateClubReveal();
    playerContainer.innerHTML = '<p class="draft-tip">No clubs remain.</p>';
    updateStatusPanels();
    return;
  }

  const chosenClub = draftQueue.shift();
  const clubNames = [...new Set(players.map((player) => player.club))];
  const startTime = performance.now();
  const duration = 1800;

  isSpinning = true;
  spinButton.disabled = true;
  updateStatusPanels();

  const tick = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    clubName.textContent = clubNames[Math.floor(Math.random() * clubNames.length)];
    animateClubReveal();

    if (progress < 1) {
      const nextDelay = Math.max(70, Math.round(70 + Math.pow(progress, 2) * 430));
      spinTimer = window.setTimeout(() => tick(performance.now()), nextDelay);
      return;
    }

    clearSpinTimer();
    finishClubSpin(chosenClub);
  };

  tick(startTime);
}

function advanceToNextClub() {
  if (isDraftComplete || isTeamComplete()) {
    return;
  }

  currentClub = null;
  playerContainer.innerHTML = '<p class="draft-tip">Rolling the next club...</p>';
  window.setTimeout(() => {
    startClubSpin();
  }, 300);
}

function updateRerollButton() {
  if (!rerollButton) {
    return;
  }

  const canUseReroll = !rerollUsed && Boolean(currentClub) && !isSpinning && !isDraftComplete && !isTeamComplete();
  rerollButton.disabled = !canUseReroll;
  rerollButton.textContent = rerollUsed ? '🔄 REROLL USED' : '🔄 REROLL (1 LEFT)';
}

function handlePlayerSelection(player) {
  if (!canSelectPlayer(player)) {
    return;
  }

  availablePlayers = availablePlayers.filter((availablePlayer) => availablePlayer.id !== player.id);
  assignPlayerToTeam(player);
  currentClub = null;
  renderCourtSlots();
  updateStatusPanels();
  renderPlayersForClub();

  if (isTeamComplete()) {
    isDraftComplete = true;
    clubName.textContent = 'Team Evaluation';
    animateClubReveal();
    renderEvaluationScreen();
    return;
  }

  window.setTimeout(() => {
    advanceToNextClub();
  }, 250);
}

function startSeasonSimulation() {
  if (isDraftComplete || isTeamComplete()) {
    renderEvaluationScreen();
    return;
  }

  clubName.textContent = 'Team Evaluation';
  animateClubReveal();
  playerContainer.innerHTML = '<p class="draft-tip">Team evaluation will appear when your roster is complete.</p>';
}

function handleSpinButtonClick() {
  if (isSpinning) {
    return;
  }

  if (isDraftComplete || isTeamComplete()) {
    startSeasonSimulation();
    return;
  }

  if (!spinLocked) {
    spinLocked = true;
    renderSpinButton();
  }

  startClubSpin();
}

function handleRerollClick() {
  if (rerollUsed || !currentClub || isSpinning || isDraftComplete || isTeamComplete()) {
    return;
  }

  rerollUsed = true;
  currentClub = null;
  playerContainer.innerHTML = '<p class="draft-tip">Skipping this club...</p>';
  updateRerollButton();

  window.setTimeout(() => {
    startClubSpin();
  }, 250);
}

spinButton.addEventListener('click', handleSpinButtonClick);

draftQueue = buildDraftQueue();
availablePlayers = players.map((player) => ({ ...player }));

buildStatusPanel();
buildCourtLayout();

Object.values(teamSlots).forEach((slot) => {
  slot.classList.add('team-slot');
});

rerollButton = document.createElement('button');
rerollButton.type = 'button';
rerollButton.id = 'rerollButton';
rerollButton.className = 'reroll-button';
rerollButton.textContent = '🔄 REROLL (1 LEFT)';
rerollButton.addEventListener('click', handleRerollClick);
mainContainer.insertBefore(rerollButton, spinButton);

renderCourtSlots();
updateStatusPanels();
renderPlayersForClub();
renderSpinButton();
