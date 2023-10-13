function Tools3D(mediator, binding, drawer, selection, projectionPointsDrawer, projectionManager, projectionParams, keyboard) {
    this.point = new Point3D('point', 1);
    this.line = new Point3D('line', 2);
    this.ellipse = new Point3D('ellipse', 3);
    this.polygon = new Point3D('polygon');
    var targetItems = new Group();
    mediator.subscribe("projectionsChanged", function () {
        targetItems.children.forEach(function (item) {
            item.remove();
            item.visible = false;
        });
        targetItems.removeChildren();
        targetItems.addChildren(projectionPointsDrawer.redraw(projectionManager.projections));
        drawer.save([targetItems]);
    });
    mediator.subscribe("settingsChanged", function () {
            mediator.publish("projectionsChanged");
        },
        {
            predicate: function (path, value) {
                return path.startsWith("projections");
            },
        });
    function Point3D(shape, pointsCount) {
        var points = [];
        var tool = new Tool();
        var cancelled = false;
        var projection;
        var filter;

        function filterPoint(point) {
            if (filter === "xz") {
                return point.x < 0 && point.y < 0
            }
            if (filter === "xy") {
                return point.x < 0 && point.y > 0
            }
            if (filter === "yz") {
                return point.x > 0 && point.y < 0
            }
            return (point.x < 0 && point.y != 0) || (point.y < 0 && point.x != 0);
        }

        tool.onMouseMove = function (event) {
            if (!filterPoint(event.point)) {
                return;
            }
            var bindedPoint = binding.drawPoint(event.point);
            if (!projection || projection.isDeleted) return;
            if (projectionParams.showLinkLines) {
                var projections = projection.bind(bindedPoint);
                if (!projections) {
                    var bindedProj = projectionManager.bind(bindedPoint, shape);
                    if (bindedProj) {
                        projections = bindedProj.bind(bindedPoint);
                    }
                }
                if (projections) {

                    if (projections.xy != null) {
                        mediator.publish("bindingDrawingStarted");
                        projectionPointsDrawer.drawLinkLines(projections);
                        mediator.publish("bindingDrawingFinished");
                    }
                    if (projections.xz != null) {
                        mediator.publish("bindingDrawingStarted");
                        projectionPointsDrawer.drawLinkLines(projections);
                        mediator.publish("bindingDrawingFinished");
                    }
                    if (projections.yz != null) {
                        mediator.publish("bindingDrawingStarted");
                        projectionPointsDrawer.drawLinkLines(projections);
                        mediator.publish("bindingDrawingFinished");
                    }
                }
            }

        }.bind(this);

        tool.onMouseDown = function (event) {
            var point = binding.getPoint(event.point);
            if (!filterPoint(point)) {
                return;
            }
            cancelled = false;
            var nearestProjection = projectionManager.bind(point);
            if (nearestProjection) {
                projection = nearestProjection;
            }
            if (!projection || projection.isDeleted || !projection.checkPoint(point)) {
                projection = new Projection(shape);
                projectionManager.projections.push(projection);
            }
            projection.autoMerge = !projectionManager.testMode;

            projection.addPoint(point);

            targetItems.remove();
            targetItems = new Group();
            //targetItems.addChildren(projectionPointsDrawer.redraw(projectionManager.projections));
            //drawer.save([targetItems]);
            mediator.publish("projectionsChanged");
        }.bind(this);

        tool.onMouseDrag = function (event) {
            if (cancelled) return;
        }.bind(this);

        tool.onKeyDown = function (event) {
            if (event.key == 'escape') {
                this.cancel();
                project.deselectAll();
            }
        }.bind(this);

        this.cancel = function () {
            cancelled = true;
            binding.clear();
            selection.deleteCopy();
            drawer.cancel();
        }

        this.activate = function (pointFilter) {
            filter = pointFilter;
            tool.activate();
            binding.clear();
            mediator.publish("tool3DActivated", shape);
        };
    }
}