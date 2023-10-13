function ProjectionPointsDrawer(mediator, stylesManager, projectionParams) {
    this.pointChar;
    this.graphics = [];
    function drawLinkLine(point1, point2) {
        var lines = new Group();
        if ((point1.x < 0 && point1.y < 0) || (point2.x < 0 && point2.y < 0)) {
            lines.addChild(new Path(point1, point2));
        }
        else {
            var xpoint = point1.x > 0 ? point1 : point2;
            var ypoint = point1.y > 0 ? point1 : point2;
            lines.addChild(new Path(xpoint, [xpoint.x, 0]));
            lines.addChild(new Path(ypoint, [0, ypoint.y]));
            lines.addChild(new Path.Arc([xpoint.x, 0], [xpoint.x / Math.sqrt(2), ypoint.y / Math.sqrt(2)], [0, ypoint.y]));
        }
        stylesManager.applyStyle(lines, 'linkLine');
        return lines;
    }

    function drawPointProj(point, isValid) {
        var icon = new Path.Circle(point, 5);
        stylesManager.applyStyle(icon, 'projectionPoint');
        if (!isValid) {
            stylesManager.applyStyle(icon, 'projectionPointInvalid');
        }
        return icon;
    }

    this.drawProjectedPoint = function (projectedPoint) {
        var pointsGroup = new Group();
        if (projectedPoint.xy != null) {
            pointsGroup.addChild(drawPointProj(projectedPoint.xy, projectedPoint.isValid()));
        }
        if (projectedPoint.xz != null) {
            pointsGroup.addChild(drawPointProj(projectedPoint.xz, projectedPoint.isValid()));
        }
        if (projectedPoint.yz != null) {
            pointsGroup.addChild(drawPointProj(projectedPoint.yz, projectedPoint.isValid()));
        }
        return pointsGroup;
    }
    this.drawPointText = function (projectedPoints) {
        var offset = new Point(10, -10);
        var titlesXY = [];
        var titlesYZ = [];
        var titlesXZ = [];
        var textGroup = new Group();

        for (var i = 0; i < projectedPoints.length; i++) {
            if (projectedPoints[i].xy != null) {
                var samePointFound = false;
                for (var j = 0; j < i; j++) {
                    if (projectedPoints[j].xy != null && projectedPoints[j].xy.equals(projectedPoints[i].xy)) {
                        samePointFound = true;
                        titlesXY[j].content += '=' + String.fromCharCode(this.pointChar) + "'";
                        break;
                    }
                }
                if (!samePointFound) {
                    var text = new PointText(projectedPoints[i].xy.add(offset));
                    text.content = String.fromCharCode(this.pointChar) + "'";
                    stylesManager.applyTextStyle(text, 'pointText');
                    textGroup.addChild(text);
                    titlesXY[i] = text;
                }
            }
            if (projectedPoints[i].xz != null) {
                var samePointFound = false;
                for (var j = 0; j < i; j++) {
                    if (projectedPoints[j].xz != null && projectedPoints[j].xz.equals(projectedPoints[i].xz)) {
                        samePointFound = true;
                        titlesXZ[j].content += '=' + String.fromCharCode(this.pointChar) + "''";
                        break;
                    }
                }
                if (!samePointFound) {
                    var text = new PointText(projectedPoints[i].xz.add(offset));
                    text.content = String.fromCharCode(this.pointChar) + "''";
                    stylesManager.applyTextStyle(text, 'pointText');
                    textGroup.addChild(text);
                    titlesXZ[i] = text;
                }
            }
            if (projectedPoints[i].yz != null) {
                var samePointFound = false;
                for (var j = 0; j < i; j++) {
                    if (projectedPoints[j].yz != null && projectedPoints[j].yz.equals(projectedPoints[i].yz)) {
                        samePointFound = true;
                        titlesYZ[j].content += '=' + String.fromCharCode(this.pointChar) + "'''";
                        break;
                    }
                }
                if (!samePointFound) {

                    var text = new PointText(projectedPoints[i].yz.add(offset));
                    text.content = String.fromCharCode(this.pointChar) + "'''";
                    stylesManager.applyTextStyle(text, 'pointText');
                    textGroup.addChild(text);
                    titlesYZ[i] = text;
                }
            }
            this.pointChar++;
        }

        return textGroup;
    };

    this.resetPointText = function () {
        this.pointChar = 'A'.charCodeAt();
    };

    this.drawLinkLines = function (projectedPoint) {
        var linesGroup = new Group();
        if (projectedPoint.xy != null && projectedPoint.yz != null) {
            var linkLine = drawLinkLine(projectedPoint.xy, projectedPoint.yz);
            linkLine.strokeColor = 'blue';
            linesGroup.addChild(linkLine);
        }
        if (projectedPoint.xy != null && projectedPoint.xz != null) {
            var linkLine = drawLinkLine(projectedPoint.xy, projectedPoint.xz);
            linkLine.strokeColor = 'red';
            linesGroup.addChild(linkLine);
        }
        if (projectedPoint.xz != null && projectedPoint.yz != null) {
            var linkLine = drawLinkLine(projectedPoint.xz, projectedPoint.yz);
            linkLine.strokeColor = 'green';
            linesGroup.addChild(linkLine);
        }
        return linesGroup;
    }

    this.redraw = function (projections) {
        this.resetPointText();
        projections.forEach(function (shape, index) {
            var shapeGroup = new Group();
            var pointProjections = shape.points3D;

            pointProjections.forEach(function (proj) {
                if (projectionParams.showLinkLines) {
                    shapeGroup.addChild(this.drawLinkLines(proj));
                }
                shapeGroup.addChild(this.drawProjectedPoint(proj));
            }.bind(this));
            if (projectionParams.showPointText) {
                shapeGroup.addChild(this.drawPointText(pointProjections));
            }

            var shapeXY = this.drawShape(pointProjections.map(function (p) {
                return p.xy
            }).filter(function (item) {
                return item != null
            }), shape.shape);
            if (shapeXY) {
                shapeXY.data.projection = shape;
                shapeGroup.addChild(shapeXY);
            }

            var shapeYZ = this.drawShape(pointProjections.map(function (p) {
                return p.yz
            }).filter(function (item) {
                return item != null
            }), shape.shape);
            if (shapeYZ) {
                shapeYZ.data.projection = shape;
                shapeGroup.addChild(shapeYZ);
            }

            var shapeXZ = this.drawShape(pointProjections.map(function (p) {
                return p.xz
            }).filter(function (item) {
                return item != null
            }), shape.shape);
            if (shapeXZ) {
                shapeXZ.data.projection = shape;
                shapeGroup.addChild(shapeXZ);
            }
            this.graphics[index] = shapeGroup;
        }.bind(this));
        return this.graphics;
    };

    this.drawShape = function (points, shape) {
        if (points.length < 1) return null;
        var res;
        if (shape == 'point') {
            res = this.drawPoint(points);
        }
        if (shape == 'ellipse') {
            res = this.drawEllipse(points);
        }
        if (shape == 'polygon' || shape == 'line') {
            res = this.drawPolygon(points);
        }
        return res;
    };
    this.drawPolygon = function (points) {
        var shape = new Group();
        for (var i = 1; i < points.length; i++) {
            var u = new Path.Line(points[i - 1], points[i]);
            stylesManager.applyStyle(u, 'drawing');
            shape.addChild(u);
        }
        if (points.length > 2) {
            var u = new Path.Line(points[0], points[points.length - 1]);
            stylesManager.applyStyle(u, 'drawing');
            shape.addChild(u);
        }
        return shape;
    };
    this.drawPoint = function (points) {
        var shape = new Group();
        shape.addChild(new Path.Line(points[0], points[0]));
        return shape;
    };
    this.drawEllipse = function (points) {
        if (points.length != 3) return;
        var shape = new Group();

        var diff1 = points[1].subtract(points[0]);
        var diff2 = points[2].subtract(points[0]);

        var angle = new Point(1, 0).getDirectedAngle(diff1);
        var r1 = points[0].getDistance(points[1]);
        var r2 = diff2.project(diff1).getDistance(diff2);

        var rect = new Rectangle(points[0].subtract([r1, r2]), points[0].add([r1, r2]));

        var radAngle = diff1.getDirectedAngle(diff2);
        var skewAngle = Math.abs(radAngle) >= 90 ? -radAngle % 90 : 90 - radAngle % 90;
        var skewPoint = [skewAngle, 0];

        var ellipse = new Path.Ellipse(rect);
        ellipse.skew(skewPoint);
        ellipse.rotate(angle);
        stylesManager.applyStyle(ellipse, 'drawing');
        shape.addChild(ellipse);

        // var ellipse1 = new Path.Rectangle(rect);
        // ellipse1.skew(skewPoint);
        // ellipse1.rotate(angle);
        // shape.addChild(ellipse1);

        return shape;
    }
}