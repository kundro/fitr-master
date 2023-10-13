function Background(mediator, backgroundSettings, stylesManager) {
    var margin = 50;
    var lastBounds = new Rectangle(view.bounds.point.subtract(margin), view.size.add(margin));
    view.translate(view.viewSize.divide(2));
    var redraw = function () {
        lastBounds = new Rectangle(view.bounds.point.subtract(margin), view.size.add(margin));
        mediator.publish("backgroundDrawingStarted");
        if (backgroundSettings.showGrid) drawGrid();
        if (backgroundSettings.showAxis) drawAxis();
        if (backgroundSettings.showAxisText) drawText();
        mediator.publish("backgroundDrawingFinished");
    }

    var drawGrid = function () {
        var scaledMargin = margin;
        var boundRect = view.bounds;
        var cellSize = backgroundSettings.gridStep;
        var grid = new Group();

        var rightPoint = [boundRect.right + scaledMargin, 0];
        var leftPoint = [boundRect.left - scaledMargin, 0];
        var horLine = new Symbol(new Path.Line(rightPoint, leftPoint));

        var topPoint = [0, boundRect.bottom + scaledMargin];
        var bottomPoint = [0, boundRect.top - scaledMargin];
        var vertLine = new Symbol(new Path.Line(topPoint, bottomPoint));

        horLine.definition.strokeColor = backgroundSettings.gridColor;
        vertLine.definition.strokeColor = backgroundSettings.gridColor;
        horLine.definition.strokeScaling = false;
        vertLine.definition.strokeScaling = false;

        var yStart = Math.round((boundRect.top - scaledMargin) / cellSize) * cellSize;

        for (y = yStart; y < boundRect.bottom + scaledMargin; y += cellSize) {
            grid.addChild(horLine.place(new Point(view.center.x, y)));
        }

        var xStart = Math.round((boundRect.left - scaledMargin) / cellSize) * cellSize;

        for (x = xStart; x < boundRect.right + scaledMargin; x += cellSize) {
            grid.addChild(vertLine.place(new Point(x, view.center.y)));
        }
    }
    var drawText = function()
    {
        var shift = 6;
        var zeroText = new PointText([shift, 2*shift+2]);
        stylesManager.applyTextStyle(zeroText, 'axisText');
        zeroText.content = '0';
        zeroText.scaling = new Point(1,1).divide(view.scaling);

        var xText = new PointText(new Point(view.bounds.left,0).add([6,15]));
        stylesManager.applyTextStyle(xText, 'axisText');
        xText.content = 'X';
        xText.scaling = new Point(1,1).divide(view.scaling);

        var y1Text = new PointText(new Point(0, view.bounds.bottom).add([3,-60/view.zoom]));
        stylesManager.applyTextStyle(y1Text, 'axisText');
        y1Text.content = 'Y';
        y1Text.scaling = new Point(1,1).divide(view.scaling);

        var y2Text = new PointText(new Point(view.bounds.right,0).add([-12, 15]));
        stylesManager.applyTextStyle(y2Text, 'axisText');
        y2Text.content = 'Y';
        y2Text.scaling = new Point(1,1).divide(view.scaling);

        var zText = new PointText(new Point(0, view.bounds.top).add([3, 20]));
        stylesManager.applyTextStyle(zText, 'axisText');
        zText.content = 'Z';
        zText.scaling = new Point(1,1).divide(view.scaling);
    }
    var drawAxis = function () {
        var scaledMargin = margin;
        var boundRect = view.bounds;

        var axisLeft = new Path([0, 0], [boundRect.left - scaledMargin, 0]);
        var axisRight = new Path([0, 0], [boundRect.right + scaledMargin, 0]);
        var axisBottom = new Path([0, 0], [0, boundRect.bottom + scaledMargin]);
        var axisTop = new Path([0, 0], [0, boundRect.top - scaledMargin]);

        var axis = new Group([axisLeft, axisRight, axisBottom, axisTop]);

        if(backgroundSettings.threeAxis)
        {
            axisLeft.strokeColor = 'red';
            axisTop.strokeColor = 'green';
            axisRight.strokeColor = 'blue';
            axisBottom.strokeColor = 'blue';
        }
        else
        {
            axis.strokeColor = backgroundSettings.axisColor;
        }
        axis.strokeWidth = backgroundSettings.axisWidth;
        axis.strokeScaling = false;
    }
    redraw();
    mediator.subscribe("settingsChanged", function (path, value) {
            redraw();
        },
        {
            predicate: function (path, value) {
                return path.startsWith("background");
            },
        });
    mediator.subscribe("fieldScaled", function () {
        if (!lastBounds.contains(view.bounds) ||
            (lastBounds.size.width - view.bounds.size.width > 2 * margin)) {
            redraw();
        }
    });
    mediator.subscribe("fieldMoved", function () {
        if (!lastBounds.contains(view.bounds)) {
            redraw();
        }
    });
}