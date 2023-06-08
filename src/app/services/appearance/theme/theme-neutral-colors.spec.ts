import { ThemeNeutralColors } from './theme-neutral-colors';

describe('ThemeNeutralColors', () => {
    function createNeutralColors(): ThemeNeutralColors {
        return new ThemeNeutralColors(
            'red', // windowButtonIcon
            'green', // hoveredItemBackground
            'blue', // selectedItemBackground
            'black', // tabText
            'white', // selectedTabText
            '#aaa', // mainBackground
            '#bbb', // headerBackground
            '#ccc', // footerBackground
            '#ddd', // sidePaneBackground
            '#eee', // primaryText
            '#fff', // secondaryText
            '#111', // breadcrumbBackground
            '#222', // sliderBackground
            '#333', // sliderThumbBackground
            '#444', // albumCoverLogo
            '#555', // albumCoverBackground
            '#666', // paneSeparators
            '#777', // settingsSeparators
            '#770', // contextMenuSeparators
            '#888', // scrollBars
            '#999', // searchBox
            '#aaa', // searchBoxText
            '#bbb', // searchBoxIcon
            '#ccc', // dialogBackground
            '#ddd', // primaryButtonText
            '#eee', // secondaryButtonBackground
            '#fff', // secondaryButtonText
            '#fff' // tooltipText
        );
    }

    beforeEach(() => {});

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors).toBeDefined();
        });

        it('should set windowButtonIcon', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.windowButtonIcon).toEqual('red');
        });

        it('should set hoveredItemBackground', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.hoveredItemBackground).toEqual('green');
        });

        it('should set selectedItemBackground', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.selectedItemBackground).toEqual('blue');
        });

        it('should set tabText', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.tabText).toEqual('black');
        });

        it('should set selectedTabText', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.selectedTabText).toEqual('white');
        });

        it('should set mainBackground', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.mainBackground).toEqual('#aaa');
        });

        it('should set headerBackground', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.headerBackground).toEqual('#bbb');
        });

        it('should set footerBackground', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.footerBackground).toEqual('#ccc');
        });

        it('should set sidePaneBackground', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.sidePaneBackground).toEqual('#ddd');
        });

        it('should set primaryText', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.primaryText).toEqual('#eee');
        });

        it('should set secondaryText', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.secondaryText).toEqual('#fff');
        });

        it('should set breadcrumbBackground', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.breadcrumbBackground).toEqual('#111');
        });

        it('should set sliderBackground', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.sliderBackground).toEqual('#222');
        });

        it('should set sliderThumbBackground', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.sliderThumbBackground).toEqual('#333');
        });

        it('should set albumCoverLogo', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.albumCoverLogo).toEqual('#444');
        });

        it('should set albumCoverBackground', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.albumCoverBackground).toEqual('#555');
        });

        it('should set paneSeparators', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.paneSeparators).toEqual('#666');
        });

        it('should set settingsSeparators', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.settingsSeparators).toEqual('#777');
        });

        it('should set contextMenuSeparators', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.contextMenuSeparators).toEqual('#770');
        });

        it('should set scrollBars', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.scrollBars).toEqual('#888');
        });

        it('should set searchBox', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.searchBox).toEqual('#999');
        });

        it('should set searchBoxText', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.searchBoxText).toEqual('#aaa');
        });

        it('should set searchBoxIcon', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.searchBoxIcon).toEqual('#bbb');
        });

        it('should set dialogBackground', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.dialogBackground).toEqual('#ccc');
        });

        it('should set primaryButtonText', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.primaryButtonText).toEqual('#ddd');
        });

        it('should set secondaryButtonBackground', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.secondaryButtonBackground).toEqual('#eee');
        });

        it('should set secondaryButtonText', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.secondaryButtonText).toEqual('#fff');
        });

        it('should set tooltipText', () => {
            // Arrange

            // Act
            const colors: ThemeNeutralColors = createNeutralColors();

            // Assert
            expect(colors.tooltipText).toEqual('#fff');
        });
    });
});
