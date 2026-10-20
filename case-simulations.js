(() => {
  const definitions = {
    api: {
      total: 8,
      logs: [
        'Scheduled trigger activated',
        'Dynamic request payload assembled',
        'Function App API called',
        'CSV reports generated',
        'Reports stored in Blob Storage',
        'API business status evaluated',
        'Selected business path followed',
        'PASS email sent / FAIL status tracked'
      ],
      scenes: [
        {
          title: 'Schedule starts the workflow',
          phase: 'TRIGGER · CONFIGURED SCHEDULE',
          text: 'A configured schedule starts the Azure Logic Apps workflow run.',
          systems: ['schedule', 'logic'],
          files: [],
          packet: 'START',
          log: 0,
          duration: 2.6
        },
        {
          title: 'Prepare the dynamic request',
          phase: 'ORCHESTRATION · DYNAMIC PAYLOAD',
          text: 'Logic Apps assembles the API request payload dynamically according to the business requirement. The actual schema is confidential and generic placeholders are shown.',
          systems: ['logic'],
          files: [],
          packet: 'PAYLOAD',
          log: 1,
          duration: 2.8
        },
        {
          title: 'Call the Function App API',
          phase: 'API INTEGRATION · HTTP POST',
          text: 'Logic Apps sends the configured payload to the Function App API. The Function App executes its own underlying code; Logic Apps orchestrates the call.',
          systems: ['logic', 'function'],
          files: [],
          packet: 'API',
          log: 2,
          duration: 2.6
        },
        {
          title: 'Function App generates reports',
          phase: 'PROCESSING · FUNCTION APP',
          text: 'The Function App executes its report-generation logic and outputs CSV report files.',
          systems: ['function', 'reports'],
          files: ['api-report-1', 'api-report-2'],
          packet: 'CSV',
          log: 3,
          progress: .75,
          duration: 2.8
        },
        {
          title: 'Store reports in Blob Storage',
          phase: 'FILE STORAGE · AZURE BLOB',
          text: 'The generated CSV reports are staged in Azure Blob Storage containers for subsequent workflow actions.',
          systems: ['reports', 'storage'],
          files: ['api-report-1', 'api-report-2', 'api-storage-1', 'api-storage-2'],
          packet: 'BLOB',
          log: 4,
          progress: 1,
          duration: 2.6
        },
        {
          title: 'Evaluate the API response',
          phase: 'BUSINESS STATUS · PASS / FAIL',
          text: 'Logic Apps evaluates the business status returned in the API response. A business FAIL follows configured failure handling and remains distinct from an unhandled Azure action exception.',
          systems: ['logic', 'response', 'monitor'],
          files: [],
          packet: 'STATUS',
          log: 5,
          duration: 3.0
        },
        {
          title: 'Transfer reports on PASS',
          phase: 'PASS PATH · FILE DELIVERY',
          text: 'When the response meets configured PASS requirements, Logic Apps transfers the generated reports from Blob Storage to the required destination.',
          systems: ['storage', 'response', 'destination'],
          files: ['api-storage-1', 'api-storage-2'],
          packet: 'REPORTS',
          log: 6,
          duration: 2.8
        },
        {
          title: 'Prepare customer email',
          phase: 'PASS PATH · EMAIL NOTIFICATION',
          text: 'Logic Apps prepares the customer email notification with dynamic content for the reporting requirement and logs run completion.',
          systems: ['email', 'monitor'],
          files: [],
          packet: 'EMAIL',
          log: 7,
          status: 'Completed · PASS path',
          duration: 2.8
        }
      ]
    },
    csv: {
      total: 8,
      logs: [
        'CSV available in hot folder',
        'File trigger activated',
        'Input archived',
        'SQL stored procedures running',
        'TXT output prepared',
        'Downstream handoff started',
        'Email prepared with attachments',
        'Workflow status recorded'
      ],
      scenes: [
        {
          title: 'CSV arrives upstream',
          phase: 'INPUT · FILE ARRIVAL',
          text: 'An upstream process places a CSV file in the designated input hot folder.',
          systems: ['upstream'],
          files: ['csv-input'],
          packet: 'CSV',
          log: 0,
          duration: 2.5
        },
        {
          title: 'File-arrival trigger starts',
          phase: 'ORCHESTRATION · TRIGGER',
          text: 'The configured Azure Logic Apps file-arrival trigger starts the newly developed workflow.',
          systems: ['upstream', 'logic'],
          files: ['csv-input'],
          packet: 'TRIGGER',
          log: 1,
          duration: 2.6
        },
        {
          title: 'Archive the input',
          phase: 'FILE HANDLING · ARCHIVE',
          text: 'Logic Apps moves the input CSV to the archive location designated by the business. This is strictly separate from output delivery.',
          systems: ['logic', 'archive'],
          files: ['csv-input', 'csv-archive'],
          packet: 'ARCHIVE',
          log: 2,
          duration: 2.6
        },
        {
          title: 'Apply SQL business rules',
          phase: 'PROCESSING · STORED PROCEDURES',
          text: 'The workflow executes SQL stored procedures that apply required business rules and validate the dataset.',
          systems: ['logic', 'sql'],
          files: ['csv-input', 'csv-archive'],
          packet: 'SQL',
          log: 3,
          progress: .75,
          duration: 2.8
        },
        {
          title: 'Prepare TXT outputs',
          phase: 'OUTPUT · FILE GENERATION',
          text: 'The outcome of processing produces generic TXT output files ready for downstream systems.',
          systems: ['sql', 'output'],
          files: ['csv-input', 'csv-archive', 'txt-a', 'txt-b'],
          packet: 'TXT',
          log: 4,
          progress: 1,
          duration: 2.6
        },
        {
          title: 'Deliver downstream',
          phase: 'OUTPUT · HANDOFF',
          text: 'Logic Apps delivers the TXT outputs to the business-designated destination for subsequent downstream processing.',
          systems: ['logic', 'output', 'destination'],
          files: ['csv-archive', 'txt-a', 'txt-b'],
          packet: 'DELIVER',
          log: 5,
          progress: 1,
          duration: 2.6
        },
        {
          title: 'Email output attachments',
          phase: 'NOTIFICATION · EMAIL',
          text: 'The workflow prepares an email with dynamic summary content and the generated TXT files attached.',
          systems: ['logic', 'email'],
          files: ['txt-a', 'txt-b'],
          packet: 'EMAIL',
          log: 6,
          duration: 2.6
        },
        {
          title: 'Record workflow status',
          phase: 'OBSERVABILITY · STATUS',
          text: 'Workflow execution status is recorded in telemetry. This view is illustrative and contains no production timestamps.',
          systems: ['logic', 'status'],
          files: ['csv-archive', 'txt-a', 'txt-b'],
          packet: 'DONE',
          log: 7,
          progress: 1,
          status: 'Completed · Run successful',
          duration: 2.6
        }
      ]
    },
    routing: {
      total: 6,
      logs: [
        'TXT and PDF files available',
        'File trigger activated',
        'Database configuration read',
        'Files routed and archived',
        'Success email prepared',
        'Workflow status recorded'
      ],
      scenes: [
        {
          title: 'TXT and PDF files arrive',
          phase: 'RUNTIME · FILE ARRIVAL',
          text: 'Applicable TXT and PDF files are placed in the configured input hot folder.',
          systems: ['files'],
          files: ['txt-input', 'pdf-input'],
          packet: 'FILES',
          log: 0,
          duration: 2.5
        },
        {
          title: 'File trigger starts processing',
          phase: 'RUNTIME · TRIGGER',
          text: 'The Azure Logic Apps file-arrival trigger initiates the migrated workflow execution.',
          systems: ['files', 'logic'],
          files: ['txt-input', 'pdf-input'],
          packet: 'TRIGGER',
          log: 1,
          duration: 2.5
        },
        {
          title: 'Read routing configuration',
          phase: 'RUNTIME · DATABASE LOOKUP',
          text: 'Logic Apps queries the SQL database to obtain dynamic routing paths, archive destinations, and email recipients.',
          systems: ['logic', 'database'],
          files: ['txt-input', 'pdf-input'],
          packet: 'LOOKUP',
          log: 2,
          progress: .8,
          duration: 2.8
        },
        {
          title: 'Route and archive files',
          phase: 'RUNTIME · FILE OPERATIONS',
          text: 'Logic Apps moves applicable TXT and PDF files to database-configured output destinations and separate archive folders.',
          systems: ['logic', 'routes', 'archive'],
          files: ['txt-input', 'pdf-input', 'txt-output', 'pdf-output', 'txt-archive', 'pdf-archive'],
          packet: 'ROUTING',
          log: 3,
          progress: 1,
          duration: 3.2
        },
        {
          title: 'Prepare success email',
          phase: 'RUNTIME · NOTIFICATION',
          text: 'A success email is assembled with dynamically populated counts by format (TXT and PDF) and sent to database-sourced recipients.',
          systems: ['logic', 'email'],
          files: ['txt-output', 'pdf-output', 'txt-archive', 'pdf-archive'],
          packet: 'EMAIL',
          log: 4,
          progress: 1,
          duration: 2.8
        },
        {
          title: 'Record workflow status',
          phase: 'RUNTIME · OBSERVABILITY',
          text: 'Workflow execution status is logged in the monitoring system, completing the runtime delivery cycle.',
          systems: ['logic', 'monitor'],
          files: ['txt-output', 'pdf-output'],
          packet: 'STATUS',
          log: 5,
          progress: 1,
          status: 'Completed · Files delivered',
          duration: 2.5
        }
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

    const state = {
      step: -1,
      timeline: null,
      playing: false,
      pausedByUser: false,
      apiBranch: 'pass',
      gsap: Boolean(window.gsap && !reduced.matches)
    };

    const logs = $('[data-sim-console]');
    const packet = $('[data-sim-packet]');
    const lane = $('[data-sim-lane]');

    const formatTime = (n) => `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, '0')}`;
    const cumulative = (index) => config.scenes.slice(0, index).reduce((sum, scene) => sum + scene.duration, 0);

    const apiScene = (index) => {
      const scene = config.scenes[index];
      if (kind !== 'api' || index < 6 || state.apiBranch !== 'fail') return scene;
      if (index === 6) {
        return {
          ...scene,
          title: 'Follow configured FAIL handling',
          phase: 'FAIL PATH · BUSINESS STATUS',
          text: 'The API returned a business FAIL status. Logic Apps records the status and executes configured business failure handling; this does not automatically invoke Azure action-exception Catch handling.',
          systems: ['response', 'monitor'],
          files: [],
          packet: 'FAIL',
          log: 6
        };
      }
      return {
        ...scene,
        title: 'Track business outcome in dashboard',
        phase: 'FAIL PATH · STATUS TRACKING',
        text: 'The failure record is visible in the monitoring dashboard for investigation. An Azure action exception inside Try follows the separate shared Catch path.',
        systems: ['monitor'],
        files: [],
        packet: 'LOGGED',
        status: 'Business FAIL tracked · Logged',
        log: 7
      };
    };

    const syncApiBranch = () => {
      if (kind !== 'api') return;
      $$('[data-api-branch]').forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.apiBranch === state.apiBranch));
        button.disabled = state.playing;
      });
      $$('[data-api-branch-target]').forEach((node) => {
        const isTarget = node.dataset.apiBranchTarget === state.apiBranch;
        node.classList.toggle('is-branch-preview', isTarget);
        if (state.apiBranch === 'fail' && node.dataset.apiBranchTarget === 'pass') {
          node.classList.add('is-branch-bypassed');
          node.hidden = true;
        } else if (state.apiBranch === 'pass' && node.dataset.apiBranchTarget === 'fail') {
          node.classList.add('is-branch-bypassed');
          node.hidden = true;
        } else {
          node.classList.remove('is-branch-bypassed');
          node.hidden = false;
        }
      });

      // Update is-last-visible marker on cards
      const visibleNodes = root.querySelectorAll('.sim-flow-grid .sim-node:not([hidden])');
      root.querySelectorAll('.sim-flow-grid .sim-node').forEach((n) => n.classList.remove('is-last-visible'));
      if (visibleNodes.length) visibleNodes[visibleNodes.length - 1].classList.add('is-last-visible');

      const outline = $('[data-sim-outline]');
      if (outline) {
        [...outline.children].forEach((item, index) => {
          item.textContent = `${index + 1}. ${apiScene(index).title}`;
        });
      }
      const copy = $('[data-api-branch-description]');
      if (copy) {
        copy.textContent = state.apiBranch === 'pass'
          ? 'PASS path: Transfers generated CSV reports to destination and prepares customer email.'
          : 'FAIL path: Logs business status to monitoring dashboard and follows configured handling; unhandled Azure action exceptions route to Catch separately.';
      }
    };

    const revealLog = (index) => {
      [...logs.children].forEach((li, i) => {
        const isCurrent = i === index;
        const isPast = i < index;
        li.classList.toggle('is-complete', isPast);
        li.classList.toggle('is-current', isCurrent);
        const b = li.querySelector('b');

        if (kind === 'api' && state.apiBranch === 'fail' && (i === 6 || i === 7)) {
          if (isCurrent) {
            b.textContent = 'FAIL';
            li.classList.add('is-failed');
          } else if (isPast) {
            b.textContent = 'LOGGED';
            li.classList.add('is-failed');
          } else {
            b.textContent = 'WAITING';
            li.classList.remove('is-failed');
          }
        } else {
          li.classList.remove('is-failed');
          b.textContent = isPast ? 'DONE' : isCurrent ? 'ACTIVE' : 'WAITING';
        }
      });
    };

    const resetPackets = () => {
      if (!state.gsap) return;
      window.gsap.set('[data-csv-input-packet], [data-txt-output-packet], [data-txt-delivery-packet], [data-routing-file-packet], [data-routing-archive-packet]', { x: 0, y: 0, opacity: 1 });
      $$('[data-csv-archive-route], [data-csv-output-route], [data-csv-delivery-route], [data-routing-output-route], [data-routing-archive-route]').forEach((route) => {
        route.classList.remove('is-active', 'is-arrived');
      });
    };

    // Populate Console Logs
    config.logs.forEach((label) => {
      const li = document.createElement('li');
      const marker = document.createElement('i');
      marker.setAttribute('aria-hidden', 'true');
      const text = document.createElement('span');
      text.textContent = label;
      const status = document.createElement('b');
      status.textContent = 'WAITING';
      li.append(marker, text, status);
      logs.append(li);
    });

    // Populate Walkthrough Outline
    config.scenes.forEach((scene, index) => {
      const li = document.createElement('li');
      li.textContent = `${index + 1}. ${scene.title}`;
      const out = $('[data-sim-outline]');
      if (out) out.append(li);
    });

    const pBar = $('[data-sim-progress-bar]');
    if (pBar) pBar.max = config.scenes.length;

    const resetVisuals = () => {
      $$('[data-sim-system]').forEach((node) => {
        node.classList.remove('is-active', 'is-complete');
        const stateNode = node.querySelector('[data-sim-state]');
        if (stateNode) stateNode.textContent = 'READY';
      });
      $$('[data-sim-file]').forEach((file) => file.classList.remove('is-visible', 'is-moving', 'is-arrived'));
      const prog = $('[data-sim-progress-bar]');
      if (prog) prog.value = Math.max(0, state.step + 1);
      const bar = $('[data-sim-work-progress]');
      if (bar) bar.style.transform = 'scaleX(0)';
      if (state.gsap) window.gsap.set(packet, { x: 0, y: 0 });
      resetPackets();
      lane.classList.remove('is-active');
      const finalStatus = $('[data-sim-final-status]');
      if (finalStatus) finalStatus.textContent = 'Awaiting run';
    };

    const renderScene = (index, duringPlayback = false) => {
      const scene = apiScene(index);
      state.step = index;
      resetVisuals();

      const activeKeys = new Set(scene.systems);
      $$('[data-sim-system]').forEach((node) => {
        const key = node.dataset.simSystem;
        if (activeKeys.has(key)) {
          node.classList.add('is-active');
          const st = node.querySelector('[data-sim-state]');
          if (st) st.textContent = 'ACTIVE';
        } else if (config.scenes.slice(0, index).some((_, prevIdx) => apiScene(prevIdx).systems.includes(key))) {
          node.classList.add('is-complete');
          const st = node.querySelector('[data-sim-state]');
          if (st) st.textContent = 'DONE';
        }
      });

      const visible = new Set(scene.files || []);
      $$('[data-sim-file]').forEach((file) => file.classList.toggle('is-visible', visible.has(file.dataset.simFile)));

      packet.textContent = scene.packet || 'DATA';
      $('[data-sim-lane-label]').textContent = scene.packet ? `SIMULATED HANDOFF · ${scene.packet}` : 'ILLUSTRATIVE WORKFLOW STAGE';
      lane.classList.toggle('is-active', Boolean(scene.packet));

      if (scene.progress && !duringPlayback) {
        const bar = $('[data-sim-work-progress]');
        if (bar) bar.style.transform = `scaleX(${scene.progress})`;
      }
      if (scene.status) {
        const finalStatus = $('[data-sim-final-status]');
        if (finalStatus) finalStatus.textContent = scene.status;
      }

      if (!duringPlayback) {
        if (kind === 'csv' && index >= 2) { const r = $('[data-csv-archive-route]'); if (r) r.classList.add('is-arrived'); }
        if (kind === 'csv' && index >= 4) { const r = $('[data-csv-output-route]'); if (r) r.classList.add('is-arrived'); }
        if (kind === 'csv' && index >= 5) { const r = $('[data-csv-delivery-route]'); if (r) r.classList.add('is-arrived'); }
        if (kind === 'routing' && index >= 3) {
          const out = $('[data-routing-output-route]'); if (out) out.classList.add('is-arrived');
          const arch = $('[data-routing-archive-route]'); if (arch) arch.classList.add('is-arrived');
        }
      }

      revealLog(scene.log);

      const phase = $('[data-sim-phase]');
      if (phase) phase.textContent = scene.phase || 'SIMULATED STEP';
      const title = $('[data-sim-title]');
      if (title) title.textContent = scene.title;
      const desc = $('[data-sim-description]');
      if (desc) desc.textContent = scene.text;
      const stepLabel = $('[data-sim-step]');
      if (stepLabel) stepLabel.textContent = `Step ${index + 1} of ${config.scenes.length}`;
      const clockLabel = $('[data-sim-clock]');
      if (clockLabel) clockLabel.textContent = `${formatTime(cumulative(index))} / ${formatTime(cumulative(config.scenes.length))}`;

      const progress = $('[data-sim-progress-bar]');
      if (progress) progress.value = index + 1;

      const pBtn = $('[data-sim-previous]');
      if (pBtn) pBtn.disabled = index === 0;
      const nBtn = $('[data-sim-next]');
      if (nBtn) nBtn.disabled = index === config.scenes.length - 1;
      const plBtn = $('[data-sim-play]');
      if (plBtn) plBtn.disabled = !state.gsap;
      const paBtn = $('[data-sim-pause]');
      if (paBtn) paBtn.disabled = true;
      const stBtn = $('[data-sim-start]');
      if (stBtn) stBtn.disabled = index > 0;
      const reBtn = $('[data-sim-replay]');
      if (reBtn) reBtn.disabled = false;
      const statLabel = $('[data-sim-status]');
      if (statLabel) statLabel.textContent = state.gsap ? `PAUSED · ${scene.phase}` : `MANUAL VIEW · ${scene.phase}`;

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
      const tl = window.gsap.timeline({
        paused: true,
        onUpdate: () => {
          const progress = $('[data-sim-progress-bar]');
          if (progress) progress.value = Math.min(config.scenes.length, (tl.time() / total) * config.scenes.length);
          const clk = $('[data-sim-clock]');
          if (clk) clk.textContent = `${formatTime(tl.time())} / ${formatTime(total)}`;
        },
        onComplete: () => {
          state.playing = false;
          const plBtn = $('[data-sim-play]');
          if (plBtn) plBtn.disabled = false;
          const paBtn = $('[data-sim-pause]');
          if (paBtn) paBtn.disabled = true;
          const nxBtn = $('[data-sim-next]');
          if (nxBtn) nxBtn.disabled = true;
          const stat = $('[data-sim-status]');
          if (stat) stat.textContent = 'COMPLETE · ILLUSTRATIVE RUN';
          const runBtn = root.querySelector('[data-sim-run]');
          if (runBtn) {
            runBtn.classList.remove('is-running');
            runBtn.querySelector('span').textContent = 'Run';
          }
          const designerStatus = root.querySelector('[data-designer-status]');
          if (designerStatus) designerStatus.innerHTML = '<span class="tool-dot tool-dot-run"></span> Succeeded';
          syncApiBranch();
        }
      });

      let position = 0;
      config.scenes.forEach((baseScene, index) => {
        const scene = apiScene(index);
        tl.addLabel(`scene${index}`, position).call(() => renderScene(index, true), [], position);
        tl.call(() => revealLog(scene.log), [], position + .08);

        const nodes = scene.systems.map((key) => $(`[data-sim-system="${key}"]`)).filter(Boolean);
        if (nodes.length) {
          tl.fromTo(nodes, { y: 4, opacity: .86 }, { y: 0, opacity: 1, duration: .3, stagger: .05, ease: 'power2.out' }, position + .05);
        }

        const mobile = window.matchMedia('(max-width: 680px)').matches;
        const distance = mobile ? Math.max(65, lane.clientHeight - 32) : Math.max(100, lane.clientWidth - 38);

        if (scene.packet) {
          tl.fromTo(
            packet,
            mobile ? { y: -8, x: 0 } : { x: -8, y: 0 },
            mobile ? { y: distance, x: 0 } : { x: distance, y: 0 },
            {
              duration: Math.min(0.85, scene.duration * .32),
              ease: 'power2.inOut',
              onStart: () => packet.classList.add('is-moving'),
              onComplete: () => packet.classList.add('is-arrived')
            },
            position + .18
          );
        }

        if (scene.progress) {
          tl.to('[data-sim-work-progress]', { scaleX: scene.progress, duration: Math.min(1.0, scene.duration * .35), ease: 'power1.inOut' }, position + .3);
        }

        // Staggered payload assembly animation in API case study
        if (kind === 'api' && index === 1) {
          tl.fromTo('[data-api-payload-field]', { opacity: .2, y: 4 }, { opacity: 1, y: 0, duration: .25, stagger: .08, ease: 'power2.out' }, position + .25);
        }

        // CSV report cards reveal in API case study
        if (kind === 'api' && index === 3) {
          tl.fromTo('[data-sim-file="api-report-1"], [data-sim-file="api-report-2"]', { opacity: .35, y: 5, scale: .96 }, { opacity: 1, y: 0, scale: 1, duration: .3, stagger: .1, ease: 'power2.out' }, position + .3);
        }
        if (kind === 'api' && index === 4) {
          tl.fromTo('[data-sim-file="api-storage-1"], [data-sim-file="api-storage-2"]', { opacity: .35, y: 5, scale: .96 }, { opacity: 1, y: 0, scale: 1, duration: .3, stagger: .1, ease: 'power2.out' }, position + .3);
        }

        // Packet & route animations in CSV case study
        if (kind === 'csv' && index === 2) {
          tl.to('[data-csv-input-packet]', {
            x: 52,
            duration: .6,
            ease: 'power2.inOut',
            onStart: () => { const r = $('[data-csv-archive-route]'); if (r) r.classList.add('is-active'); },
            onComplete: () => { const r = $('[data-csv-archive-route]'); if (r) r.classList.add('is-arrived'); }
          }, position + .35);
        }
        if (kind === 'csv' && index === 4) {
          tl.fromTo('[data-txt-output-packet]', { x: -36 }, {
            x: 42,
            duration: .65,
            stagger: .12,
            ease: 'power2.inOut',
            onStart: () => { const r = $('[data-csv-output-route]'); if (r) r.classList.add('is-active'); },
            onComplete: () => { const r = $('[data-csv-output-route]'); if (r) r.classList.add('is-arrived'); }
          }, position + .3);
        }
        if (kind === 'csv' && index === 5) {
          tl.fromTo('[data-txt-delivery-packet]', { x: -36 }, {
            x: 42,
            duration: .7,
            stagger: .14,
            ease: 'power2.inOut',
            onStart: () => { const r = $('[data-csv-delivery-route]'); if (r) r.classList.add('is-active'); },
            onComplete: () => { const r = $('[data-csv-delivery-route]'); if (r) r.classList.add('is-arrived'); }
          }, position + .3);
        }
        if (kind === 'csv' && index === 6) {
          tl.fromTo('[data-email-attachment]', { opacity: .4, y: 4 }, { opacity: 1, y: 0, stagger: .1, duration: .25, ease: 'power2.out' }, position + .3);
        }

        // Routing packet animations (Fixed index: scene 3 is routing/archive, scene 4 is email)
        if (kind === 'routing' && index === 3) {
          tl.fromTo('[data-routing-file-packet]', { x: -36, opacity: 0 }, {
            x: 42,
            opacity: 1,
            duration: .7,
            stagger: .12,
            ease: 'power2.inOut',
            onStart: () => { const r = $('[data-routing-output-route]'); if (r) r.classList.add('is-active'); },
            onComplete: () => { const r = $('[data-routing-output-route]'); if (r) r.classList.add('is-arrived'); }
          }, position + .3);
          tl.fromTo('[data-routing-archive-packet]', { x: -36, opacity: 0 }, {
            x: 42,
            opacity: 1,
            duration: .7,
            stagger: .12,
            ease: 'power2.inOut',
            onStart: () => { const r = $('[data-routing-archive-route]'); if (r) r.classList.add('is-active'); },
            onComplete: () => { const r = $('[data-routing-archive-route]'); if (r) r.classList.add('is-arrived'); }
          }, position + .85);
        }
        if (kind === 'routing' && index === 4) {
          tl.fromTo('[data-routing-email-preview]', { opacity: .4, y: 4 }, { opacity: 1, y: 0, duration: .3, ease: 'power2.out' }, position + .3);
        }

        position += scene.duration;
      });

      tl.addLabel('end', position);
      state.timeline = tl;
    };

    const goTo = (index) => {
      const target = Math.max(0, Math.min(config.scenes.length - 1, index));
      state.timeline?.pause();
      state.playing = false;
      if (state.timeline) state.timeline.seek(`scene${target}`, true);
      state.pausedByUser = false;
      renderScene(target);
    };

    const play = (index = state.step < 0 ? 0 : state.step) => {
      if (!state.gsap) return;
      if (!state.timeline) buildTimeline();

      // If playback already completed (at end) or at the last step, replay from start
      let target = index;
      if (state.step >= config.scenes.length - 1 || (state.timeline && state.timeline.progress() >= 1)) {
        target = 0;
        state.pausedByUser = false;
      } else {
        target = Math.max(0, Math.min(config.scenes.length - 1, target));
      }

      if (state.pausedByUser && target === state.step) {
        state.timeline.play();
        state.playing = true;
        state.pausedByUser = false;
        const plBtn = $('[data-sim-play]');
        if (plBtn) plBtn.disabled = true;
        const paBtn = $('[data-sim-pause]');
        if (paBtn) paBtn.disabled = false;
        const stLabel = $('[data-sim-status]');
        if (stLabel) stLabel.textContent = `PLAYING · ${apiScene(target).phase}`;
        const runBtn = root.querySelector('[data-sim-run]');
        if (runBtn) {
          runBtn.classList.add('is-running');
          runBtn.querySelector('span').textContent = 'Running…';
        }
        return;
      }

      state.timeline.seek(`scene${target}`, true);
      renderScene(target);
      state.pausedByUser = false;
      state.playing = true;
      state.timeline.play();
      const playBtn = $('[data-sim-play]');
      if (playBtn) playBtn.disabled = true;
      const pauseBtn = $('[data-sim-pause]');
      if (pauseBtn) pauseBtn.disabled = false;
      const startBtn = $('[data-sim-start]');
      if (startBtn) startBtn.disabled = true;
      const replayBtn = $('[data-sim-replay]');
      if (replayBtn) replayBtn.disabled = false;
      const statusLabel = $('[data-sim-status]');
      if (statusLabel) statusLabel.textContent = `PLAYING · ${apiScene(target).phase}`;
      const runBtn = root.querySelector('[data-sim-run]');
      if (runBtn) {
        runBtn.classList.add('is-running');
        runBtn.querySelector('span').textContent = 'Running…';
      }
      const designerStatus = root.querySelector('[data-designer-status]');
      if (designerStatus) designerStatus.innerHTML = '<span class="tool-dot tool-dot-run"></span> Running';
    };

    // Azure Logic Apps "Run" Command Bar Trigger
    const azureRunBtn = root.querySelector('[data-sim-run]');
    if (azureRunBtn) {
      azureRunBtn.addEventListener('click', () => {
        play(0);
      });
    }

    // Cleanly wire up optional walkthrough bar controls if present in DOM
    const simStartBtn = $('[data-sim-start]');
    if (simStartBtn) simStartBtn.addEventListener('click', () => play(0));
    const simPlayBtn = $('[data-sim-play]');
    if (simPlayBtn) simPlayBtn.addEventListener('click', () => play(state.step < 0 ? 0 : state.step));
    const simPauseBtn = $('[data-sim-pause]');
    if (simPauseBtn) {
      simPauseBtn.addEventListener('click', () => {
        state.timeline?.pause();
        state.playing = false;
        state.pausedByUser = true;
        if (simPlayBtn) simPlayBtn.disabled = !state.gsap;
        simPauseBtn.disabled = true;
        const statLabel = $('[data-sim-status]');
        if (statLabel) statLabel.textContent = 'PAUSED';
        syncApiBranch();
      });
    }
    const prevBtn = $('[data-sim-previous]');
    if (prevBtn) prevBtn.addEventListener('click', () => goTo(state.step - 1));
    const nextBtn = $('[data-sim-next]');
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(state.step + 1));
    $$('[data-sim-jump]').forEach((button) => button.addEventListener('click', () => goTo(Number(button.dataset.simJump))));
    const repBtn = $('[data-sim-replay]');
    if (repBtn) {
      repBtn.addEventListener('click', () => {
        state.timeline?.kill();
        state.timeline = null;
        state.step = -1;
        state.pausedByUser = false;
        goTo(0);
        if (state.gsap) play(0);
      });
    }

    $$('[data-api-branch]').forEach((button) => button.addEventListener('click', () => {
      if (state.playing) {
        state.timeline?.pause();
        state.playing = false;
        const pBtn = $('[data-sim-play]');
        if (pBtn) pBtn.disabled = !state.gsap;
        const psBtn = $('[data-sim-pause]');
        if (psBtn) psBtn.disabled = true;
      }
      state.apiBranch = button.dataset.apiBranch;
      state.timeline?.kill();
      state.timeline = null;
      state.pausedByUser = false;
      syncApiBranch();
      if (state.step >= 5) renderScene(state.step);
    }));

    // Copy Payload Handler for Developer Tool Inspector
    const copyBtn = root.querySelector('[data-copy-payload]');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const code = root.querySelector('[data-copy-source]');
        if (!code) return;
        const text = code.innerText || code.textContent;
        const label = copyBtn.querySelector('[data-copy-label]');
        const feedback = root.querySelector('[data-copy-feedback]');
        let ok = false;
        try {
          await navigator.clipboard.writeText(text);
          ok = true;
        } catch {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          ok = document.execCommand('copy');
          ta.remove();
        }
        if (ok) {
          copyBtn.classList.add('is-copied');
          if (label) label.textContent = 'Copied!';
          if (feedback) feedback.textContent = 'Illustrative payload copied to clipboard';
          setTimeout(() => {
            copyBtn.classList.remove('is-copied');
            if (label) label.textContent = 'Copy';
            if (feedback) feedback.textContent = '';
          }, 2200);
        }
      });
    }

    // Toggle expand/collapse on Logic Apps action cards
    root.querySelectorAll('.sim-node-head').forEach((head) => {
      head.addEventListener('click', () => {
        const card = head.closest('.sim-node');
        if (card) card.classList.toggle('is-collapsed');
      });
    });

    // Mark last visible node initially for CSV and Routing
    if (kind !== 'api') {
      const allNodes = root.querySelectorAll('.sim-flow-grid .sim-node');
      if (allNodes.length) allNodes[allNodes.length - 1].classList.add('is-last-visible');
    }

    resetVisuals();
    config.logs.forEach((_, index) => {
      if (logs.children[index]) {
        const b = logs.children[index].querySelector('b');
        if (b) b.textContent = 'WAITING';
      }
    });
    const stBtn = $('[data-sim-start]');
    if (stBtn) stBtn.disabled = false;
    const nxBtn = $('[data-sim-next]');
    if (nxBtn) nxBtn.disabled = false;
    const pvBtn = $('[data-sim-previous]');
    if (pvBtn) pvBtn.disabled = true;
    const plBtn = $('[data-sim-play]');
    if (plBtn) plBtn.disabled = !state.gsap;
    const rpBtn = $('[data-sim-replay]');
    if (rpBtn) rpBtn.disabled = true;
    syncApiBranch();

    if (!state.gsap) {
      const statLabel = $('[data-sim-status]');
      if (statLabel) statLabel.textContent = reduced.matches ? 'REDUCED MOTION · MANUAL STEPS' : 'STATIC MODE · MANUAL STEPS';
    }

    const outline = $('[data-sim-outline]');
    if (outline && outline.closest('details')) {
      outline.closest('details').addEventListener('toggle', () => {
        if (outline.closest('details').open) outline.focus?.();
      });
    }
  });
})();