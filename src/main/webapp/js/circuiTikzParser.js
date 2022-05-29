// Automatically called by drawio's JS code.
// Find in app.min.js by searching for the function name.
// Parses the XML in drawio and saves XML elements in a global JS object 'data'.
function parseToCircuiTikz(xmlStr) {
    let parser = new DOMParser();
    xml = parser.parseFromString(xmlStr, "text/xml");

    data = new CircuitData();

    let mxCells = xml.getElementsByTagName("mxCell"); // Get all mxCells as an array
    for (let i = 0; i < mxCells.length; i++) {
        let cell = mxCells.item(i); // Get one mxCell
        let component = new CircuitNode(); // JS object for mxCell

        // Add attributes to component
        let cellAttr = cell.getAttributeNames(); // Get all attributes of mxCell as an array
        for (let j = 0; j < cellAttr.length; j++) {
            let attrName = cellAttr.at(j);
            let attrVal = cell.getAttribute(attrName);
            let splitAttr = attrVal.split(';');
            if (splitAttr.length == 1) {
                component.addAttr(new Attribute(attrName, attrVal));
            } else { // 'style' attribute when split has length greater than 1
                let styleArr = [];
                for (let k = 0; k < splitAttr.length-1; k++) { // Last element is "", so ignore
                    styleArr.push(new Attribute(splitAttr.at(k).split('=').at(0), splitAttr.at(k).split('=').at(1)));
                }
                component.addAttr(styleArr);
            }
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
    let retVal;
    if(children.length == 1) {
        child = children.item(0);
        retVal = new CircuitNode(child.tagName);

        // Add attributes to node
        let childAttr = child.getAttributeNames();
        for(let j = 0; j < childAttr.length; j++) {
            let attrName = childAttr.at(j);
            let attrVal = child.getAttribute(attrName);
            retVal.addAttr(new Attribute(attrName, attrVal));
        }

        if(child.hasChildNodes()) {
            retVal.setChild(parseChild(child.children));
        }
    } else { // More than one child node
        retVal = [];
        for(let i = 0; i < children.length; i++) {
            let child = children.item(i);
            let node = new CircuitNode(child.tagName);

            // Add attributes to node
            let childAttr = child.getAttributeNames();
            for(let j = 0; j < childAttr.length; j++) {
                let attrName = childAttr.at(j);
                let attrVal = child.getAttribute(attrName);
                node.addAttr(new Attribute(attrName, attrVal));
            }

            if(child.hasChildNodes()) {
                node.setChild(parseChild(child.children));
            }

            retVal.push(node);
        }
    }
    return retVal;
}
