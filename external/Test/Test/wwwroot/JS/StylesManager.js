function StylesManager(mediator, styles, textStyles) {
    var dashArrays =
        {
            solid: [],//обычная
            dotted: [1, 2],//..........
            dashed: [5, 4],//-------------------
            dotDash: [5, 3, 0.1, 3],//-.-.-.-.-.-.-.-.-
            twoDotsOneDash: [5, 2, 1, 2, 1, 2],//-..-..-..-..-..
        }

    this.applyStyle = function (item, style) {
        var settings = styles[style];
        if (typeof settings.strokeColor != 'undefined') {
            item.strokeColor = settings.strokeColor;
        }

        if (typeof settings.strokeWidth != 'undefined') {
            item.strokeWidth = settings.strokeWidth;
        }

        if (typeof settings.strokeScaling != 'undefined') {
            item.strokeScaling = settings.strokeScaling;
        }

        if (typeof settings.lineType != 'undefined') {
            if (typeof settings.lineScaling != 'undefined') {
                item.dashArray = getDashArray(settings.lineType, settings.lineScaling);
            }
            else {
                item.dashArray = getDashArray(settings.lineType, 1);
            }
        }

        if (typeof settings.fillColor != 'undefined') {
            item.fillColor = settings.fillColor;
        }

        if (typeof settings.opacity != 'undefined') {
            item.opacity = settings.opacity;
        }

        if (typeof settings.shadowColor != 'undefined') {
            item.shadowColor = settings.shadowColor;
        }

        if (typeof settings.shadowBlur != 'undefined') {
            item.shadowBlur = settings.shadowBlur;
        }

        if (typeof settings.shadowOffset != 'undefined') {
            item.shadowOffset = settings.shadowOffset;
        }
        item.strokeCap = 'round';
    }

    this.applyTextStyle = function (item, style) {
        var settings = textStyles[style];
        if (typeof settings.strokeColor != 'undefined') {
            item.strokeColor = settings.strokeColor;
        }

        if (typeof settings.strokeWidth != 'undefined') {
            item.strokeWidth = settings.strokeWidth;
        }

        if (typeof settings.strokeScaling != 'undefined') {
            item.strokeScaling = settings.strokeScaling;
        }

        if (typeof settings.lineType != 'undefined') {
            if (typeof settings.lineScaling != 'undefined') {
                item.dashArray = getDashArray(settings.lineType, settings.lineScaling);
            }
            else {
                item.dashArray = getDashArray(settings.lineType, 1);
            }
        }

        if (typeof settings.fillColor != 'undefined') {
            item.fillColor = settings.fillColor;
        }

        if (typeof settings.opacity != 'undefined') {
            item.opacity = settings.opacity;
        }

        if (typeof settings.shadowColor != 'undefined') {
            item.shadowColor = settings.shadowColor;
        }

        if (typeof settings.shadowBlur != 'undefined') {
            item.shadowBlur = settings.shadowBlur;
        }

        if (typeof settings.shadowOffset != 'undefined') {
            item.shadowOffset = settings.shadowOffset;
        }
        item.strokeCap = 'round';

        if (typeof settings.fontFamily != 'undefined') {
            item.fontFamily = settings.fontFamily;
        }

        if (typeof settings.fontWeight != 'undefined') {
            item.fontWeight = settings.fontWeight;
        }
        if (typeof settings.fontSize != 'undefined') {
            item.fontSize = settings.fontSize;
        }
        if (typeof settings.justification != 'undefined') {
            item.justification = settings.justification;
        }
    }

    var getDashArray = function (lineType, coef) {
        return dashArrays[lineType].map(function (num) {
            return num * coef;
        });
    };

    mediator.subscribe("settingsChanged", function (path, value) {
            project.selectedItems.forEach(function (item) {
                this.applyStyle(item, 'drawing');
            }.bind(this))
        }.bind(this),
        {
            predicate: function (path, value) {
                return path.startsWith("styles.drawing");
            },
        });
}