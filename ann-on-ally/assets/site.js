(function(){
  // Close mobile navigation after a choice.
  document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>document.querySelector('.nav')?.classList.remove('open')));

  // Make quotation form useful without a mail backend: construct an email draft.
  const form=document.getElementById('quotationForm');
  if(form){
    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      if(!form.reportValidity()) return;
      const data=new FormData(form);
      const fields=[
        ['Name',data.get('name')],['Email',data.get('email')],['Organisation',data.get('organisation')],
        ['Area of support',data.get('support')],['Timeline',data.get('timeline')],['Budget and currency',data.get('budget')],
        ['What I would like help with',data.get('details')]
      ].filter(([,v])=>String(v||'').trim());
      const body=fields.map(([k,v])=>k+':\n'+String(v).trim()).join('\n\n');
      const subject='Ann-On-Ally quotation request';
      const href='mailto:anshuldixit2494@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
      const status=document.getElementById('quotationStatus');
      if(status) status.textContent='Opening your email app with the quotation details.';
      window.location.href=href;
    });
  }
})();
