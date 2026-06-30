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
const CLUBS = [...new Set(players.map((player) => player.club))];

const COACHES = {
  Reds: { club: 'Reds', name: 'Jon Uriarte', rank: 1 },
  Chequers: { club: 'Chequers', name: 'Gavin Lewis', rank: 2 },
  Balcatta: { club: 'Balcatta', name: 'Conrad Hill', rank: 3 },
  'Southern Cross': { club: 'Southern Cross', name: 'Ethan Dodd', rank: 4 },
  'Northern Stars': { club: 'Northern Stars', name: 'Steve Petsos', rank: 5 },
  Rossmoyne: { club: 'Rossmoyne', name: 'Jordy Linton', rank: 6 },
  Apex: { club: 'Apex', name: 'Jheysson Rojas', rank: 7 }
};

const LEGENDARY_GAVIN = {
  id: 999,
  name: 'Gavin Lewis',
  club: 'Chequers',
  position: 'S',
  overall: 100,
  attack: 100,
  defence: 100,
  potential: 100,
  isLegendary: true
};

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
let currentPosition = null;
let isSpinning = false;
let isDraftComplete = false;
let positionRerollUsed = false;
let spinLocked = false;
let rerollButton = null;
let progressValue = null;
let spinTimer = null;
let teamCoach = null;
let availableCoachByClub = {};
let coachSelectionValue = null;
let coachProjectionValue = null;
let coachOverallValue = null;
let legendaryAvailableThisSpin = false;
let legendarySelected = false;

function shuffleArray(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
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
  const playersComplete = POSITION_ORDER.every((position) => getPositionCount(position) === POSITION_RULES[position].max);
  return playersComplete && Boolean(teamCoach);
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
  const playerCount = [team.S, ...team.PH, ...team.MB, team.OPP, team.L].filter(Boolean).length;
  return playerCount + (teamCoach ? 1 : 0);
}

function updateStatusPanels() {
  if (progressValue) {
    progressValue.textContent = `${getDraftedCount()} / 8 Selected`;
  }

  renderCourtSlots();
  renderCoachPanel();
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
      <p id="draftProgressValue">0 / 8 Selected</p>
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

function buildCoachPanel() {
  const teamPanel = document.querySelector('.team-panel');

  if (!teamPanel) {
    return;
  }

  const coachSection = document.createElement('section');
  coachSection.className = 'coach-section';
  coachSection.innerHTML = `
    <h3>Coach</h3>
    <p id="coachSelectionValue">No coach selected</p>
    <div class="coach-section__stats">
      <p id="coachProjectionValue">Projected Record: --</p>
      <p id="coachOverallValue">Overall Rating: --</p>
    </div>
  `;

  teamPanel.appendChild(coachSection);
  coachSelectionValue = document.getElementById('coachSelectionValue');
  coachProjectionValue = document.getElementById('coachProjectionValue');
  coachOverallValue = document.getElementById('coachOverallValue');
}

function getCoachBonus() {
  if (!teamCoach) {
    return 0;
  }

  if (teamCoach.rank === 1) {
    return 5;
  }

  if (teamCoach.rank === 2) {
    return 4;
  }

  if (teamCoach.rank === 3) {
    return 3;
  }

  if (teamCoach.rank === 4) {
    return 2;
  }

  if (teamCoach.rank === 5) {
    return 1;
  }

  if (teamCoach.rank === 6) {
    return 0.5;
  }

  return 0;
}

function renderCoachPanel() {
  if (!coachSelectionValue || !coachProjectionValue || !coachOverallValue) {
    return;
  }

  if (!teamCoach) {
    coachSelectionValue.textContent = 'No coach selected';
    coachProjectionValue.textContent = 'Projected Record: --';
    coachOverallValue.textContent = `Overall Rating: ${calculateTeamScore().toFixed(1)}`;
    return;
  }

  const score = calculateTeamScore();
  const band = getEvaluationBand(score);
  coachSelectionValue.textContent = `${teamCoach.name} (${teamCoach.club})`;
  coachProjectionValue.textContent = `Projected Record: ${band.record}`;
  coachOverallValue.textContent = `Overall Rating: ${score.toFixed(1)}`;
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
    { label: 'Elite Core', ids: [1, 18, 43], delta: 5 },
    { label: 'Balanced Star Crew', ids: [2, 19, 44], delta: 4 },
    { label: 'Backcourt Anchor', ids: [3, 20, 45], delta: 3 },
    { label: 'Disaster Unit', ids: [35, 60, 67, 78, 89], delta: -18 },
    { label: 'Last-Place Mix', ids: [37, 62, 66, 80, 89], delta: -15 },
    { label: 'Rough Around the Edges', ids: [39, 65, 77, 80, 89], delta: -12 }
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

  if (averageOverall >= 96) {
    totalDelta += 2;
    triggered.push('High-end roster: +2');
  } else if (averageOverall <= 83) {
    totalDelta -= 14;
    triggered.push('Low-end roster: -14');
  }

  const weakCount = roster.filter((player) => (player.overall || 0) < 84).length;
  if (weakCount >= 3) {
    const weakPenalty = weakCount * 3;
    totalDelta -= weakPenalty;
    triggered.push(`Too many weak picks: -${weakPenalty}`);
  }

  return { totalDelta, triggered };
}

function calculateTeamScore() {
  const roster = getRosterPlayers();
  const weightedOverall = getWeightedOverall();
  const chemistryBonus = getChemistryBonus();
  const comboEffects = getComboEffects(roster);
  const coachBonus = getCoachBonus();
  const averageOverall = roster.length
    ? roster.reduce((total, player) => total + (player.overall || 0), 0) / roster.length
    : 0;
  const eliteCount = roster.filter((player) => (player.overall || 0) >= 96).length;
  const lowCount = roster.filter((player) => (player.overall || 0) <= 81).length;

  let adjustedScore = weightedOverall + (chemistryBonus * 0.6) + comboEffects.totalDelta + coachBonus;
  adjustedScore -= 12;

  if (averageOverall >= 95) {
    adjustedScore += 2;
  }

  if (averageOverall <= 86) {
    adjustedScore -= 5;
  }

  if (averageOverall <= 82) {
    adjustedScore -= 7;
  }

  if (eliteCount >= 4) {
    adjustedScore += 1.5;
  }

  if (lowCount >= 2) {
    adjustedScore -= lowCount * 2.5;
  }

  return Number(Math.max(30, Math.min(112, adjustedScore)).toFixed(1));
}

function getEvaluationBand(score) {
  if (score >= 108) {
    return { record: '18–0', grade: 'S+', tier: 'Dynasty' };
  }

  if (score >= 105) {
    return { record: '17–1', grade: 'S', tier: 'Championship Favourite' };
  }

  if (score >= 103) {
    return { record: '16–2', grade: 'A+', tier: 'Elite' };
  }

  if (score >= 99) {
    return { record: '15–3', grade: 'A', tier: 'Championship Contender' };
  }

  if (score >= 95) {
    return { record: '14–4', grade: 'A-', tier: 'Strong Finals Team' };
  }

  if (score >= 91) {
    return { record: '13–5', grade: 'B+', tier: 'Finals Team' };
  }

  if (score >= 87) {
    return { record: '12–6', grade: 'B', tier: 'Playoff Team' };
  }

  if (score >= 83) {
    return { record: '11–7', grade: 'B-', tier: 'Average' };
  }

  if (score >= 79) {
    return { record: '10–8', grade: 'C+', tier: 'Developing' };
  }

  if (score >= 75) {
    return { record: '9–9', grade: 'C', tier: 'Rebuilding' };
  }

  if (score >= 71) {
    return { record: '8–10', grade: 'C-', tier: 'Sliding' };
  }

  if (score >= 67) {
    return { record: '7–11', grade: 'D+', tier: 'Struggling' };
  }

  if (score >= 63) {
    return { record: '6–12', grade: 'D', tier: 'Rough Season' };
  }

  if (score >= 59) {
    return { record: '5–13', grade: 'D-', tier: 'Bottom Four' };
  }

  if (score >= 55) {
    return { record: '4–14', grade: 'F+', tier: 'Collapse Mode' };
  }

  if (score >= 51) {
    return { record: '3–15', grade: 'F', tier: 'Collapse Mode' };
  }

  if (score >= 47) {
    return { record: '2–16', grade: 'F', tier: 'Rebuild Required' };
  }

  if (score >= 43) {
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
  if (legendarySelected) {
    const roster = getRosterPlayers();
    const teamSummaryLines = [
      ...roster.map((player) => `${player.name} — ${POSITION_LABELS[player.position]}`),
      teamCoach ? `${teamCoach.name} — Coach` : 'No coach drafted'
    ];

    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.innerHTML = `
      <div class="popup-card" style="font-family:Segoe UI, Arial, sans-serif;">
        <div style="font-size:0.95rem;letter-spacing:0.24em;text-transform:uppercase;color:#4fb0ff;margin-bottom:0.65rem;">TEAM COMPLETE</div>
        <div style="font-size:1.2rem;font-weight:700;margin-bottom:0.95rem;">Season Results</div>

        <div style="display:grid;gap:0.45rem;text-align:left;margin-bottom:0.9rem;">
          <div style="display:flex;justify-content:space-between;gap:1rem;padding:0.55rem 0.7rem;border-bottom:1px solid rgba(255,255,255,0.08);">
            <span style="color:#95a4b8;">Games Won</span>
            <strong>20 / 20</strong>
          </div>
          <div style="display:flex;justify-content:space-between;gap:1rem;padding:0.55rem 0.7rem;border-bottom:1px solid rgba(255,255,255,0.08);">
            <span style="color:#95a4b8;">Grade</span>
            <strong>GOAT</strong>
          </div>
        </div>

        <div style="text-align:left;margin-bottom:0.95rem;">
          <div style="font-size:0.82rem;letter-spacing:0.2em;text-transform:uppercase;color:#4fb0ff;margin-bottom:0.45rem;">Your Team</div>
          <div style="display:grid;gap:0.35rem;">
            ${teamSummaryLines.map((line) => `<div style="padding:0.45rem 0.6rem;border-radius:10px;background:rgba(255,255,255,0.03);">${line}</div>`).join('')}
          </div>
        </div>

        <div style="text-align:left;margin-bottom:0.95rem;padding:0.7rem 0.8rem;border-radius:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);">
          <div style="font-size:0.82rem;letter-spacing:0.2em;text-transform:uppercase;color:#4fb0ff;margin-bottom:0.35rem;">AI Season Summary</div>
          <div style="line-height:1.45;">Gavin Lewis is the best player of all time, never served out, and he blocked Matt Pallot 25 times in the grand final. As usual, Gavin carried the team.</div>
        </div>

        <a class="play-again-btn" href="index.html" style="width:100%;max-width:100%;">PLAY AGAIN</a>
      </div>
    `;

    document.body.appendChild(overlay);
    return;
  }

  const score = calculateTeamScore();
  const band = getEvaluationBand(score);
  const roster = getRosterPlayers();
  const teamSummaryLines = [
    ...roster.map((player) => `${player.name} — ${POSITION_LABELS[player.position]}`),
    teamCoach ? `${teamCoach.name} — Coach` : 'No coach drafted'
  ];
  const gamesWon = Number.parseInt(band.record.split('–')[0], 10) || 0;
  const summaryOpener = [
    'The season started like chaos and ended like a slightly organized volleyball miracle.',
    'The analysts called this roster "questionable" in round one and "disturbingly effective" by finals.',
    'At one point this looked like a social game lineup, then somehow it turned into a contender.'
  ];
  const summaryCloser = [
    'Opponents spent most of the season trying to find your weak spot and mostly found floor burns instead.',
    'The locker room chemistry swung between stand-up comedy and tactical genius, which weirdly worked.',
    'The game plan was simple: survive long rallies, swing hard, and pretend every set point was planned.'
  ];
  const positiveContributionTemplates = [
    '{name} turned broken plays into highlight reels and somehow made it look accidental.',
    '{name} served like they had unresolved issues with the other side of the net.',
    '{name} kept winning clutch points like they had already read the script.',
    '{name} was so reliable teammates started setting them in warm-up conversations.'
  ];
  const negativeContributionTemplates = [
    '{name} treated serve receive like a trust exercise and trust was not returned.',
    '{name} attempted several heroic plays, most of which were heroic for the opposition.',
    '{name} defended with heart, hustle, and occasionally the wrong part of the body.',
    '{name} had great energy and questionable timing, a dangerous tactical combo.'
  ];
  const openingLine = summaryOpener[Math.floor(Math.random() * summaryOpener.length)];
  const closingLine = summaryCloser[Math.floor(Math.random() * summaryCloser.length)];
  const shuffledRoster = shuffleArray(roster);
  const featuredPlayers = shuffledRoster.slice(0, Math.min(4, shuffledRoster.length));
  const positiveChance = gamesWon >= 13 ? 0.85 : gamesWon >= 9 ? 0.55 : 0.2;
  const contributionLines = featuredPlayers.map((player) => {
    const isPositive = Math.random() < positiveChance;
    const pool = isPositive ? positiveContributionTemplates : negativeContributionTemplates;
    const template = pool[Math.floor(Math.random() * pool.length)];
    return template.replace('{name}', player.name);
  });
  const aiSummary = `${openingLine} ${teamCoach ? `${teamCoach.name} kept everyone moving in one direction while yelling inspirational nonsense.` : 'The interim coach survived mostly on vibes and aggressive timeout gestures.'} ${contributionLines.join(' ')} ${closingLine}`;

  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';
  overlay.innerHTML = `
    <div class="popup-card" style="font-family:Segoe UI, Arial, sans-serif;">
      <div style="font-size:0.95rem;letter-spacing:0.24em;text-transform:uppercase;color:#4fb0ff;margin-bottom:0.65rem;">TEAM COMPLETE</div>
      <div style="font-size:1.2rem;font-weight:700;margin-bottom:0.95rem;">Season Results</div>

      <div style="display:grid;gap:0.45rem;text-align:left;margin-bottom:0.9rem;">
        <div style="display:flex;justify-content:space-between;gap:1rem;padding:0.55rem 0.7rem;border-bottom:1px solid rgba(255,255,255,0.08);">
          <span style="color:#95a4b8;">Games Won</span>
          <strong>${gamesWon} / 18</strong>
        </div>
        <div style="display:flex;justify-content:space-between;gap:1rem;padding:0.55rem 0.7rem;border-bottom:1px solid rgba(255,255,255,0.08);">
          <span style="color:#95a4b8;">Grade</span>
          <strong>${band.grade}</strong>
        </div>
      </div>

      <div style="text-align:left;margin-bottom:0.95rem;">
        <div style="font-size:0.82rem;letter-spacing:0.2em;text-transform:uppercase;color:#4fb0ff;margin-bottom:0.45rem;">Your Team</div>
        <div style="display:grid;gap:0.35rem;">
          ${teamSummaryLines.map((line) => `<div style="padding:0.45rem 0.6rem;border-radius:10px;background:rgba(255,255,255,0.03);">${line}</div>`).join('')}
        </div>
      </div>

      <div style="text-align:left;margin-bottom:0.95rem;padding:0.7rem 0.8rem;border-radius:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);">
        <div style="font-size:0.82rem;letter-spacing:0.2em;text-transform:uppercase;color:#4fb0ff;margin-bottom:0.35rem;">AI Season Summary</div>
        <div style="line-height:1.45;">${aiSummary}</div>
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
    spinButton.innerHTML = '🔒 AUTO SPINNING';
    spinButton.classList.add('is-locked');
    spinButton.disabled = true;
    return;
  }

  spinButton.innerHTML = '🎡 SPIN TEAM + POSITION';
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

function getAvailablePositionsForClub(club) {
  return POSITION_ORDER.filter((position) => (
    availablePlayers.some((player) => player.club === club && player.position === position && canSelectPlayer(player))
  ));
}

function getEligibleClubsForSpin() {
  return CLUBS.filter((club) => {
    const hasCoachOption = !teamCoach && Boolean(availableCoachByClub[club]);
    const hasPlayerOption = getAvailablePositionsForClub(club).length > 0;
    return hasCoachOption || hasPlayerOption;
  });
}

function getClubHeading() {
  if (!currentClub) {
    return 'Press Spin';
  }

  if (currentPosition) {
    return `${currentClub} • ${POSITION_LABELS[currentPosition]}`;
  }

  return `${currentClub} • Coach Window`;
}

function renderPlayersForClub() {
  playerContainer.innerHTML = '';

  if (!currentClub) {
    playerContainer.innerHTML = '<p class="draft-tip">Press SPIN TEAM + POSITION to reveal your next option.</p>';
    return;
  }

  const clubPlayers = currentPosition
    ? getAvailablePlayersForClub(currentClub).filter((player) => player.position === currentPosition)
    : [];
  const clubCoach = teamCoach ? null : (availableCoachByClub[currentClub] || null);

  if (!clubPlayers.length && !clubCoach) {
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

  if (clubCoach) {
    const coachCard = document.createElement('article');
    coachCard.className = 'player-card coach-card';

    const coachButton = document.createElement('button');
    coachButton.type = 'button';
    coachButton.className = 'player-select-button';
    coachButton.innerHTML = `
      <h3>${clubCoach.name}</h3>
      <p>Coach • ${clubCoach.club}</p>
      <p>Head Coach</p>
    `;

    coachButton.addEventListener('click', () => handleCoachSelection(clubCoach));
    coachCard.appendChild(coachButton);
    coachCard.classList.add(getDelayClass(clubPlayers.length));
    fragment.appendChild(coachCard);
  }

  if (legendaryAvailableThisSpin) {
    const legendaryCard = document.createElement('article');
    legendaryCard.className = 'player-card coach-card';

    const legendaryButton = document.createElement('button');
    legendaryButton.type = 'button';
    legendaryButton.className = 'player-select-button';
    legendaryButton.innerHTML = `
      <h3>Gavin Lewis</h3>
      <p>Legendary Setter • Chequers</p>
      <p>1% Spawn</p>
    `;

    legendaryButton.addEventListener('click', handleLegendarySelection);
    legendaryCard.appendChild(legendaryButton);
    legendaryCard.classList.add(getDelayClass(clubPlayers.length + (clubCoach ? 1 : 0)));
    fragment.appendChild(legendaryCard);
  }

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
  legendaryAvailableThisSpin = false;

  if (chosenClub === 'Chequers' && !legendarySelected && !isPositionFull('S') && Math.random() < 0.01) {
    currentPosition = 'S';
    legendaryAvailableThisSpin = true;
  } else {
    const positionOptions = getAvailablePositionsForClub(chosenClub);
    currentPosition = positionOptions.length
      ? positionOptions[Math.floor(Math.random() * positionOptions.length)]
      : null;
  }

  clubName.textContent = getClubHeading();
  animateClubReveal();
  updateStatusPanels();
  renderPlayersForClub();
}

function startClubSpin() {
  if (isSpinning || isDraftComplete || isTeamComplete()) {
    return;
  }

  const eligibleClubs = getEligibleClubsForSpin();
  if (!eligibleClubs.length) {
    isDraftComplete = true;
    currentClub = null;
    currentPosition = null;
    clubName.textContent = 'Draft Complete';
    animateClubReveal();
    playerContainer.innerHTML = '<p class="draft-tip">No clubs remain.</p>';
    updateStatusPanels();
    return;
  }

  const chosenClub = eligibleClubs[Math.floor(Math.random() * eligibleClubs.length)];
  const startTime = performance.now();
  const duration = 1800;

  isSpinning = true;
  spinButton.disabled = true;
  updateStatusPanels();

  const tick = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    clubName.textContent = CLUBS[Math.floor(Math.random() * CLUBS.length)];
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
  currentPosition = null;
  legendaryAvailableThisSpin = false;
  playerContainer.innerHTML = '<p class="draft-tip">Rolling the next team and position...</p>';
  window.setTimeout(() => {
    startClubSpin();
  }, 300);
}

function updateRerollButton() {
  if (!rerollButton) {
    return;
  }

  const canUseReroll = !positionRerollUsed && Boolean(currentClub) && !isSpinning && !isDraftComplete && !isTeamComplete();
  rerollButton.disabled = !canUseReroll;
  rerollButton.textContent = positionRerollUsed ? '🔄 POSITION REROLL USED' : '🔄 REROLL POSITION (1 LEFT)';
}

function handlePlayerSelection(player) {
  if (!canSelectPlayer(player)) {
    return;
  }

  availablePlayers = availablePlayers.filter((availablePlayer) => availablePlayer.id !== player.id);
  assignPlayerToTeam(player);
  currentClub = null;
  currentPosition = null;
  legendaryAvailableThisSpin = false;
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

function handleCoachSelection(coach) {
  if (teamCoach || !currentClub || coach.club !== currentClub || !availableCoachByClub[currentClub]) {
    return;
  }

  teamCoach = coach;
  availableCoachByClub[coach.club] = null;
  currentClub = null;
  currentPosition = null;
  legendaryAvailableThisSpin = false;
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

function handleLegendarySelection() {
  team.S = { ...LEGENDARY_GAVIN };
  legendarySelected = true;
  legendaryAvailableThisSpin = false;
  currentClub = null;
  currentPosition = null;
  clubName.textContent = 'Legendary Pick Locked';
  animateClubReveal();
  updateStatusPanels();
  renderPlayersForClub();

  if (isTeamComplete()) {
    isDraftComplete = true;
    clubName.textContent = 'Legendary Season';
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
  if (positionRerollUsed || !currentClub || isSpinning || isDraftComplete || isTeamComplete()) {
    return;
  }

  const availablePositions = getAvailablePositionsForClub(currentClub);
  if (!availablePositions.length) {
    return;
  }

  positionRerollUsed = true;
  const alternatives = availablePositions.filter((position) => position !== currentPosition);
  const nextPositionPool = alternatives.length ? alternatives : availablePositions;
  currentPosition = nextPositionPool[Math.floor(Math.random() * nextPositionPool.length)];
  clubName.textContent = getClubHeading();
  animateClubReveal();
  playerContainer.innerHTML = '<p class="draft-tip">Rerolling position...</p>';
  updateRerollButton();

  window.setTimeout(() => {
    renderPlayersForClub();
  }, 250);
}

spinButton.addEventListener('click', handleSpinButtonClick);

availablePlayers = players.map((player) => ({ ...player }));
availableCoachByClub = Object.fromEntries(
  Object.entries(COACHES).map(([club, coach]) => [club, { ...coach }])
);

buildStatusPanel();
buildCourtLayout();
buildCoachPanel();

Object.values(teamSlots).forEach((slot) => {
  slot.classList.add('team-slot');
});

rerollButton = document.createElement('button');
rerollButton.type = 'button';
rerollButton.id = 'rerollButton';
rerollButton.className = 'reroll-button';
rerollButton.textContent = '🔄 REROLL POSITION (1 LEFT)';
rerollButton.addEventListener('click', handleRerollClick);
spinButton.parentElement.insertBefore(rerollButton, spinButton);

renderCourtSlots();
updateStatusPanels();
renderPlayersForClub();
renderSpinButton();
