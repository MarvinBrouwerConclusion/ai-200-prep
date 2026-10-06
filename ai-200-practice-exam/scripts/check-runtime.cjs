const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n');

// Run session startup, feedback and results with a small in-memory DOM facade.
for (const engine of ['dist', 'inline']) {
  for (const randomValue of [0.1, 0.9]) {
    for (const [mode, total] of [['exam',50],['quick',20],['case',5],['study',263]]) {
      const elements = new Map();
      const element = id => {
        if (!elements.has(id)) elements.set(id, {innerHTML:'', querySelectorAll:()=>[], style:{}});
        return elements.get(id);
      };
      const storage = new Map();
      const math = Object.create(Math);
      math.random = () => randomValue;
      const context = {
        window:{}, Math:math,
        document:{getElementById:element, querySelectorAll:()=>[]},
        localStorage:{getItem:key=>storage.get(key)||null, setItem:(key,value)=>storage.set(key,value)},
        setInterval:()=>1, clearInterval:()=>{}
      };
      vm.runInNewContext(read('dist/questions.js'), context);
      let script;
      if (engine === 'dist') {
        const original = read('dist/app.js');
        script = original.replace(/\n\s*welcome\(\);\s*\}\)\(\);\s*$/, '\nwindow.__review={start:mode=>{selectedMode=mode;startSession()},state:()=>state,feedback:feedbackMarkup,finish};welcome();\n})();');
        assert.notEqual(script, original);
      } else {
        const original = read('inline/runtime.part').replace(/<\/script>\s*$/, '');
        script = original.replace(/\nhome\(\);\s*\}\)\(\);\s*$/, '\nwindow.__review={start,state:()=>st,feedback,finish};home();\n})();');
        assert.notEqual(script, original);
      }
      vm.runInNewContext(script, context);
      const api = context.window.__review;
      api.start(mode);
      const state = api.state();
      const questions = state.flat || state.qs;
      assert.equal(questions.length, total, `${engine}/${mode}`);
      if (mode === 'exam') {
        for (const [domain,count] of Object.entries(context.window.AI200_DATA.EXAM_DOMAIN_COUNTS)) {
          assert.equal(questions.filter(q=>q.domain===domain).length, count);
        }
      }
      for (const q of questions) state.answers[q.id] = q.answer;
      const adapted = questions.find(q=>q.adapted);
      if (adapted) {
        const feedback = api.feedback(adapted);
        assert.ok(feedback.includes('Microsoft Learn module (adapted)'));
        assert.ok(feedback.includes(adapted.assessmentSource));
        assert.ok(feedback.endsWith('</div>'));
      }
      api.finish();
      const markup = element(engine === 'dist' ? 'app' : 'ai200-screen').innerHTML;
      assert.ok(markup.includes('1000'));
      assert.ok(markup.includes('Answer review'));
      assert.ok(!markup.includes('{state.comments'));
      assert.ok(!/\}\/div>|\}\/details>/.test(markup));
    }
  }
}
console.log('PASS: both runtimes start and score all four modes; both cases retain domain counts; adapted-source feedback and result markup checked.');
