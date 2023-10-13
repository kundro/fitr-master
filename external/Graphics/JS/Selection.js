function Selection(mediator, layerManager) {
    var hitTestObj = layerManager.userLayers;
    var selectedItems;
    var selectedItemsCopy;
    var selectedCurveIndex = null;
    Object.defineProperty(this, "selectedItems", {
        get: function () {
            if (!this.anythingSelected()) return null;
            if (!selectedItemsCopy) {
                this.copySelection();
            }
            return selectedItemsCopy;
        }
    });
    Object.defineProperty(this, "selectedCurve", {
        get: function () {
            if (!this.anythingSelected() || selectedCurveIndex == null) return null;
            if (!selectedItems) {
                this.copySelection();
            }
            return selectedItemsCopy.firstChild.curves[selectedCurveIndex];
        }.bind(this)
    });
    this.copySelection = function () {
        selectedItems = new Group(project.selectedItems);
        selectedItemsCopy = selectedItems.clone();
        layerManager.activeUserLayer.addChild(selectedItems);
        selectedItemsCopy.selected = false;
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
    this.deleteCopy = function () {
        if (selectedItemsCopy) selectedItemsCopy.remove();
        selectedItemsCopy = null;
        selectedItems = null;
    }
    this.selectAll = function () {
        var items = hitTestObj.getItems({
            match: function (item) {
                return item.className != 'Layer' && ((item.parent.className != 'Group' && item.className != 'Group') || item.data.projection);
            },
        });
        items.forEach(function (item) {
            item.selected = true;
        });
        mediator.publish("selectionChanged");
    }
    this.deselectAll = function () {
        hitTestObj.selected = false;
        mediator.publish("selectionChanged");
    }
    this.anythingSelected = function () {
        return project.selectedItems.length > 0;
    }
    this.selectPoint = function (point) {
        //this.deselectAll();
        var hitOptions = {
            segments: true,
            stroke: true,
            fill: true,
            tolerance: 5
        };
        var hitResult = hitTestObj.hitTest(point, hitOptions);
        if (hitResult) {
            hitResult.item.selected = true;
        }
    }
    this.selectInsideRectangle = function (rectangle) {
        //this.deselectAll();
        var items = hitTestObj.getItems({
            inside: rectangle,
            match: function (item) {
                return item.className != 'Layer' && ((item.parent.className != 'Group' && item.className != 'Group') || item.data.projection);
            },
        });
        items.forEach(function (item) {
            item.selected = true;
        });
    }
    this.selectCurve = function (point) {
        this.selectPoint(point);
        var hitOptions = {
            curves: true,
            tolerance: 10,
        };
        if (!this.anythingSelected()) return null;
        var hitResult = this.selectedItems.hitTest(point, hitOptions);
        if (!hitResult) return null;
        selectedCurveIndex = hitResult.location.index;
        hitResult.location.curve.selected = true;
        return true;
    }
}