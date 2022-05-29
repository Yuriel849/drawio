// Single object holding all information on a circuit diagram
function CircuitData(mxCells = []) {
    this.mxCells = mxCells; // Default empty array
}

// Add a CircuitComponent object to the array in a CircuitData object
CircuitData.prototype.addComponent = function(component) {
    this.mxCells.push(component);
}

function CircuitNode(name = "mxCell", attrs = [], child = null) {
    this.name = name; // Default name "mxCell"
    this.attrs = attrs; // Default empty array
    this.child = child; // Default null
}

CircuitNode.prototype.addAttr = function(attr) {
    this.attrs.push(attr);
}

CircuitNode.prototype.setChild = function(child) {
    this.child = child;
}

CircuitNode.prototype.addChild = function(child) {
    if(this.child.constructor === Array) {
        this.child.push(child);
    }
}

function Attribute(name, value) {
    this.name = name;
    this.value = value;
}
