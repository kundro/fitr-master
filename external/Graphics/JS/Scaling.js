function Scaling(mediator, scalingSettings, canvas)
{
	function sign(x) {
		return ((x > 0) - (x < 0)) || +x;
	}
	
    function addOnWheel(elem, handler) {
        if (elem.addEventListener) {
            if ('onwheel' in document) {
                // IE9+, FF17+
                elem.addEventListener("wheel", handler);
            } else if ('onmousewheel' in document) {
                // устаревший вариант события
                elem.addEventListener("mousewheel", handler);
            } else {
                // 3.5 <= Firefox < 17, более старое событие DOMMouseScroll пропустим
                elem.addEventListener("MozMousePixelScroll", handler);
            }
        } else { // IE8-
            grid.attachEvent("onmousewheel", handler);
        }
    }

    addOnWheel(canvas, function (e) {
        var step = scalingSettings.step;
        e.preventDefault();
        var delta = e.deltaY || e.detail || e.wheelDelta;
        var canvasRect = canvas.getBoundingClientRect();
        var mousePos = new Point(e.clientX - canvasRect.left, e.clientY - canvasRect.top);
        var coef = 1 - (step * sign(delta));
        view.scale(coef, view.viewToProject(mousePos));
        mediator.publish("fieldScaled", coef);
    });
}