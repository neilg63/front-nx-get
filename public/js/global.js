(function() {

  const loadScripts = () => {
    const id1 = 'cookieconsent-js';
    if (!document.getElementById(id1)) {
        const el = document.createElement('script');
        el.src = '/js/cookieconsent.js';
        el.id = id1;
        document.body.appendChild(el);
    }
    const id2 = 'cookieconsent-css';
    if (!document.getElementById(id2)) {
        const el2 = document.createElement('link');
        el2.rel = 'stylesheet';
        el2.media = 'screen';
        el2.href = '/css/cookieconsent.css';
        el2.id = id2;
        document.body.appendChild(el2);
    }
  }

/*   function getCookieValue(name) {
    const result = document.cookie.match("(^|[^;]+)\s*" + name + "\s*=\s*([^;]+)")
      return result ? result.pop() : ""
  }
  const isOlderThan = (ts = 0, currTs = 0) => {
    const secsAgo = currTs - ts;
    const oneWeekSecs = 7 * 24 * 60 * 60;
    return secsAgo >= oneWeekSecs;
  } */

  const runCookieConsent = () => {
    if (window.initCookieConsent) {
      const cookieconsent = window.initCookieConsent();
      cookieconsent.run({
        autoclear_cookies: true,                   // default: false
        page_scripts: true,  
        gui_options: {
            consent_modal: {
                layout: 'cloud',               // box/cloud/bar
                position: 'bottom right',     // bottom/middle/top + left/right/center
                transition: 'slide',           // zoom/slide
                swap_buttons: false            // enable to invert buttons
            }
        },
        languages: {
          'en': {
              consent_modal: {
                  title: 'We use cookies',
                  description: 'This website uses essential cookies to ensure its proper operation and tracking cookies to understand how you interact with it. The latter will be set only after consent.',
                  primary_btn: {
                      text: 'Accept',
                      role: 'accept_all'              // 'accept_selected' or 'accept_all'
                  },
                  secondary_btn: {
                      text: 'Reject',
                      role: 'accept_necessary'        // 'settings' or 'accept_necessary'
                  }
              },
              settings_modal: {
                  accept_all_btn: 'Accept',
                  reject_all_btn: 'Reject',
                  close_btn_label: 'Close',
                  cookie_table_headers: [],
                  blocks: []
              }
          }
      },
      onAccept: function(cookie){
          setTimeout(triggerNewsletter, 3000);
      },
      });
    }
  }


  setTimeout(loadScripts, 1000);
  setTimeout(runCookieConsent, 2500);

  // Google Tag Manger

  window.dataLayer = window.dataLayer || [];
  
  const gtEl = document.getElementById("google-tag-script");
  
  if (gtEl instanceof HTMLElement) {
    const gtId = gtEl.getAttribute("data-id");
    if (gtId) {
      function gtag(){
        window.dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', gtId);
    }
  }

})();