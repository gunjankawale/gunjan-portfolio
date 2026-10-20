(() => {
  const definitions = {
    api: {
      total: 8,
      logs: ['Scheduled trigger activated', 'Dynamic request prepared', 'Function App API called', 'Three CSV reports generated', 'Reports stored in Blob', 'API status evaluated', 'Selected business path followed', 'PASS email / FAIL status tracked'],
      scenes: [
        { title: 'Schedule starts the workflow', phase: 'TRIGGER · CONFIGURED SCHEDULE', text: 'A configured schedule starts the Azure Logic Apps workflow.', systems: ['schedule', 'logic'], files: [], packet: 'START', log: 0, duration: 5 },
        { title: 'Prepare the dynamic request', phase: 'ORCHESTRATION · DYNAMIC PAYLOAD', text: 'Logic Apps assembles the API request payload dynamically according to the business requirement. The actual schema is not shown.', systems: ['logic'], files: [], packet: 'PAYLOAD', log: 1, duration: 6 },
        { title: 'Call the Function App API', phase: 'API INTEGRATION · REQUEST', text: 'Logic Apps sends the configured payload to the Function App API. The Function App runs its own code; I integrate with the API.', systems: ['logic', 'function'], files: [], packet: 'API', log: 2, duration: 6 },
        { title: 'Function App generates reports', phase: 'PROCESSING · FUNCTION APP', text: 'The Function App executes its report-generation logic and produces three CSV reports.', systems: ['function', 'reports'], files: ['api-report-1', 'api-report-2', 'api-report-3'], packet: 'CSV × 3', log: 3, progress: .72, duration: 6 },
        { title: 'Store reports in Blob', phase: 'FILE STORAGE · AZURE BLOB', text: 'The generated CSV reports are stored in Azure Blob Storage for the subsequent workflow actions.', systems: ['reports', 'storage'], files: ['api-report-1', 'api-report-2', 'api-report-3', 'api-storage-1', 'api-storage-2', 'api-storage-3'], packet: 'CSV', log: 4, progress: 1, duration: 6 },
        { title: 'Evaluate the API response', phase: 'BUSINESS STATUS · PASS / FAIL', text: 'Logic Apps evaluates the status returned by the API. A business FAIL follows configured failure handling and is distinct from an Azure action exception handled by Catch.', systems: ['logic', 'response', 'monitor'], files: [], packet: 'STATUS', log: 5, duration: 7 },
        { title: 'Transfer reports on PASS', phase: 'PASS PATH · FILE DELIVERY', text: 'When the response meets the configured PASS requirements, Logic Apps transfers the generated reports from Blob Storage to the required local destination.', systems: ['storage', 'response', 'destination'], files: ['api-storage-1', 'api-storage-2', 'api-storage-3'], packet: 'REPORTS', log: 6, duration: 6 },
        { title: 'Prepare the customer email', phase: 'PASS PATH · EMAIL & TRACKING', text: 'Logic Apps prepares the customer email with dynamic content for the reporting requirement and records relevant workflow status.', systems: ['email', 'monitor'], files: [], packet: 'EMAIL', log: 7, status: 'Illustrative PASS path', duration: 6 }
      ]
    },
    csv: {
      total: 8,
      logs: ['CSV available in hot folder', 'File trigger activated', 'Input archived', 'SQL stored procedures running', 'TXT output prepared', 'Downstream handoff started', 'Email prepared with attachments', 'Workflow status recorded'],
      scenes: [
        { title: 'CSV arrives upstream', phase: 'INPUT · FILE ARRIVAL', text: 'An upstream process places a CSV in the designated hot folder.', systems: ['upstream'], files: ['csv-input'], packet: 'CSV', log: 0, duration: 5 },
        { title: 'File-arrival trigger starts', phase: 'ORCHESTRATION · TRIGGER', text: 'The configured Azure Logic Apps file trigger starts the new workflow.', systems: ['upstream', 'logic'], files: ['csv-input'], packet: 'CSV', log: 1, duration: 6 },
        { title: 'Archive the input', phase: 'FILE HANDLING · ARCHIVE', text: 'Logic Apps places the input at the archive location designated by the business. This is separate from output delivery.', systems: ['logic', 'archive'], files: ['csv-input', 'csv-archive'], packet: 'CSV', log: 2, duration: 6 },
        { title: 'Apply SQL business rules', phase: 'PROCESSING · STORED PROCEDURES', text: 'The workflow executes SQL stored procedures that apply the required business rules. The rules themselves are not represented here.', systems: ['logic', 'sql'], files: ['csv-input', 'csv-archive'], packet: 'SQL', log: 3, progress: .72, duration: 6 },
        { title: 'Prepare TXT outputs', phase: 'OUTPUT · FILE GENERATION', text: 'The result of processing is represented as generic TXT output files. The file cards are illustrative.', systems: ['sql', 'output'], files: ['csv-input', 'csv-archive', 'txt-a', 'txt-b'], packet: 'TXT', log: 4, progress: 1, duration: 6 },
        { title: 'Deliver downstream', phase: 'OUTPUT · HANDOFF', text: 'Logic Apps delivers the TXT outputs to the business-designated destination for downstream processing.', systems: ['logic', 'output', 'destination'], files: ['csv-archive', 'txt-a', 'txt-b'], packet: 'TXT', log: 5, progress: 1, duration: 5 },
        { title: 'Email output attachments', phase: 'NOTIFICATION · EMAIL', text: 'The workflow prepares an email with dynamic content and the generated TXT files attached.', systems: ['logic', 'email'], files: ['txt-a', 'txt-b'], packet: 'TXT', log: 6, progress: 1, duration: 5 },
        { title: 'Record workflow status', phase: 'OBSERVABILITY · STATUS', text: 'Relevant workflow status is recorded. This view is illustrative and contains no production logs or timestamps.', systems: ['logic', 'status'], files: ['csv-archive', 'txt-a', 'txt-b'], packet: 'STATUS', log: 7, progress: 1, status: 'Completed', duration: 6 }
      ]
    },
    routing: {
      total: 6,
      logs: ['TXT/PDF files available', 'File trigger activated', 'Database configuration read', 'Files routed and archived', 'Success email prepared', 'Workflow status recorded'],
      scenes: [
        { title: 'TXT and PDF files are available', phase: 'RUNTIME · FILE ARRIVAL', text: 'Applicable TXT and PDF files are available in the configured input or hot folder.', systems: ['files'], files: ['txt-input', 'pdf-input'], packet: 'TXT / PDF', log: 0, duration: 5 },
        { title: 'File trigger starts processing', phase: 'RUNTIME · TRIGGER', text: 'The Azure Logic Apps file-arrival trigger initiates processing.', systems: ['files', 'logic'], files: ['txt-input', 'pdf-input'], packet: 'TRIGGER', log: 1, duration: 5 },
        { title: 'Read routing configuration', phase: 'RUNTIME · DATABASE LOOKUP', text: 'Logic Apps reads configured output and archive destinations and email recipients from the SQL database.', systems: ['logic', 'database'], files: ['txt-input', 'pdf-input'], packet: 'CONFIG', log: 2, progress: .8, duration: 6 },
        { title: 'Route and archive files', phase: 'RUNTIME · FILE OPERATIONS', text: 'Logic Apps moves applicable TXT and PDF files to the database-specified output and archive locations.', systems: ['logic', 'routes'], files: ['txt-input', 'pdf-input', 'txt-output', 'pdf-output', 'txt-archive', 'pdf-archive'], packet: 'TXT / PDF', log: 3, progress: 1, duration: 7 },
        { title: 'Prepare the success email', phase: 'RUNTIME · NOTIFICATION', text: 'The success email goes to configured recipients and includes dynamic TXT and PDF counts. Values shown are placeholders.', systems: ['logic', 'email'], files: ['txt-output', 'pdf-output', 'txt-archive', 'pdf-archive'], packet: 'EMAIL', log: 4, progress: 1, duration: 6 },
        { title: 'Record workflow status', phase: 'RUNTIME · OBSERVABILITY', text: 'Relevant workflow status logging completes the runtime overview.', systems: ['logic', 'monitor'], files: ['txt-output', 'pdf-output'], packet: 'STATUS', log: 5, progress: 1, status: 'Completed', duration: 5 }
      ]
    }
  };

  document.querySelectorAll('[data-workflow-sim]').forEach((root) => {
    const kind = root.dataset.workflowSim;
    const config = definitions[kind];
    if (!config) return;
    const $ = (selector) => root.querySelector(selector);
    const $$ = (selector) => [...root.querySelectorAll(selector)];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const state = { step: -1, timeline: null, playing: false, pausedByUser: false, apiBranch: 'pass', gsap: Boolean(window.gsap && !reduced.matches) };
    const logs = $('[data-sim-console]');
    const packet = $('[data-sim-packet]');
    const lane = $('[data-sim-lane]');
    const formatTime = (n) => `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, '0')}`;
    const cumulative = (index) => config.scenes.slice(0, index).reduce((sum, scene) => sum + scene.duration, 0);
    const apiScene = (index) => {
      const scene = config.scenes[index];
      if (kind !== 'api' || index < 6 || state.apiBranch !== 'fail') return scene;
      if (index === 6) return { ...scene, title: 'Follow configured FAIL handling', phase: 'FAIL PATH · BUSINESS STATUS', text: 'The API returned a business FAIL status. Logic Apps records the status and follows configured business handling; this does not automatically enter the shared Catch scope.', systems: ['response', 'monitor'], files: [], packet: 'FAIL' };
      return { ...scene, title: 'Track the business outcome', phase: 'FAIL PATH · STATUS TRACKING', text: 'The failure status is visible for monitoring and investigation. An Azure action exception inside Try follows the separate shared Catch path.', systems: ['monitor'], files: [], packet: 'STATUS', status: 'Illustrative FAIL path' };
    };
    const syncApiBranch = () => {
      if (kind !== 'api') return;
      $$('[data-api-branch]').forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.apiBranch === state.apiBranch));
        button.disabled = state.playing;
      });
      $$('[data-api-branch-target]').forEach((node) => node.classList.toggle('is-branch-preview', node.dataset.apiBranchTarget === state.apiBranch));
      const outline = $('[data-sim-outline]');
      if (outline) [...outline.children].forEach((item, index) => { item.textContent = `${index + 1}. ${apiScene(index).title}`; });
      const copy = $('[data-api-branch-description]');
      if (copy) copy.textContent = state.apiBranch === 'pass'
          ? 'PASS continues to configured file delivery and customer email.'
          : 'FAIL records business status and follows configured handling; an Azure action exception inside Try goes to Catch separately.';
    };
    const revealLog = (index) => {
      [...logs.children].forEach((li, i) => {
        li.classList.toggle('is-complete', i < index);
        li.classList.toggle('is-current', i === index);
        li.querySelector('b').textContent = i < index ? 'DONE' : i === index ? 'ACTIVE' : 'WAITING';
      });
    };
    const resetPackets = () => {
      if (!state.gsap) return;
      window.gsap.set('[data-csv-input-packet], [data-txt-output-packet], [data-txt-delivery-packet], [data-routing-file-packet], [data-routing-archive-packet]', { x: 0, y: 0, opacity: 1 });
      $$('[data-csv-archive-route], [data-csv-output-route], [data-csv-delivery-route], [data-routing-output-route], [data-routing-archive-route]').forEach((route) => route.classList.remove('is-active', 'is-arrived'));
    };

    config.logs.forEach((label) => {
      const li = document.createElement('li');
      const marker = document.createElement('i'); marker.setAttribute('aria-hidden', 'true');
      const text = document.createElement('span'); text.textContent = label;
      const status = document.createElement('b'); status.textContent = 'WAITING';
      li.append(marker, text, status); logs.append(li);
    });
    config.scenes.forEach((scene, index) => {
      const li = document.createElement('li'); li.textContent = `${index + 1}. ${scene.title}`; $('[data-sim-outline]').append(li);
    });
    $('[data-sim-progress-bar]').max = config.scenes.length;

    const resetVisuals = () => {
      $$('[data-sim-system]').forEach((node) => { node.classList.remove('is-active', 'is-complete'); const stateNode = node.querySelector('[data-sim-state]'); if (stateNode) stateNode.textContent = 'READY'; });
      $$('[data-sim-file]').forEach((file) => file.classList.remove('is-visible', 'is-moving', 'is-arrived'));
      $('[data-sim-progress-bar]').value = Math.max(0, state.step + 1);
      const bar = $('[data-sim-work-progress]'); if (bar) bar.style.transform = 'scaleX(0)';
      if (state.gsap) window.gsap.set(packet, { x: 0, y: 0 });
      resetPackets();
      lane.classList.remove('is-active');
      $('[data-sim-final-status]').textContent = 'Awaiting run';
    };
    const renderScene = (index, duringPlayback = false) => {
      const scene = apiScene(index);
      state.step = index;
      resetVisuals();
      const activeKeys = new Set(scene.systems);
      $$('[data-sim-system]').forEach((node) => {
        const key = node.dataset.simSystem;
        if (activeKeys.has(key)) { node.classList.add('is-active'); node.querySelector('[data-sim-state]').textContent = 'ACTIVE'; }
        else if (config.scenes.slice(0, index).some((_, previousIndex) => apiScene(previousIndex).systems.includes(key))) { node.classList.add('is-complete'); node.querySelector('[data-sim-state]').textContent = 'DONE'; }
      });
      const visible = new Set(scene.files || []);
      $$('[data-sim-file]').forEach((file) => file.classList.toggle('is-visible', visible.has(file.dataset.simFile)));
      packet.textContent = scene.packet || 'DATA';
      $('[data-sim-lane-label]').textContent = scene.packet ? `SIMULATED HANDOFF · ${scene.packet}` : 'ILLUSTRATIVE WORKFLOW STAGE';
      lane.classList.toggle('is-active', Boolean(scene.packet));
      if (scene.progress && !duringPlayback) { const bar = $('[data-sim-work-progress]'); if (bar) bar.style.transform = `scaleX(${scene.progress})`; }
      if (scene.status) $('[data-sim-final-status]').textContent = scene.status;
      if (!duringPlayback) {
        if (kind === 'csv' && index >= 2) $('[data-csv-archive-route]').classList.add('is-arrived');
        if (kind === 'csv' && index >= 4) $('[data-csv-output-route]').classList.add('is-arrived');
        if (kind === 'csv' && index >= 5) $('[data-csv-delivery-route]').classList.add('is-arrived');
        if (kind === 'routing' && index >= 6) { $('[data-routing-output-route]').classList.add('is-arrived'); $('[data-routing-archive-route]').classList.add('is-arrived'); }
      }
      const activeLog = scene.log;
      [...logs.children].forEach((li, i) => {
        li.classList.toggle('is-complete', i < activeLog);
        li.classList.toggle('is-current', i === activeLog);
        li.querySelector('b').textContent = i < activeLog || (index === config.scenes.length - 1 && i === activeLog) ? 'DONE' : i === activeLog ? 'ACTIVE' : 'WAITING';
      });
      $('[data-sim-phase]').textContent = scene.phase || 'SIMULATED STEP';
      $('[data-sim-title]').textContent = scene.title;
      $('[data-sim-description]').textContent = scene.text;
      $('[data-sim-step]').textContent = `Step ${index + 1} of ${config.scenes.length}`;
      $('[data-sim-clock]').textContent = `${formatTime(cumulative(index))} / ${formatTime(cumulative(config.scenes.length))}`;
      const progress = $('[data-sim-progress-bar]'); progress.value = index + 1;
      $('[data-sim-previous]').disabled = index === 0;
      $('[data-sim-next]').disabled = index === config.scenes.length - 1;
      $('[data-sim-play]').disabled = !state.gsap;
      $('[data-sim-pause]').disabled = true;
      $('[data-sim-start]').disabled = index > 0;
      $('[data-sim-replay]').disabled = false;
      $('[data-sim-status]').textContent = state.gsap ? `PAUSED · ${scene.phase}` : `MANUAL VIEW · ${scene.phase}`;
      $$('[data-sim-jump]').forEach((button) => {
        const start = Number(button.dataset.simJump);
        const end = button.dataset.simJumpEnd === undefined ? start : Number(button.dataset.simJumpEnd);
        button.setAttribute('aria-pressed', String(index >= start && index <= end));
      });
      syncApiBranch();
    };
    const buildTimeline = () => {
      state.timeline?.kill();
      const total = cumulative(config.scenes.length);
      const tl = window.gsap.timeline({ paused: true,
        onUpdate: () => { const progress = $('[data-sim-progress-bar]'); progress.value = Math.min(config.scenes.length, (tl.time() / total) * config.scenes.length); $('[data-sim-clock]').textContent = `${formatTime(tl.time())} / ${formatTime(total)}`; },
        onComplete: () => { state.playing = false; $('[data-sim-play]').disabled = false; $('[data-sim-pause]').disabled = true; $('[data-sim-next]').disabled = true; $('[data-sim-status]').textContent = 'COMPLETE · ILLUSTRATIVE RUN'; syncApiBranch(); }
      });
      let position = 0;
      config.scenes.forEach((baseScene, index) => {
        const scene = apiScene(index);
        tl.addLabel(`scene${index}`, position).call(() => renderScene(index, true), [], position);
        tl.call(() => revealLog(scene.log), [], position + .22);
        const nodes = scene.systems.map((key) => $(`[data-sim-system="${key}"]`)).filter(Boolean);
        if (nodes.length) tl.fromTo(nodes, { y: 5, opacity: .84 }, { y: 0, opacity: 1, duration: .4, stagger: .07, ease: 'power2.out' }, position + .1);
        const mobile = window.matchMedia('(max-width: 680px)').matches;
        const distance = mobile ? Math.max(65, lane.clientHeight - 34) : Math.max(100, lane.clientWidth - 40);
        if (scene.packet) tl.fromTo(packet, mobile ? { y: -8, x: 0 } : { x: -8, y: 0 }, mobile ? { y: distance, x: 0 } : { x: distance, y: 0 }, { duration: Math.min(1.3, scene.duration * .28), ease: 'power2.inOut', onStart: () => packet.classList.add('is-moving'), onComplete: () => packet.classList.add('is-arrived') }, position + .35);
        if (scene.progress) tl.to('[data-sim-work-progress]', { scaleX: scene.progress, duration: Math.min(1.5, scene.duration * .3), ease: 'power1.inOut' }, position + .55);
        if (kind === 'api' && index === 1) tl.fromTo('[data-api-payload-field]', { opacity: .3, y: 5 }, { opacity: 1, y: 0, duration: .32, stagger: .14, ease: 'power2.out' }, position + .4);
        if (kind === 'api' && index === 3) tl.fromTo('[data-sim-file="api-report-1"], [data-sim-file="api-report-2"], [data-sim-file="api-report-3"]', { opacity: .45, y: 6, scale: .96 }, { opacity: 1, y: 0, scale: 1, duration: .35, stagger: .16, ease: 'power2.out' }, position + .5);
        if (kind === 'api' && index === 4) tl.fromTo('[data-sim-file="api-storage-1"], [data-sim-file="api-storage-2"], [data-sim-file="api-storage-3"]', { opacity: .45, y: 6, scale: .96 }, { opacity: 1, y: 0, scale: 1, duration: .35, stagger: .16, ease: 'power2.out' }, position + .5);
        if (kind === 'csv' && index === 2) tl.to('[data-csv-input-packet]', { x: 52, duration: .75, ease: 'power2.inOut', onStart: () => $('[data-csv-archive-route]').classList.add('is-active'), onComplete: () => $('[data-csv-archive-route]').classList.add('is-arrived') }, position + .55);
        if (kind === 'csv' && index === 4) tl.fromTo('[data-txt-output-packet]', { x: -44 }, { x: 48, duration: .8, stagger: .16, ease: 'power2.inOut', onStart: () => $('[data-csv-output-route]').classList.add('is-active'), onComplete: () => $('[data-csv-output-route]').classList.add('is-arrived') }, position + .45);
        if (kind === 'csv' && index === 5) tl.fromTo('[data-txt-delivery-packet]', { x: -46 }, { x: 48, duration: .9, stagger: .18, ease: 'power2.inOut', onStart: () => $('[data-csv-delivery-route]').classList.add('is-active'), onComplete: () => $('[data-csv-delivery-route]').classList.add('is-arrived') }, position + .45);
        if (kind === 'csv' && index === 6) tl.fromTo('[data-email-attachment]', { opacity: .5, y: 4 }, { opacity: 1, y: 0, stagger: .15, duration: .32, ease: 'power2.out' }, position + .45);
        if (kind === 'routing' && index === 6) {
          tl.fromTo('[data-routing-file-packet]', { x: -44 }, { x: 48, duration: .9, stagger: .18, ease: 'power2.inOut', onStart: () => $('[data-routing-output-route]').classList.add('is-active'), onComplete: () => $('[data-routing-output-route]').classList.add('is-arrived') }, position + .45);
          tl.fromTo('[data-routing-archive-packet]', { x: -44 }, { x: 48, duration: .9, stagger: .18, ease: 'power2.inOut', onStart: () => $('[data-routing-archive-route]').classList.add('is-active'), onComplete: () => $('[data-routing-archive-route]').classList.add('is-arrived') }, position + 1.5);
        }
        if (kind === 'routing' && index === 7) tl.fromTo('[data-routing-email-preview]', { opacity: .55, y: 5 }, { opacity: 1, y: 0, duration: .4, ease: 'power2.out' }, position + .5);
        position += scene.duration;
      });
      tl.addLabel('end', position);
      state.timeline = tl;
    };
    const goTo = (index) => {
      const target = Math.max(0, Math.min(config.scenes.length - 1, index));
      state.timeline?.pause(); state.playing = false;
      if (state.timeline) state.timeline.seek(`scene${target}`, true);
      state.pausedByUser = false;
      renderScene(target);
    };
    const play = (index = state.step < 0 ? 0 : state.step) => {
      if (!state.gsap) return;
      if (!state.timeline) buildTimeline();
      const target = Math.max(0, Math.min(config.scenes.length - 1, index));
      if (state.pausedByUser && target === state.step) {
        state.timeline.play(); state.playing = true; state.pausedByUser = false;
        $('[data-sim-play]').disabled = true; $('[data-sim-pause]').disabled = false;
        $('[data-sim-status]').textContent = `PLAYING · ${apiScene(target).phase}`;
        return;
      }
      state.timeline.seek(`scene${target}`, true); renderScene(target);
      state.pausedByUser = false;
      state.playing = true; state.timeline.play();
      $('[data-sim-play]').disabled = true; $('[data-sim-pause]').disabled = false;
      $('[data-sim-start]').disabled = true; $('[data-sim-replay]').disabled = false;
      $('[data-sim-status]').textContent = `PLAYING · ${apiScene(target).phase}`;
    };
    $('[data-sim-start]').addEventListener('click', () => play(0));
    $('[data-sim-play]').addEventListener('click', () => play(state.step < 0 ? 0 : state.step));
    $('[data-sim-pause]').addEventListener('click', () => { state.timeline?.pause(); state.playing = false; state.pausedByUser = true; $('[data-sim-play]').disabled = !state.gsap; $('[data-sim-pause]').disabled = true; $('[data-sim-status]').textContent = 'PAUSED'; syncApiBranch(); });
    $('[data-sim-previous]').addEventListener('click', () => goTo(state.step - 1));
    $('[data-sim-next]').addEventListener('click', () => goTo(state.step + 1));
    $$('[data-sim-jump]').forEach((button) => button.addEventListener('click', () => goTo(Number(button.dataset.simJump))));
    $('[data-sim-replay]').addEventListener('click', () => { state.timeline?.kill(); state.timeline = null; state.step = -1; state.pausedByUser = false; goTo(0); if (state.gsap) play(0); });
    $$('[data-api-branch]').forEach((button) => button.addEventListener('click', () => {
      if (state.playing) { state.timeline?.pause(); state.playing = false; $('[data-sim-play]').disabled = !state.gsap; $('[data-sim-pause]').disabled = true; }
      state.apiBranch = button.dataset.apiBranch;
      state.timeline?.kill(); state.timeline = null; state.pausedByUser = false;
      syncApiBranch();
      if (state.step >= 5) renderScene(state.step);
    }));
    resetVisuals();
    config.logs.forEach((_, index) => { logs.children[index].querySelector('b').textContent = 'WAITING'; });
    $('[data-sim-start]').disabled = false; $('[data-sim-next]').disabled = false; $('[data-sim-previous]').disabled = true;
    $('[data-sim-play]').disabled = !state.gsap; $('[data-sim-replay]').disabled = true;
    syncApiBranch();
    if (!state.gsap) $('[data-sim-status]').textContent = reduced.matches ? 'REDUCED MOTION · MANUAL STEPS' : 'STATIC MODE · MANUAL STEPS';
    const outline = $('[data-sim-outline]'); outline.closest('details').addEventListener('toggle', () => { if (outline.closest('details').open) outline.focus?.(); });
  });
})();
