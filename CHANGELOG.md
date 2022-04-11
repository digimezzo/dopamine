# Dopamine change log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.0.0-preview.11] - 2022-04-11

### Added

-   Optional tray icon

### Changed

### Removed

### Fixed

-   Disks containing an inaccessible "System Volume Information" folder cannot be indexed

## [3.0.0-preview.10] - 2022-04-04

### Added

-   Updated Bulgarian translation
-   Songs can now be added to and removed from the playback queue

### Changed

### Removed

### Fixed

-   Fixed: paths containing '#' cannot be played
-   Fixed: Discord Rich Presence time remaining is incorrect

## [3.0.0-preview.9] - 2022-03-16

### Added

-   Added Bulgarian translation
-   Added Traditional Chinese translation
-   Added Russian translation

### Changed

-   Downloading missing album covers is now disabled by default
-   Discord Rich Presence is now disabled by default

### Removed

### Fixed

-   Fixed playlist image not updating when changing it a second time
-   Fixed 'Add to playlist' menu does not indicate clearly that there are no playlists

## [3.0.0-preview.8] - 2022-03-06

### Added

-   Added Palenight theme
-   Added Chinese (simplified) translation
-   Added basic playlists support

### Changed

-   Improved macOS icon

### Removed

### Fixed

-   Scroll bars do not follow the system colors anymore

## [3.0.0-preview.7] - 2021-09-20

### Added

### Changed

### Removed

### Fixed

-   Buttons on playback pane (under the progress bar) are not clickable

## [3.0.0-preview.6] - 2021-09-19

### Added

### Changed

### Removed

### Fixed

-   Instead of crashing, Dopamine now fallbacks to a default theme when the current theme is invalid.
-   Search bar does not work when 'Use system title bar' setting is disabled
-   Artists and genres break off without ellipsis when the artists and genres columns are too narrow
-   Paginating does not work on Collection, Settings and Information tabs when the window is too narrow.
-   Welcome screen does not scroll when the window is too small

## [3.0.0-preview.5] - 2021-09-17

### Added

-   Added Mac support
-   Added search

### Changed

-   Theme files have changed. Custom themes will have to be re-created from one of the default themes.

### Removed

### Fixed

-   Fixed blurry bold fonts in Windows
-   Fixed some indexing problems
-   Fixed forgotten and invisible selections on all screens

## [3.0.0-preview.4] - 2021-08-20

### Added

-   It is now possible to associate audio files to Dopamine and play them with Dopamine from the file manager
-   It is now possible to create custom themes
-   Added Manjaro light and dark theme
-   Added Ubuntu light and dark theme

### Changed

### Removed

### Fixed

-   Fixes a crash that happens after a clean install of Preview 3
-   No folder is selected when opening the folders screen for the first time
-   Background cover of Now playing screen is almost invisible when using light theme
-   Hopefully fixed blurry fonts in Windows

## [3.0.0-preview.3] - 2021-08-05

### Added

-   Pressing the ENTER key pauses and resumes playback
-   Clicking on the album cover of the currently playing song, opens the "Now playing" screen.
-   Added now playing background
-   Smoother transitions between screens
-   Lower memory usage

### Changed

### Removed

### Fixed

-   Fixed misalignment of menu selector after startup

## [3.0.0-preview.2] - 2021-07-17

### Added

-   Added a "Now playing" screen

### Changed

### Removed

### Fixed

-   Fixed a bug that causes incorrect detection of available updates
-   Fixed high CPU usage caused by playback progress bar
-   Fixed a crash caused by Discord Rich Presence which happens when the start or end of the playback queue is reached
-   Fixed a bug where the playing song is not cleared when playback stops when reaching the start or end of the playback queue
-   Fixed a bug that caused duplicate artists in the Artists screen
-   Fixed a bug that caused duplicate genres in the Genres screen
-   Fixed incorrect color of chevron text in Artists and Genres screens when using the light theme
-   Fixed a bug where the Dopamine 2 shortcut in Windows is overwritten and points to Dopamine 3 after installing Dopamine 3

## [3.0.0-preview.1] - 2021-06-30

### Added

-   First preview, which adds Linux support.

### Changed

### Removed

### Fixed
