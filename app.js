 
/* JARVIS AI — Complete app.js replacement */
(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const ui = {
    idea:$("idea"), voice:$("voice"), build:$("build"), clear:$("clear"),
    voiceStatus:$("voiceStatus"), assistantReply:$("assistantReply"),
    speakReply:$("speakReply"), replyText:$("replyText"),
    researchLink:$("researchLink"), workspace:$("workspace"),
    projectTitle:$("projectTitle"), buildStatus:$("buildStatus"),
    plan:$("plan"), fileCount:$("fileCount"), fileList:$("fileList"),
    codeView:$("codeView"), preview:$("preview"), rerun:$("rerun"),
    tests:$("tests"), download:$("download")
  };

  const MEMORY_KEY = "jarvis_memory_v1";
  const state = {
    memory:loadMemory(), files:[], lastReply:"",
    listening:false, recognition:null, projectName:"My App"
  };

  // Keep this empty until a secure AI backend is configured.
  // Never put private API keys in browser JavaScript.
  const AI_BACKEND_URL = "";

  function loadMemory() {
    try {
      const m = JSON.parse(localStorage.getItem(MEMORY_KEY) || "{}");
      return {
        facts:Array.isArray(m.facts) ? m.facts : [],
        corrections:Array.isArray(m.corrections) ? m.corrections : [],
        commands:Array.isArray(m.commands) ? m.commands : []
      };
    } catch {
      return {facts:[], corrections:[], commands:[]};
    }
  }

  function saveMemory() {
    try {
      localStorage.setItem(MEMORY_KEY, JSON.stringify(state.memory));
      return true;
    } catch {
      return false;
    }
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;",
      '"':"&quot;", "'":"&#39;"
    })[c]);
  }

  function respond(message, speak=false) {
    state.lastReply = message;
    if (ui.assistantReply) ui.assistantReply.hidden = false;
    if (ui.replyText) ui.replyText.textContent = message;
    if (ui.voiceStatus) ui.voiceStatus.textContent =
      state.listening ? "Listening…" : "Ready";
    if (speak) say(message);
  }

  function say(message) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(String(message));
    speech.lang = "en-IN";
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  }

  function openURL(url) {
    const tab = window.open(url, "_blank", "noopener,noreferrer");
    if (!tab) window.location.href = url;
  }

  const apps = [
    [["youtube","you tube"],"YouTube","https://youtube.com/"],
    [["maps","google maps"],"Google Maps","https://maps.google.com/"],
    [["google"],"Google","https://google.com/"],
    [["whatsapp","what's app"],"WhatsApp","https://wa.me/"],
    [["spotify","music"],"Spotify","https://open.spotify.com/"],
    [["gmail","email"],"Gmail","https://mail.google.com/"],
    [["instagram","insta"],"Instagram","https://instagram.com/"],
    [["facebook"],"Facebook","https://facebook.com/"],
    [["telegram"],"Telegram","https://web.telegram.org/"],
    [["github"],"GitHub","https://github.com/"],
    [["chatgpt","chat gpt"],"ChatGPT","https://chatgpt.com/"],
    [["amazon"],"Amazon","https://amazon.in/"],
    [["myntra"],"Myntra","https://myntra.com/"],
    [["play store","playstore"],"Play Store","https://play.google.com/store"],
    [["chrome","browser"],"Google Search","https://google.com/"],
    [["settings"],"Android Settings",
      "intent:#Intent;action=android.settings.SETTINGS;end"]
  ];

  function remember(text) {
    const fact = text.trim().slice(0,500);
    if (!fact) return respond("Tell me what to remember.",true);
    if (!state.memory.facts.includes(fact)) state.memory.facts.push(fact);
    respond(saveMemory()
      ? "Saved in my local memory: " + fact
      : "Could not save memory. Check your browser storage.",true);
  }

  function correct(text) {
    state.memory.corrections.push({
      text:text.trim().slice(0,500),
      date:new Date().toISOString()
    });
    state.memory.corrections = state.memory.corrections.slice(-100);
    saveMemory();
    respond("Correction saved. I can refer to it in this browser in future.",true);
  }

  function showMemory() {
    const m = state.memory;
    respond(
      "MY SAVED MEMORY\n\nFACTS:\n" +
      (m.facts.map((x,i)=>`${i+1}. ${x}`).join("\n") || "(none)") +
      "\n\nCORRECTIONS:\n" +
      (m.corrections.map((x,i)=>`${i+1}. ${x.text}`).join("\n") || "(none)") +
      "\n\nCUSTOM COMMANDS:\n" +
      (m.commands.map(x=>`When I say ${x.trigger}, do ${x.action}`).join("\n") || "(none)") +
      "\n\nStored locally in this browser.",false
    );
  }

  function forgetMemory() {
    state.memory = {facts:[],corrections:[],commands:[]};
    saveMemory();
    respond("Saved memories and custom commands cleared.",true);
  }

  function addCommand(text) {
    const m = text.match(/when i say\s+(.+?),?\s+do\s+(.+)/i);
    if (!m) return respond(
      'Use: "When I say study time, do open YouTube."',true);
    const trigger = m[1].trim().toLowerCase();
    const action = m[2].trim();
    state.memory.commands = state.memory.commands.filter(x=>x.trigger!==trigger);
    state.memory.commands.push({trigger,action});
    saveMemory();
    respond("Custom command saved: " + trigger,true);
  }

  function calculatorHTML() {
    return `<!doctype html><html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Calculator</title><style>body{font:20px system-ui;background:#0f172a;color:white;display:grid;place-items:center;min-height:100vh}.box{padding:20px;background:#1e293b;border-radius:18px;width:min(330px,90vw)}input{box-sizing:border-box;width:100%;font-size:28px;padding:10px}.keys{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px}button{font-size:20px;padding:14px;border:0;border-radius:9px}</style><div class="box"><h2>Calculator</h2><input id="d" readonly value="0"><div class="keys">${["7","8","9","/","4","5","6","*","1","2","3","-","C","0","=","+"].map(k=>`<button onclick="press('${k}')">${k}</button>`).join("")}</div></div><script>let v='',d=document.getElementById('d');function press(k){if(k==='C')v='';else if(k==='='){try{if(!/^[0-9+*/. -]+$/.test(v))throw 0;v=String(Function('return ('+v+')')())}catch(e){v='Error'}}else v+=k;d.value=v||'0'}</script></html>`;
  }

  function todoHTML() {
    return `<!doctype html><html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tasks</title><style>body{font:18px system-ui;max-width:600px;margin:30px auto;padding:15px}input,button{padding:12px}li{padding:12px;cursor:pointer}</style><h1>My Tasks</h1><input id="task" placeholder="New task"><button onclick="add()">Add</button><ul id="list"></ul><script>function add(){let i=document.getElementById('task'),s=i.value.trim();if(!s)return;let x=document.createElement('li');x.textContent='□ '+s;x.onclick=()=>{x.style.textDecoration=x.style.textDecoration?'':'line-through'};document.getElementById('list').append(x);i.value=''}document.getElementById('task').addEventListener('keydown',e=>{if(e.key==='Enter')add()})</script></html>`;
  }

  function portfolioHTML() {
    return `<!doctype html><html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Portfolio</title><style>body{font:18px system-ui;background:#0f172a;color:white;margin:0}header{padding:55px 20px;background:#2563eb;text-align:center}main{max-width:700px;margin:auto;padding:20px}.card{padding:20px;background:#1e293b;border-radius:14px;margin:14px 0}</style><header><h1>Your Name</h1><p>Student • Creator</p></header><main><section class="card"><h2>About Me</h2><p>Write your introduction here.</p></section><section class="card"><h2>Skills and Projects</h2><p>Add your projects here.</p></section><section class="card"><h2>Contact</h2><p>your-email@example.com</p></section></main></html>`;
  }

  function genericHTML(title, description) {
    return `<!doctype html><html><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHTML(title)}</title><style>body{font:18px system-ui;background:#0f172a;color:white;padding:24px;max-width:700px;margin:auto}main{padding:22px;background:#1e293b;border-radius:16px}textarea{width:95%;padding:10px}button{padding:12px;background:#0284c7;color:white;border:0;border-radius:8px}</style><main><h1>${escapeHTML(title)}</h1><p>${escapeHTML(description)}</p><textarea id="note" rows="4" placeholder="Write here"></textarea><p><button onclick="document.getElementById('result').textContent='Saved for this session.'">Save</button></p><p id="result"></p></main></html>`;
  }

  function buildApp(prompt) {
    const p = prompt.toLowerCase();
    let title = "My Web App";
    let html = genericHTML(title,prompt);

    if (p.includes("calculator")) {
      title = "Calculator"; html = calculatorHTML();
    } else if (/to.?do|task list|todo/.test(p)) {
      title = "To-do List"; html = todoHTML();
    } else if (/portfolio|personal website/.test(p)) {
      title = "Portfolio"; html = portfolioHTML();
    } else if (/quiz|trivia/.test(p)) {
      title = "Quiz";
      html = `<!doctype html><html><meta name="viewport" content="width=device-width,initial-scale=1"><h1>Quick Quiz</h1><h3>Which planet is called the Red Planet?</h3><button onclick="r.textContent='Try again'">Earth</button><button onclick="r.textContent='Correct!'">Mars</button><button onclick="r.textContent='Try again'">Venus</button><p id="r"></p></html>`;
    } else if (/habit|tracker/.test(p)) {
      title = "Habit Tracker";
      html = `<!doctype html><html><meta name="viewport" content="width=device-width,initial-scale=1"><h1>Daily Habit Tracker</h1>${["Drink water","Study","Exercise","Read","Sleep on time"].map(x=>`<p><label><input type="checkbox"> ${x}</label></p>`).join("")}</html>`;
    } else {
      const match = prompt.match(/(?:called|named)\s+(.+)/i);
      if (match) title = match[1].slice(0,60);
      html = genericHTML(title,prompt);
    }

    state.projectName = title;
    state.files = [
      {name:"index.html",content:html},
      {name:"README.md",content:`# ${title}\n\nStarter project made with JARVIS.\n\nOpen index.html in a modern browser.\n`}
    ];
    renderProject();
    respond(title + " is ready in the preview.",true);
  }

  function renderProject() {
    if (ui.workspace) ui.workspace.hidden = false;
    if (ui.projectTitle) ui.projectTitle.textContent = state.projectName;
    if (ui.buildStatus) ui.buildStatus.textContent = "Build complete";
    if (ui.plan) ui.plan.textContent = "Starter project created. Open the preview to test it.";
    if (ui.fileCount) ui.fileCount.textContent = String(state.files.length);
    if (ui.fileList) ui.fileList.innerHTML =
      state.files.map(f=>`<div>${escapeHTML(f.name)}</div>`).join("");
    if (ui.codeView) ui.codeView.textContent = state.files[0]?.content || "";
    if (ui.preview) ui.preview.srcdoc = state.files[0]?.content || "";
    if (ui.tests) ui.tests.textContent = "Project files created. Test the preview manually.";
  }

  function buildFromInput() {
    const text = (ui.idea?.value || "").trim();
    if (!text) return respond("Describe an app to build, such as a calculator.",true);
    buildApp(text);
  }

  function clearWorkspace() {
    state.files = [];
    if (ui.workspace) ui.workspace.hidden = true;
    if (ui.idea) ui.idea.value = "";
    if (ui.fileCount) ui.fileCount.textContent = "0";
    respond("Workspace cleared.",true);
  }

  function downloadFiles() {
    if (!state.files.length) return respond("Build an app first.",true);
    state.files.forEach((f,i)=>setTimeout(()=>{
      const blob = new Blob([f.content],{type:"text/plain;charset=utf-8"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href=url; a.download=f.name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1500);
    },i*400));
    respond("Downloading project files separately.",true);
  }

  async function askAI(message) {
    if (!AI_BACKEND_URL) {
      return respond("Online AI is not connected yet. I can run commands, save memories, build starter apps, or search Google. A secure backend is required for AI-model answers.",true);
    }
    try {
      const res = await fetch(AI_BACKEND_URL,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          message,
          memory:state.memory.facts.slice(-20),
          corrections:state.memory.corrections.slice(-10)
        })
      });
      if (!res.ok) throw new Error("AI request failed");
      const data = await res.json();
      if (typeof data.reply !== "string") throw new Error("Invalid response");
      respond(data.reply,true);
    } catch {
      respond("AI service unavailable. Check your secure backend configuration.",true);
    }
  }

  async function command(raw) {
    const text = String(raw || "").trim();
    const q = text.toLowerCase().replace(/[.!?]+$/,"");
    if (!q) return respond("I didn't hear a command.",true);

    if (/^(remember|remember that|remember this)\s+/i.test(text))
      return remember(text.replace(/^(remember|remember that|remember this)\s+/i,""));

    if (/^(correction|learn this correction|you are wrong)\s*:/i.test(text))
      return correct(text.replace(/^(correction|learn this correction|you are wrong)\s*:/i,""));

    if (/^when i say\b/i.test(text)) return addCommand(text);
    if (/^(show|view|list) (my )?(memory|memories)$/.test(q)) return showMemory();
    if (/^(forget|delete|clear) (all )?(my )?(memory|memories)$/.test(q)) return forgetMemory();

    const custom = state.memory.commands.find(c=>q===c.trigger);
    if (custom) return command(custom.action);

    if (/^(hello|hi|hey|hey jarvis|good morning|good evening)\b/.test(q))
      return respond("Hello! JARVIS is online. What can I do for you?",true);

    if (/what time|current time|time is it/.test(q))
      return respond("The time is "+new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),true);

    if (/what date|today'?s date|date today/.test(q))
      return respond("Today is "+new Date().toLocaleDateString(undefined,{dateStyle:"full"}),true);

    if (/stop speaking|stop talking|be quiet/.test(q)) {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      return respond("Voice stopped.");
    }

    if (/clear workspace|clear project/.test(q)) return clearWorkspace();

    if (/\b(build|create|make|generate)\b/.test(q) &&
        /\b(app|website|calculator|to.?do|portfolio|quiz|tracker|project)\b/.test(q)) {
      const idea = text.replace(/^(jarvis[, ]*)?(please )?(build|create|make|generate)( me)?\s*/i,"");
      if (ui.idea) ui.idea.value = idea || text;
      return buildApp(idea || text);
    }

    if (/^(open|launch|start|go to)\b/.test(q)) {
      const app = apps.find(([names])=>names.some(name=>q.includes(name)));
      if (app) {
        respond("Opening "+app[1]+". Your browser may open its website instead of the installed app.",true);
        openURL(app[2]);
        return;
      }
      return respond("Try opening YouTube, Maps, WhatsApp, Spotify, Gmail, Instagram, ChatGPT, or Settings.",true);
    }

    if (/^(search|research|look up|google)\b/.test(q)) {
      const query = text.replace(/^(search|research|look up|google)( for)?\s*/i,"").trim();
      respond("Searching Google.",true);
      openURL(query ? "https://www.google.com/search?q="+encodeURIComponent(query) : "https://google.com/");
      return;
    }

    if (/^(help|what can you do|commands|who are you)$/.test(q))
      return respond("Try open YouTube; search for badminton rackets; remember that I like guitar; show my memory; when I say study time, do open YouTube; build a calculator app; or what time is it.",true);

    return askAI(text);
  }

  function startVoice() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return respond("Voice recognition may not be supported in this browser. Try Chrome and allow microphone access.",true);
    if (state.listening && state.recognition) {
      state.recognition.stop();
      return;
    }
    const r = new Recognition();
    state.recognition = r;
    r.lang = "en-IN";
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onstart = () => {
      state.listening = true;
      if (ui.voiceStatus) ui.voiceStatus.textContent = "Listening…";
    };
    r.onresult = e => command(e.results[0][0].transcript);
    r.onerror = e => respond("Voice error: "+e.error+". Check microphone permissions.");
    r.onend = () => {
      state.listening = false;
      if (ui.voiceStatus) ui.voiceStatus.textContent = "Ready";
    };
    try { r.start(); } catch { respond("Please try voice again in a moment."); }
  }

  if (ui.voice) ui.voice.addEventListener("click",startVoice);
  if (ui.build) ui.build.addEventListener("click",buildFromInput);
  if (ui.clear) ui.clear.addEventListener("click",clearWorkspace);
  if (ui.speakReply) ui.speakReply.addEventListener("click",()=>say(state.lastReply || "I'm ready."));
  if (ui.rerun) ui.rerun.addEventListener("click",renderProject);
  if (ui.download) ui.download.addEventListener("click",downloadFiles);

  document.querySelectorAll("[data-example]").forEach(button=>{
    button.addEventListener("click",()=>{
      if (ui.idea) ui.idea.value = button.getAttribute("data-example") || "";
      buildFromInput();
    });
  });

  if (ui.idea) ui.idea.addEventListener("keydown",e=>{
    if (e.key==="Enter" && !e.shiftKey) {
      e.preventDefault();
      const text=ui.idea.value.trim();
      if (/^(open|launch|start|go to|search|research|google|remember|when i say|show my memory|view my memory|forget my memory|what time|what date|hello|hi|hey jarvis|help|stop speaking|clear workspace|correction)\b/i.test(text)) command(text);
      else buildFromInput();
    }
  });

  respond("JARVIS is ready. Tap Voice and allow microphone access, or type an app idea.",false);
})();

 
