'use strict';
const endpoint='https://knajekgpbflouhttqder.supabase.co/functions/v1/public-contact';
const el=id=>document.getElementById(id);
let pending;
try{const saved=JSON.parse(localStorage.getItem('tapnote.contact')||'null');if(saved){el('ticket').value=saved.id;el('receipt').value=saved.receipt;}}catch{}
async function send(payload){const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),cache:'no-store'});const value=await r.json();if(!r.ok)throw new Error(value.error||'通信に失敗しました。');return value;}
el('contact').addEventListener('submit',async event=>{event.preventDefault();el('send').disabled=true;el('notice').textContent='送信しています…';try{
 if(!pending){const bytes=crypto.getRandomValues(new Uint8Array(32));pending={id:crypto.randomUUID(),receipt:Array.from(bytes).map(x=>x.toString(16).padStart(2,'0')).join('')};}
 el('ticket').value=pending.id;el('receipt').value=pending.receipt;
 try{localStorage.setItem('tapnote.contact',JSON.stringify(pending));}catch{}
 await send({action:'create',...pending,subject:el('subject').value,body:el('body').value,website:el('website').value});
 pending=undefined;el('notice').textContent='受け付けました。下の受付番号と照会キーを控え、回答を確認してください。';el('body').value='';
}catch(error){el('notice').textContent=error.message||'送信できませんでした。';}finally{el('send').disabled=false;}});
el('lookup').addEventListener('submit',async event=>{event.preventDefault();el('check').disabled=true;el('result').textContent='確認しています…';try{
 const value=await send({action:'read',id:el('ticket').value.trim(),receipt:el('receipt').value.trim()});
 el('result').textContent=`件名：${value.subject}\n\n送信内容：\n${value.body}\n\n運営からの回答：\n${value.reply||'まだ回答はありません。時間をおいて再度ご確認ください。'}`;
}catch(error){el('result').textContent=error.message||'確認できませんでした。';}finally{el('check').disabled=false;}});
