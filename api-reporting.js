(() => {
  const root = document.querySelector('[data-api-demo]');
  if (!root) return;
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => [...root.querySelectorAll(selector)];
  const scenes = [
    { title: 'Scheduled trigger', text: 'A configured schedule starts the Azure Logic Apps workflow. Its status changes to In Progress before the request is prepared.', duration: 5 },
    { title: 'Dynamic payload assembly', text: 'Logic Apps combines configured values into a request. The displayed fields are generic placeholders, not the actual API schema.', duration: 7 },
    { title: 'API request in transit', text: 'Logic Apps calls the Azure Function App API. The packet illustrates that handoff; no live service is contacted.', duration: 4 },
    { title: 'Function App processing', text: 'The Function App executes its own report-generation code. Logic Apps orchestrates the call but does not generate the CSV output.', duration: 8 },
    { title: 'CSV generation and storage', text: 'The Function App generates CSV output and stores it in Azure Blob Storage. Generation and storage are separate stages.', duration: 6 },
    { title: 'Response and business status', text: 'The API response returns to Logic Apps, which evaluates the business status against configured requirements.', duration: 7 },
    { title: 'Choose a business outcome', text: 'The simulated sequence pauses here. Explore PASS to see applicable delivery and notification, or FAIL to see dashboard tracking and configured failure handling.', duration: 10 },
    { title: 'Workflow recap', text: 'The selected path completes this conceptual view. Business FAIL remains distinct from an Azure action exception handled by Catch.', duration: 8 }
  ];
  const totalSeconds = scenes.reduce((sum, scene) => sum + scene.duration, 0);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const branchButtons = $$('[data-demo-branch]');
  const logs = $$('[data-demo-log]');
  const systems = $$('[data-system]');
  const activities = $$('[data-activity]');
  const state = { step: -1, branch: 'pass', branchChosen: false, awaitingBranch: false, timeline: null, playing: false, pausedByUser: false, gsap: Boolean(window.gsap && !reducedMotion.matches) };
  const formatTime = (seconds) => { const n = Math.max(0, Math.floor(seconds)); return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`; };
  const setText = (selector, value) => { const node = $(selector); if (node) node.textContent = value; };

  const updateConsole = (index) => {
    const failLabels = ['Schedule activated', 'Dynamic request prepared', 'API request dispatched', 'Function App processing', 'CSV reports generated', 'Response status evaluated', 'Failure recorded in monitoring dashboard', 'Configured failure actions (where applicable)'];
    const passLabels = ['Schedule activated', 'Dynamic request prepared', 'API request dispatched', 'Function App processing', 'CSV reports generated', 'Response status evaluated', 'Output delivery initiated', 'Notification prepared'];
    const entries = state.branch === 'fail' ? failLabels : passLabels;
    logs.forEach((row, i) => {
      const label = row.querySelector('span');
      const status = row.querySelector('b');
      if (label) label.textContent = entries[i];
      row.classList.toggle('is-complete', i < index);
      row.classList.toggle('is-current', i === index);
      row.classList.toggle('is-failed', state.branch === 'fail' && i === 6 && index >= 6);
      if (status) status.textContent = i < index ? (state.branch === 'fail' && i === 6 ? 'FAILED' : 'DONE') : i === index ? (state.branch === 'fail' && i === 6 ? 'FAIL' : 'ACTIVE') : 'WAITING';
    });
  };
  const setBranch = (branch, animate = false) => {
    state.branch = branch;
    branchButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.demoBranch === branch)));
    $('[data-outcome="pass"]').hidden = branch !== 'pass';
    $('[data-outcome="fail"]').hidden = branch !== 'fail';
    const decision = $('[data-decision-state]');
    if (decision) { decision.textContent = branch === 'pass' ? 'PASS · continue applicable steps' : 'FAIL · follow configured handling'; decision.dataset.status = branch; }
    if (animate && state.gsap) window.gsap.fromTo(branch === 'pass' ? $('[data-outcome="pass"]') : $('[data-outcome="fail"]'), { opacity: .55, y: 8 }, { opacity: 1, y: 0, duration: .32, ease: 'power2.out' });
    if (state.step >= 6) updateConsole(state.step === 7 ? 7 : 6);
  };
  const resetVisuals = () => {
    systems.forEach((node) => node.classList.remove('is-active', 'is-done'));
    activities.forEach((activity) => { activity.classList.remove('is-active', 'is-done'); activity.querySelector('b').textContent = 'READY'; });
    $$('[data-route]').forEach((route) => route.classList.remove('is-active', 'is-done'));
    $$('[data-payload-field]').forEach((field) => field.classList.remove('is-revealed'));
    $$('[data-request-packet], [data-file-packet], [data-response-packet], [data-delivery-packet]').forEach((packet) => packet.classList.remove('is-arrived'));
    $('[data-delivery-route]').classList.remove('is-active');
    $('[data-execution-progress]').style.transform = 'scaleX(0)';
    $('[data-stored-file]').classList.remove('is-stored');
    if (state.gsap) {
      window.gsap.set('[data-request-packet], [data-file-packet], [data-response-packet], [data-delivery-packet]', { x: 0, y: 0 });
      window.gsap.set('[data-payload-field]', { opacity: .5, y: 3 });
      window.gsap.set('[data-activity]', { opacity: .68, x: 0 });
      window.gsap.set('[data-stored-file]', { opacity: .65, y: 0 });
      window.gsap.set('[data-recap]', { opacity: 1, y: 0 });
    }
    setText('[data-logic-state]', 'Idle'); setText('[data-function-state]', 'Waiting'); setText('[data-storage-state]', 'Empty');
    setText('[data-trigger-label]', 'Configured schedule'); setText('[data-payload-state]', 'Illustrative');
  };
  const renderScene = (index) => {
    state.step = index;
    resetVisuals();
    const activate = (name) => { const node = $(`[data-system="${name}"]`); if (node) node.classList.add('is-active'); };
    if (index >= 0) { activate('logic'); setText('[data-logic-state]', 'In Progress'); }
    if (index >= 2) { $('[data-route="request"]').classList.add('is-done'); activate('function'); $('[data-request-packet]').classList.add('is-arrived'); }
    if (index >= 3) { setText('[data-function-state]', 'Processing'); activities.forEach((activity) => { activity.classList.add('is-done'); activity.querySelector('b').textContent = 'DONE'; }); $('[data-execution-progress]').style.transform = 'scaleX(1)'; }
    if (index >= 4) { $('[data-route="storage"]').classList.add('is-done'); activate('storage'); $('[data-stored-file]').classList.add('is-stored'); setText('[data-storage-state]', 'Stored'); }
    if (index >= 5) { $('[data-route="response"]').classList.add('is-done'); $('[data-response-packet]').classList.add('is-arrived'); setText('[data-decision-state]', 'Response received · evaluate status'); }
    if (index >= 6) setBranch(state.branch);
    if (index === 7) $('[data-choose-outcome]').hidden = false;
    else $('[data-choose-outcome]').hidden = true;
    const elapsed = scenes.slice(0, index).reduce((sum, scene) => sum + scene.duration, 0);
    setText('[data-scene-number]', `SCENE ${String(index + 1).padStart(2, '0')} / 08`);
    setText('[data-scene-title]', scenes[index].title);
    setText('[data-scene-description]', scenes[index].text);
    setText('[data-demo-step]', `Step ${index + 1} of 8`);
    setText('[data-demo-time]', `${formatTime(elapsed)} / ${formatTime(totalSeconds)}`);
    const progress = $('[data-demo-progress]'); if (progress) progress.value = index + 1;
    const live = $('[data-demo-live]'); if (live) live.textContent = `Step ${index + 1} of 8: ${scenes[index].title}. ${scenes[index].text}`;
    updateConsole(index);
    $('[data-demo-previous]').disabled = index === 0;
    $('[data-demo-next]').disabled = index === 7;
    $('[data-demo-start]').disabled = index > 0;
    $('[data-demo-play]').disabled = !state.gsap || (index === 6 && state.awaitingBranch);
    $('[data-demo-pause]').disabled = true;
    $('[data-demo-replay]').disabled = false;
    setText('[data-demo-status]', index === 6 && !state.branchChosen ? 'PAUSED · CHOOSE PASS OR FAIL' : `PAUSED · SCENE ${String(index + 1).padStart(2, '0')}`);
  };

  const buildTimeline = () => {
    if (!state.gsap) return;
    state.timeline?.kill();
    const gsap = window.gsap;
    gsap.set('[data-recap]', { opacity: .2, y: 5 });
    const tl = gsap.timeline({ paused: true,
      onUpdate: () => { const progress = $('[data-demo-progress]'); if (progress) progress.value = Math.min(8, (tl.time() / totalSeconds) * 8); setText('[data-demo-time]', `${formatTime(tl.time())} / ${formatTime(totalSeconds)}`); },
      onComplete: () => { state.playing = false; state.awaitingBranch = false; $('[data-demo-play]').disabled = false; $('[data-demo-pause]').disabled = true; $('[data-demo-next]').disabled = true; $('[data-choose-outcome]').hidden = false; setText('[data-demo-status]', `COMPLETE · ${state.branch.toUpperCase()} PATH`); }
    });
    let cursor = 0;
    scenes.forEach((scene, index) => {
      tl.addLabel(`scene${index}`, cursor).call(() => {
        renderScene(index);
        if (index === 6 && !state.branchChosen) { state.awaitingBranch = true; state.playing = false; tl.pause(); $('[data-demo-play]').disabled = true; $('[data-demo-pause]').disabled = true; setText('[data-demo-status]', 'PAUSED · CHOOSE PASS OR FAIL'); }
      }, [], cursor);
      const t = cursor;
      const active = scene.systems || (index >= 4 ? ['logic', 'storage'] : index >= 2 ? ['logic', 'function'] : ['logic']);
      const nodes = active.map((key) => $(`[data-system="${key}"]`)).filter(Boolean);
      if (nodes.length) tl.fromTo(nodes, { y: 4, opacity: .88 }, { y: 0, opacity: 1, duration: .45, stagger: .08, ease: 'power2.out' }, t + .12);
      if (index === 0) tl.to('[data-trigger-label]', { color: '#d2f36b', duration: .35 }, t + .4).call(() => setText('[data-logic-state]', 'In Progress'), [], t + .7);
      if (index === 1) tl.to('[data-payload-field]', { opacity: 1, y: 0, stagger: .55, duration: .45, ease: 'power2.out', onStart: function () { this.targets().forEach((field) => field.classList.add('is-revealed')); } }, t + .35).to('[data-payload-state]', { color: '#d2f36b', duration: .3 }, t + 2.4).call(() => setText('[data-payload-state]', 'ASSEMBLED'), [], t + 2.4);
      if (index === 2) tl.to('[data-request-packet]', { x: 95, duration: 1.2, ease: 'power2.inOut', onStart: () => $('[data-route="request"]').classList.add('is-active'), onComplete: () => $('[data-request-packet]').classList.add('is-arrived') }, t + .4).to('[data-system="function"]', { scale: 1.025, duration: .3, yoyo: true, repeat: 1 }, t + 1.6);
      if (index === 3) tl.call(() => setText('[data-function-state]', 'Processing'), [], t + .25).to('[data-execution-progress]', { scaleX: 1, duration: 3.6, ease: 'power1.inOut' }, t + .6).to('[data-activity]', { opacity: 1, stagger: .55, duration: .35, ease: 'power2.out', onStart: function () { this.targets().forEach((activity) => { activity.classList.add('is-active'); activity.querySelector('b').textContent = 'RUN'; }); }, onComplete: () => activities.forEach((activity) => { activity.classList.remove('is-active'); activity.classList.add('is-done'); activity.querySelector('b').textContent = 'DONE'; }) }, t + .8);
      if (index === 4) tl.fromTo('[data-file-packet]', { x: -65 }, { x: 90, duration: 1.2, ease: 'power2.inOut', onStart: () => $('[data-route="storage"]').classList.add('is-active') }, t + .5).to('[data-stored-file]', { opacity: 1, y: 0, duration: .45, ease: 'back.out(1.5)', onStart: () => $('[data-stored-file]').classList.add('is-stored') }, t + 2).call(() => setText('[data-storage-state]', 'Stored'), [], t + 2.4);
      if (index === 5) tl.fromTo('[data-response-packet]', { x: 65 }, { x: -90, duration: 1.2, ease: 'power2.inOut', onStart: () => $('[data-route="response"]').classList.add('is-active') }, t + .4).call(() => setBranch(state.branch), [], t + 1.8);
      if (index === 6) {
        if (state.branch === 'pass') {
          const vertical = window.matchMedia('(max-width: 900px)').matches;
          tl.fromTo('[data-delivery-packet]', vertical ? { y: -16 } : { x: -48 }, vertical ? { y: 16 } : { x: 40 }, { duration: 1.15, ease: 'power2.inOut', onStart: () => $('[data-delivery-route]').classList.add('is-active'), onComplete: () => $('[data-delivery-packet]').classList.add('is-arrived') }, t + .6).to('.demo-destination', { scale: 1.02, duration: .35, yoyo: true, repeat: 1 }, t + 2).fromTo('.demo-email', { opacity: .65, x: -6 }, { opacity: 1, x: 0, duration: .45 }, t + 3.6);
        } else tl.to('.demo-monitor', { scale: 1.02, duration: .35, yoyo: true, repeat: 1 }, t + 1).fromTo('.demo-business-actions', { opacity: .65, x: -6 }, { opacity: 1, x: 0, duration: .45 }, t + 3.6);
      }
    if (index === 7) tl.to('[data-recap]', { opacity: 1, y: 0, duration: .55, ease: 'power2.out' }, t + .2).to(systems, { borderColor: '#829d54', duration: .4, stagger: .1 }, t + .7);
      cursor += scene.duration;
    });
    tl.addLabel('end', cursor);
    state.timeline = tl;
  };
  const play = (from = state.step < 0 ? 0 : state.step) => {
    if (!state.gsap) return;
    if (!state.timeline) buildTimeline();
    if (state.pausedByUser && from === state.step) {
      state.timeline.play(); state.playing = true; state.pausedByUser = false;
      $('[data-demo-play]').disabled = true; $('[data-demo-pause]').disabled = false;
      setText('[data-demo-status]', `PLAYING · SCENE ${String(from + 1).padStart(2, '0')}`);
      return;
    }
    state.timeline.seek(`scene${from}`, true);
    renderScene(from);
    state.pausedByUser = false;
    state.awaitingBranch = from === 6 && !state.branchChosen;
    if (state.awaitingBranch) { setText('[data-demo-status]', 'PAUSED · CHOOSE PASS OR FAIL'); return; }
    state.playing = true;
    state.timeline.play();
    $('[data-demo-play]').disabled = true; $('[data-demo-pause]').disabled = false;
    setText('[data-demo-status]', `PLAYING · SCENE ${String(from + 1).padStart(2, '0')}`);
  };
  const navigate = (index) => {
    const next = Math.max(0, Math.min(7, index));
    state.playing = false;
    state.pausedByUser = false;
    state.awaitingBranch = next === 6 && !state.branchChosen;
    if (state.timeline) { state.timeline.pause(); state.timeline.seek(`scene${next}`, true); }
    renderScene(next);
  };
  $('[data-demo-start]').addEventListener('click', () => play(0));
  $('[data-demo-play]').addEventListener('click', () => { if (state.awaitingBranch) return; play(state.step < 0 ? 0 : state.step); });
  $('[data-demo-pause]').addEventListener('click', () => { state.timeline?.pause(); state.playing = false; state.pausedByUser = true; $('[data-demo-play]').disabled = false; $('[data-demo-pause]').disabled = true; setText('[data-demo-status]', 'PAUSED'); });
  $('[data-demo-previous]').addEventListener('click', () => navigate(Math.max(0, state.step - 1)));
  $('[data-demo-next]').addEventListener('click', () => navigate(Math.min(7, state.step + 1)));
  $('[data-demo-replay]').addEventListener('click', () => { state.timeline?.kill(); state.timeline = null; state.step = -1; state.branchChosen = false; state.awaitingBranch = false; state.pausedByUser = false; state.playing = false; $('[data-choose-outcome]').hidden = true; renderScene(0); $('[data-demo-start]').disabled = false; setText('[data-demo-status]', 'READY · SIMULATION RESET'); if (state.gsap) play(0); });
  $('[data-choose-outcome]').addEventListener('click', () => { state.timeline?.pause(); state.branchChosen = false; state.awaitingBranch = false; state.pausedByUser = false; state.playing = false; $('[data-choose-outcome]').hidden = true; navigate(5); state.awaitingBranch = true; $('[data-demo-next]').disabled = true; $('[data-demo-play]').disabled = true; setText('[data-demo-status]', 'PAUSED · CHOOSE PASS OR FAIL'); });
  branchButtons.forEach((button) => button.addEventListener('click', () => {
    setBranch(button.dataset.demoBranch, true);
    if (state.step >= 6 || state.awaitingBranch) {
      state.branchChosen = true; state.awaitingBranch = false; state.pausedByUser = false;
      if (state.gsap) {
        buildTimeline(); state.timeline.seek('scene6', true); renderScene(6); state.playing = true; state.timeline.play();
        $('[data-demo-play]').disabled = true; $('[data-demo-pause]').disabled = false; $('[data-choose-outcome]').hidden = true;
        setText('[data-demo-status]', `PLAYING · ${state.branch.toUpperCase()} PATH`);
      } else {
        renderScene(state.step === 7 ? 7 : 6);
        setText('[data-demo-status]', `MANUAL VIEW · ${state.branch.toUpperCase()} PATH`);
      }
    }
  }));
  const copyButton = $('[data-copy-payload]');
  copyButton.addEventListener('click', async () => {
    const value = $('[data-copy-source]').textContent;
    try { await navigator.clipboard.writeText(value); setText('[data-copy-status]', 'Illustrative JSON copied.'); }
    catch { const input = document.createElement('textarea'); input.value = value; input.setAttribute('readonly', ''); input.style.position = 'fixed'; input.style.opacity = '0'; document.body.append(input); input.select(); const copied = document.execCommand('copy'); input.remove(); setText('[data-copy-status]', copied ? 'Illustrative JSON copied.' : 'Select and copy the example above.'); }
  });
  resetVisuals(); setText('[data-demo-status]', 'READY · MANUAL START'); updateConsole(-1); setBranch('pass');
  $('[data-demo-next]').disabled = false; $('[data-demo-previous]').disabled = true; $('[data-demo-play]').disabled = !state.gsap; $('[data-demo-start]').disabled = false;
  if (!state.gsap) setText('[data-demo-status]', reducedMotion.matches ? 'REDUCED MOTION · MANUAL STEPS' : 'STATIC MODE · MANUAL STEPS');
})();
