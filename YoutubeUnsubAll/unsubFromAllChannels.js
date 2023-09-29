/** 
  * Modified version of https://www.alphr.com/mass-unsubscribe-youtube/
  * This script now accounts for pagination and can unsubscribe from all YouTube channels.
  * Wrapping this in an IIFE for browser compatibility.
  */
(async function iife() {
    const UNSUBSCRIBE_DELAY_TIME = 2000;
    const SCROLL_WAIT_TIME = 5000;  // Time to wait after simulating a scroll action for content to load.

    function simulateClick(element) {
        const event = new MouseEvent('click', {
            'bubbles': true,
            'cancelable': true,
            'view': window
        });
        element.dispatchEvent(event, true);  // Using capturing phase
    }

    function forceScroll() {
        window.scrollTo(0, document.documentElement.scrollHeight);
    }

    var runAfterDelay = (fn, delay) => new Promise((resolve, reject) => {
        setTimeout(() => {
            fn();
            resolve();
        }, delay);
    });

    let prevChannelCount = 0;
    let channels = Array.from(document.getElementsByTagName('ytd-channel-renderer'));

    do {
        console.log(`${channels.length} channels found.`);
        
        let ctr = 0;
        for (const channel of channels) {
            const unsubscribeButton = channel.querySelector(`[aria-label^='Unsubscribe from']`);
            if (unsubscribeButton) {
                simulateClick(unsubscribeButton);
                await runAfterDelay(() => {
                    const dialog = document.getElementsByTagName('yt-confirm-dialog-renderer')[0];
                    if (dialog) {
                        const confirmButton = dialog.querySelector('#confirm-button');
                        if (confirmButton) {
                            simulateClick(confirmButton);
                            // Try clicking child elements of the confirmation button
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

        // Force scroll to load more content
        forceScroll();
        await runAfterDelay(() => {}, SCROLL_WAIT_TIME);  // Wait for new content to load.

        prevChannelCount = channels.length;
        channels = Array.from(document.getElementsByTagName('ytd-channel-renderer'));  // Fetch the updated list
        
    } while (channels.length !== prevChannelCount);  // Repeat until no new channels are found on the page.

})();