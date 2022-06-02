// Automatically called by drawio's JS code.
// Find in app.min.js by searching for the function name.
// Parses the XML in drawio and saves XML elements in a global JS object named 'data'.
function parseToCircuiTikz(xmlStr) {
    let parser = new DOMParser();
    xml = parser.parseFromString(xmlStr, "text/xml");

    data = new CircuitData();

    let mxCells = xml.getElementsByTagName("mxCell"); // Get all mxCells as an array
    for (let i = 0; i < mxCells.length; i++) {
        let cell = mxCells.item(i); // Get one mxCell
        let component = new CircuitElement(); // JS object for mxCell

        // Add attributes to component
        let cellAttr = cell.getAttributeNames(); // Get all attributes of mxCell as an array
        for (let j = 0; j < cellAttr.length; j++) {
            let attrName = cellAttr.at(j);
            let attrVal = cell.getAttribute(attrName);
            let splitAttr = attrVal.split(';');
            if (splitAttr.length != 1) { // When length is greater than 1, it's the 'style' attribute
                let styleAttr = {};
                for (let k = 0; k < splitAttr.length-1; k++) { // Last element is "", so ignore
                    styleAttr[splitAttr.at(k).split('=').at(0)] = splitAttr.at(k).split('=').at(1);
                }
                attrVal = styleAttr;
            }
            component.addAttr(attrName, attrVal);
        }
        // Add child(ren) to component
        if (cell.hasChildNodes()) {
            component.setChild(parseChild(cell.children));
        }

        data.addComponent(component);
    }
};

// Parses the XML in 'children' and called recursively to process children's children.
// Parameter 'children': HTMLCollection
function parseChild(children) {
    let retVal = [];
    for(let i = 0; i < children.length; i++) {
        let child = children.item(i);
        let node = new CircuitElement(child.tagName);

        // Add attributes to node
        let childAttr = child.getAttributeNames();
        for(let j = 0; j < childAttr.length; j++) {
            let attrName = childAttr.at(j);
            let attrVal = child.getAttribute(attrName);
            node.addAttr(attrName, attrVal);
        }

        if(child.hasChildNodes()) {
            node.setChild(parseChild(child.children));
        }

        if(children.length == 1) {
            retVal = node;
        } else { // If more than one child, returns array
            retVal.push(node);
        }
    }

    return retVal;
}

// Calculates the (x,y) coordinates of a rotated rectangle's vertices.
// Rotation is in the clockwise direction, with the x-axis as 0 degrees.
//    ex) Rotation of 90 degrees, rotates rectangle clockwise from horizontal to vertical.
// Parameters (If omitted, all 0 by default):
//    center_x: x coordinate at the center of the rectangle.
//    center_y: y coordinate at the center of the rectangle.
//    width: Full width of the rectangle.
//    height: Full height of the rectangle.
//    degree: Degree of rotation, do not provide in radians.
function getRotatedVertices(center_x = 0, center_y = 0, width = 0, height = 0, degree = 0) {
    width = width / 2; // Only half of width and height needed for this function
    height = height / 2;
    let rVertices = [];
    let rad = degree * Math.PI / 180;
    let cos = Math.cos(rad);
    let sin = Math.sin(rad);

    // upper-left (x,y)
    rVertices.push({x: center_x - (width * cos) - (height * sin), y: center_y - (width * sin) + (height * cos)});
    // upper-right (x,y)
    rVertices.push({x: center_x + (width * cos) - (height * sin), y: center_y + (width * sin) + (height * cos)});
    // lower-right (x,y)
    rVertices.push({x: center_x + (width * cos) + (height * sin), y: center_y + (width * sin) - (height * cos)});
    // lower-left (x,y)
    rVertices.push({x: center_x - (width * cos) + (height * sin), y: center_y - (width * sin) - (height * cos)});

    return rVertices;
}