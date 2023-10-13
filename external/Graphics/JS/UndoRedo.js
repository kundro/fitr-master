function UndoRedo(mediator, controlledObj) {
    var copies = [];
    var currentPos = 0;

    copies.push(controlledObj.exportJSON());

    this.undo = function () {
        if (currentPos) {
            currentPos--;
        }
        controlledObj.clear();
        controlledObj.importJSON(copies[currentPos]);
    }

    this.redo = function () {
        if (currentPos >= copies.length-1) return;
        currentPos ++;
        controlledObj.importJSON(copies[currentPos]);
    }

    mediator.subscribe("drawingChanged", function () {
        copies.splice(++currentPos, copies.length, controlledObj.exportJSON());
    });
    this.save = function()
    {
        var fileName = "image.svg";
        var url = "data:image/svg+xml;base64," + btoa(project.exportSVG({asString:true, bounds: 'content'}));

        var link = document.createElement("a");
        link.download = fileName;
        link.href = url;
        link.click();
    }
}