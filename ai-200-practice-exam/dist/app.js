(()=>{
  const {DOMAINS,QUESTION_BANK,CASES,LOCKED_SET}=window.AI200_DATA;
  const app=document.getElementById("app");
  const letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let state=null,timerId=null,selectedMode="exam";

  const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const same=(a,b)=>Array.isArray(a)&&Array.isArray(b)?a.length===b.length&&a.every((v,i)=>v===b[i]):a===b;
  const fmt=t=>`${String(Math.floor(t/60)).padStart(2,"0")}:${String(t%60).padStart(2,"0")}`;
  function pick(domain,n){return shuffle(QUESTION_BANK.filter(x=>x.domain===domain)).slice(0,n)}

  function welcome(){
    clearInterval(timerId);state=null;
    const history=JSON.parse(localStorage.getItem("ai200-history")||"[]");
    app.innerHTML=`<main class="welcome"><section class="welcome-card">
      <header class="welcome-head"><div class="eyebrow">Microsoft-style practice environment</div><h1>AI-200 Exam Simulator</h1><p>Practice the decisions, timing, navigation, and question patterns used in role-based Microsoft certification exams.</p></header>
      <div class="welcome-body">
        <h2>Choose a session</h2>
        <div class="notice"><strong>Exam-like, not an official Microsoft exam.</strong> The full simulation uses Microsoft's 100-minute no-lab profile and 50 questions within the usual 40–60 range. The real introduction screen confirms the actual sections and whether a lab is present.</div>
        <div class="mode-grid">
          <button class="mode-card selected" data-mode="exam"><strong>Full simulation</strong><span>50 questions · 100 minutes · case study · locked Yes/No set · no lab</span></button>
          <button class="mode-card" data-mode="quick"><strong>Quick assessment</strong><span>20 questions · 40 minutes · weighted across all four domains</span></button>
          <button class="mode-card" data-mode="case"><strong>Case study drill</strong><span>5 questions · scenario tabs · review before leaving · no separate timer</span></button>
          <button class="mode-card" data-mode="study"><strong>Study mode</strong><span>All ${QUESTION_BANK.length+CASES.reduce((n,c)=>n+c.questions.length,0)+LOCKED_SET.questions.length} questions · no timer · immediate explanations</span></button>
        </div>
        <h3>What the simulator reproduces</h3>
        <ul><li>Question counter, timer, review flags, comments, section review, and exam summary</li><li>Single choice, multiple response, build-list ordering, case studies, and non-reviewable problem/solution items</li><li>Question selection aligned to exam domain ranges and a weak-area report</li><li>Optional Microsoft Learn reference panel while the clock continues</li></ul>
        ${history.length?`<p><strong>Last attempt:</strong> ${history[0].score}/1000 · ${history[0].passed?"Pass":"Not passed"} · ${esc(history[0].date)}</p>`:""}
        <div class="actions"><button id="start" class="primary">Begin session</button></div>
      </div></section></main>`;
    document.querySelectorAll(".mode-card").forEach(b=>b.onclick=()=>{document.querySelectorAll(".mode-card").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");selectedMode=b.dataset.mode});
    document.getElementById("start").onclick=()=>showInstructions();
  }

  function showInstructions(){
    const isExam=selectedMode==="exam";
    app.innerHTML=`<main class="welcome"><section class="welcome-card"><header class="welcome-head"><div class="eyebrow">Instructions</div><h1>${isExam?"Exam overview":"Practice overview"}</h1></header><div class="welcome-body">
      <p>This session is delivered in English. Read every instruction carefully before answering.</p>
      <ul>
        <li>${isExam?"You have 100 minutes for 50 questions. This simulates an associate exam without a lab.":selectedMode==="quick"?"You have 40 minutes for 20 questions.":selectedMode==="case"?"This drill contains one case study with five questions and no separate timer.":"There is no time limit and explanations are available as you work."}</li>
        <li>Most questions can be reviewed until you leave their section.</li>
        <li>Case study details remain available in tabs while you answer that case.</li>
        <li>In a problem/solution set, selecting <strong>Next</strong> locks the answer. You cannot return.</li>
        <li>A break keeps the clock running and locks all questions already viewed.</li>
        <li>There is no penalty for guessing. Answer every question.</li>
      </ul>
      <div class="warning">The real exam can vary in question count, order, case studies, and labs. Microsoft reveals the exact structure on the introduction screen when the exam starts.</div>
      <label class="flag"><input id="ack" type="checkbox"> I have read the instructions.</label>
      <div class="actions"><button class="secondary" id="backWelcome">Back</button><button class="primary" id="launch" disabled>Start exam</button></div>
    </div></section></main>`;
    document.getElementById("backWelcome").onclick=welcome;
    document.getElementById("ack").onchange=e=>document.getElementById("launch").disabled=!e.target.checked;
    document.getElementById("launch").onclick=startSession;
  }

  function startSession(){
    let sections=[];let seconds=0;
    if(selectedMode==="exam"){
      const caseStudy=CASES[Math.floor(Math.random()*CASES.length)];
      const main=window.AI200_DATA.selectExamQuestions(caseStudy,shuffle);
      const caseSection={id:"case",title:`Case study: ${caseStudy.title}`,questions:caseStudy.questions,caseData:caseStudy.tabs,reviewable:true};
      const mainSection={id:"main",title:"General questions",questions:main,reviewable:true};
      sections=Math.random()<.5?[caseSection,mainSection]:[mainSection,caseSection];
      sections.push({id:"locked",title:LOCKED_SET.title,questions:LOCKED_SET.questions,scenario:LOCKED_SET.scenario,reviewable:false});seconds=6000;
    }else if(selectedMode==="quick"){
      sections=[{id:"quick",title:"Quick assessment",questions:shuffle([...pick("containers",4),...pick("data",6),...pick("services",5),...pick("operations",5)]),reviewable:true}];seconds=2400;
    }else if(selectedMode==="case"){
      const caseStudy=CASES[Math.floor(Math.random()*CASES.length)];
      sections=[{id:"case",title:`Case study: ${caseStudy.title}`,questions:caseStudy.questions,caseData:caseStudy.tabs,reviewable:true}];seconds=0;
    }else{
      const all=[...QUESTION_BANK,...CASES.flatMap(c=>c.questions),...LOCKED_SET.questions.map(x=>({...x,locked:false}))];
      sections=[{id:"study",title:"Study mode",questions:shuffle(all),reviewable:true}];seconds=0;
    }
    sections=sections.map(section=>({...section,questions:section.questions.map(question=>window.AI200_DATA.prepareQuestion(question,shuffle))}));
    const flat=sections.flatMap((s,si)=>s.questions.map((x,qi)=>({...x,sectionIndex:si,indexInSection:qi,sectionTitle:s.title})));
    state={mode:selectedMode,sections,flat,current:0,answers:{},flags:{},comments:{},lockedBefore:-1,seconds,started:Date.now(),checked:{}};
    if(seconds){timerId=setInterval(()=>{state.seconds--;const el=document.getElementById("timer");if(el)el.textContent=fmt(state.seconds);if(state.seconds<=0){clearInterval(timerId);finish(true)}},1000)}
    renderQuestion();
  }

  function current(){return state.flat[state.current]}
  function sectionFor(q){return state.sections[q.sectionIndex]}
  function isAnswered(q){const a=state.answers[q.id];return Array.isArray(a)?a.length>0:a!==undefined&&a!==null}
  function isCorrect(q){const a=state.answers[q.id];if(q.type==="multi"){return same([...(a||[])].sort(),[...q.answer].sort())}return same(a,q.answer)}

  function renderQuestion(){
    const qn=current(),section=sectionFor(qn),answered=Object.values(state.answers).filter((_,i)=>i>=0).length;
    app.innerHTML=`<div class="shell"><header class="topbar"><div class="brand">AI-200</div><div class="exam-name">Developing AI Cloud Solutions on Azure</div><div class="top-spacer"></div>${state.seconds?`<div id="timer" class="timer">${fmt(state.seconds)}</div>`:"<div class='timer'>Study mode</div>"}<div class="top-count">Question ${state.current+1} of ${state.flat.length}</div></header>
      <div class="exam-layout"><aside class="sidebar"><div class="section-label">${esc(section.title)}</div><div>${answered} answered</div><div class="progress-line"><div class="progress-fill" style="width:${Math.round((state.current+1)/state.flat.length*100)}%"></div></div><div class="nav-grid">${state.flat.map((x,i)=>navDot(x,i)).join("")}</div>
      <div class="side-tools"><button id="learn">▤ Microsoft Learn</button>${state.mode!=="study"?'<button id="break">Ⅱ Take a break</button>':""}<button id="overview">☰ Exam overview</button></div></aside>
      <main class="workspace">${questionMarkup(qn,section)}</main></div>
      <footer class="bottombar"><label class="flag"><input id="flag" type="checkbox" ${state.flags[qn.id]?"checked":""} ${qn.locked?"disabled":""}> Mark for review</label><button class="quiet" id="comment">Comment</button><div class="bottom-spacer"></div><button class="secondary" id="prev" ${!canGo(state.current-1)?"disabled":""}>Previous</button>${state.mode==="study"?'<button class="secondary" id="check">Check answer</button>':""}<button class="primary" id="next">${state.current===state.flat.length-1?"Finish":"Next"}</button></footer></div>`;
    bindQuestion(qn);
  }

  function navDot(qn,i){
    const futureLocked=qn.locked&&i>state.current;const pastLocked=i<=state.lockedBefore;
    const cls=["qdot",i===state.current?"current":"",isAnswered(qn)?"answered":"",state.flags[qn.id]?"flagged":"",futureLocked||pastLocked?"locked":""].join(" ");
    return `<button class="${cls}" data-index="${i}" ${!canGo(i)?"disabled":""} aria-label="Question ${i+1}">${i+1}</button>`;
  }
  function canGo(i){if(i<0||i>=state.flat.length)return false;if(i<=state.lockedBefore)return false;const target=state.flat[i],now=current();if(target.locked&&i!==state.current)return false;return target.sectionIndex===now.sectionIndex}

  function questionMarkup(qn,section){
    const meta=`<div class="question-meta"><span>${esc(DOMAINS[qn.domain])}</span><span class="pill">${labelType(qn)}</span></div>`;
    const body=`<div class="question-title">Question ${state.current+1}</div>${section.scenario?`<div class="notice"><strong>Scenario</strong><br>${esc(section.scenario)}</div>`:""}<div class="prompt">${esc(qn.prompt)}</div><div class="instruction">${instruction(qn)}</div>${optionMarkup(qn)}${state.mode==="study"&&state.checked[qn.id]?feedbackMarkup(qn):""}`;
    if(!section.caseData)return meta+body;
    const tabs=Object.keys(section.caseData);const active=section.activeTab||tabs[0];
    return `${meta}<div class="case-layout"><section class="case-panel"><div class="tabs">${tabs.map(t=>`<button class="tab ${t===active?"active":""}" data-tab="${esc(t)}">${esc(t)}</button>`).join("")}</div><div class="case-content"><h3>${esc(active)}</h3><p>${esc(section.caseData[active])}</p></div></section><section>${body}</section></div>`;
  }
  function labelType(qn){return qn.type==="multi"?`Choose ${qn.choose||qn.answer.length}`:qn.type==="order"?"Build list":qn.type==="yesno"?"Yes / No":"Single choice"}
  function instruction(qn){if(qn.type==="multi")return `Select ${qn.choose||qn.answer.length} answers.`;if(qn.type==="order")return "Arrange all steps in the correct order.";if(qn.locked)return "You cannot return after selecting Next.";return "Select the best answer."}
  function optionMarkup(qn){
    if(qn.type==="order"){
      const arr=state.answers[qn.id]||shuffle(qn.options);if(!state.answers[qn.id])state.answers[qn.id]=arr;
      return `<div class="order-list">${arr.map((x,i)=>`<div class="order-row"><div class="order-rank">${i+1}</div><div>${esc(x)}</div><div class="order-controls"><button data-move="up" data-pos="${i}" ${i===0?"disabled":""}>↑</button><button data-move="down" data-pos="${i}" ${i===arr.length-1?"disabled":""}>↓</button></div></div>`).join("")}</div>`;
    }
    const chosen=state.answers[qn.id];return `<div class="options">${qn.options.map((o,i)=>{const sel=qn.type==="multi"?(chosen||[]).includes(i):chosen===i;return `<label class="option ${sel?"selected":""}"><input type="${qn.type==="multi"?"checkbox":"radio"}" name="answer" value="${i}" ${sel?"checked":""}><span class="letter">${letters[i]}.</span><span>${esc(o)}</span></label>`}).join("")}</div>`;
  }

  function bindQuestion(qn){
    document.querySelectorAll("input[name=answer]").forEach(el=>el.onchange=e=>{
      const v=+e.target.value;if(qn.type==="multi"){let a=[...(state.answers[qn.id]||[])];a=e.target.checked?[...a,v]:a.filter(x=>x!==v);state.answers[qn.id]=a}else state.answers[qn.id]=v;renderQuestion();
    });
    document.querySelectorAll("[data-move]").forEach(b=>b.onclick=()=>{const a=[...state.answers[qn.id]],i=+b.dataset.pos,j=b.dataset.move==="up"?i-1:i+1;[a[i],a[j]]=[a[j],a[i]];state.answers[qn.id]=a;renderQuestion()});
    document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{sectionFor(qn).activeTab=b.dataset.tab;renderQuestion()});
    document.querySelectorAll("[data-index]").forEach(b=>b.onclick=()=>{state.current=+b.dataset.index;renderQuestion()});
    document.getElementById("flag").onchange=e=>{state.flags[qn.id]=e.target.checked;renderQuestion()};
    document.getElementById("prev").onclick=()=>{if(canGo(state.current-1)){state.current--;renderQuestion()}};
    document.getElementById("next").onclick=next;
    document.getElementById("comment").onclick=()=>commentModal(qn);
    document.getElementById("learn").onclick=learnDrawer;
    document.getElementById("overview").onclick=()=>reviewModal(false);
    const br=document.getElementById("break");if(br)br.onclick=breakModal;
    const chk=document.getElementById("check");if(chk)chk.onclick=()=>{if(!isAnswered(qn))return alert("Select an answer first.");state.checked[qn.id]=true;renderQuestion()};
  }

  function next(){
    const qn=current();if(qn.locked&&!isAnswered(qn))return alert("You must answer this question before continuing.");
    if(qn.locked)state.lockedBefore=state.current;
    if(state.current===state.flat.length-1)return reviewModal(true);
    const nextQ=state.flat[state.current+1];
    if(nextQ.sectionIndex!==qn.sectionIndex)return reviewModal(true);
    state.current++;renderQuestion();
  }

  function reviewModal(sectionEnd){
    const qn=current(),si=qn.sectionIndex,items=sectionEnd?state.flat.filter(x=>x.sectionIndex===si):state.flat;
    const unanswered=items.filter(x=>!isAnswered(x)).length,flagged=items.filter(x=>state.flags[x.id]).length;
    app.insertAdjacentHTML("beforeend",`<div class="modal-backdrop" id="modal"><section class="modal"><h2>${sectionEnd?"Review this section":"Exam overview"}</h2><p>${unanswered} unanswered · ${flagged} marked for review</p><div class="review-list">${items.map(x=>{const i=state.flat.indexOf(x);return `<div class="review-row"><strong>Q${i+1}</strong><span>${esc(x.prompt.slice(0,76))}${x.prompt.length>76?"…":""}</span><span class="${!isAnswered(x)?"status-unanswered":state.flags[x.id]?"status-flagged":""}">${!isAnswered(x)?"Unanswered":state.flags[x.id]?"Review":"Answered"}</span></div>`}).join("")}</div><div class="actions"><button class="secondary" id="closeModal">Return</button>${sectionEnd?`<button class="primary" id="leaveSection">${state.current===state.flat.length-1?"Submit exam":"Finish section"}</button>`:""}</div></section></div>`);
    document.getElementById("closeModal").onclick=()=>document.getElementById("modal").remove();
    const leave=document.getElementById("leaveSection");if(leave)leave.onclick=()=>{
      if(state.current===state.flat.length-1)return finish(false);
      const end=Math.max(...state.flat.map((x,i)=>x.sectionIndex===si?i:-1));state.lockedBefore=Math.max(state.lockedBefore,end);state.current=end+1;renderQuestion();
    };
  }

  function commentModal(qn){
    app.insertAdjacentHTML("beforeend",`<div class="modal-backdrop" id="modal"><section class="modal"><h2>Comment on question</h2><p>Your comment is stored only in this browser.</p><textarea id="commentText" rows="6" style="width:100%;padding:10px">${esc(state.comments[qn.id]||"")}</textarea><div class="actions"><button class="secondary" id="cancel">Cancel</button><button class="primary" id="saveComment">Save comment</button></div></section></div>`);
    document.getElementById("cancel").onclick=()=>document.getElementById("modal").remove();document.getElementById("saveComment").onclick=()=>{state.comments[qn.id]=document.getElementById("commentText").value;document.getElementById("modal").remove()};
  }
  function breakModal(){
    app.insertAdjacentHTML("beforeend",`<div class="modal-backdrop" id="modal"><section class="modal"><h2>Take a break</h2><p>The exam clock continues. You will not be able to return to any question you have already viewed, including unanswered or flagged questions.</p><div class="actions"><button class="secondary" id="cancel">Return to exam</button><button class="primary" id="startBreak">Start break</button></div></section></div>`);
    document.getElementById("cancel").onclick=()=>document.getElementById("modal").remove();document.getElementById("startBreak").onclick=()=>{state.lockedBefore=Math.max(state.lockedBefore,state.current);document.getElementById("modal").innerHTML=`<section class="modal"><h2>Break in progress</h2><p>The clock is still running.</p><div class="timer">${fmt(state.seconds)}</div><div class="actions"><button class="primary" id="resume">Resume exam</button></div></section>`;document.getElementById("resume").onclick=()=>{if(state.current<state.flat.length-1)state.current++;renderQuestion()}};
  }
  function learnDrawer(){
    document.body.insertAdjacentHTML("beforeend",`<aside class="learn-drawer" id="drawer"><div class="actions"><button class="secondary" id="closeDrawer">Close</button></div><h2>Microsoft Learn references</h2><p>The real associate-level exam can provide Microsoft Learn in a split view. The timer continues while you browse.</p><a target="_blank" rel="noopener" href="https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200">https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200</a><a target="_blank" rel="noopener" href="${esc(current().source)}">${esc(current().source)}</a><p><strong>Exam strategy:</strong> use documentation for one precise lookup. Searching every answer usually costs too much time.</p></aside>`);document.getElementById("closeDrawer").onclick=()=>document.getElementById("drawer").remove();
  }

  function feedbackMarkup(qn){
    const ok=isCorrect(qn);return `<div class="feedback ${ok?"":"bad"}"><h3>${ok?"Correct":"Review this answer"}</h3><p><strong>Your answer:</strong> ${esc(answerText(qn,state.answers[qn.id]))}</p><p><strong>Correct answer:</strong> ${esc(answerText(qn,qn.answer))}</p><p>${esc(qn.explanation)}</p>${qn.practiceSource?`<p><strong>Practice source:</strong> <a target="_blank" rel="noopener" href="${esc(qn.practiceSource)}">${esc(qn.practiceSource)}</a></p>`:""}<p><strong>Technical reference:</strong> <a target="_blank" rel="noopener" href="${esc(qn.source)}">${esc(qn.source)}</a></p></div>`;
  }
  function answerText(qn,a){if(a===undefined)return "No answer";if(qn.type==="order")return (a||[]).join(" → ");if(Array.isArray(a))return a.map(i=>`${letters[i]}. ${qn.options[i]}`).join("; ");return `${letters[a]}. ${qn.options[a]}`}

  function finish(auto){
    clearInterval(timerId);const correct=state.flat.filter(isCorrect).length,total=state.flat.length,score=Math.round(correct/total*1000),passed=score>=700;
    const domains=Object.keys(DOMAINS).map(d=>{const qs=state.flat.filter(x=>x.domain===d),c=qs.filter(isCorrect).length;return {d,total:qs.length,correct:c,pct:qs.length?Math.round(c/qs.length*100):0}});
    const history=JSON.parse(localStorage.getItem("ai200-history")||"[]");history.unshift({date:new Date().toLocaleString(),score,passed,mode:state.mode});localStorage.setItem("ai200-history",JSON.stringify(history.slice(0,10)));
    app.innerHTML=`<main class="results"><section class="score-card"><div class="score-hero"><div class="score-circle" style="--pct:${correct/total*360}deg"><strong>${score}</strong></div><div><div class="eyebrow">Practice score</div><h1 class="${passed?"pass":"fail"}">${passed?"Pass":"Not passed"}</h1><p>${correct} of ${total} questions correct. ${auto?"Time expired and the session was submitted automatically.":""}</p><p>This scaled score is an estimate for practice. Microsoft does not publish a simple question-to-score conversion.</p></div></div>
      <table class="domain-table"><thead><tr><th>Skill area</th><th>Result</th><th>Performance</th></tr></thead><tbody>${domains.map(x=>`<tr><td>${esc(DOMAINS[x.d])}</td><td>${x.correct}/${x.total}</td><td><div class="bar"><span style="width:${x.pct}%"></span></div>${x.pct}%</td></tr>`).join("")}</tbody></table>
      <div class="actions"><button class="secondary" id="print">Print results</button><button class="primary" id="again">Start another session</button></div></section>
      <section class="history"><h2>Answer review</h2><p>Open a question to see the correct answer, explanation, and official reference.</p>${state.flat.map((x,i)=>`<details class="review-answer"><summary class="${isCorrect(x)?"answer-good":"answer-bad"}">Question ${i+1} · ${isCorrect(x)?"Correct":"Incorrect"} · ${esc(DOMAINS[x.domain])}</summary><div class="review-body"><p>${esc(x.prompt)}</p><p><strong>Your answer:</strong> ${esc(answerText(x,state.answers[x.id]))}</p><p><strong>Correct answer:</strong> ${esc(answerText(x,x.answer))}</p><p>${esc(x.explanation)}</p>${x.practiceSource?`<p><strong>Practice source:</strong> <a target="_blank" rel="noopener" href="${esc(x.practiceSource)}">${esc(x.practiceSource)}</a></p>`:""}<p><strong>Technical reference:</strong> <a target="_blank" rel="noopener" href="${esc(x.source)}">${esc(x.source)}</a></p>${state.comments[x.id]?`<p><strong>Your comment:</strong> ${esc(state.comments[x.id])}</p>`:""}</div></details>`).join("")}</section></main>`;
    document.getElementById("again").onclick=welcome;document.getElementById("print").onclick=()=>window.print();
  }

  welcome();
})();
