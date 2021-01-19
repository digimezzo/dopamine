import assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { BaseRemoteProxy } from '../../core/io/base-remote-proxy';
import { WindowControlsComponent } from './window-controls.component';

describe('WindowControlsComponent', () => {
    let remoteProxyMock: IMock<BaseRemoteProxy>;

    let component: WindowControlsComponent;

    beforeEach(() => {
        remoteProxyMock = Mock.ofType<BaseRemoteProxy>();
        component = new WindowControlsComponent(remoteProxyMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            assert.ok(component);
        });
    });
});
