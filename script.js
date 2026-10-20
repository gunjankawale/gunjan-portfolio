(() => {
  const year = document.querySelector('#copyright-year');
  if (year) year.textContent = String(new Date().getFullYear());

  const progress = document.querySelector('.scroll-progress span');
  if (progress) {
    let scheduled = false;
    const updateProgress = () => {
      const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
      const amount = scrollRange > 0 ? Math.min(1, window.scrollY / scrollRange) : 0;
      progress.style.transform = `scaleX(${amount})`;
      scheduled = false;
    };

    window.addEventListener('scroll', () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(updateProgress);
    }, { passive: true });
    updateProgress();
  }

  const motionUnits = [...document.querySelectorAll('[data-motion-unit]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  motionUnits.forEach((unit) => {
    const object = unit.querySelector('.motion-object');
    const fallback = unit.querySelector('[data-motion-fallback]');
    const motionFigure = unit.querySelector('.motion-figure');
    const controls = unit.querySelector('.motion-controls');
    const playButton = unit.querySelector('[data-motion-play]');
    const pauseButton = unit.querySelector('[data-motion-pause]');
    const replayButton = unit.querySelector('[data-motion-replay]');
    const status = unit.querySelector('[data-motion-status]');
    if (!object || !controls || !playButton || !pauseButton || !replayButton || !status) return;

    const mobileSource = object.dataset.mobile;
    const desktopSource = object.getAttribute('data');
    const mobileQuery = window.matchMedia('(max-width: 680px)');
    const sourceForViewport = () => mobileQuery.matches && mobileSource ? mobileSource : desktopSource;
    const motionState = { svg: null, animations: [], ready: false, playing: false, started: false };

    const setStatus = (message) => { status.textContent = message; };
    const refreshControls = () => {
      playButton.disabled = motionState.playing || !motionState.ready;
      pauseButton.disabled = !motionState.playing || !motionState.ready;
      replayButton.disabled = !motionState.ready;
    };
    const getSvgDocument = () => {
      const document = object.contentDocument;
      const svg = document?.documentElement;
      if (!svg || svg.localName !== 'svg') {
        object.hidden = true;
        object.style.opacity = '';
        return false;
      }
      motionState.svg = svg;
      motionState.animations = [...document.querySelectorAll('animateMotion, animate, animateTransform, set')]
        .filter((animation) => animation.getAttribute('begin') === 'indefinite');
      motionState.ready = motionState.animations.length > 0;
      motionState.started = false;
      const aspectRatio = svg.viewBox?.baseVal?.width && svg.viewBox?.baseVal?.height
        ? `${svg.viewBox.baseVal.width} / ${svg.viewBox.baseVal.height}`
        : '16 / 9';
      if (motionFigure) motionFigure.style.aspectRatio = aspectRatio;
      object.style.aspectRatio = aspectRatio;
      if (motionState.ready) {
        if (fallback) fallback.hidden = true;
        object.hidden = false;
        object.style.opacity = '';
        object.removeAttribute('aria-hidden');
        controls.hidden = false;
        setStatus(reducedMotion.matches ? 'Paused · motion preference respected' : 'Paused · press Play to begin');
      } else {
        object.hidden = true;
        object.style.opacity = '';
        setStatus('Static diagram available');
      }
      refreshControls();
    };

    object.addEventListener('load', getSvgDocument);
    object.addEventListener('error', () => {
      object.hidden = true;
      object.style.opacity = '';
      setStatus('Static diagram available');
    });
    const source = sourceForViewport();
    if (object.getAttribute('data') !== source) object.setAttribute('data', source);
    object.style.opacity = '0';
    object.setAttribute('aria-hidden', 'true');
    object.hidden = false;
    if (object.contentDocument?.documentElement?.localName === 'svg') getSvgDocument();

    mobileQuery.addEventListener?.('change', () => {
      if (motionState.playing) stopAnimation();
      motionState.ready = false;
      motionState.animations = [];
      motionState.svg = null;
      motionState.started = false;
      object.hidden = true;
      if (fallback) fallback.hidden = false;
      object.setAttribute('data', sourceForViewport());
      object.style.opacity = '0';
      object.setAttribute('aria-hidden', 'true');
      object.hidden = false;
      setStatus('Loading diagram…');
      refreshControls();
    });

    const startAnimation = (rewind = false) => {
      if (!motionState.ready || !motionState.svg) return;
      if (rewind) {
        motionState.svg.pauseAnimations();
        motionState.svg.setCurrentTime(0);
        motionState.started = false;
      }
      if (!motionState.started) {
        motionState.animations.forEach((animation, index) => {
          try { animation.beginElementAt(index * 0.6); } catch { /* Unsupported SMIL controls leave the static diagram available. */ }
        });
        motionState.started = true;
      }
      motionState.svg.unpauseAnimations();
      motionState.playing = true;
      setStatus('Animation playing');
      refreshControls();
    };

    function stopAnimation() {
      motionState.svg?.pauseAnimations();
      motionState.playing = false;
      setStatus('Animation paused');
      refreshControls();
    }

    playButton.addEventListener('click', () => startAnimation());
    pauseButton.addEventListener('click', stopAnimation);
    replayButton.addEventListener('click', () => startAnimation(true));
    reducedMotion.addEventListener?.('change', () => {
      if (reducedMotion.matches && motionState.playing) stopAnimation();
      else if (!motionState.playing) setStatus(reducedMotion.matches ? 'Paused · motion preference respected' : 'Paused · press Play to begin');
    });
  });

  const walkthroughDefinitions = {
    overview: {
      nodes: [
        ['Redpoint', 'LEGACY WORKFLOW', 'RP'], ['Existing business logic', 'PRESERVED BEHAVIOR', 'RULES'], ['Azure Logic Apps', 'MIGRATED WORKFLOW', 'LA'], ['Output reconciliation', 'VALIDATE RESULTS', 'CHECK'],
        ['Configured trigger', 'SCHEDULE OR EVENT', 'START'], ['Try scope', 'WORKFLOW-SPECIFIC ACTIONS + LOGGING', 'TRY'], ['Success path', 'NEXT APPLICABLE ACTION', 'OK'], ['Catch scope', 'EMAIL ALERT + FAILURE LOG', 'CATCH']
      ],
      edges: [[0,1],[1,2],[2,3],[4,5],[5,6],[5,7]],
      steps: [
        {scene:'SCENE A · MIGRATION',title:'Existing workflow in Redpoint',description:'The existing production workflows already carry business rules and expected behavior.',input:'Existing Redpoint workflow',action:'Identify the current stages and logic before migration.',output:'Reference behavior for the Azure version.',node:0},
        {scene:'SCENE A · MIGRATION',title:'Keep the business logic',description:'For migrated workflows, the existing business behavior is preserved rather than redesigned from scratch.',input:'Existing workflow logic',action:'Carry the behavior forward into the migrated workflow.',output:'Equivalent business intent in the new orchestration.',node:1,edge:0},
        {scene:'SCENE A · MIGRATION',title:'Move orchestration to Logic Apps',description:'Approximately 7–8 existing production workflows were migrated from Redpoint to Azure Logic Apps.',input:'Existing Redpoint workflows',action:'Migrate workflow orchestration to Azure Logic Apps.',output:'Migrated Logic Apps workflows.',node:2,edge:1},
        {scene:'SCENE A · MIGRATION',title:'Reconcile the outputs',description:'Outputs from the legacy and migrated workflows are reconciled to check for consistent expected behavior.',input:'Redpoint and Logic Apps outputs',action:'Compare corresponding outputs.',output:'A validation check without claiming specific results or performance gains.',node:3,edge:2},
        {scene:'SCENE B · SHARED RELIABILITY',title:'A configured trigger starts a run',description:'A schedule or event trigger configured in Logic Apps starts the workflow.',input:'Schedule or file event',action:'Initialize a workflow run.',output:'The workflow enters its configured Try scope.',node:4},
        {scene:'SCENE B · SHARED RELIABILITY',title:'Workflow-specific actions run in Try',description:'Try contains the actions needed by that workflow, which can vary and may include SQL, file processing or API calls.',input:'Run context and workflow inputs',action:'Execute applicable business steps and configured status logging.',output:'Progress continues through the next applicable action.',node:5,edge:3},
        {scene:'SCENE B · SHARED RELIABILITY',title:'Successful actions continue',description:'When an action succeeds, the workflow proceeds to its next applicable step. Dashboard values such as In Progress, Completed, Failed and Skipped are logged statuses.',input:'Successful action result',action:'Continue the workflow and record relevant status.',output:'The next applicable workflow action.',node:6,edge:4},
        {scene:'SCENE B · SHARED RELIABILITY',title:'Action exceptions follow Catch',description:'An Azure action exception inside Try follows the shared Catch path, which sends a configured email alert and records the workflow failure in the monitoring dashboard.',input:'Azure action exception in Try',action:'Run Catch handling and record the failure.',output:'Email alert and dashboard failure entry.',node:7,edge:5},
        {scene:'SCENE B · SHARED RELIABILITY',title:'Dashboard status tracks the run',description:'In Progress, Completed, Failed and Skipped are workflow statuses stored for monitoring; they are not Logic Apps action names.',input:'Workflow and step events',action:'Write applicable status entries to monitoring.',output:'An auditable run state for operations.',node:7},
        {scene:'SCENE B · SHARED RELIABILITY',title:'Business status is separate',description:'The API PASS/FAIL business decision belongs only to the reporting case study. An API response of FAIL does not automatically invoke Catch.',input:'API response, in that specific workflow',action:'Apply its configured business-status handling separately.',output:'A clear distinction between business outcomes and action exceptions.',node:5},
        {scene:'OVERVIEW COMPLETE',title:'One shared wrapper, varied workflows',description:'Migration preserves existing behavior; new requirements are developed separately. Runtime actions, logging placement and business handling depend on each workflow.',input:'A specific business process',action:'Use the relevant trigger, actions, logging and exception path.',output:'A workflow-specific implementation within a shared reliability approach.',node:6}
      ]
    },
    api: {
      nodes: [
        ['Schedule', 'LOGIC APPS TRIGGER', 'TIME'], ['Dynamic payload', 'VALUES SET BY REQUIREMENT', 'DATA'], ['Function App API', 'LOGIC APPS MAKES THE CALL', 'API'], ['Function App processing', 'ITS OWN REPORT CODE', 'RUN'],
        ['Azure Blob Storage', 'GENERATED CSV REPORTS', 'CSV'], ['Response + status', 'LOGIC APPS EVALUATES', 'PASS?'], ['PASS · delivery + email', 'DYNAMIC CONTENT · STATIC LIST', 'SEND'], ['FAIL · configured handling', 'DASHBOARD · BUSINESS ACTIONS', 'FAIL']
      ],
      edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]],
      steps: {
        pass: [
          {scene:'MIGRATED WORKFLOW · PASS PATH',title:'Scheduled trigger',description:'A schedule configured in Azure Logic Apps initiates this reporting workflow.',input:'Configured schedule',action:'Start a reporting run.',output:'Workflow run begins.',node:0},
          {scene:'MIGRATED WORKFLOW · PASS PATH',title:'Assemble the dynamic payload',description:'Logic Apps prepares request values dynamically according to business requirements.',input:'Configured workflow values',action:'Populate the API request payload.',output:'A request ready for the Function App API.',node:1,edge:0},
          {scene:'MIGRATED WORKFLOW · PASS PATH',title:'Call the Function App API',description:'Logic Apps sends the request to an API exposed through the Function App. Your contribution is API integration and orchestration.',input:'Dynamic request payload',action:'Make the API call from Logic Apps.',output:'Request reaches the Function App.',node:2,edge:1},
          {scene:'SEPARATE PROCESSING SYSTEM',title:'Function App runs its processing',description:'The Function App executes its own processing and report-generation code. You call the API; you do not write that Function App code.',input:'API request',action:'Function App runs its own report logic.',output:'Reports are generated by the Function App.',node:3,edge:2},
          {scene:'SEPARATE STORAGE SYSTEM',title:'CSV reports are stored',description:'The Function App stores the generated CSV reports in Azure Blob Storage.',input:'Generated CSV reports',action:'Write report files to Blob Storage.',output:'CSV reports are available for subsequent workflow handling.',node:4,edge:3},
          {scene:'BUSINESS STATUS · PASS PATH',title:'Return and evaluate the API status',description:'The API response returns to Logic Apps. The workflow evaluates PASS or FAIL according to configured business requirements.',input:'API response and stored reports',action:'Evaluate the returned business status.',output:'The selected business handling path.',node:5,edge:4},
          {scene:'PASS · FILE DELIVERY',title:'Continue the successful path',description:'For PASS, Logic Apps continues the applicable file-delivery steps and moves generated files from Blob Storage to the required business destination.',input:'CSV reports in Blob Storage',action:'Transfer files to the business destination.',output:'Reports delivered for the next business process.',node:6,edge:5},
          {scene:'PASS · CUSTOMER NOTIFICATION',title:'Send the report email',description:'Logic Apps sends an email with content populated dynamically. The recipient list is statically configured in the workflow.',input:'Workflow values and delivery state',action:'Compose dynamic email content and send to configured recipients.',output:'Customer notification sent.',node:6},
          {scene:'PASS PATH · COMPLETE',title:'Log completion',description:'The workflow records relevant status for its completion after report delivery and notification.',input:'Delivery and email results',action:'Record the applicable workflow status.',output:'A completed reporting run.',node:6}
        ],
        fail: [
          {scene:'MIGRATED WORKFLOW · FAIL PATH',title:'Scheduled trigger',description:'A schedule configured in Azure Logic Apps initiates this reporting workflow.',input:'Configured schedule',action:'Start a reporting run.',output:'Workflow run begins.',node:0},
          {scene:'MIGRATED WORKFLOW · FAIL PATH',title:'Assemble the dynamic payload',description:'Logic Apps prepares request values dynamically according to business requirements.',input:'Configured workflow values',action:'Populate the API request payload.',output:'A request ready for the Function App API.',node:1,edge:0},
          {scene:'MIGRATED WORKFLOW · FAIL PATH',title:'Call the Function App API',description:'Logic Apps sends the request to an API exposed through the Function App.',input:'Dynamic request payload',action:'Make the API call from Logic Apps.',output:'Request reaches the Function App.',node:2,edge:1},
          {scene:'SEPARATE PROCESSING SYSTEM',title:'Function App runs its processing',description:'The Function App executes its own processing and report-generation code; Logic Apps orchestrates the call.',input:'API request',action:'Run the Function App’s report logic.',output:'Processing results and generated reports.',node:3,edge:2},
          {scene:'SEPARATE STORAGE SYSTEM',title:'CSV reports are stored',description:'The Function App stores generated CSV reports in Azure Blob Storage.',input:'Generated CSV reports',action:'Write reports to Blob Storage.',output:'Files available for configured follow-up handling.',node:4,edge:3},
          {scene:'BUSINESS STATUS · FAIL PATH',title:'Return and evaluate the API status',description:'Logic Apps evaluates the API response. A business FAIL is a workflow outcome, not automatically an Azure action exception.',input:'API response',action:'Evaluate the returned business status.',output:'Configured FAIL handling begins.',node:5,edge:4},
          {scene:'FAIL · MONITORING',title:'Record the business failure',description:'The workflow records the FAIL outcome in the monitoring dashboard.',input:'API business status: FAIL',action:'Write the workflow-specific failure entry.',output:'Failure is visible for monitoring.',node:7,edge:6},
          {scene:'FAIL · BUSINESS-DEFINED ACTIONS',title:'Apply configured failure handling',description:'Business requirements determine the response. Where applicable, the workflow can be failed and an email alert sent. This is separate from Catch.',input:'Recorded business FAIL',action:'Perform the configured business failure actions.',output:'The relevant business response and notification.',node:7},
          {scene:'FAIL PATH · COMPLETE',title:'Log the final workflow state',description:'Record the applicable final workflow status and retain visibility of the business failure.',input:'Business failure handling result',action:'Complete the configured status logging.',output:'A traceable failed business outcome.',node:7}
        ]
      }
    },
    csv: {
      nodes: [
        ['Upstream process', 'PLACES THE INPUT', 'UP'], ['CSV hot folder', 'CONFIGURED LOCATION', 'CSV'], ['Logic Apps trigger', 'FILE ARRIVAL STARTS RUN', 'LA'], ['Input archive', 'BUSINESS-DESIGNATED LOCATION', 'ARC'],
        ['SQL stored procedures', 'APPLY REQUIRED RULES', 'SQL'], ['TXT outputs', 'REQUIRED OUTPUT FILES', 'TXT'], ['Business destination', 'DOWNSTREAM PROCESS', 'OUT'], ['Email attachments', 'STATIC RECIPIENT LIST', 'MAIL']
      ],
      edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[5,7]],
      steps: [
        {scene:'NEW WORKFLOW · SEQUENTIAL PROCESSING',title:'Upstream process supplies a CSV',description:'An upstream process places the input file for this fresh business requirement.',input:'CSV from an upstream process',action:'Make the input available to the workflow.',output:'CSV ready for the configured hot folder.',node:0},
        {scene:'INPUT ARRIVAL',title:'CSV arrives in the hot folder',description:'The input lands in the designated hot folder monitored for this workflow.',input:'CSV file',action:'Place the file in the configured hot folder.',output:'File arrival event is available.',node:1,edge:0},
        {scene:'LOGIC APPS ORCHESTRATION',title:'File trigger starts the workflow',description:'An Azure Logic Apps file trigger detects the arriving input and starts processing.',input:'New CSV in hot folder',action:'Trigger the workflow on file arrival.',output:'A Logic Apps run begins.',node:2,edge:1},
        {scene:'INPUT ARCHIVING',title:'Archive the input CSV',description:'The workflow archives the input at the location designated by the business.',input:'Incoming CSV',action:'Move or archive the input file.',output:'Input retained at the designated archive location.',node:3,edge:2},
        {scene:'SQL BUSINESS RULES',title:'Execute stored procedures',description:'Logic Apps executes SQL stored procedures that apply the required business rules. The specific rules depend on the requirement.',input:'Workflow data and input context',action:'Call the configured SQL stored procedures.',output:'Processing results for the required outputs.',node:4,edge:3},
        {scene:'TXT OUTPUT GENERATION',title:'Prepare required TXT outputs',description:'The workflow uses the processing result to generate the required TXT output files.',input:'Stored procedure results',action:'Generate the required TXT files.',output:'TXT outputs ready for handoff.',node:5,edge:4},
        {scene:'DOWNSTREAM HANDOFF',title:'Deliver TXT files',description:'The outputs move to the business destination used by the next process; the wider process continues downstream.',input:'Generated TXT files',action:'Deliver files to the configured business destination.',output:'Files available for downstream processing.',node:6,edge:5},
        {scene:'EMAIL NOTIFICATION',title:'Prepare the email attachments',description:'Logic Apps composes an email with the generated TXT files attached. Its recipient list is statically configured.',input:'Generated TXT files',action:'Attach outputs and prepare the configured notification.',output:'Email prepared for the configured recipients.',node:7,edge:6},
        {scene:'WORKFLOW COMPLETE',title:'Record completion status',description:'The workflow logs relevant completion and delivery status for this run.',input:'Delivery and notification results',action:'Record the applicable workflow status.',output:'A traceable completed run; downstream work remains separate.',node:7}
      ]
    },
    routing: {
      nodes: [
        ['Redpoint workflow', 'EXISTING FILE ROUTING', 'RP'], ['Preserved behavior', 'MIGRATED TO LOGIC APPS', 'MOVE'], ['Output reconciliation', 'VALIDATE CONSISTENCY', 'CHECK'], ['TXT / PDF input', 'CONFIGURED INPUT FOLDER', 'FILES'],
        ['Logic Apps trigger', 'FILE ARRIVAL', 'LA'], ['SQL configuration', 'DESTINATIONS + RECIPIENTS', 'SQL'], ['Identify applicable files', 'TXT AND PDF', 'MATCH'], ['Deliver · archive · email', 'DATABASE-DRIVEN VALUES', 'ROUTE']
      ],
      edges: [[0,1],[1,2],[3,4],[4,5],[5,6],[6,7]],
      steps: [
        {scene:'PART A · MIGRATION',title:'Existing Redpoint routing workflow',description:'The existing workflow routes files using configuration held in a database.',input:'TXT/PDF files and database configuration',action:'Run the established file-arrival and routing process.',output:'Existing behavior to preserve during migration.',node:0},
        {scene:'PART A · MIGRATION',title:'Migrate orchestration to Logic Apps',description:'This case study is a Redpoint-to-Azure Logic Apps migration, not a newly built workflow. Existing business logic is preserved.',input:'Existing Redpoint workflow',action:'Move workflow orchestration to Azure Logic Apps.',output:'Migrated workflow with existing business behavior.',node:1,edge:0},
        {scene:'PART A · MIGRATION',title:'Reconcile legacy and migrated outputs',description:'Outputs are compared to validate consistent behavior. No reconciliation counts or performance results are implied.',input:'Redpoint and Logic Apps outputs',action:'Reconcile corresponding results.',output:'A migration validation check.',node:2,edge:1},
        {scene:'PART B · RUNTIME',title:'TXT and PDF files become available',description:'Applicable TXT and PDF files arrive at the configured input or hot-folder location.',input:'TXT and PDF files',action:'Make files available for processing.',output:'File-arrival event can start the migrated workflow.',node:3},
        {scene:'PART B · RUNTIME',title:'Logic Apps file trigger starts a run',description:'The file-arrival trigger configured in Logic Apps starts the runtime workflow.',input:'Files in configured input folder',action:'Start the Logic Apps workflow.',output:'Run context for configuration lookup.',node:4,edge:2},
        {scene:'PART B · RUNTIME',title:'Read SQL routing configuration',description:'Logic Apps queries the SQL database to retrieve runtime configuration before routing files.',input:'Workflow run context',action:'Query the configuration source.',output:'Configured output destination, archive destination and email recipients.',node:5,edge:3},
        {scene:'PART B · RUNTIME',title:'Use database-supplied values',description:'The database supplies the output destination, archive destination and email recipients; they are not hard-coded workflow settings in this walkthrough.',input:'SQL configuration result',action:'Make retrieved configuration available to the run.',output:'Runtime routing and notification values.',node:5},
        {scene:'PART B · RUNTIME',title:'Identify applicable TXT and PDF files',description:'The workflow identifies the TXT and PDF files applicable to processing without assuming undocumented selection rules.',input:'Available files and workflow context',action:'Identify the applicable file formats.',output:'TXT and PDF files for configured routing.',node:6,edge:4},
        {scene:'PART B · FILE HANDLING',title:'Deliver and archive files separately',description:'Files move to the respective output and archive destinations defined by the retrieved database configuration.',input:'Identified TXT/PDF files and routing values',action:'Deliver output and archive copies at their configured destinations.',output:'Files delivered and archived as configured.',node:7,edge:5},
        {scene:'PART B · NOTIFICATION',title:'Send success email with dynamic counts',description:'Logic Apps sends a success email to database-supplied recipients. Its dynamic content can include {TXT count} and {PDF count}; these are placeholders, not production volumes.',input:'Delivery result, file format counts and configured recipients',action:'Populate and send the success notification.',output:'Database-configured recipients receive the workflow summary.',node:7},
        {scene:'MIGRATED WORKFLOW · COMPLETE',title:'Log final delivery and status',description:'The migrated flow preserves the legacy business behavior, uses SQL-sourced routing values at runtime and records relevant status.',input:'Delivery, archive and email outcomes',action:'Record the applicable workflow completion status.',output:'Traceable completion of the migrated routing workflow.',node:7}
      ]
    }
  };

  const svgNs = 'http://www.w3.org/2000/svg';
  const svgElement = (name, attrs = {}, content) => {
    const element = document.createElementNS(svgNs, name);
    Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
    if (content !== undefined) element.textContent = content;
    return element;
  };
  document.querySelectorAll('[data-walkthrough]').forEach((card) => {
    const key = card.dataset.walkthrough;
    const definition = walkthroughDefinitions[key];
    const diagram = card.querySelector('[data-flow-diagram]');
    const staticDiagram = card.querySelector('.walkthrough-static');
    const controls = card.querySelector('.walkthrough-controls');
    const title = card.querySelector('[data-step-title]');
    if (!definition || !diagram || !controls || !title) return;
    let branch = 'pass';
    let steps = Array.isArray(definition.steps) ? definition.steps : definition.steps[branch];
    let current = 0;
    let timer = 0;
    let running = false;
    const compactDiagram = window.matchMedia('(max-width: 680px)').matches;
    const nodeWidth = compactDiagram ? 250 : 200;
    const nodeHeight = 108;
    const canvasWidth = compactDiagram ? 600 : 1000;
    const canvasHeight = compactDiagram ? 1010 : 600;
    const nodePositions = definition.nodes.map((_, index) => {
      if (compactDiagram) {
        const row = Math.floor(index / 2);
        const column = row % 2 === 0 ? index % 2 : 1 - (index % 2);
        return { x: 45 + column * 260, y: 145 + row * 205 };
      }
      return index < 4 ? { x: 40 + index * 240, y: 150 } : { x: 40 + (7 - index) * 240, y: 390 };
    });
    const drawDiagram = () => {
      diagram.replaceChildren();
      diagram.setAttribute('viewBox', `0 0 ${canvasWidth} ${canvasHeight}`);
      diagram.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      diagram.append(svgElement('title', {}, `${key} workflow system map`));
      diagram.append(svgElement('desc', {}, 'Systems and handoffs are highlighted as each walkthrough step advances.'));
      const defs = svgElement('defs');
      const markerDefinition = svgElement('marker', { id: `flow-arrow-${key}`, viewBox: '0 0 10 10', refX: '8', refY: '5', markerWidth: '7', markerHeight: '7', orient: 'auto-start-reverse' });
      defs.append(markerDefinition);
      diagram.append(defs);
      const marker = diagram.querySelector('marker');
      marker?.append(svgElement('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: '#d2f36b' }));
      diagram.append(svgElement('rect', { class: 'flow-bg', x: 0, y: 0, width: canvasWidth, height: canvasHeight, rx: 18 }));
      const diagramHeading = compactDiagram
        ? key === 'overview' ? 'MIGRATION + RELIABILITY' : key === 'api' ? 'API REPORTING · SEPARATE SYSTEMS' : key === 'csv' ? 'CSV → TXT · SEQUENTIAL FLOW' : 'REDPOINT MIGRATION · SQL ROUTING'
        : key === 'overview' ? 'MIGRATION → SHARED RELIABILITY' : key === 'api' ? 'LOGIC APPS ORCHESTRATION · SEPARATE PROCESSING' : key === 'csv' ? 'NEW WORKFLOW · SEQUENTIAL FILE PROCESSING' : 'MIGRATED WORKFLOW · DATABASE-DRIVEN RUNTIME';
      diagram.append(svgElement('text', { class: 'flow-lane-label', x: compactDiagram ? 26 : 34, y: 42 }, diagramHeading));
      if (compactDiagram) {
        diagram.append(svgElement('rect', { class: 'flow-lane', x: 20, y: 78, width: 560, height: canvasHeight - 105, rx: 15 }));
        diagram.append(svgElement('text', { class: 'flow-note', x: 38, y: 111 }, 'ACTIVE STEP HIGHLIGHTS NODE + HANDOFF'));
      } else {
        diagram.append(svgElement('rect', { class: 'flow-lane', x: 20, y: 78, width: 960, height: 190, rx: 15 }));
        diagram.append(svgElement('rect', { class: 'flow-lane', x: 20, y: 318, width: 960, height: 250, rx: 15 }));
        diagram.append(svgElement('text', { class: 'flow-note', x: 40, y: 102 }, 'SYSTEMS / STAGES · STATIC OVERVIEW ALWAYS AVAILABLE'));
        diagram.append(svgElement('text', { class: 'flow-note', x: 40, y: 345 }, 'ACTIVE STEP HIGHLIGHTS THE CURRENT NODE AND HANDOFF'));
      }
      definition.edges.forEach(([from, to], edgeIndex) => {
        const a = nodePositions[from], b = nodePositions[to];
        const startX = a.x + nodeWidth / 2, startY = a.y + nodeHeight / 2;
        const endX = b.x + nodeWidth / 2, endY = b.y + nodeHeight / 2;
        const midY = startY === endY ? startY : (startY + endY) / 2;
        const path = svgElement('path', { class: 'flow-edge', 'data-edge': edgeIndex, d: `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`, 'marker-end': `url(#flow-arrow-${key})` });
        diagram.append(path);
      });
      definition.nodes.forEach(([label, system, icon], index) => {
        const pos = nodePositions[index];
        const group = svgElement('g', { class: 'flow-node', 'data-node': index });
        group.append(svgElement('rect', { x: pos.x, y: pos.y, width: nodeWidth, height: nodeHeight, rx: 13 }));
        group.append(svgElement('text', { class: 'flow-node-icon', x: pos.x + 14, y: pos.y + 21 }, icon));
        const titleText = svgElement('text', { class: 'flow-node-title', x: pos.x + 14, y: pos.y + 51 });
        const words = label.split(' ');
        const lines = [];
        let line = '';
        words.forEach((word) => { if (`${line} ${word}`.trim().length > 19 && line) { lines.push(line); line = word; } else line = `${line} ${word}`.trim(); });
        if (line) lines.push(line);
        lines.slice(0, 2).forEach((part, lineIndex) => titleText.append(svgElement('tspan', { x: pos.x + 14, dy: lineIndex ? 17 : 0 }, part)));
        group.append(titleText);
        const systemLimit = compactDiagram ? 30 : 27;
        const systemText = system.length > systemLimit ? `${system.slice(0, systemLimit - 2)}…` : system;
        group.append(svgElement('text', { class: 'flow-node-system', x: pos.x + 14, y: pos.y + 92 }, systemText));
        diagram.append(group);
      });
      diagram.append(svgElement('circle', { class: 'flow-token', 'data-flow-token': '', r: 10, cx: 0, cy: 0, visibility: 'hidden' }));
      diagram.append(svgElement('text', { class: 'flow-token-label', 'data-flow-token-label': '', x: 0, y: 0 }, key === 'api' ? 'API' : key === 'csv' ? 'CSV' : key === 'routing' ? 'FILE' : 'RUN'));
      if (staticDiagram) staticDiagram.hidden = true;
    };
    const stepList = card.querySelector('[data-walkthrough-step-list]');
    const renderFullStepList = () => {
      if (!stepList) return;
      stepList.replaceChildren(...steps.map((step) => { const item = document.createElement('li'); item.textContent = `${step.title} — ${step.description}`; return item; }));
    };
    const setStep = (index) => {
      current = Math.max(0, Math.min(steps.length - 1, index));
      const step = steps[current];
      card.querySelector('[data-step-scene]').textContent = step.scene;
      card.querySelector('[data-step-title]').textContent = step.title;
      card.querySelector('[data-step-description]').textContent = step.description;
      card.querySelector('[data-step-input]').textContent = step.input;
      card.querySelector('[data-step-action]').textContent = step.action;
      card.querySelector('[data-step-output]').textContent = step.output;
      card.querySelector('[data-step-count]').textContent = `Step ${current + 1} of ${steps.length}`;
      const progressElement = card.querySelector('[data-step-progress]');
      progressElement.max = steps.length;
      progressElement.value = current + 1;
      diagram.querySelectorAll('.flow-node').forEach((node) => {
        const nodeIndex = Number(node.dataset.node);
        node.classList.toggle('is-active', nodeIndex === step.node);
        node.classList.toggle('is-complete', steps.slice(0, current).some((past) => past.node === nodeIndex));
      });
      diagram.querySelectorAll('.flow-edge').forEach((edge) => {
        const edgeIndex = Number(edge.dataset.edge);
        edge.classList.toggle('is-active', edgeIndex === step.edge);
        edge.classList.toggle('is-complete', Number.isInteger(step.edge) && edgeIndex < step.edge);
      });
      const activeEdge = Number.isInteger(step.edge) ? definition.edges[step.edge] : null;
      const token = diagram.querySelector('[data-flow-token]');
      const tokenLabel = diagram.querySelector('[data-flow-token-label]');
      if (activeEdge) {
        const from = nodePositions[activeEdge[0]], to = nodePositions[activeEdge[1]];
        token.setAttribute('cx', (from.x + to.x + nodeWidth) / 2);
        token.setAttribute('cy', (from.y + to.y + nodeHeight) / 2);
        token.setAttribute('visibility', 'visible');
        tokenLabel.setAttribute('x', token.getAttribute('cx'));
        tokenLabel.setAttribute('y', token.getAttribute('cy'));
        tokenLabel.setAttribute('visibility', 'visible');
      } else {
        const pos = nodePositions[step.node];
        token.setAttribute('cx', pos.x + nodeWidth / 2); token.setAttribute('cy', pos.y + nodeHeight / 2);
        token.setAttribute('visibility', 'visible');
        tokenLabel.setAttribute('x', pos.x + nodeWidth / 2); tokenLabel.setAttribute('y', pos.y + nodeHeight / 2);
        tokenLabel.setAttribute('visibility', 'visible');
      }
      card.querySelector('[data-walkthrough-prev]').disabled = current === 0;
      card.querySelector('[data-walkthrough-next]').disabled = current === steps.length - 1;
      if (!running) card.querySelector('[data-walkthrough-status]').textContent = current === 0 ? 'Preview · use Next step or Start walkthrough' : current === steps.length - 1 ? 'Walkthrough complete' : 'Paused · use Next step to continue';
    };
    const stop = () => { window.clearInterval(timer); timer = 0; running = false; card.querySelector('[data-walkthrough-play]').disabled = false; card.querySelector('[data-walkthrough-pause]').disabled = true; card.querySelector('[data-walkthrough-status]').textContent = current === steps.length - 1 ? 'Walkthrough complete' : 'Paused · current step preserved'; };
    const play = () => {
      if (running) return;
      if (current >= steps.length - 1) setStep(0);
      running = true;
      card.querySelector('[data-walkthrough-play]').disabled = true;
      card.querySelector('[data-walkthrough-pause]').disabled = false;
      card.querySelector('[data-walkthrough-status]').textContent = 'Walkthrough playing · about 6 seconds per step';
      timer = window.setInterval(() => {
        if (current >= steps.length - 1) { stop(); return; }
        setStep(current + 1);
        if (current >= steps.length - 1) stop();
      }, 6000);
    };
    const restartBranch = (nextBranch) => {
      stop(); branch = nextBranch; steps = definition.steps[branch]; current = 0; renderFullStepList(); setStep(0);
    };
    drawDiagram();
    renderFullStepList();
    setStep(0);
    card.querySelector('[data-walkthrough-start]').addEventListener('click', () => { stop(); setStep(0); play(); });
    card.querySelector('[data-walkthrough-play]').addEventListener('click', play);
    card.querySelector('[data-walkthrough-pause]').addEventListener('click', stop);
    card.querySelector('[data-walkthrough-prev]').addEventListener('click', () => { stop(); setStep(current - 1); });
    card.querySelector('[data-walkthrough-next]').addEventListener('click', () => { stop(); setStep(current + 1); });
    card.querySelector('[data-walkthrough-replay]').addEventListener('click', () => { stop(); setStep(0); play(); });
    const overviewToggle = card.querySelector('[data-walkthrough-overview]');
    const allSteps = card.querySelector('.walkthrough-all-steps');
    overviewToggle.addEventListener('click', () => {
      allSteps.open = !allSteps.open;
      overviewToggle.setAttribute('aria-expanded', String(allSteps.open));
      overviewToggle.textContent = allSteps.open ? 'Hide full workflow overview' : 'Full workflow overview';
    });
    card.querySelectorAll('[data-branch]').forEach((button) => button.addEventListener('click', () => {
      card.querySelectorAll('[data-branch]').forEach((choice) => choice.setAttribute('aria-pressed', String(choice === button)));
      restartBranch(button.dataset.branch);
    }));
    card.querySelector('[data-walkthrough-status]').textContent = 'Preview · use Next step or Start walkthrough';
  });

  if (!('IntersectionObserver' in window)) return;
  const currentPage = new URL(window.location.href).pathname;
  const navLinks = [...document.querySelectorAll('.main-nav a')].filter((link) => {
    const destination = new URL(link.href);
    return destination.pathname === currentPage && destination.hash;
  });
  const sections = navLinks
    .map((link) => document.querySelector(link.hash))
    .filter(Boolean);

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const isCurrent = link.hash === `#${entry.target.id}`;
        link.classList.toggle('is-current', isCurrent);
        if (isCurrent) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-28% 0px -62% 0px' });

  sections.forEach((section) => navObserver.observe(section));
})();
