document.addEventListener('DOMContentLoaded', function () {
  // inject styles
  var css = `
  .yt-modal-overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.8);z-index:9999;visibility:hidden;opacity:0;transition:opacity .18s ease,visibility .18s ease}
  .yt-modal-overlay.open{visibility:visible;opacity:1}
  .yt-modal{width:90%;max-width:980px;background:transparent;border-radius:10px;overflow:hidden}
  .yt-modal iframe{width:100%;height:56vw;max-height:560px;border:0;display:block}
  .yt-modal-close{position:absolute;right:18px;top:18px;background:rgba(0,0,0,.6);border:0;color:#fff;padding:8px 10px;border-radius:8px;cursor:pointer;font-weight:700}
  @media(min-width:800px){.yt-modal iframe{height:56vh}}
  `;
  var style = document.createElement('style');
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  // create modal
  var overlay = document.createElement('div');
  overlay.className = 'yt-modal-overlay';
  overlay.innerHTML = '<div class="yt-modal"><button class="yt-modal-close">✕</button><iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
  document.body.appendChild(overlay);

  var iframe = overlay.querySelector('iframe');
  var closeBtn = overlay.querySelector('.yt-modal-close');

  function extractYouTubeId(url){
    try{
      var u = url.trim();
      var id = null;
      var m = u.match(/[?&]v=([^&#]+)/);
      if(m && m[1]) return m[1];
      m = u.match(/youtu\.be\/([^?#&\/]+)/);
      if(m && m[1]) return m[1];
      m = u.match(/youtube\.com\/shorts\/([^?#&\/]+)/);
      if(m && m[1]) return m[1];
      m = u.match(/youtube\.com\/embed\/([^?#&\/]+)/);
      if(m && m[1]) return m[1];
      return null;
    } catch(e){ return null; }
  }

  function openModalWithUrl(url){
    var id = extractYouTubeId(url);
    if(!id) return window.open(url, '_blank');
    iframe.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0';
    overlay.classList.add('open');
  }

  function closeModal(){
    overlay.classList.remove('open');
    // remove src after short delay to stop playback
    setTimeout(function(){ iframe.src = ''; }, 200);
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e){ if(e.target === overlay) closeModal(); });

  // attach click listeners to video preview links
  var links = document.querySelectorAll('.video-preview a, a[href*="youtube.com"], a[href*="youtu.be"]');
  links.forEach(function(a){
    a.addEventListener('click', function(e){
      var href = a.getAttribute('href');
      if(!href) return;
      // Only intercept YouTube links; otherwise allow default
      if(href.indexOf('youtube.com') === -1 && href.indexOf('youtu.be') === -1) return;
      e.preventDefault();
      openModalWithUrl(href);
    });
  });
});
