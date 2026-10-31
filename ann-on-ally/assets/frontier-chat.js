(function(){
 const launch=document.getElementById('frontierLaunch'), chat=document.getElementById('frontierChat'), close=document.getElementById('frontierClose'), form=document.getElementById('frontierForm'), input=document.getElementById('frontierInput'), messages=document.getElementById('frontierMessages');
 if(!launch||!chat||!form||!input||!messages) return;
 function toggle(open){chat.classList.toggle('open',open); if(open) input.focus();}
 launch.addEventListener('click',()=>toggle(true)); close?.addEventListener('click',()=>toggle(false));
 document.querySelectorAll('.frontier-open').forEach(b=>b.addEventListener('click',()=>toggle(true)));
 document.addEventListener('keydown',e=>{if(e.key==='Escape')toggle(false)});
 function renderRich(container,blocks){
   const wrap=document.createElement('div'); wrap.className='fc-rich';
   (blocks||[]).forEach(block=>{
     if(block.type==='heading'){const h=document.createElement((block.level||3)===4?'h4':'h3');h.textContent=block.text||'';wrap.appendChild(h);}
     else if(block.type==='paragraph'){const p=document.createElement('p');p.textContent=block.text||'';wrap.appendChild(p);}
     else if(block.type==='bullets'){if(block.title){const l=document.createElement('div');l.className='fc-rich-label';l.textContent=block.title;wrap.appendChild(l);}const ul=document.createElement('ul');(block.items||[]).forEach(item=>{const li=document.createElement('li');li.textContent=item;ul.appendChild(li);});wrap.appendChild(ul);}
     else if(block.type==='chips'){if(block.title){const l=document.createElement('div');l.className='fc-rich-label';l.textContent=block.title;wrap.appendChild(l);}const c=document.createElement('div');c.className='fc-rich-chips';(block.items||[]).forEach(item=>{const chip=document.createElement('span');chip.className='fc-rich-chip';chip.textContent=item;c.appendChild(chip);});wrap.appendChild(c);}
     else if(block.type==='callout'){const c=document.createElement('div');c.className='fc-rich-callout';if(block.title){const b=document.createElement('strong');b.textContent=block.title;c.appendChild(b);}const t=document.createElement('span');t.textContent=block.text||'';c.appendChild(t);wrap.appendChild(c);}
     else if(block.type==='link'){const a=document.createElement('a');a.className='fc-rich-link';a.textContent=block.label||'Explore on the site';const href=block.href||'';const map={'#research':'research.html','#lab':'lab.html','#hire':'hire.html','#home':'index.html','#contact':'mailto:anshuldixit2494@gmail.com'};a.href=map[href]||href||'#';wrap.appendChild(a);}
   }); container.appendChild(wrap);
 }
 function addTrace(container,meta){
   const v=meta.v3||{}; const details=document.createElement('details');details.className='fc-trace';const summary=document.createElement('summary');summary.textContent='How this was derived';details.appendChild(summary);const body=document.createElement('div');
   [['Status',meta.status],['Evidence',(meta.evidence||[]).join(' · ')||'No site evidence'],['V3',v.epistemic_status||''],['Operator',v.operator||'']].forEach(([k,val])=>{if(!val)return;const r=document.createElement('div');r.className='fc-trace-row';const b=document.createElement('strong');b.textContent=k+': ';r.appendChild(b);r.appendChild(document.createTextNode(val));body.appendChild(r);});
   if(meta.unresolved?.length){const r=document.createElement('div');r.className='fc-trace-row';r.textContent='Unresolved: '+meta.unresolved.join(' · ');body.appendChild(r);} details.appendChild(body); container.appendChild(details);
 }
 function add(text,who,meta){const d=document.createElement('div');d.className='fc-msg '+who;if(who==='bot'&&meta?.rich?.length)renderRich(d,meta.rich);else d.textContent=text;if(meta&&!(meta.v3&&meta.v3.operator==='scope_guard'))addTrace(d,meta);messages.appendChild(d);messages.scrollTop=messages.scrollHeight;}
 form.addEventListener('submit',async(e)=>{
   e.preventDefault(); const q=input.value.trim(); if(!q)return; add(q,'user');input.value='';
   const waiting=document.createElement('div');waiting.className='fc-msg bot';waiting.textContent='Peek-a-boo is checking the website evidence…';messages.appendChild(waiting);messages.scrollTop=messages.scrollHeight;
   try{const base=(window.ANNONALLY_CONFIG?.apiBase||'').replace(/\/$/,'');const r=await fetch(base+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:q})});const data=await r.json();waiting.remove();if(!r.ok)throw new Error(data.detail||'Request failed');add(data.answer,'bot',data);}
   catch(err){waiting.remove();add('Peek-a-boo is not connected from this deployment yet. The website itself is available, but the reasoning endpoint still needs a public connection.','bot',{status:'OFFLINE',evidence:[],unresolved:[err.message]});}
 });
})();
