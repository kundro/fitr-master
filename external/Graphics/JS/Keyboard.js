function Keyboard() {
    var handlers =[];
    project.view.onKeyDown = function (event) {
        for(var i = 0; i < handlers.length; i++)
        {
            handlers[i](event);
        }
    };
    this.addHandler = function(func)
    {
        handlers.push(func);
    }
}