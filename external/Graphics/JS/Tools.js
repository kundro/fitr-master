function Tools(mediator, toolsSettings, binding, drawer, selection, stylesManager) {
    this.rectangle = new Rect();
    this.polygon = new Polygon();
    this.star = new Star();
    this.line = new Line();
    this.move = new Move();
    this.hand = new Hand();
    this.select = new Select();
    this.ellipse = new Ellipse();
    this.circle = new Circle();
    this.scale = new Scale();
    this.rotate = new Rotate();
    this.pathLine = new PathLine();
    this.text = new Text();
    this.freeTransform = new FreeTransform();
    this.curveTransform = new CurveTransform();
    this.circle3Points = new Circle3Points();
    var select = this.select;

    function PathLine() {
        var path;
        var line = new DrawingTool();
        line.init = function (event, targetItems) {
            path = new Path();
            targetItems.addChild(path);
            var point = binding.getPoint(event.point);
            path.add(point);
        }
        line.draw = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            path.add(point);
        }
        this.activate = function () {
            line.activate();
            mediator.publish("toolActivated", 'pathLine');
        };
    }

    function Line() {
        var path;
        var startPoint;
        var line = new DrawingTool();
        line.init = function (event, targetItems) {
            path = new Path();
            targetItems.addChild(path);
            var point = binding.getPoint(event.point);
            startPoint = point;
        }
        line.draw = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            path.remove();
            path = new Path(startPoint, point);
            targetItems.addChild(path);
        }
        this.activate = function () {
            line.activate();
            mediator.publish("toolActivated", 'line');
        };
    }

    function Rect() {
        var path;
        var startPoint;
        var rectangle = new DrawingTool();
        rectangle.init = function (event, targetItems) {
            startPoint = binding.getPoint(event.point);
            path = new Path.Rectangle(startPoint, startPoint);
            targetItems.addChild(path);
        }
        rectangle.draw = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            path.remove();
            path = new Path.Rectangle(startPoint, point);
            targetItems.addChild(path);
        }
        this.activate = function () {
            rectangle.activate();
            mediator.publish("toolActivated", 'rectangle');
        };
    }

    function Polygon() {
        var path;
        var tool = new DrawingTool();
        var center;
        tool.init = function (event, targetItems) {
            center = binding.getPoint(event.point);
            path = new Path.RegularPolygon(center, toolsSettings.polygon.sides, 0);
            targetItems.addChild(path);
        }
        tool.draw = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            path.remove();
            path = new Path.RegularPolygon(center, toolsSettings.polygon.sides, point.getDistance(center));
            targetItems.addChild(path);
        }
        this.activate = function () {
            tool.activate();
            mediator.publish("toolActivated", 'polygon');
        };
    }

    function Star() {
        var path;
        var tool = new DrawingTool();
        var center;
        tool.init = function (event, targetItems) {
            center = binding.getPoint(event.point);
            path = new Path.Star(center, toolsSettings.star.points, 0, 0);
            targetItems.addChild(path);
        }
        tool.draw = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            path.remove();
            path = new Path.Star(center, toolsSettings.star.points, point.getDistance(center) / 2, point.getDistance(center));
            targetItems.addChild(path);
        }
        this.activate = function () {
            tool.activate();
            mediator.publish("toolActivated", 'star');
        };
    }

    function Circle() {
        var path;
        var circle = new DrawingTool();
        var center;
        circle.init = function (event, targetItems) {
            center = binding.getPoint(event.point);
            path = new Path.Circle(center, 0);
            targetItems.addChild(path);
        }
        circle.draw = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            path.remove();
            path = new Path.Circle(center, point.getDistance(center))
            targetItems.addChild(path);
        }
        this.activate = function () {
            circle.activate();
            mediator.publish("toolActivated", 'circle');
        };
    }

    function Ellipse() {
        var path;
        var tool = new DrawingTool();
        var center;
        tool.init = function (event, targetItems) {
            center = binding.getPoint(event.point);
            path = null;
        }
        tool.draw = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            if (path) path.remove();
            path = new Path.Ellipse(new Rectangle(center.multiply(2).subtract(point), point));
            targetItems.addChild(path);
        }
        this.activate = function () {
            tool.activate();
            mediator.publish("toolActivated", 'ellipse');
        };
    }

    function Move() {
        var lastPoint = new Point(0, 0);
        var move = new TransformTool();
        move.init = function (event, targetItems) {
            deltaSum = new Point(0, 0);
            lastPoint = binding.getPoint(event.point);
        }
        move.transform = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            var delta = point.subtract(lastPoint);
            lastPoint = point;
            targetItems.translate(delta);
        }
        this.activate = function () {
            move.activate();
            mediator.publish("toolActivated", 'move');
        };
    }

    function Scale() {
        var lastDistance;
        var tool = new TransformTool();
        tool.init = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            lastDistance = targetItems.position.getDistance(point);
        }
        tool.transform = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            var distance = targetItems.position.getDistance(point);
            targetItems.scale(distance / lastDistance);
            lastDistance = distance;
        }
        this.activate = function () {
            tool.activate();
            mediator.publish("toolActivated", 'scale');
        };
    }

    function Rotate() {
        var lastAngle;
        var pos;
        var tool = new TransformTool();
        tool.init = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            pos = targetItems.position;
            lastAngle = point.subtract(pos).angle;
        }
        tool.transform = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            var angle = point.subtract(pos).angle;
            targetItems.rotate(angle - lastAngle, pos);
            lastAngle = angle;
        }
        this.activate = function () {
            tool.activate();
            mediator.publish("toolActivated", 'rotate');
        };
    }

    function FreeTransform() {
        var segment;
        var type;
        var tool = new TransformTool();
        tool.init = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            var hitOptions = {
                segments: true,
                handles: true,
                tolerance: 10
            };
            var hitResult = targetItems.hitTest(point, hitOptions);
            if (!hitResult) {
                segment = null;
                type = null;
                return;
            }
            segment = hitResult.segment;
            type = hitResult.type;
        }
        tool.transform = function (event, targetItems) {
            if (!segment) return;
            var point = binding.getPoint(event.point);
            if (type == 'segment') {
                segment.point = point;
            }
            if (type == 'handle-in') {
                segment.handleIn = point.subtract(segment.point);
            }
            if (type == 'handle-out') {
                segment.handleOut = point.subtract(segment.point);
            }
        }
        this.activate = function () {
            tool.activate();
            mediator.publish("toolActivated", 'freeTransform');
        };
    }

    function CurveTransform() {
        var curve;
        var type;
        var targetItems;
        var tool = new ToolWrapper();
        tool.showBindings = true;

        tool.onMouseDown = function (event) {
            var point = binding.getPoint(event.point);
            var newCurve = selection.selectCurve(point);
            if (newCurve) {
                curve = newCurve;
            }
            else {
                var hitOptions = {
                    handles: true,
                    tolerance: 10,
                };
                if (!selection.anythingSelected()) tool.cancel();
                targetItems = selection.selectedItems;
                var hitResult = targetItems.hitTest(point, hitOptions);
                if (hitResult) {
                    type = hitResult.type;
                }
                else {
                    type = null;
                    targetItems = null;
                    tool.cancel();
                    curve = null;
                }
            }
        }.bind(this);

        tool.onMouseDrag = function (event) {
            if (!curve) return;
            var point = binding.getPoint(event.point);
            if (type == 'handle-in') {
                curve.segment2.handleIn = point.subtract(curve.point2);
            }
            if (type == 'handle-out') {
                curve.segment1.handleOut = point.subtract(curve.point1);
            }
        }.bind(this);

        tool.onMouseUp = function (event) {
            if (targetItems) {
                selection.saveSelection();
                targetItems = null;
            }
        }.bind(this);
        this.activate = function () {
            tool.activate();
            mediator.publish("toolActivated", 'curveTransform');
        };
    }

    function Hand() {
        var hand = new ToolWrapper();
        hand.onMouseDrag = function (event) {
            view.translate(event.point.subtract(event.downPoint));
            mediator.publish("fieldMoved");
        }
        this.activate = function () {
            hand.activate();
            mediator.publish("toolActivated", 'hand');
        };
    }

    function Text() {
        var text;
        var textCursor;
        var tool = new ToolWrapper();
        tool.showBindings = true;
        tool.onMouseDown = function (event) {
            if (text) {
                this.showBindings = true;
                if (text.content.length > 0) {
                    drawer.save([text]);
                }
                text = null;
                drawer.cancel();
                return;
            }

            this.showBindings = false;
            binding.clear();
            var point = binding.getPoint(event.point);
            text = new PointText(point);
            text.content = '';
            stylesManager.applyTextStyle(text, 'drawing');
            textCursor = new Path.Line(text.bounds.topRight, text.bounds.bottomRight);
            stylesManager.applyStyle(textCursor, 'textCursor');

            textCursor.on('frame', function (event) {
                if (event.count % 20 != 0) return;
                this.visible = !this.visible;
            });
        }
        tool.onKeyDown = function (event) {
            text.content += event.character;
            textCursor.position = new Point(text.bounds.right, textCursor.position.y);
        }
        this.activate = function () {
            tool.activate();
            tool.text = null;
            mediator.publish("toolActivated", 'text');
        };
    }

    function Select() {
        var selectMany;
        var startPoint;
        var selectionRect;
        var tool = new ToolWrapper();
        var selectionCallback;
        tool.onMouseDown = function (event) {
            startPoint = event.point;
            selection.selectPoint(startPoint);
            if (selectionCallback && selection.anythingSelected())
            {
                selectionCallback();
                selectionCallback = null;
            }
        }
        tool.onMouseDrag = function (event) {
            if (!selectMany) {
                selectMany = true;
            }
            var prev = selectionRect;
            selectionRect = new Path.Rectangle(startPoint, event.point);
            stylesManager.applyStyle(selectionRect, 'selection');
            if (prev) prev.remove();
        }
        tool.onMouseUp = function (event) {
            if (!selectMany) return;
            selection.selectInsideRectangle(new Rectangle(startPoint, event.point));
            drawer.cancel();
            selectMany = false;
            if (selectionCallback && selection.anythingSelected())
            {
                selectionCallback();
                selectionCallback = null;
            }
        }
        this.activate = function () {
            tool.activate();
            mediator.publish("toolActivated", 'select');
        };
        this.activateWithCallback = function (callback, event) {
            tool.activate();
            selectionCallback = callback;
            if (event) tool.onMouseDown(event);
        }
    }


    function DrawingTool() {
        var targetItems;
        //this.init;
        //this.draw;
        var tool = new ToolWrapper();
        tool.showBindings = true;
        tool.onMouseDown = function (event) {
            targetItems = new Group();
            if (this.init) this.init(event, targetItems);
            stylesManager.applyStyle(targetItems, 'drawing');
            stylesManager.applyStyle(targetItems, 'predrawing');
        }.bind(this);

        tool.onMouseDrag = function (event) {
            if (this.draw) this.draw(event, targetItems);
            stylesManager.applyStyle(targetItems, 'drawing');
            stylesManager.applyStyle(targetItems, 'predrawing');
        }.bind(this);

        tool.onMouseUp = function (event) {
            if (this.draw) this.draw(event, targetItems);
            stylesManager.applyStyle(targetItems, 'drawing');
            targetItems.children.forEach(function (item) {
                stylesManager.applyStyle(item, 'drawing');
            });
            drawer.save(targetItems.children);
            //targetItems.remove();
        }
        this.activate = function () {
            tool.activate();
        };
    }

    function Circle3Points() {
        var targetItems;
        var path;
        var points;
        //this.init;
        //this.draw;
        var tool = new ToolWrapper();
        tool.showBindings = true;
        var stage = 0;
        tool.onMouseDown = function (event) {
            stage++;
            var point = binding.getPoint(event.point);
            if (stage == 1) {
                points = [];
                targetItems = new Group();
                path = null;
                points.push(point);
            }
            if (stage == 2) {
                points.push(point);
            }
            if (stage == 3) {
                stylesManager.applyStyle(targetItems, 'drawing');
                drawer.save(targetItems.children);
                targetItems.remove();
                stage = 0;
            }
        }.bind(this);

        tool.onMouseMove = function (event) {
            if (stage == 2) {
                var point = binding.getPoint(event.point);

                var a = points[1].x - points[0].x;
                var b = points[1].y - points[0].y;
                var c = point.x - points[0].x;
                var d = point.y - points[0].y;
                var e = (a * (points[1].x + points[0].x)) + (b * (points[1].y + points[0].y));
                var f = (c * (point.x + points[0].x)) + (d * (point.y + points[0].y));
                var g = 2 * ((a * (point.y - points[1].y)) - (b * (point.x - points[1].x)));

                var x = ((d * e) - (b * f)) / g;
                var y = ((a * f) - (c * e)) / g;
                var center = new Point(x, y);
                if (path) path.remove();
                path = new Path.Circle(center, point.getDistance(center));
                targetItems.addChild(path);
                stylesManager.applyStyle(targetItems, 'drawing');
                stylesManager.applyStyle(targetItems, 'predrawing');
            }
        }.bind(this);

        this.activate = function () {
            tool.activate();
            mediator.publish("toolActivated", 'circle3Points');
        };
    }

    function TransformTool() {
        var targetItems;
        //this.init;
        //this.transform;
        var tool = new ToolWrapper();
        tool.showBindings = true;

        tool.onMouseDown = function (event) {
            if (!selection.anythingSelected())
                select.activateWithCallback(function () {
                    this.activate();
                }.bind(this), event);
            if (!selection.anythingSelected()) tool.cancel();
            targetItems = selection.selectedItems;
            if (this.init) this.init(event, targetItems);
        }.bind(this);

        tool.onMouseDrag = function (event) {
            if (this.transform) this.transform(event, targetItems);
        }.bind(this);

        tool.onMouseUp = function (event) {
            selection.saveSelection();
        }.bind(this);
        this.activate = function () {
            if (!selection.anythingSelected()) select.activateWithCallback(function () {
                    this.activate();
                }.bind(this)
            )
            else {
                tool.activate();
            }
        };
    }

    function ToolWrapper() {
        var tool = new Tool();
        //tool.minDistance = 5;
        var cancelled = false;
        this.showBindings = false;
        tool.onMouseMove = function (event) {
            if (this.showBindings) binding.drawPoint(event.point);
            if (this.onMouseMove) this.onMouseMove(event);
        }.bind(this);

        tool.onMouseDown = function (event) {
            cancelled = false;
            if (this.onMouseDown) this.onMouseDown(event);
        }.bind(this);

        tool.onMouseDrag = function (event) {
            if (cancelled) return;
            if (this.showBindings) binding.drawPoint(event.point);
            if (this.onMouseDrag) this.onMouseDrag(event);
        }.bind(this);

        tool.onMouseUp = function (event) {
            if (cancelled) return;
            if (this.onMouseUp) this.onMouseUp(event);
        }.bind(this);

        tool.onKeyDown = function (event) {
            if (event.key == 'escape') {
                this.cancel();
                project.deselectAll();
            }
            if (event.key == 'delete') {
                drawer.delete(project.selectedItems);
            }
            if (this.onKeyDown) this.onKeyDown(event);
        }.bind(this);

        this.cancel = function () {
            cancelled = true;
            binding.clear();
            selection.deleteCopy();
            drawer.cancel();
        }

        this.activate = function () {
            tool.activate();
            binding.clear();
        };
    }
}