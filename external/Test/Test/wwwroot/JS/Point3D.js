function Point3D(x,y,z)
{
    this.x = x;
    this.y = y;
    this.z = z;
    this.isValid = function () {
        return this.x != 0 && this.y != 0 && this.z != 0;
    }
    Object.defineProperty(this, "xy", {
        get: function () {
            return this.x !== 0 && this.y !== 0 ? new Point(-this.x, this.y) : null;
        }.bind(this),

        set: function (value) {
            this.x = -value.x;
            this.y = value.y;
        }.bind(this),
    });
    Object.defineProperty(this, "xz", {
        get: function () {
            return this.x !== 0 && this.z !== 0 ? new Point(-this.x, -this.z) : null;
        }.bind(this),

        set: function (value) {
            this.x = -value.x;
            this.z = -value.y;
        }.bind(this),
    });
    Object.defineProperty(this, "yz", {
        get: function () {
            return this.y !== 0 && this.z !== 0 ? new Point(this.y, -this.z) : null;
        }.bind(this),

        set: function (value) {
            this.y = value.x;
            this.z = -value.y;
        }.bind(this),
    });
}
Point3D.prototype.toString = function() {
    return '(' + this.x + ';' + this.y + ';' + this.z + ')';
};