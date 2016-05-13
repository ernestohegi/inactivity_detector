var inactivityDetector = (() => {
    'use strict';

    const BODY_ELEMENT_NAME       = 'body',
          DEFAULT_EVENT_TO_LISTEN = 'click';

    let lastClick,
        redirectUrl,
        waitingTime,
        eventToListen,
        $body;

    let setDOMElements = () => $body = document.querySelector(BODY_ELEMENT_NAME);

    let setLastClick = () => lastClick = Date.now();

    let setRedirectUrl = settings => {
        redirectUrl = (settings && settings.redirectUrl)
            ? settings.redirectUrl
            : window.location.origin
    };

    let setWaitingTime = settings => {
        let defaultWaitingTime = 300000; // 5 minutes by default

        waitingTime = (settings && settings.waitingTime)
            ? settings.waitingTime
            : defaultWaitingTime
    };

    let setEventsToListen = settings => {
        eventToListen = (settings && settings.eventToListen)
            ? settings.eventToListen
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
