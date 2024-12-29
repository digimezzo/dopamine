class GuidFactoryMock {
    createReturnValue = 0;

    create() {
        return this.createReturnValue;
    }
}

exports.GuidFactoryMock = GuidFactoryMock;
