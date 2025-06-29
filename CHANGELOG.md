# Dopamine change log

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0-preview.40] - 2025-06-29

### Added

-   Added Arabic translation

### Changed

-   Images now have round corners
-   Updated the Russian translation
-   Updated the Spanish translation

### Fixed

-   Fixed a bug where artists that are separated by a semicolon ';' were not indexed correctly
-   Fixed a bug where the folders screen had an empty sorting button
-   Fixed a bug where it was not possible to remove a folder that is not displayed in the collection
-   Fixed a bug where changing the album grouping settings had no effect on the collection

## [3.0.0-preview.39] - 2025-06-21

### Added

-   Added Ctrl-F shortcut to focus the search bar and ESC to clear it
-   Added support for cover art images that have file name albumart.jpg, albumart.jpeg or albumart.png
-   Added Turkish translation

### Changed

-   Slightly improved the look of the mini player
-   Improved scaling of text on Now Playing screen for smaller screens
-   Order selections are now menus instead of toggle buttons
-   Updated the Brazilian Portuguese translation
-   Updated the Spanish translation
-   Updated the Turkish translation
-   Updated the Vietnamese translation

### Fixed

-   Fixed an issue where a random song would start playing after the queue ended when using gapless playback.
-   Fixed an issue where album lists were not refreshed after a search returned no results.
-   Fixed an issue where progress was not reset to 0 when playback has finished
-   Fixed an issue where a track that is longer than 4 minutes was scrobbled to Last.fm immediately after it started playing
-   Fixed some sizing issues on the "Folders" screen
-   Fixed search problems

## [3.0.0-preview.38] - 2025-05-29

### Added

-   Added tagging support

### Changed

-   Updated Simplified Brazilian Portuguese translation
-   Updated Simplified Russian translation
-   Updated Simplified Spanish translation

### Fixed

-   Fixed more problems with Discord Rich Presence
-   Fixed unexpected resume when skipping while paused
-   Fixed audio not playing when starting from double-clicking a file in file manager in mini player mode
-   Fixed a bug where any image residing in the same directory as the audio file was used as cover art

## [3.0.0-preview.37] - 2024-12-09

### Fixed

-   Fixed problems with Discord Rich Presence

## [3.0.0-preview.36] - 2024-12-08

### Changed

-   Updated Bulgarian translation
-   Updated Italian translation
-   Updated Russian translation
-   Updated Simplified Chinese translation
-   Updated Vietnamese translation

### Fixed

-   Fixed many issues with gapless playback
-   Fixed Windows media overlay disappearing after a few seconds
-   Fixed skipping multiple songs causing a crash

## [3.0.0-preview.35] - 2024-10-20

### Added

-   Added gapless playback
-   Added back support for .tiff cover images after having to break it in order to fix other problems
-   Added Italian translation

### Fixed

-   Fixed missing tray icons on all operating systems
-   Fixed slow performance on folders screen when opening folders containing a lot of files
-   Fixed sorting of songs by album when there are more than 9 songs in a multi-disc album
-   Fixed albums being shown under the wrong artist due to splitting of artists on separators
-   Fixed problems while transitioning between full and cover player on macOS

## [3.0.0-preview.34] - 2024-09-21

### Added

-   Adds a new macOS icon (Thank you https://github.com/VisualisationExpo)
-   Adds macOS traffic lights support (Thank you https://github.com/fr-eed)

### Changed

-   Updated Bulgarian translation
-   Updated Simplified Chinese translation

### Fixed

-   Loss of responsiveness when using large collections
-   Albums can break off mid-cover on specific window sizes
-   Playlists only wrap into multiple rows after a mouse click
-   Artists and genres semantic scroll alignment is not always correct
-   Multiple indexing issues (including unnecessary splitting of albums)
-   Hanging of UI (white screen) at startup while loading persisted queue
-   Missing newlines in lyrics
-   Application close behaviour on macOS has been improved
-   Double-clicked files are not being played in macOS
-   Selecting "Open with" on multiple files only plays one file in Windows

## [3.0.0-preview.33] - 2024-09-03

### Added

-   Adds a mini player

### Changed

-   Updated Russian translation
-   Updated Swedish translation
-   Updated Vietnamese translation

### Fixed

-   Fixes problems with saving rating to MP3 files

## [3.0.0-preview.32] - 2024-08-25

### Added

-   It is now possible to split multiple artists by customizable symbols like "ft." or "feat."

### Changed

-   Updated Brazilian Portuguese translation
-   Updated Swedish translation

### Fixed

-   Fixes application crash caused by a bug when reading album artist from .wav files
-   Fixes incorrect start position when starting songs by double-click in file explorer

## [3.0.0-preview.31] - 2024-08-11

### Fixed

-   Fixes application crash when using Bulgarian translation

## [3.0.0-preview.30] - 2024-08-05

### Added

-   When moving songs inside playlists, the playlist song order is now remembered after a restart.

### Changed

-   Updated Bulgarian translation
-   Updated Vietnamese translation

## [3.0.0-preview.29] - 2024-08-04

### Added

-   The playback state (queue, playing song, playback progress) are now remembered after a restart together with loop and shuffle state

### Changed

-   Updated Croatian translation
-   Updated Vietnamese translation

### Fixed

-   Fixed a crash that can occur when indexing album covers on Linux

## [3.0.0-preview.28] - 2024-07-27

### Added

-   Added option to follow the album cover color
-   Added option to remember playback controls (loop, shuffle) after a restart

### Changed

-   Improved loop one button

## [3.0.0-preview.27] - 2024-07-08

### Added

-   Added album grouping settings

### Changed

-   Updated Swedish translation

### Fixed

-   When no playlist folder is selected, creating a playlist does nothing.

## [3.0.0-preview.26] - 2024-06-30

### Added

-   Added a setting to toggle downloading of online lyrics

### Changed

-   Updated Simplified Chinese translation
-   Updated Russian translation

### Fixed

-   .tiff cover images don't load
-   Pressing 'Space' key when editing Playlist toggles play
-   Files don't play if they contain '?' in file name or path
-   Sorting is not alphanumeric (1, 10, 2 instead of 1, 2, 10)
-   Javascript error when closing Dopamine while it is indexing
-   Search does not work in 'Genres' tab

## [3.0.0-preview.25] - 2024-03-01

### Changed

-   Updated Russian translation

### Fixed

-   Albums are indexed even if they have been indexed before
-   Album artwork indexing is much slower since preview 24
-   Right-clicking anywhere on the collection UI reacts slowly
-   Indexing notification is not always displayed

## [3.0.0-preview.24] - 2024-02-23

### Added

-   Added Farsi translation
-   Added Polish translation

### Changed

-   Modernized the user interface
-   Updated Brazilian Portuguese translation
-   Updated Vietnamese translation

### Fixed

-   Semantic scroll on Artists and Genres pages doesn't work
-   Star ratings are reset to zero after a collection refresh
-   Songs containing multiple `#` in their path cannot be played
-   Indexing is slow since last previews

## [3.0.0-preview.23] - 2024-01-01

### Added

-   Added setting to keep playback controls visible on Now playing page
-   Added context menu to folders in folders screen which allow opening folders in file manager

### Changed

-   Updated Brazilian Portuguese translation
-   Updated Czech translation

### Fixed

-   Audio visualization is not centered
-   Playback queue does not always show all songs
-   It is not possible to drag the window by grabbing the Dopamine logo
-   Album list empty when resizing from very small window
-   Album art has low resolution since preview 22
-   Window buttons have bad contrast in dark mode
-   It should be possible to also delete configuration data when uninstalling Dopamine
-   Scroll bars appear in unexpected places when window is too small

## [3.0.0-preview.22] - 2023-12-29

### Added

-   Pressing play when the queue has finished playing now plays the first song of the queue
-   Added audio visualizer
-   Added Swedish translation

### Changed

-   More subtle page switching animation
-   Smarter default colors for tray icon
-   Updated Bulgarian translation
-   Updated Vietnamese translation

### Fixed

-   Re-ordering Artists and Genres adds empty Artists and Genres
-   Queue plays first song instead of next song when pressing next
-   Some lyrics bugs
-   MP3 files containing ID3v2 frames with non-standard frame identifiers could not be loaded
-   Updated dependencies to fix some security vulnerabilities
-   Improved performance of Now Playing screens
-   Improved UI responsiveness during indexing
-   A lot of UI problems

## [3.0.0-preview.21] - 2023-11-09

### Added

-   Clicking the volume icon now mutes/unmutes
-   Dopamine now has a logarithmic volume control, because your ears are worth it!
-   Added lyrics support
-   Dopamine now plays files that are dropped on the user interface

### Changed

-   Updated Russian translation (Thank you adem4ik)

### Fixed

-   Loop one icon has no margin
-   Searching does not update counters on Folders screen
-   Loading of songs is slow on Playlists and Folders screens
-   Playlists screen always starts playing the first song even when another song is double-clicked
-   User interface inconsistencies
-   Queue loops if it has the same song twice

## [3.0.0-preview.20] - 2023-09-17

### Added

-   Added Brazilian Korean translation (Thank you chaeya)
-   Added Brazilian Portuguese translation (Thank you ghsantos)
-   Added media key support (Thank you ghsantos)
-   Added advanced setting to view log file
-   Added artist information on the Now playing screen

### Changed

-   The queue now shows the songs in playback order (Thank you jessicajeanne)
-   Updated Bulgarian translation (Thank you kukata)
-   Updated Czech translation (Thank you Fjuro)
-   Updated German translation (Thank you BodoTh)
-   Updated Russian translation (Thank you adem4ik)
-   Updated Simplified Chinese translation (Thank you 5zhou, Guanran928, sherlockholmestech)
-   Updated Vietnamese translation (Thank you mastoduy)

### Fixed

-   Fixed the tray icon on MacOS (Thank you ghsantos)
-   Fixed Last.fm scrobbling not working after restart
-   Fixed bug where title of rating column remained visible when rating column was disabled
-   Fixed missing context menu on Songs screen

## [3.0.0-preview.19] - 2022-12-31

### Added

-   Added Last.fm support

### Fixed

-   Fixed a bug where albums weren't all displayed just after startup
-   Fixed "error: local database is inconsistent: name mismatch on package Dopamine-3.0.0" error on Arch based systems

## [3.0.0-preview.18] - 2022-11-13

### Fixed

-   Fixed a bug where files which previously failed to index were not re-indexed on the next attempt
-   Fixed indexing of some OGG files
-   Fixed indexing of external cover art for cover art files which aren't fully in lowercase
-   Fixed semantic zoom letter "h" (It was incorrectly displayed as "f")

## [3.0.0-preview.17] - 2022-11-02

### Added

-   Added "Songs" screen

### Changed

-   Updated Simplified Chinese translation
-   Updated Traditional Chinese translation

### Fixed

-   Fixed a crash that happens when rating a song that isn't currently playing
-   Fixed .m4a and .opus files not indexing anymore
-   Fixed tabs which are displayed above the notifications not being clickable

## [3.0.0-preview.16] - 2022-10-06

### Fixed

-   Fixed bug where rating is not shown in the lists of songs
-   Fixed bug where pages following a hidden page do not load their data

## [3.0.0-preview.15] - 2022-10-02

### Added

-   Added semantic zoom for artists and genres
-   Added context menu option to view song files in their folder
-   Added rating to now playing screen and controls
-   Added Greek translation

### Changed

-   Improved playlists screen to avoid confusion when creating new playlist folders
-   Artist name is displayed on 2 lines on now playing screen when too long
-   Updated Russian translation

### Fixed

-   Fixed a problem uninstalling
-   Fixed Discord Rich Presence not updating

## [3.0.0-preview.14] - 2022-09-16

### Added

-   Added Spanish translation

### Changed

-   Updated Russian translation

### Fixed

-   Fixes fonts not getting loaded correctly
-   Fixes crash on Windows

## [3.0.0-preview.13] - 2022-09-14

### Added

-   Added support for MP4 audio playback
-   Added option to delete song files from the computer
-   Added rating
-   Added German translation

### Changed

-   Updated Russian translation
-   Album lists are more responsive

### Fixed

-   Fixed an issue where image and text would not change simultaneously when the playing song changes

## [3.0.0-preview.12] - 2022-07-28

### Added

-   Added option to show and hide the Artists, Albums, ... pages
-   Added Croatian translation
-   Added Czech translation

### Fixed

-   Fixed bug where toggling Discord Rich Presence in the settings has the inverse effect
-   Fixed a problem setting Discord Rich Presence time remaining

## [3.0.0-preview.11] - 2022-06-16

### Added

-   Added optional tray icon with optional minimize and close to tray
-   Added "Random" album sort order
-   Added possibility to add songs from folders screen to playlists and queue
-   Added Japanese translation
-   Added Kurdish translation
-   Added Vietnamese translation

### Changed

-   Updated the Simplified Chinese translation

### Fixed

-   Disks containing an inaccessible "System Volume Information" folder cannot be indexed
-   Crash when applying custom theme which has unsupported properties

## [3.0.0-preview.10] - 2022-04-04

### Added

-   Updated Bulgarian translation
-   Songs can now be added to and removed from the playback queue

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

### Fixed

-   Scroll bars do not follow the system colors anymore

## [3.0.0-preview.7] - 2021-09-20

### Fixed

-   Buttons on playback pane (under the progress bar) are not clickable

## [3.0.0-preview.6] - 2021-09-19

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

### Fixed

-   Fixed misalignment of menu selector after startup

## [3.0.0-preview.2] - 2021-07-17

### Added

-   Added a "Now playing" screen

### Fixed

-   Fixed a bug that causes incorrect detection of available updates
-   Fixed high CPU usage caused by playback progress bar
-   Fixed a crash caused by Discord Rich Presence which happens when the start or end of the playback queue is reached
-   Fixed a bug where the playing song is not cleared when playback stops when reaching the start or end of the playback
    queue
-   Fixed a bug that caused duplicate artists in the Artists screen
-   Fixed a bug that caused duplicate genres in the Genres screen
-   Fixed incorrect color of chevron text in Artists and Genres screens when using the light theme
-   Fixed a bug where the Dopamine 2 shortcut in Windows is overwritten and points to Dopamine 3 after installing Dopamine
    3

## [3.0.0-preview.1] - 2021-06-30

### Added

-   First preview, which adds Linux support.
