/** 
  * My modification of https://www.alphr.com/mass-unsubscribe-youtube/
  * This script can now unsub from all youtube channels
  * Youtube bulk unsubscribe fn.
  * Wrapping this in an IIFE for browser compatibility.
  */
(async function iife() {
    // This is the time delay after which the "unsubscribe" button is "clicked"; Tweak to your liking!
    var UNSUBSCRIBE_DELAY_TIME = 2000;
  
    function simulateClick(element) {
      const event = new MouseEvent('click', {
        'bubbles': true,
        'cancelable': true,
        'view': window
      });
      element.dispatchEvent(event, true);  // Using capturing phase
    }
  
    /**
      * Delay runner. Wraps `setTimeout` so it can be `await`ed on. 
      * @param {Function} fn 
      * @param {number} delay 
     */
    var runAfterDelay = (fn, delay) => new Promise((resolve, reject) => {
      setTimeout(() => {
        fn();
        resolve();
      }, delay);
    });
  
    // Get the channel list; this can be considered a row in the page.
    var channels = Array.from(document.getElementsByTagName(`ytd-channel-renderer`));
    console.log(`${channels.length} channels found.`);
  
    var ctr = 0;
    for (const channel of channels) {
      // Get the unsubscribe button and trigger a "click"
      const unsubscribeButton = channel.querySelector(`[aria-label^='Unsubscribe from']`);
      if (unsubscribeButton) {
        simulateClick(unsubscribeButton);
        await runAfterDelay(() => {
          // Get the dialog container...
          const dialog = document.getElementsByTagName(`yt-confirm-dialog-renderer`)[0];
          if (dialog) {
              const confirmButton = dialog.querySelector(`#confirm-button`);
              if (confirmButton) {
                  // Try clicking the button itself first
                  simulateClick(confirmButton);
          
                  // Additionally, try clicking child elements
                  const childElements = confirmButton.querySelectorAll('*');
                  for (const child of childElements) {
                      simulateClick(child);
                  }
                  console.log(`Unsubscribed ${ctr + 1}/${channels.length}`);
                  ctr++;
              }
          }
        }, UNSUBSCRIBE_DELAY_TIME);
      }
    }
  })();
  