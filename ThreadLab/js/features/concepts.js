/* Guide is primarily semantic HTML, so its FAQ remains accessible without JS. */
for(const item of document.querySelectorAll('.faq details')){
  item.addEventListener('toggle',()=>{if(!item.open)return;for(const other of document.querySelectorAll('.faq details'))if(other!==item)other.open=false})
}
