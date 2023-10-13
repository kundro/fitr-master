window.splate = {
    url: window.location != window.parent.location
        ? document.referrer
        : document.location.href,

    send: (command, data) => {
        window.parent.postMessage({
            command: command,
            data: data
        }, splate.url);
    },

    create: (data) => splate.send("create", data),
    validate: (state) => splate.send("validate", state),

    onReceived: function (data) { },
    onCreate: function (data) { },
    onValidate: function (data) { }
};

window.addEventListener("message", e => {
    let response = JSON.parse(e.data);

    splate.onReceived(response.data);
    switch (response.command.toLowerCase()) {

        case "create":
            console.log("external: create");
            console.log(response);
            splate.onCreate(response.data);
            break;
        case "validate":
            console.log("external: validate");
            console.log(response);
            splate.onValidate(response.data);
            break;
        default:
    }
});