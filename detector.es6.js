var inactivityDetector = (() => {
    'use strict';

    const BODY_ELEMENT_NAME = 'body',
          CLICK_EVENT_NAME  = 'click touchstart';

    let lastClick,
        redirectUrl,
        waitingTime,
        $body;

    let setDOMElements = () => $body = $(BODY_ELEMENT_NAME);

    let setLastClick = () => lastClick = Date.now();

    let setRedirectUrl = settings => {
        let origin = window.location.origin;

        redirectUrl = (settings)
            ? settings.redirectUrl || origin
            : origin
    };

    let setWaitingTime = settings => {
        let defaultWaitingTime = 300000; // 5 minutes by default

        waitingTime = (settings)
            ? settings.waitingTime || defaultWaitingTime
            : defaultWaitingTime
    };


    let bindEvents = () => {
        $body.on(CLICK_EVENT_NAME, setLastClick)
    };

    let checkActivity = () => {
        if (Date.now() - lastClick >= waitingTime) {
            window.location.href = redirectUrl;
            return false;
        }

        setTimeout(
            () => requestAnimationFrame(checkActivity),
            waitingTime
        );
    };

    let startInactivityDetector = () => requestAnimationFrame(checkActivity);

    return {
        init: settings => {
            setDOMElements();
            setLastClick();
            setRedirectUrl(settings);
            setWaitingTime(settings);
            bindEvents();
            startInactivityDetector();
        }
    }
})();
