class Parent {
    constructor(child) {
        this.child = child;
    }

    getName() {
        return this.child.getName();
    }
}

exports.Parent = Parent;
