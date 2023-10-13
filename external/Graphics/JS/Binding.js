function Binding(mediator, bindingSettings, drawingLayers) {
    var bindingTolerance;
    var signs = new Signs();
    this.getPoint = function (point, customBinding) {
        bindingTolerance = bindingSettings.bindingTolerance / view.zoom;
        var points = [];
        if (bindingSettings.bindToLineEnds) points = points.concat(bindToLineEnds(point));
        if (bindingSettings.bindToIntersections) points = points.concat(bindToIntersections(point));
        if (bindingSettings.bindToCenters) points = points.concat(bindToCenters(point));
        if(customBinding) {
            points = points.concat(customBinding(point, bindingTolerance));
        }
        var nearestPoint = getNearestPoint(point, points, bindingTolerance);
        if (nearestPoint) {
            return nearestPoint;
        }

        if (bindingSettings.bindToGrid) {
            return bindToGrid(point);
        }
        return point;
    }
    this.drawPoint = function (point, customBinding) {
        mediator.publish("bindingDrawingStarted");
        var bindedPoint = this.getPoint(point, customBinding);
        if (!bindedPoint.equals(point)) {
                signs.gridBinding.place(bindedPoint);
        }
        mediator.publish("bindingDrawingFinished");
        return bindedPoint;
    }
    this.clear = function () {
        mediator.publish("bindingDrawingStarted");
        mediator.publish("bindingDrawingFinished");
    }

    function bindToGrid(point) {
        return point.divide(bindingSettings.gridStep).round().multiply(bindingSettings.gridStep);
    }

    function bindToLineEnds(point) {
        var hitOptions = {
            ends: true,
            tolerance: bindingTolerance,
        };
        var hitResults = drawingLayers.hitTestAll(point, hitOptions);
        return hitResults.map(function (res) {
            return res.segment.point;
        });
    }

    function bindToCenters(point) {
        var hitOptions = {
            center: true,
            tolerance: bindingTolerance,
        };
        var hitResults = drawingLayers.hitTestAll(point, hitOptions);
        return hitResults.map(function (res) {
            return res.point;
        });
    }

    function bindToIntersections(point) {
        var hitOptions = {
            stroke: true,
            tolerance: bindingTolerance,
        };
        var hitResults = drawingLayers.hitTestAll(point, hitOptions);
        var intersections = [];
        if (hitResults.length > 1) {
            for (var i = 0; i < hitResults.length; i++) {
                for (var j = i; j < hitResults.length; j++) {
                    if (hitResults[i].item.intersects(hitResults[j].item)) {
                        intersections = intersections.concat(
                            hitResults[i].item.getIntersections(hitResults[j].item).map(
                                function (item) {
                                    return item.point;
                                }
                            )
                        );
                    }
                }
            }
        }
        return intersections;
    }

    function getNearestPoint(point, points, maxDistance) {
        if (points.length == 0) return null;
        var minDistance = point.getDistance(point[0]);
        var minIndex = 0;
        points.forEach(function (item, i) {
            var distance = point.getDistance(item);
            if (distance < minDistance) {
                minIndex = i;
                minDistance = distance;
            }
        });
        if (points[minIndex].isClose(point, maxDistance)) return points[minIndex];
        return null;
    }
}
function Signs() {
    this.gridBinding = function () {
        var size = 7;
        var line1 = new Path([-size, -size], [size, size]);
        var line2 = new Path([-size, size], [size, -size]);
        line1.strokeColor = 'grey';
        line1.strokeWidth = 1;
        line1.strokeScaling = false;
        line2.strokeColor = 'grey';
        line2.strokeWidth = 1;
        line2.strokeScaling = false;
        var sign = new Group(line1, line2);
        return new Symbol(sign);
    }();
    mediator.subscribe("fieldScaled", function (coef) {
        for (var prop in this) {
            this[prop].definition.scale(1 / coef);
        }
    }.bind(this));
}