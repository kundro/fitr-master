window.splate = {
    url: window.location != window.parent.location
        ? document.referrer
        : document.location.href,

    send: (data) => {
        window.parent.postMessage(data, splate.url);
    },
    onSubmit: () => { },
    onReceived: (data) => { }
};

window.addEventListener("message", e => {
    if (e.data === "submit") {
        splate.onSubmit();
    }
    else {
        splate.onReceived(e.data);
    }
});