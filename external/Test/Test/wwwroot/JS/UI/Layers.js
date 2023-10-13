$(document).ready(function () {
    var layoutPanel = $("#layoutPanel");
    var addLayout = $("#addLayout");
    var AllLayoutPanel = $("#AllLayoutPanel");
    const removeLayoutName = 'removeLayout';
    const layoutNameName = 'layer';
    const someSwith = 'someSwitchLayout';
    const radioButtonLayoutName = 'radioButtonLayout';
    const removeNameForDelete = 'layer';
    const radioButtonChangeLayerName = 'activelayout';
    var index = 1;//TODO убрать

    addLayout.click(function () {
        AddLayout(index);
    });
    function AddLayout(name){
            AllLayoutPanel.append(GenerateLayoutTemplate(name));
            BindEventForRemoveLayer(name);
            BindEventForChangeLayer();
            BindEventForChangeVisibleLayer(name);
            var tempRemoveNameForDelete = removeNameForDelete + name;
            layerManager.addLayer(tempRemoveNameForDelete);

    }
    function BindEventForChangeVisibleLayer(name) {

        var tempSomeChangeName = '#' + someSwith + name;
        $(tempSomeChangeName).change(function () {
            var name = $(this).val();
            if($(this).is(':checked')){
                layerManager.show(name);
                console.log('set show layer' + name);
            }
            else{
                layerManager.hide(name);
                console.log('set hide layer' + name);
            }
        })
    }
    //Event change layout
    function BindEventForChangeLayer() {
        $("input[name=activelayout]:radio").change( function() {
            console.log('set active layout: ' + $(this).attr("data-id")); //TODO удалить
            layerManager.setActive($(this).attr("data-id"))
        });
    }
    function BindEventForRemoveLayer(name) {
        var tempRemoveLayoutName = '#' +  removeLayoutName + name;
        $(tempRemoveLayoutName).bind("click", function () {
            var id = $(this).attr("data-id");
            var name = $(this).attr("data-name");
            var elementForRemove = '#' + layoutNameName + id;
            var check = layerManager.removeLayer(name);
            if(check == false){
                console.log('error remove layer(layers < 1) ' + name);
            }
            else{
                $(elementForRemove).remove();
                console.log('remove layer ' + name);
            }
        });
    }
    function GenerateLayoutTemplate(layoutName) {
            // debugger;
            var removeLayoutEventName = removeLayoutName + layoutName;
            var layoutNameEventName = layoutNameName + layoutName;
            var someSwitchEventName = someSwith + layoutName;
            var radioButtonEventName = radioButtonLayoutName + layoutName;
            var tempRemoveNameForDelete;
            if(typeof(layoutName) == "number"){
                tempRemoveNameForDelete  = removeNameForDelete + layoutName;
            }
            else{
                tempRemoveNameForDelete = layoutName;
            }

            var layoutTemplate = $(' <li class="list-group-item" id="'+layoutNameEventName+'">' +
                '<input id="'+radioButtonEventName+'" type="radio" name="'+ radioButtonChangeLayerName +'" data-id="'+tempRemoveNameForDelete+'" style="margin-right:2%" checked="checked" >' +
                ''+tempRemoveNameForDelete+'' +
                '<span style="float:right">'+
                '<input id="'+someSwitchEventName+'" value="'+tempRemoveNameForDelete+'" type="checkbox" checked="checked"/>' +
                '<span data-name="'+tempRemoveNameForDelete+'" data-id="'+layoutName+'" id="'+removeLayoutEventName+'" class="glyphicon glyphicon-minus removeLayout" style="color:red;"></span></span>' +
                '</li>');

            index++; //TODO убрать
        return  layoutTemplate;
    }

    function RemoveAllLayers() {
        AllLayoutPanel.empty();
    }

    function MainPoint() {
        var layers = layerManager.getLayers();
        $.each(layers, function (index, infoObject) {
            AllLayoutPanel.prepend(GenerateLayoutTemplate(infoObject.name));
            BindEventForRemoveLayer(infoObject.name);
            BindEventForChangeVisibleLayer(infoObject.name);
            BindEventForChangeLayer(infoObject.name);
        })
    }
    MainPoint();
});

