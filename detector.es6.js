var inactivityDetector = (() => {
    'use strict';

    const BODY_ELEMENT_NAME         = 'body',
          DEFAULT_EVENT_TO_LISTEN  = 'click touchstart';

    let lastClick,
        redirectUrl,
        waitingTime,
        eventToListen,
        $body;

    let setDOMElements = () => $body = document.querySelector(BODY_ELEMENT_NAME);

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

    let setEventsToListen = settings => {
        eventToListen = (settings)
            ? settings.eventToListen || DEFAULT_EVENT_TO_LISTEN
            : DEFAULT_EVENT_TO_LISTEN
    };

    let bindEvents = () => {
        $body.addEventListener(eventToListen, setLastClick)
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
            setEventsToListen(settings);
            bindEvents();
            startInactivityDetector();
        }
    }
})();
