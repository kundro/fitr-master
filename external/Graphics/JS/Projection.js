function Projection(shape, points3D) {
    this.shape = shape;
    this.getPointsCount = function () {
        if (shape == 'point') {
            return 1;
        }
        if (shape == 'line') {
            return 2;
        }
        if (shape == 'ellipse') {
            return 3;
        }
        return null;
    };
    this.points3D = points3D ? points3D : [];
    this.bindingTolerance = 10;
    this.autoMerge = true;
    this.isDeleted = false;
    this.isNear = function (a, b) {
        return b >= a - this.bindingTolerance && b <= a + this.bindingTolerance;
    };
    this.compareTaskPoint = function (point, taskPoint, comparer) {
        var conditions = this.parseConditions(comparer)
        if(point.x == 0)
        {
            return this.checkCondition(point.y, taskPoint.y, conditions.y) && this.checkCondition(point.z, taskPoint.z, conditions.z);
        }
        if(point.y == 0)
        {
            return this.checkCondition(point.x, taskPoint.x, conditions.x) && this.checkCondition(point.z, taskPoint.z, conditions.z);
        }
        if(point.z == 0)
        {
            return this.checkCondition(point.y, taskPoint.y, conditions.y) && this.checkCondition(point.x, taskPoint.x, conditions.x);
        }
    };
    this.parseConditions = function(conditions)
    {
        var res=
        {
            x:conditions[1],
            y:conditions[3],
            z:conditions[5],
        };
        return res;
    };
    this.checkCondition = function(a, b, condition)
    {
        if (condition === '>') {
            return a > b;
        }
        if (condition === '<') {
            return a < b;
        }
        if (condition === '=') {
            return this.isNear(a,b);
        }
    };

    this.addPoint = function (point) {
        var projectionPoint = this.get3DPoint(point);
        var nearestPoint = this.getNearestPoint(projectionPoint);
        if (nearestPoint == null || !this.autoMerge) {
            this.points3D.push(projectionPoint);
            return;
        }
        else {
            var mergedPoint = this.mergePoints(projectionPoint, nearestPoint);
            this.points3D.splice(this.points3D.indexOf(nearestPoint), 1, mergedPoint);
        }
    }
    this.checkPoint = function (point) {
        var p3D = this.get3DPoint(point);

        var countX = this.points3D.filter(function (point) {
            return point.x == 0 || point.isValid();
        }).length;
        var countY = this.points3D.filter(function (point) {
            return point.y == 0 || point.isValid();
        }).length;
        var countZ = this.points3D.filter(function (point) {
            return point.z == 0 || point.isValid();
        }).length;

        var count = Math.max(countX, countY, countZ);
        var pointsCount = this.getPointsCount();
        if (pointsCount) {
            return count < pointsCount ? true : this.getNearestPoint(p3D) ? true : false;
        }
        else {
            return !this.validate();
        }
    }
    this.getMatches = function (task) {
        if(!task.comparer)
        {
            task.comparer = 'x=y=z=';
        }
        var matches = 0;
        task.projection.points3D.forEach(function (taskPoint) {
            var yz = this.points3D.find(function (point) {
                return point.x == 0 && this.compareTaskPoint(point, taskPoint, task.comparer);
            }.bind(this));
            var xz = this.points3D.find(function (point) {
                return point.y == 0 && this.compareTaskPoint(point, taskPoint, task.comparer);
            }.bind(this));
            var xy = this.points3D.find(function (point) {
                return point.z == 0 && this.compareTaskPoint(point, taskPoint, task.comparer);
            }.bind(this));
            if (xy) {
                matches++;
            }
            if (xz) {
                matches++;
            }
            if (yz) {
                matches++;
            }
        }.bind(this));
        return matches;
    }
    this.validateTask = function (task) {
        var result =
            {
                shape: task.projection.shape,
                points: [],
            };
        task.projection.points3D.forEach(function (taskPoint) {
            var yz = this.points3D.find(function (point) {
                return point.x == 0 && this.compareTaskPoint(point, taskPoint, task.comparer);
            }.bind(this));
            var xz = this.points3D.find(function (point) {
                return point.y == 0 && this.compareTaskPoint(point, taskPoint, task.comparer);
            }.bind(this));
            var xy = this.points3D.find(function (point) {
                return point.z == 0 && this.compareTaskPoint(point, taskPoint, task.comparer);
            }.bind(this));
            result.points.push(
                {
                    point: taskPoint,
                    xy: xy ? true : false,
                    xz: xz ? true : false,
                    yz: yz ? true : false
                });
            if (xy && xz && yz) {
                this.points3D.splice(this.points3D.indexOf(xy), 1);
                this.points3D.splice(this.points3D.indexOf(xz), 1);
                this.points3D.splice(this.points3D.indexOf(yz), 1);
                this.points3D.push(new Point3D(taskPoint.x, taskPoint.y, taskPoint.z));
            }
        }.bind(this));
        return result;
    }

    this.mergePoints = function (from, to) {
        var result = new Point3D();
        result.x = to.x;
        result.y = to.y;
        result.z = to.z;
        if (to.x == 0) {
            result.x = from.x;
        }
        if (to.y == 0) {
            result.y = from.y;
        }
        if (to.z == 0) {
            result.z = from.z;
        }
        return result;
    }

    this.get3DPoint = function (point) {
        if (point.x < 0 && point.y < 0) {
            return new Point3D(-point.x, 0, -point.y);
        }
        if (point.x < 0 && point.y > 0) {
            return new Point3D(-point.x, point.y, 0);
        }
        if (point.x > 0 && point.y < 0) {
            return new Point3D(0, point.x, -point.y);
        }
        return null;
    };

    this.getNearestPoint = function (projectionPoint) {
        var tolerance = this.bindingTolerance;
        if (projectionPoint.x == 0) {
            for (var i = 0; i < this.points3D.length; i++) {
                if ((this.points3D[i].z == 0 && this.points3D[i].y >= projectionPoint.y - tolerance && this.points3D[i].y <= projectionPoint.y + tolerance)
                    || (this.points3D[i].y == 0 && this.points3D[i].z >= projectionPoint.z - tolerance && this.points3D[i].z <= projectionPoint.z + tolerance)) {
                    return this.points3D[i];
                }
            }
        }
        if (projectionPoint.y == 0) {
            for (var i = 0; i < this.points3D.length; i++) {
                if ((this.points3D[i].z == 0 && this.points3D[i].x >= projectionPoint.x - tolerance && this.points3D[i].x <= projectionPoint.x + tolerance)
                    || (this.points3D[i].x == 0 && this.points3D[i].z >= projectionPoint.z - tolerance && this.points3D[i].z <= projectionPoint.z + tolerance)) {
                    return this.points3D[i];
                }
            }

        }
        if (projectionPoint.z == 0) {
            for (var i = 0; i < this.points3D.length; i++) {
                if ((this.points3D[i].x == 0 && this.points3D[i].y >= projectionPoint.y - tolerance && this.points3D[i].y <= projectionPoint.y + tolerance)
                    || (this.points3D[i].y == 0 && this.points3D[i].x >= projectionPoint.x - tolerance && this.points3D[i].x <= projectionPoint.x + tolerance)) {
                    return this.points3D[i];
                }
            }
        }
        return null;
    }
    this.bind = function (point) {
        var point3D = this.get3DPoint(point);
        var nearest = this.getNearestPoint(point3D);
        if (nearest != null) {
            var merged = this.mergePoints(nearest, point3D);
            return merged;
        }
        return null;
    };
    this.validate = function () {
        var polygonCondition = this.shape == 'polygon' ? this.points3D.length >= 3 : false;
        var e = (polygonCondition || this.points3D.length == this.getPointsCount()) &&
            this.points3D.every(function (p) {
                return p.isValid();
            });
        return e;
    };
}