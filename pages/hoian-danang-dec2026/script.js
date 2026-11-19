'use strict';
// Replace with your own email before publishing.
const ORGANIZER_EMAIL = 'REPLACE_WITH_YOUR_EMAIL@example.com';
const form = document.getElementById('guest-form');
const dialog = document.getElementById('review-dialog');
const review = document.getElementById('review-content');
const notice = document.getElementById('evening-notice');
let summaryText = '';
const selected = name => form.querySelector(`input[name="${name}"]:checked`)?.value || 'Not selected';
const selectedMany = name => [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(el => el.value);
function validateEvenings(){
  const a = selected('evening2'), b = selected('evening3');
  const duplication = a===b && a!=='Free evening' && a!=='Not selected';
  const timing = b==='Hoi An Memories Show';
  notice.hidden = !(duplication || timing);
  notice.textContent = duplication ? 'You have selected the same experience for both evenings. If you want to enjoy both experiences, please select one on each night. You can still continue with this selection.' : timing ? 'The Dec 03 show starts at 20:00. We will adjust the afternoon food tour timing if this option is selected, subject to availability.' : '';
}
form.querySelectorAll('input[name="evening2"], input[name="evening3"]').forEach(i=>i.addEventListener('change',validateEvenings));
const line = (label,value) => `<div class="review-line"><b>${label}</b><span>${escapeHTML(value)}</span></div>`;
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
form.addEventListener('submit',e=>{
 e.preventDefault();
 const morning = selectedMany('morning');
 if(!morning.length){alert('Please choose at least one option for the morning of Dec 03.');form.querySelector('input[name="morning"]').focus();return;}
 if(morning.includes('Free morning') && morning.length>1){alert('Please choose either a free morning or the optional morning activities.');return;}
 const data = new FormData(form);
 const entries = [
  ['Group contact',String(data.get('guestName')).trim()],
  ['Email',String(data.get('guestEmail')).trim()],
  ['Dec 02 evening',selected('evening2')],
  ['Dec 03 evening',selected('evening3')],
  ['Dec 03 morning',morning.join('; ')],
  ['Workshop participants',String(data.get('workshopCount'))],
  ['Dec 06',selected('day6')],
  ['Additional help',selectedMany('support').join('; ')||'None requested'],
  ['Special requests',String(data.get('notes')||'').trim()||'None']
 ];
 summaryText = `HOI AN & DA NANG | 02–07 DEC 2026\nGuest travel preferences (request only; no bookings confirmed)\n\n${entries.map(([k,v])=>`${k}: ${v}`).join('\n')}\n\nPlease send us availability and the tailored quotation before any optional service is booked.`;
 review.innerHTML = entries.map(([k,v])=>line(k,v)).join('');
 dialog.showModal();
});
document.getElementById('close-dialog').addEventListener('click',()=>dialog.close());
document.getElementById('edit-response').addEventListener('click',()=>dialog.close());
document.getElementById('copy-response').addEventListener('click',async()=>{
 try {await navigator.clipboard.writeText(summaryText);document.getElementById('copy-response').textContent='Copied ✓';setTimeout(()=>document.getElementById('copy-response').textContent='Copy summary',2000)}
 catch {const temp=document.createElement('textarea');temp.value=summaryText;document.body.appendChild(temp);temp.select();document.execCommand('copy');temp.remove();alert('Summary copied.');}
});
document.getElementById('send-response').addEventListener('click',()=>{
 if(ORGANIZER_EMAIL.startsWith('REPLACE_WITH_')){alert('The tour organizer must configure their email address before direct email submission is available. Please use “Copy summary” for now.');return;}
 const subject='Hoi An & Da Nang Tour – Guest Preferences – 02–07 Dec 2026';
 location.href=`mailto:${encodeURIComponent(ORGANIZER_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summaryText)}`;
});
