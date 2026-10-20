(() => {
  const root = document.querySelector('[data-api-demo]');
  if (!root) return;

  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => [...root.querySelectorAll(selector)];
  const scenes = [
    { title: 'Scheduled trigger', text: 'A configured schedule starts the Azure Logic Apps workflow. The status changes to In Progress before the request is prepared.', duration: 5 },
    { title: 'Dynamic payload assembly', text: 'Logic Apps combines configured values into a request. The displayed fields are generic placeholders, not the actual API schema.', duration: 7 },
    { title: 'API request in transit', text: 'Logic Apps calls the Azure Function App API. The moving request represents that boundary; no live service is contacted.', duration: 4 },
    { title: 'Function App processing', text: 'The Function App executes its own report-generation code. Logic Apps orchestrates the call but does not generate the CSV output.', duration: 8 },
    { title: 'CSV generation and storage', text: 'The Function App generates CSV output and stores it in Azure Blob Storage. Generation and storage are shown as separate stages.', duration: 6 },
    { title: 'Response and business status', text: 'The API response returns to Logic Apps, which evaluates the business status against configured requirements.', duration: 7 },
    { title: 'Applicable branch actions', text: 'PASS continues applicable delivery and notification. FAIL follows business-defined handling and dashboard tracking; it is not automatically an Azure action exception.', duration: 10 },
    { title: 'Workflow recap', text: 'This recap connects the schedule, dynamic request, Function App processing, Blob output, business status and applicable next steps.', duration: 8 }
  ];
  const totalSeconds = scenes.reduce((sum, scene) => sum + scene.duration, 0);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const branchButtons = $$('[data-demo-branch]');
  const outcomePass = $('[data-outcome="pass"]');
  const outcomeFail = $('[data-outcome="fail"]');
  const systems = $$('[data-system]');
  const activities = $$('[data-activity]');
  const state = { step: -1, branch: 'pass', timeline: null, playing: false, gsap: Boolean(window.gsap && !reduceMotion.matches) };

  const formatTime = (seconds) => {
    const n = Math.max(0, Math.floor(seconds));
    return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`;
  };
  const setText = (selector, value) => { const node = $(selector); if (node) node.textContent = value; };
  const setStepCopy = (index) => {
    const preview = index < 0;
    setText('[data-scene-number]', preview ? 'STATIC PREVIEW' : `SCENE ${String(index + 1).padStart(2, '0')} / 08`);
    setText('[data-scene-title]', preview ? 'One workflow, from trigger to outcome.' : scenes[index].title);
    setText('[data-scene-description]', preview ? 'Start the simulated sequence or use the controls to inspect each stage. The visual uses generic placeholders and does not call a live API.' : scenes[index].text);
    setText('[data-demo-step]', preview ? 'Preview · 0 of 8' : `Step ${index + 1} of 8`);
    const progress = $('[data-demo-progress]');
    if (progress) progress.value = preview ? 0 : index + 1;
    const elapsed = preview ? 0 : scenes.slice(0, index).reduce((sum, scene) => sum + scene.duration, 0);
    setText('[data-demo-time]', `${formatTime(elapsed)} / ${formatTime(totalSeconds)}`);
    const live = $('[data-demo-live]');
    if (live) live.textContent = preview ? 'Static workflow overview. Start walkthrough to animate.' : `Step ${index + 1} of 8: ${scenes[index].title}. ${scenes[index].text}`;
  };
  const setBranch = (branch, animate = false) => {
    state.branch = branch;
    branchButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.demoBranch === branch)));
    outcomePass.hidden = branch !== 'pass';
    outcomeFail.hidden = branch !== 'fail';
    outcomePass.classList.toggle('is-selected', branch === 'pass');
    outcomeFail.classList.toggle('is-selected', branch === 'fail');
    const decision = $('[data-decision-state]');
    if (decision) {
      decision.textContent = branch === 'pass' ? 'PASS · continue applicable steps' : 'FAIL · follow configured handling';
      decision.dataset.status = branch;
    }
    if (animate && state.gsap) window.gsap.fromTo(branch === 'pass' ? outcomePass : outcomeFail, { opacity: 0.55, y: 8 }, { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' });
  };
  const clearVisuals = () => {
    systems.forEach((system) => system.classList.remove('is-active', 'is-done'));
    activities.forEach((activity) => { activity.classList.remove('is-active', 'is-done'); activity.querySelector('b').textContent = 'READY'; });
    $$('[data-route]').forEach((route) => route.classList.remove('is-active', 'is-done'));
    $$('[data-payload-field]').forEach((field) => field.classList.remove('is-revealed'));
    $$('[data-request-packet], [data-file-packet], [data-response-packet], [data-delivery-packet]').forEach((packet) => packet.classList.remove('is-moving', 'is-arrived'));
    $('[data-delivery-route]').classList.remove('is-active');
    $('[data-execution-progress]').style.transform = 'scaleX(0)';
    $('[data-stored-file]').classList.remove('is-stored');
    if (state.gsap) window.gsap.set('[data-request-packet], [data-file-packet], [data-response-packet], [data-delivery-packet]', { x: 0 });
    if (state.gsap) window.gsap.set('[data-payload-field]', { opacity: 0.5, y: 3 });
    if (state.gsap) window.gsap.set('[data-activity]', { opacity: 0.68, x: 0 });
    if (state.gsap) window.gsap.set('[data-stored-file]', { opacity: 0.65, y: 0 });
    if (state.gsap) window.gsap.set('[data-recap]', { opacity: 1, y: 0 });
    setText('[data-logic-state]', 'Idle'); setText('[data-function-state]', 'Waiting'); setText('[data-storage-state]', 'Empty');
    setText('[data-trigger-label]', 'Configured schedule');
    setText('[data-payload-state]', 'Illustrative');
    setText('[data-demo-status]', state.gsap ? 'READY · MANUAL START' : (reduceMotion.matches ? 'REDUCED MOTION · MANUAL STEPS' : 'STATIC MODE · GSAP UNAVAILABLE'));
  };
  const completeStep = (index) => {
    clearVisuals();
    const activate = (name) => { const el = $(`[data-system="${name}"]`); if (el) el.classList.add('is-active'); };
    if (index >= 0) {
      setText('[data-logic-state]', index >= 0 ? 'In Progress' : 'Idle');
      if (index >= 0) activate('logic');
    }
    if (index >= 2) { $('[data-route="request"]').classList.add('is-done'); activate('function'); }
    if (index >= 3) { setText('[data-function-state]', 'Processing'); activities.forEach((a, i) => { if (i < 3) { a.classList.add('is-done'); a.querySelector('b').textContent = 'DONE'; } }); $('[data-execution-progress]').style.transform = 'scaleX(1)'; }
    if (index >= 4) { $('[data-route="storage"]').classList.add('is-done'); activate('storage'); $('[data-stored-file]').classList.add('is-stored'); setText('[data-storage-state]', 'Stored'); }
    if (index >= 5) { $('[data-route="response"]').classList.add('is-done'); }
    if (index >= 6) { activate(state.branch === 'pass' ? 'storage' : 'logic'); setBranch(state.branch); }
    if (index === 7) { systems.forEach((el) => el.classList.add('is-done')); }
  };
  const showScene = (index, seekTimeline = true) => {
    const next = Math.max(0, Math.min(scenes.length - 1, index));
    state.step = next;
    if (state.timeline) {
      state.timeline.pause(); state.playing = false;
      if (seekTimeline) state.timeline.seek(`scene${next}`, false);
    }
    completeStep(next);
    setStepCopy(next);
    const buttons = { start: $('[data-demo-start]'), play: $('[data-demo-play]'), pause: $('[data-demo-pause]'), previous: $('[data-demo-previous]'), next: $('[data-demo-next]'), replay: $('[data-demo-replay]') };
    buttons.start.disabled = true; buttons.play.disabled = !state.gsap; buttons.pause.disabled = true;
    buttons.previous.disabled = next === 0; buttons.next.disabled = next === scenes.length - 1; buttons.replay.disabled = false;
    setText('[data-demo-status]', state.gsap ? `PAUSED · SCENE ${String(next + 1).padStart(2, '0')}` : 'MANUAL SCENE VIEW');
  };
  const buildTimeline = () => {
    if (!state.gsap) return;
    if (state.timeline) state.timeline.kill();
    const gsap = window.gsap;
    gsap.set('[data-recap]', { opacity: 0, y: 8 });
    const tl = gsap.timeline({ paused: true, onUpdate: () => { const value = (tl.time() / totalSeconds) * scenes.length; const progress = $('[data-demo-progress]'); if (progress) progress.value = Math.min(scenes.length, value); setText('[data-demo-time]', `${formatTime(tl.time())} / ${formatTime(totalSeconds)}`); }, onComplete: () => { state.playing = false; $('[data-demo-play]').disabled = false; $('[data-demo-pause]').disabled = true; $('[data-demo-next]').disabled = true; setText('[data-demo-status]', 'COMPLETE · REPLAY OR INSPECT'); } });
    let cursor = 0;
    scenes.forEach((scene, index) => {
      tl.addLabel(`scene${index}`, cursor).call(() => { state.step = index; completeStep(index); setStepCopy(index); $('[data-demo-previous]').disabled = index === 0; $('[data-demo-next]').disabled = index === scenes.length - 1; setText('[data-demo-status]', `PLAYING · SCENE ${String(index + 1).padStart(2, '0')}`); }, [], cursor);
      const t = cursor;
      if (index === 0) tl.fromTo('[data-system="logic"]', { scale: 0.99 }, { scale: 1, duration: 0.65, ease: 'power2.out' }, t + 0.2).to('[data-trigger-label]', { color: '#d2f36b', duration: 0.35 }, t + 0.65).call(() => setText('[data-logic-state]', 'In Progress'), [], t + 0.7);
      if (index === 1) tl.to('[data-payload-field]', { opacity: 1, y: 0, stagger: 0.55, duration: 0.45, ease: 'power2.out', onStart: function () { this.targets().forEach((el) => el.classList.add('is-revealed')); } }, t + 0.35).to('[data-payload-state]', { color: '#d2f36b', duration: 0.3 }, t + 2.4).call(() => setText('[data-payload-state]', 'ASSEMBLED'), [], t + 2.4);
      if (index === 2) tl.to('[data-route="request"]', { opacity: 1, duration: 0.25 }, t + 0.2).to('[data-request-packet]', { x: 95, duration: 1.2, ease: 'power2.inOut', onStart: () => $('[data-route="request"]').classList.add('is-active'), onComplete: () => $('[data-request-packet]').classList.add('is-arrived') }, t + 0.55).to('[data-system="function"]', { scale: 1.025, duration: 0.3, yoyo: true, repeat: 1 }, t + 1.65);
      if (index === 3) tl.call(() => setText('[data-function-state]', 'Processing'), [], t + 0.25).to('[data-execution-progress]', { scaleX: 1, duration: 3.6, ease: 'power1.inOut' }, t + 0.6).to('[data-activity]', { opacity: 1, x: 0, stagger: 0.55, duration: 0.35, ease: 'power2.out', onStart: function () { this.targets().forEach((el) => { el.classList.add('is-active'); el.querySelector('b').textContent = 'RUN'; }); }, onComplete: () => activities.forEach((a) => { a.classList.remove('is-active'); a.classList.add('is-done'); a.querySelector('b').textContent = 'DONE'; }) }, t + 0.8);
      if (index === 4) tl.fromTo('[data-file-packet]', { x: -65 }, { x: 90, duration: 1.2, ease: 'power2.inOut', onStart: () => $('[data-route="storage"]').classList.add('is-active') }, t + 0.5).to('[data-stored-file]', { opacity: 1, y: 0, duration: 0.45, ease: 'back.out(1.5)', onStart: () => $('[data-stored-file]').classList.add('is-stored') }, t + 2).call(() => setText('[data-storage-state]', 'Stored'), [], t + 2.4);
      if (index === 5) tl.fromTo('[data-response-packet]', { x: 65 }, { x: -90, duration: 1.2, ease: 'power2.inOut', onStart: () => $('[data-route="response"]').classList.add('is-active') }, t + 0.4).to('[data-decision-state]', { opacity: 1, duration: 0.35, onStart: () => setBranch(state.branch) }, t + 1.9);
      if (index === 6) {
        const passPath = state.branch === 'pass';
        tl.fromTo(passPath ? '[data-outcome="pass"]' : '[data-outcome="fail"]', { opacity: 0.62, y: 8 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, t + 0.4);
        if (passPath) {
          const verticalDelivery = window.matchMedia('(max-width: 900px)').matches;
          tl.fromTo('[data-delivery-packet]', verticalDelivery ? { y: -16 } : { x: -48 }, verticalDelivery ? { y: 16 } : { x: 40 }, { duration: 1.15, ease: 'power2.inOut', onStart: () => $('[data-delivery-route]').classList.add('is-active'), onComplete: () => $('[data-delivery-packet]').classList.add('is-arrived') }, t + 1.1).to('.demo-destination', { scale: 1.02, duration: 0.35, yoyo: true, repeat: 1 }, t + 2.4).fromTo('.demo-email', { opacity: 0.65, x: -6 }, { opacity: 1, x: 0, duration: 0.45 }, t + 4.2);
        } else tl.to('.demo-monitor', { scale: 1.02, duration: 0.35, yoyo: true, repeat: 1 }, t + 1.7).fromTo('.demo-business-actions', { opacity: 0.65, x: -6 }, { opacity: 1, x: 0, duration: 0.45 }, t + 4.2);
      }
      if (index === 7) tl.to('[data-recap]', { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, t + 0.2).to(systems, { borderColor: '#829d54', duration: 0.4, stagger: 0.12 }, t + 0.7);
      cursor += scene.duration;
    });
    tl.addLabel('end', cursor);
    state.timeline = tl;
  };

  const start = () => {
    if (state.gsap && !state.timeline) buildTimeline();
    if (state.step < 0) showScene(0, false);
    if (state.timeline) state.timeline.seek(`scene${Math.max(0, state.step)}`, false);
    $('[data-demo-start]').disabled = true;
    $('[data-demo-replay]').disabled = false;
    if (!state.gsap) { setText('[data-demo-status]', reduceMotion.matches ? 'REDUCED MOTION · USE STEP CONTROLS' : 'STATIC MODE · USE STEP CONTROLS'); return; }
    state.timeline.play(); state.playing = true;
    $('[data-demo-play]').disabled = true; $('[data-demo-pause]').disabled = false;
    setText('[data-demo-status]', `PLAYING · SCENE ${String(Math.max(0, state.step) + 1).padStart(2, '0')}`);
  };
  $('[data-demo-start]').addEventListener('click', start);
  $('[data-demo-play]').addEventListener('click', () => { if (!state.timeline) { start(); return; } state.timeline.play(); state.playing = true; $('[data-demo-play]').disabled = true; $('[data-demo-pause]').disabled = false; setText('[data-demo-status]', 'PLAYING'); });
  $('[data-demo-pause]').addEventListener('click', () => { if (state.timeline) state.timeline.pause(); state.playing = false; $('[data-demo-play]').disabled = !state.gsap; $('[data-demo-pause]').disabled = true; setText('[data-demo-status]', 'PAUSED'); });
  $('[data-demo-previous]').addEventListener('click', () => showScene(Math.max(0, state.step - 1)));
  $('[data-demo-next]').addEventListener('click', () => showScene(Math.min(scenes.length - 1, state.step + 1)));
  $('[data-demo-replay]').addEventListener('click', () => { if (state.timeline) { state.timeline.pause(0); state.timeline.kill(); state.timeline = null; } state.step = -1; state.playing = false; clearVisuals(); setStepCopy(-1); $('[data-demo-start]').disabled = false; $('[data-demo-play]').disabled = true; $('[data-demo-pause]').disabled = true; $('[data-demo-previous]').disabled = true; $('[data-demo-next]').disabled = false; $('[data-demo-replay]').disabled = true; setText('[data-demo-status]', 'READY · MANUAL START'); if (state.gsap) start(); else showScene(0, false); });
  branchButtons.forEach((button) => button.addEventListener('click', () => { setBranch(button.dataset.demoBranch, true); if (state.timeline && state.step >= 0) { if (state.timeline) state.timeline.pause(); buildTimeline(); state.timeline?.seek(`scene${state.step}`, false); completeStep(state.step); state.playing = false; $('[data-demo-play]').disabled = !state.gsap; $('[data-demo-pause]').disabled = true; setText('[data-demo-status]', 'PAUSED · BRANCH CHANGED'); } }));
  clearVisuals(); setStepCopy(-1); setBranch('pass');
  if (!window.gsap || reduceMotion.matches) {
    $('[data-demo-start]').disabled = false;
    $('[data-demo-play]').disabled = true;
    $('[data-demo-pause]').disabled = true;
    $('[data-demo-next]').disabled = false;
    $('[data-demo-previous]').disabled = true;
    $('[data-demo-replay]').disabled = true;
    if (reduceMotion.matches) setText('[data-demo-status]', 'REDUCED MOTION · MANUAL STEPS');
    return;
  }
  $('[data-demo-start]').disabled = false;
  $('[data-demo-play]').disabled = false;
})();
