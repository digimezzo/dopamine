import { IMock, Mock } from 'typemoq';
import { ArtistInformationFactory } from './artist-information-factory';
import { DesktopBase } from '../../common/io/desktop.base';

describe('ArtistInformationFactory', () => {
    let desktopMock: IMock<DesktopBase>;

    beforeEach(() => {
        desktopMock = Mock.ofType<DesktopBase>();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const factory: ArtistInformationFactory = new ArtistInformationFactory(desktopMock.object);

            // Assert
            expect(factory).toBeDefined();
        });
    });

    describe('create', () => {
        it('should create an ArtistInformation instance with set properties', () => {
            // Arrange
            const factory: ArtistInformationFactory = new ArtistInformationFactory(desktopMock.object);

            // Act
            const instance = factory.create('name', 'url', 'imageUrl', 'biography');

            // Assert
            expect(instance).toBeDefined();
            expect(instance.name).toEqual('name');
            expect(instance.url).toEqual('url');
            expect(instance.imageUrl).toEqual('imageUrl');
            expect(instance.biography).toEqual('biography');
        });
    });

    describe('createEmpty', () => {
        it('should create an ArtistInformation instance with empty properties', () => {
            // Arrange
            const factory: ArtistInformationFactory = new ArtistInformationFactory(desktopMock.object);

            // Act
            const instance = factory.createEmpty();

            // Assert
            expect(instance).toBeDefined();
            expect(instance.name).toEqual('');
            expect(instance.url).toEqual('');
            expect(instance.imageUrl).toEqual('');
            expect(instance.biography).toEqual('');
        });
    });
});
