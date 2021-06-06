import { ContactInformation } from './contact-information';

describe('ContactInformation', () => {
    describe('donateUrl', () => {
        it('should provide donateUrl', () => {
            // Arrange

            // Act
            const donateUrl: string = ContactInformation.donateUrl;

            // Assert
            expect(donateUrl).toEqual('https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=MQALEWTEZ7HX8');
        });
    });

    describe('websiteUrl', () => {
        it('should provide websiteUrl', () => {
            // Arrange

            // Act
            const websiteUrl: string = ContactInformation.websiteUrl;

            // Assert
            expect(websiteUrl).toEqual('https://www.digimezzo.com');
        });
    });

    describe('twitterUrl', () => {
        it('should provide twitterUrl', () => {
            // Arrange

            // Act
            const twitterUrl: string = ContactInformation.twitterUrl;

            // Assert
            expect(twitterUrl).toEqual('https://twitter.com/digimezzo');
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
