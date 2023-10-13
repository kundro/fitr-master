
$(document).ready(function () {
    var constColor = {
        'black': '#000000',
        'white': '#ffffff',
        'red': '#FF0000',
        'default': '#777777',
        'primary': '#337ab7',
        'success': '#5cb85c',
        'info': '#5bc0de',
        'warning': '#f0ad4e',
        'danger': '#d9534f'
    };
    $('.draggable').draggable({ containment: "parent" });

    $('.taskResultsPanel').hide();

    $('.toolboxMain li').click(function () {
        var tool = $(this).attr('data-tool');
        toolbox[tool].activate();
    });
    $('.toolbox3D li').click(function () {
        var tool = $(this).attr('data-tool');
        toolbox3D[tool].activate();
    });

    mediator.subscribe("toolActivated", function (tool) {
        $('[data-tool].active').removeClass('active');
        $('.toolboxMain [data-tool=' + tool + ']').addClass('active');
    });

    mediator.subscribe("tool3DActivated", function (tool) {
        $('[data-tool].active').removeClass('active');
        $('.toolbox3D [data-tool=' + tool + ']').addClass('active');
    });

    $(".colorpicker-component[data-setting]").colorpicker({
        colorSelectors: constColor,
    }).on('hidePicker', function () {
        settingsManager.setValue($(this).attr('data-setting'), $(this).colorpicker('getValue'));
    });
    $(".colorpicker-component[data-setting]").each(function (i, item) {
        var val = settingsManager.getValue($(item).attr('data-setting'));
        $(item).colorpicker('setValue', val);
    });

    $('.navbar-btn').click(function () {
        var navId = $(this).attr('id');
        var tab = $("[data-nav-id=" + navId + "]");
        if (tab.is(":visible")) {
            tab.hide("fast");
        }
        else {
            $("[data-nav-id]:visible").hide();
            tab.show();
        }
    });

    /*
        projectionManager.getTasks().forEach(function (task, i) {
            var list = $('.tasksList');
            var template = list.children().first();
            var listItem = template.clone();
            listItem.text(task);
            listItem.val(i);
            listItem.show();
            listItem.appendTo(list);
        });
    
        $('.tasksList li').click(function () {
            $('.tasksList li.active').removeClass('active');
            $(this).addClass('active');
            $('.taskText').text($(this).text());
            projectionManager.testMode = true;
        });
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        $('.taskValidate').click(function () {
            $('.taskResultsPanel').show();
            var index = parseInt($('.tasksList li.active').first().val());
            var res = projectionManager.validateTask(index);
            var items = $('.taskErrors>li:not(:first-child)').each(function () {
                $(this).remove();
            });
            var list = $('.taskErrors');
            res.forEach(function (result) {
                var projValid = true;
                var pointsHtml = result.points.map(function (p) {
                    if (p.xy && p.xz && p.yz) {
                        return '<li class="taskTrue">' + p.point.toString() + '<span class="glyphicon glyphicon-ok"></span></li>';
                    }
                    else if (!p.xy && !p.xz && !p.yz) {
                        projValid = false;
                        return '<li class="taskFalse">' + p.point.toString() + '<span class="glyphicon glyphicon-remove"></span></li>';
                    }
                    else {
                        projValid = false;
                        var xyHtml = p.xy ? '<span class="taskTrue">XY<span class="glyphicon glyphicon-ok"></span></span>' : '<span class="taskFalse">XY<span class="glyphicon glyphicon-remove"></span></span>';
                        var xzHtml = p.xz ? '<span class="taskTrue">XZ<span class="glyphicon glyphicon-ok"></span></span>' : '<span class="taskFalse">XZ<span class="glyphicon glyphicon-remove"></span></span>';
                        var yzHtml = p.yz ? '<span class="taskTrue">YZ<span class="glyphicon glyphicon-ok"></span></span>' : '<span class="taskFalse">YZ<span class="glyphicon glyphicon-remove"></span></span>';
                        return '<li class="taskFalse">' + p.point.toString() + ' ' + xyHtml + xzHtml + yzHtml + '</li>';
                    }
                }).join('');
                var liClass = result.points
                list.append('<li class="'+(projValid?'taskTrue':'taskFalse')+'">' + capitalizeFirstLetter(result.shape) + '<ul>'+pointsHtml+'</ul></li>');
            });
        });
    
        $('.taskCancel').click(function () {
            $('.taskResultsPanel').hide();
            $('.tasksList li.active').removeClass('active');
            $('.taskText').text('');
            projectionManager.testMode = false;
        });
    */
    $("input[type=number][data-setting]").change(function () {
        settingsManager.setValue($(this).attr("data-setting"), parseInt($(this).val()));
    });
    $("input[type=number][data-setting]").each(function () {
        var val = settingsManager.getValue($(this).attr("data-setting"));
        $(this).val(val);
    });


    $("input[type=checkbox][data-setting]").click(function () {
        if (!$(this).is(':checked')) {
            settingsManager.setValue($(this).attr("data-setting"), false);
        }
        else {
            settingsManager.setValue($(this).attr("data-setting"), true);
        }
    });
    $("input[type=checkbox][data-setting]").each(function () {
        var val = settingsManager.getValue($(this).attr("data-setting"));
        $(this).prop('checked', val);
    });

    $("input[data-slider-min]").bootstrapSlider();
    $("input[data-slider-min]").on("slide", function (slideEvt) {
        settingsManager.setValue($(this).attr('data-setting'), slideEvt.value);
        $(this).siblings(".valueLabel").text(slideEvt.value);
    });
    $("input[data-slider-min]").each(function (i, item) {
        var val = settingsManager.getValue($(item).attr('data-setting'));
        $(item).bootstrapSlider('setValue', val);
        $(item).siblings(".valueLabel").text(val);
    });

    $("select[data-setting]").change(function () {
        var value = $(this).val();
        settingsManager.setValue($(this).attr('data-setting'), value);
    });
    $("select[data-setting]").each(function () {
        var val = settingsManager.getValue($(this).attr("data-setting"));
        $(this).val(val);
    });
    $("[data-for-tool]").each(function (i, item) {
        $(item).hide();
        mediator.subscribe('toolActivated', function (tool) {
            var a = $(item).attr('data-for-tool');
            if (tool == $(item).attr('data-for-tool')) {
                $(item).show();
            }
            else {
                $(item).hide();
            }
        });
    });
    $('#controlLayersPanel').click(function () {
        $('#layersPanel').toggle();
    });
    $('#controlElementPanel').click(function () {
        $('#leftmenu').toggle();
    });

    splate.onReceived = data => {
        document.getElementById("background.showGrid").checked = data.showGrid;
        document.getElementById("projections.showLinkLines").checked = data.showProjectionLines;
        document.getElementById("binding.bindToGrid").checked = data.snapToGrid;
        document.getElementById("projections.showPointText").checked = data.pointAutoNaming;
        document.getElementById("navbar.message").innerHTML = data.message;

        settingsManager.settings.background.showGrid = data.showGrid;
        settingsManager.settings.projections.showLinkLines = data.showProjectionLines;
        settingsManager.settings.binding.bindToGrid = data.snapToGrid;
        settingsManager.settings.projections.showPointText = data.pointAutoNaming;

        console.log(data)
    };

    splate.onSubmit = () => {
        var point = {};

        if (projectionManager.projections.length === 1) {
            const p = projectionManager.projections[0];
            let axes = "";

            point.x = p.points3D[0].x;
            point.y = p.points3D[0].y;
            point.z = p.points3D[0].z;

             if (p.points3D[0].x) {
                 point.x = p.points3D[0].x / settingsManager.settings.binding.scalingFactor;
                 axes += "X";
             }
             if (p.points3D[0].y) {
                 point.y = p.points3D[0].y  / settingsManager.settings.binding.scalingFactor;
                 axes += "Y";
             }
             if (p.points3D[0].z) {
                 point.z = p.points3D[0].z / settingsManager.settings.binding.scalingFactor;
                 axes += "Z";
             }

            point.axes = axes;
        }

        if (projectionManager.projections.length > 1) {

            for (var i = 0; i < projectionManager.projections.length; i++)
            {
                const p = projectionManager.projections[i];
                let axes = "";

                point['x' + (i + 1)] = p.points3D[0].x;
                point['y' + (i + 1)] = p.points3D[0].y;
                point['z' + (i + 1)] = p.points3D[0].z;

                if (p.points3D[0].x) {
                    point['x' + (i + 1)] = p.points3D[0].x / settingsManager.settings.binding.scalingFactor;
                    axes += "X";
                }
                if (p.points3D[0].y) {
                    point['y' + (i + 1)] = p.points3D[0].y  / settingsManager.settings.binding.scalingFactor;
                    axes += "Y";
                }
                if (p.points3D[0].z) {
                    point['z' + (i + 1)] = p.points3D[0].z / settingsManager.settings.binding.scalingFactor;
                    axes += "Z";
                }

                point["axes" + (i + 1)] = axes;
            }
        }

        console.log(point);

        splate.send(point);
    };
});
