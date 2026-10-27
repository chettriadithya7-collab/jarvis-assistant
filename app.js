(() => {
"use strict";
const $ = (id) => document.getElementById(id);
const voiceButton = $("voice");
const voiceStatus = $("voiceStatus");
const assistantReply = $("assistantReply");
const replyText = $("replyText");
const researchLink = $("researchLink");
let recognition = null;
function say(text) {
  if (/\b(open youtube|youtube)\b/i.test(command)) {
  respond("Opening YouTube.", null);
  window.location.href = "https://www.youtube.com/";
  return;
}
  
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN";
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
}
function respond(text, searchQuery) {
  assistantReply.classList.remove("hidden");
  replyText.textContent = text;
  if (searchQuery) {
    researchLink.classList.remove("hidden");
    researchLink.href = "https://www.google.com/search?q=" + encodeURIComponent(searchQuery);
    researchLink.textContent = "Open research search: " + searchQuery + " ↗";
  } else {
    researchLink.classList.add("hidden");
    researchLink.removeAttribute("href");
  }
}
function routeCommand(raw) {
  const command = raw.trim();
  const low = command.toLowerCase();

  0= "https://www.youtube.com/";
    return;
  }

  if (/\b(open google search|open google)\b/i.test(command)) {
    respond("Opening Google Search.", null);
    window.location.href = "https://www.google.com/";
    return;
  }

    if (/\b(open google maps|open maps)\b/i.test(command)) {
    respond("Opening Google Maps.", null);
    window.location.href = "https://maps.google.com/";
    return;
 
  }

  if (/\b(open spotify|open music)\b/i.test(command)) {
    respond("Opening Spotify.", null);
    window.location.href = "https://open.spotify.com/";
    return;
  }

  if (/\b(open whatsapp)\b/i.test(command)) {
    respond("Opening WhatsApp.", null);
    window.location.href = "https://www.whatsapp.com/";
    return;
  }

  if (/\b(open gmail)\b/i.test(command)) {
    respond("Opening Gmail.", null);
    window.location.href = "https://mail.google.com/";
    return;
  }

  if (/\b(open instagram)\b/i.test(command)) {
    respond("Opening Instagram.", null);
    window.location.href = "https://www.instagram.com/";
    return;
  }

  if (/\b(open messages)\b/i.test(command)) {
    respond("Trying to open your messaging app.", null);
    window.location.href = "sms:";
    return;
  }

  if (/\b(open phone)\b/i.test(command)) {
    respond("Use your phone's Phone app to make calls.", null);
    return;
  }

  if (/\b(open camera|open settings|open chrome)\b/i.test(command)) {
    respond("This website cannot reliably launch that system app directly. Please open it from your phone's home screen.", null);
    return;
  }


  $("idea").value = command;
  if (/\b(build|make|create|develop|generate|design)\b/.test(low) &&
      /\b(app|website|site|tool|game|calculator|portfolio|tracker|quiz|todo|to-do|project)\b/.test(low)) {
    respond("I have placed your command in the app builder. Review it, then tap Build my app. This version generates starter templates, not arbitrary full apps.", null);
    $("idea").scrollIntoView({behavior:"smooth", block:"center"});
    say("I have placed your command in the app builder. Tap Build my app when you are ready.");
    return;
  }
  if (/\b(research|find out|look up|search)\b/.test(low)) {
    const q = command.replace(/^(jarvis[, ]*)?(please )?(research|search|look up|find out)\s*/i,"").trim() || command;
    respond("I can hand this topic to a web search. Review the sources yourself; this prototype does not verify claims automatically.", q);
    say("I prepared a research search. Open the link to review results.");
    return;
  }
  if (/\b(hack|hacking|cybersecurity|security testing|penetration test)\b/.test(low)) {
    respond("I can help with defensive cybersecurity learning: explain security concepts, review your own code, or plan practice in a legal training lab. I cannot help break into accounts, devices, or networks. Tell me the concept or code you want to learn.", null);
    say("I can help with defensive cybersecurity learning and authorised practice.");
    return;
  }
  if (/\b(trad(e|ing)|stock|market|chart|indicator|backtest)\b/.test(low)) {
    respond("I can help explain market concepts, indicators, and historical backtesting. This prototype cannot access live prices or place trades, and no strategy guarantees profit. For a real analysis, provide the data or chart details.", null);
    say("I can help with trading education and historical data analysis, but not guaranteed predictions.");
    return;
  }
  if (/\b(open.?source|github|repository|repo|code|programming|debug)\b/.test(low)) {
    respond("I can help you understand open-source code. Share the repository URL or paste a file into the chat where you are getting help. This local prototype cannot clone or execute arbitrary repositories by itself.", null);
    say("Share the repository link or code to get help understanding it.");
    return;
  }
  respond("I heard: “" + command + "”. I can build supported starter apps, prepare research searches, and give safe learning guidance. For a truly general AI agent, this interface still needs a connected language model and secure tools.", null);
  say("I heard your command. I need a connected AI model to handle more general tasks.");
}
function startVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    voiceStatus.textContent = "Speech recognition is not available in this browser. Try a current Chrome browser over HTTPS, or type your command instead.";
    voiceStatus.classList.add("voice-error");
    return;
  }
  try {
    recognition = new SR();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {voiceStatus.textContent = "Listening… speak now."; voiceButton.classList.add("listening");};
    recognition.onerror = (event) => {voiceStatus.textContent = "Voice input issue: " + event.error + ". You can type the command instead."; voiceStatus.classList.add("voice-error"); voiceButton.classList.remove("listening");};
    recognition.onend = () => {voiceButton.classList.remove("listening");};
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      $("idea").value = transcript;
      voiceStatus.textContent = "Heard: “" + transcript + "”";
      voiceStatus.classList.remove("voice-error");
      routeCommand(transcript);
    };
    recognition.start();
  } catch (e) {
    voiceStatus.textContent = "Could not start microphone. Check browser microphone permission, or type your command.";
    voiceStatus.classList.add("voice-error");
  }
}
voiceButton.addEventListener("click", startVoice);
$("speakReply").addEventListener("click", () => say(replyText.textContent));
document.querySelectorAll("[data-mode]").forEach(button => button.addEventListener("click", () => {
  const mode = button.dataset.mode;
  const prompts = {
    research: "Research the topic: ",
    code: "Explain this open-source repository or code: ",
    cyber: "Teach me defensive cybersecurity in an authorised practice environment: ",
    trading: "Explain this trading concept or analyse historical data: "
  };
  $("idea").value = prompts[mode];
  $("idea").focus();
  respond("Add your topic or details after the prompt. This local prototype can prepare a research search or provide safe guidance, but it does not have a full AI model connected yet.", null);
}));

let project = {};
let activeFile = "";
let lastIdea = "";
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const slug = (s) => (s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,36) || "jarvis-project");
const titleFrom = (s) => {
  const clean = s.replace(/^(please\s+)?(create|build|make|develop|design)\s+(me\s+)?(a|an|the)?\s*/i,"").replace(/\b(with|that has|which has)\b[\s\S]*/i,"").trim();
  return (clean.charAt(0).toUpperCase()+clean.slice(1)).slice(0,65) || "JARVIS Generated App";
};
const shell = (title, description, body, script) => ({
"index.html": `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#101827"><title>${esc(title)}</title><link rel="stylesheet" href="styles.css"></head>
<body><main class="app"><header><p class="eyebrow">JARVIS PROJECT</p><h1>${esc(title)}</h1><p class="desc">${esc(description)}</p></header>${body}<footer>Made with JARVIS Voice Agent V3</footer></main><script src="app.js"><\/script></body></html>`,
"styles.css": `:root{font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#eaf2ff;background:#0b1220}*{box-sizing:border-box}body{margin:0;padding:20px;background:radial-gradient(ellipse at top,#1b3552,#0b1220 65%);min-height:100vh}.app{max-width:760px;margin:0 auto;background:#111d2e;border:1px solid #30445e;border-radius:20px;padding:clamp(18px,5vw,32px);box-shadow:0 20px 70px #0004}h1{font-size:clamp(27px,5vw,40px);line-height:1.1;margin:0 0 10px}.eyebrow{color:#51dfff;font-size:11px;letter-spacing:.18em;font-weight:800}.desc{color:#afc2d9;line-height:1.6}section,.card{background:#0b1625;border:1px solid #2a4059;border-radius:13px;padding:16px;margin:14px 0}label{display:block;color:#a9c8e7;font-size:13px;margin-bottom:6px}input,textarea,select{width:100%;padding:11px;border:1px solid #38516b;border-radius:8px;background:#08111e;color:#f4f8ff;font:inherit;margin-bottom:10px}button{padding:10px 13px;border:1px solid #45bfe8;border-radius:9px;background:#1475a7;color:white;font:inherit;font-weight:700;cursor:pointer;margin:3px}button.secondary{background:#1b2b40;border-color:#3b526b}button.danger{background:#6d2535;border-color:#aa5365}.row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.row input{flex:1;min-width:150px;margin:0}.item{display:flex;align-items:center;gap:8px;padding:10px;border-bottom:1px solid #26394f;overflow-wrap:anywhere}.item span{flex:1}.item.done span{text-decoration:line-through;color:#7f95ad}.muted{color:#9fb2c8}.stat{font-size:30px;font-weight:800;color:#5de4ff}table{width:100%;border-collapse:collapse}td,th{text-align:left;padding:9px;border-bottom:1px solid #293e55}footer{font-size:12px;color:#8299b4;text-align:center;margin-top:22px}a{color:#60dcff} .result{font-size:24px;min-height:35px;overflow-wrap:anywhere}@media(min-width:600px){.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}}`,
"app.js": script
});
function todoApp(title, idea) {
 const body = `<section><label for="task">New task</label><div class="row"><input id="task" placeholder="What needs doing?"><button id="add">Add task</button></div><p class="muted">Your list is saved on this device in this browser.</p></section><section><div class="row"><strong>My tasks</strong><span id="count" class="muted"></span><button id="clearDone" class="secondary">Clear completed</button></div><div id="list"></div></section>`;
 const script = `const input=document.querySelector('#task'),list=document.querySelector('#list'),count=document.querySelector('#count');let tasks=[];try{tasks=JSON.parse(localStorage.getItem('jarvis-tasks')||'[]')}catch(e){}function save(){try{localStorage.setItem('jarvis-tasks',JSON.stringify(tasks))}catch(e){}render()}function render(){list.innerHTML='';tasks.forEach((t,i)=>{const row=document.createElement('div');row.className='item'+(t.done?' done':'');const check=document.createElement('input');check.type='checkbox';check.checked=t.done;check.setAttribute('aria-label','Mark '+t.text+' complete');check.onchange=()=>{tasks[i].done=check.checked;save()};const span=document.createElement('span');span.textContent=t.text;const del=document.createElement('button');del.className='danger';del.textContent='Delete';del.onclick=()=>{tasks.splice(i,1);save()};row.append(check,span,del);list.append(row)});count.textContent=tasks.length+' task(s)'}document.querySelector('#add').onclick=()=>{const text=input.value.trim();if(!text)return;tasks.push({text,done:false});input.value='';save();input.focus()};input.addEventListener('keydown',e=>{if(e.key==='Enter')document.querySelector('#add').click()});document.querySelector('#clearDone').onclick=()=>{tasks=tasks.filter(t=>!t.done);save()};render();`;
 return shell(title, "A simple task manager built from your command.", body, script);
}
function calculator(title) {
 const body = `<section><label for="display">Calculator display</label><input id="display" class="result" inputmode="decimal" placeholder="0" aria-label="Calculator display"><div id="keys" class="grid">${["7","8","9","÷","4","5","6","×","1","2","3","−","0",".","C","+","(",")","⌫","="].map(k=>`<button data-key="${k}">${k}</button>`).join("")}</div><p class="muted">Only basic arithmetic is evaluated. Invalid expressions are rejected.</p></section>`;
 const script = `const display=document.querySelector('#display');document.querySelector('#keys').addEventListener('click',e=>{const k=e.target.dataset.key;if(!k)return;if(k==='C'){display.value='';return}if(k==='⌫'){display.value=display.value.slice(0,-1);return}if(k==='='){const expr=display.value.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');if(!/^[0-9+*/().\\s-]+$/.test(expr)||!expr.trim()){display.value='Invalid expression';return}try{const result=Function('"use strict";return ('+expr+')')();display.value=Number.isFinite(result)?String(result):'Cannot divide by zero'}catch(err){display.value='Invalid expression'}return}if(display.value==='Invalid expression'||display.value==='Cannot divide by zero')display.value='';display.value+=k});display.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();document.querySelector('[data-key="="]').click()}});`;
 return shell(title, "A clean calculator for everyday arithmetic.", body, script);
}
function portfolio(title, idea) {
 const body = `<section><h2>About me</h2><p class="muted">Replace this sample text with your own introduction, interests, and goals.</p></section><div class="grid"><section><h2>Skills</h2><p>Skill one · Skill two · Skill three</p></section><section><h2>Projects</h2><p>Describe your best projects and what you learned.</p></section></div><section><h2>Contact</h2><label for="email">Contact email</label><input id="email" type="email" placeholder="you@example.com"><p class="muted">This demo does not send messages. Connect a trusted backend to enable a contact form.</p></section>`;
 return shell(title, "A responsive personal portfolio starter. Customize the sample content before publishing.", body, `document.querySelector('#email').addEventListener('change',e=>{e.target.setCustomValidity(e.target.validity.typeMismatch?'Enter a valid email address.':'')});`);
}
function quiz(title) {
 const body = `<section><h2>Quick knowledge quiz</h2><p id="question">Which language runs in a web browser?</p><div id="answers"><button data-answer="0">Python</button><button data-answer="1">JavaScript</button><button data-answer="0">SQL</button></div><p id="feedback" aria-live="polite" class="muted"></p><p>Score: <strong id="score">0</strong></p><button id="reset" class="secondary">Reset quiz</button></section>`;
 const script = `let score=0,answered=false;document.querySelector('#answers').addEventListener('click',e=>{if(!e.target.dataset.answer||answered)return;answered=true;if(e.target.dataset.answer==='1'){score++;document.querySelector('#feedback').textContent='Correct!';}else{document.querySelector('#feedback').textContent='Not quite. The answer is JavaScript.'}document.querySelector('#score').textContent=score});document.querySelector('#reset').onclick=()=>{score=0;answered=false;document.querySelector('#score').textContent='0';document.querySelector('#feedback').textContent='';};`;
 return shell(title, "A small interactive quiz starter. Replace the sample question and answers to customize it.", body, script);
}
function tracker(title, idea) {
 const body = `<section><h2>Add an entry</h2><div class="grid"><div><label for="label">Description</label><input id="label" placeholder="e.g. Travel"></div><div><label for="amount">Amount</label><input id="amount" type="number" min="0" step="0.01" placeholder="0.00"></div></div><button id="add">Add entry</button></section><section><div class="row"><h2>Total</h2><span id="total" class="stat">₹0.00</span></div><div id="entries"></div><button id="reset" class="danger">Clear all entries</button></section>`;
 const script = `let entries=[];const fmt=n=>'₹'+n.toFixed(2);function render(){document.querySelector('#total').textContent=fmt(entries.reduce((s,e)=>s+e.amount,0));const list=document.querySelector('#entries');list.innerHTML='';entries.forEach((e,i)=>{const row=document.createElement('div');row.className='item';const span=document.createElement('span');span.textContent=e.label+' — '+fmt(e.amount);const del=document.createElement('button');del.textContent='Delete';del.className='danger';del.onclick=()=>{entries.splice(i,1);render()};row.append(span,del);list.append(row)})}document.querySelector('#add').onclick=()=>{const label=document.querySelector('#label').value.trim(),amount=Number(document.querySelector('#amount').value);if(!label||!Number.isFinite(amount)||amount<0){alert('Enter a description and a non-negative amount.');return}entries.push({label,amount});document.querySelector('#label').value='';document.querySelector('#amount').value='';render()};document.querySelector('#reset').onclick=()=>{if(confirm('Clear all entries?')){entries=[];render()}};render();`;
 return shell(title, "A simple tracker starter. Entries remain in this page session only in this first version.", body, script);
}
function generic(title, idea) {
 const body = `<section><h2>Project brief</h2><p>${esc(idea)}</p><p class="muted">This is a starter scaffold because this idea doesn't match a built-in generator yet. The brief has been saved in the project README. Add your specific features to the code to complete the application.</p></section><div class="grid"><section><h2>Feature area A</h2><p class="muted">Add your first core feature here.</p><button id="demoAction">Try demo interaction</button><p id="demoResult" aria-live="polite"></p></section><section><h2>Feature area B</h2><p class="muted">Connect a real data source or create another feature module.</p></section></div><section><h2>Next steps</h2><ol><li>Confirm the exact user roles and screens.</li><li>Implement and test one feature at a time.</li><li>Only add backend services when needed.</li></ol></section>`;
 const script = `document.querySelector('#demoAction').onclick=()=>{document.querySelector('#demoResult').textContent='Demo interaction works. Replace this with your first real feature.'};`;
 return shell(title, "A general-purpose web app scaffold based on your idea.", body, script);
}
function buildFiles(idea) {
 const low=idea.toLowerCase(), title=titleFrom(idea);
 let built, kind;
 if(/to.?do|task list|task manager|checklist/.test(low)){built=todoApp(title,idea);kind="To-do list";}
 else if(/calculator|calculate|arithmetic/.test(low)){built=calculator(title);kind="Calculator";}
 else if(/portfolio|personal website|resume website/.test(low)){built=portfolio(title,idea);kind="Portfolio website";}
 else if(/quiz|trivia|multiple choice/.test(low)){built=quiz(title);kind="Quiz";}
 else if(/budget|expense|spending|income tracker|money tracker/.test(low)){built=tracker(title,idea);kind="Simple tracker";}
 else {built=generic(title,idea);kind="General starter scaffold";}
 const readme = `# ${title}\n\nGenerated by JARVIS Voice Agent V3 (local template engine).\n\n## Original request\n${idea}\n\n## Project type\n${kind}\n\n## Run locally\nOpen \`index.html\` in a modern browser. If the browser blocks local features, run the files through a static web server or publish the project with GitHub Pages.\n\n## Files\n- \`index.html\`: page structure\n- \`styles.css\`: responsive styling\n- \`app.js\`: interactive behaviour\n- \`README.md\`: this guide\n- \`TESTS.md\`: basic checks and known limits\n\n## Important\nThis is a template-generated starter, not a full AI-generated implementation. Review code before publishing. Do not add secrets, passwords, or API keys to frontend JavaScript. A real login, cloud database, payments, or private data needs a secure backend.\n`;
 const tests = `# Basic checks\n\n- [ ] index.html exists and includes a title.\n- [ ] styles.css exists and includes responsive layout rules.\n- [ ] app.js exists and contains the app interaction logic.\n- [ ] Preview loads without a visible browser error.\n- [ ] Try the main user action manually on mobile and desktop.\n\nThese are manual smoke-test notes. They are not a full automated test suite.\n`;
 return {...built, "README.md":readme, "TESTS.md":tests};
}
function renderFiles() {
 const list=$("fileList"); list.innerHTML="";
 Object.keys(project).forEach(name=>{
   const b=document.createElement("button"); b.className="file-btn"+(name===activeFile?" active":""); b.textContent=name; b.onclick=()=>{activeFile=name;renderFiles()}; list.append(b);
 });
 $("fileCount").textContent=Object.keys(project).length+" files";
 $("codeView").textContent=project[activeFile] || "";
}
function runChecks() {
 const checks=[
  ["index.html exists",!!project["index.html"]],
  ["CSS file exists",!!project["styles.css"]],
  ["JavaScript file exists",!!project["app.js"]],
  ["HTML has a viewport tag",/name="viewport"/i.test(project["index.html"]||"")],
  ["Generated app includes a script",/app\.js/i.test(project["index.html"]||"")],
  ["Project instructions included",!!project["README.md"] && !!project["TESTS.md"]]
 ];
 const ul=$("tests");ul.innerHTML="";
 checks.forEach(([name,pass])=>{const li=document.createElement("li");li.className=pass?"pass":"fail";li.textContent=(pass?"✓ ":"✗ ")+name;ul.append(li)});
 $("buildStatus").textContent=checks.every(x=>x[1])?"CHECKS PASSED":"CHECKS FAILED";
}
function build() {
 const idea=$("idea").value.trim();
 if(!idea){$("idea").focus();alert("Type a short app idea first.");return}
 lastIdea=idea;project=buildFiles(idea);activeFile="index.html";
 $("workspace").classList.remove("hidden");
 $("projectTitle").textContent=titleFrom(idea);
 $("plan").innerHTML="";
 ["Interpret the request and select a local starter template.","Generate HTML, CSS, JavaScript, and project documentation.","Load the generated HTML in a sandboxed preview.","Run basic structural checks; inspect the main interaction manually.","Package the project files into a ZIP for export."].forEach(step=>{const li=document.createElement("li");li.textContent=step;$("plan").append(li)});
 renderFiles();
 const previewDoc=project["index.html"].replace(/<link rel="stylesheet" href="styles.css">/i,`<style>${project["styles.css"]}</style>`).replace(/<script src="app.js"><\/script>/i,`<script>${project["app.js"]}<\/script>`);
 $("preview").srcdoc=previewDoc;
 runChecks();
 $("workspace").scrollIntoView({behavior:"smooth",block:"start"});
}
$("build").addEventListener("click",build);
$("clear").addEventListener("click",()=>{$("idea").value="";$("idea").focus()});
document.querySelectorAll("[data-example]").forEach(b=>b.addEventListener("click",()=>{$("idea").value=b.dataset.example;$("idea").focus()}));
$("rerun").addEventListener("click",runChecks);
$("download").addEventListener("click",()=>{
 if(!Object.keys(project).length){alert("Build a project first.");return}
 const blob=zipStore(project);
 const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=slug(titleFrom(lastIdea))+"-jarvis-project.zip";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);
});
function crc32(bytes){let c=-1;for(let i=0;i<bytes.length;i++){c^=bytes[i];for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xEDB88320:0)}return (c^-1)>>>0}
function u16(n){return [n&255,(n>>>8)&255]}
function u32(n){return [n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255]}
function join(parts){let length=parts.reduce((s,p)=>s+p.length,0),out=new Uint8Array(length),offset=0;parts.forEach(p=>{out.set(p,offset);offset+=p.length});return out}
function zipStore(entries){
 const enc=new TextEncoder(), local=[],central=[];let offset=0;
 for(const [name,content] of Object.entries(entries)){
  const n=enc.encode(name),data=enc.encode(content),crc=crc32(data);
  const lh=join([new Uint8Array(u32(0x04034b50)),new Uint8Array(u16(20)),new Uint8Array(u16(0)),new Uint8Array(u16(0)),new Uint8Array(u16(0)),new Uint8Array(u16(0)),new Uint8Array(u32(crc)),new Uint8Array(u32(data.length)),new Uint8Array(u32(data.length)),new Uint8Array(u16(n.length)),new Uint8Array(u16(0)),n,data]);
  local.push(lh);
  const ch=join([new Uint8Array(u32(0x02014b50)),new Uint8Array(u16(20)),new Uint8Array(u16(20)),new Uint8Array(u16(0)),new Uint8Array(u16(0)),new Uint8Array(u16(0)),new Uint8Array(u16(0)),new Uint8Array(u32(crc)),new Uint8Array(u32(data.length)),new Uint8Array(u32(data.length)),new Uint8Array(u16(n.length)),new Uint8Array(u16(0)),new Uint8Array(u16(0)),new Uint8Array(u16(0)),new Uint8Array(u16(0)),new Uint8Array(u32(0)),new Uint8Array(u32(offset)),n]);
  central.push(ch);offset+=lh.length;
 }
 const centralData=join(central),localData=join(local);
 const end=join([new Uint8Array(u32(0x06054b50)),new Uint8Array(u16(0)),new Uint8Array(u16(0)),new Uint8Array(u16(central.length)),new Uint8Array(u16(central.length)),new Uint8Array(u32(centralData.length)),new Uint8Array(u32(localData.length)),new Uint8Array(u16(0))]);
 return new Blob([localData,centralData,end],{type:"application/zip"});
}
})();