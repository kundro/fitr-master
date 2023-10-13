function Drawer(mediator, layerManager) {
    var selectedItems;
    var selectedItemsCopy;

    this.getSelection = function () {
        selectedItems = new Group(project.selectedItems);
        selectedItemsCopy = selectedItems.clone();
        layerManager.activeUserLayer.addChild(selectedItems);
        //layerManager.appTopLayers.children['preview'].addChild(selectedItemsCopy);
        selectedItemsCopy.selected = false;
        return selectedItemsCopy;
    }
    this.saveSelection = function () {
        if (!selectedItemsCopy) return;
        selectedItemsCopy.selected = true;
        layerManager.activeUserLayer.addChildren(selectedItemsCopy.children);
        selectedItems.remove();
        selectedItemsCopy = null;
        selectedItems = null;
        layerManager.appTopLayers.children['preview'].removeChildren();
        mediator.publish("drawingChanged");
    }
    this.save = function (newItems) {
        layerManager.activeUserLayer.addChildren(newItems);
        //previewLayer.removeChildren();
        mediator.publish("drawingChanged");
    }
    this.delete = function (items) {
        items.forEach(function (item) {
            item.remove();
        });
        mediator.publish("drawingChanged");
    }
    this.cancel = function () {
        layerManager.appTopLayers.children['preview'].removeChildren();
    }
}