import { ContactInformation } from './contact-information';

describe('ContactInformation', () => {
    describe('donateUrl', () => {
        it('should provide donateUrl', () => {
            // Arrange

            // Act
            const donateUrl: string = ContactInformation.donateUrl;

            // Assert
            expect(donateUrl).toEqual('https://digimezzo.github.io/site/donate');
        });
    });

    describe('websiteUrl', () => {
        it('should provide websiteUrl', () => {
            // Arrange

            // Act
            const websiteUrl: string = ContactInformation.websiteUrl;

            // Assert
            expect(websiteUrl).toEqual('https://digimezzo.github.io/site');
        });
    });

    describe('blueskyUrl', () => {
        it('should provide blueskyUrl', () => {
            // Arrange

            // Act
            const blueskyUrl: string = ContactInformation.blueskyUrl;

            // Assert
            expect(blueskyUrl).toEqual('https://bsky.app/profile/digimezzo.bsky.social');
        });
    });

    describe('githubUrl', () => {
        it('should provide githubUrl', () => {
            // Arrange

            // Act
            const githubUrl: string = ContactInformation.githubUrl;

            // Assert
            expect(githubUrl).toEqual('https://github.com/digimezzo');
        });
    });
});
