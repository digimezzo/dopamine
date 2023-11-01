![Dopamine](Dopamine.full.png)

# Dopamine

Dopamine is an elegant audio player which tries to make organizing and listening to music as simple and pretty as possible. This version is written using Electron, Angular and Typescript. The original Dopamine (for Windows), which is written in WPF and C#, remains available <a href="https://github.com/digimezzo/dopamine-windows">here</a>.

Dopamine icons created by <a href="https://www.itssharl.ee/">Sharlee</a>.

[![Release](https://img.shields.io/github/release/digimezzo/dopamine.svg?style=flat-square&include_prereleases)](https://github.com/digimezzo/dopamine/releases/latest)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/digimezzo/dopamine/Nightly%20builds?style=flat-square)](https://github.com/digimezzo/dopamine/actions/workflows/nightly.yml)
[![Issues](https://img.shields.io/github/issues/digimezzo/dopamine.svg?style=flat-square)](https://github.com/digimezzo/dopamine/issues)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=MQALEWTEZ7HX8)

<a href='https://ko-fi.com/S6S11K63U' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://az743702.vo.msecnd.net/cdn/kofi1.png?v=2' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

![Dopaminescreenshot](Dopamine.screenshot.png)

## Thank you JetBrains!

[![JetBrains logo](https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.png)

The rendered output looks like this:
An old rock in the desert
Escaping Characters

To display a literal character that would otherwise be used to format text in a Markdown document, add a backslash (\) in front of the character.

\* Without the backslash, this would be a bullet in an unordered list.

The rendered output looks like this:

* Without the backslash, this would be a bullet in an unordered list.
Characters You Can Escape

You can use a backslash to escape the following characters.
Character 	Name
\ 	backslash
` 	backtick (see also escaping backticks in code)
* 	asterisk
_ 	underscore
{ } 	curly braces
[ ] 	brackets
< > 	angle brackets
( ) 	parentheses
# 	pound sign
+ 	plus sign
- 	minus sign (hyphen)
. 	dot
! 	exclamation mark
| 	pipe (see also escaping pipe in tables)
HTML

Many Markdown applications allow you to use HTML tags in Markdown-formatted text. This is helpful if you prefer certain HTML tags to Markdown syntax. For example, some people find it easier to use HTML tags for images. Using HTML is also helpful when you need to change the attributes of an element, like specifying the color of text or changing the width of an image.

To use HTML, place the tags in the text of your Markdown-formatted file.

This **word** is bold. This <em>word</em> is italic.

The rendered output looks like this:

This word is bold. This word is italic.
HTML Best Practices

For security reasons, not all Markdown applications support HTML in Markdown documents. When in doubt, check your Markdown application’s documentation. Some applications support only a subset of HTML tags.

Use blank lines to separate block-level HTML elements like <div>, <table>, <pre>, and <p> from the surrounding content. Try not to indent the tags with tabs or spaces — that can interfere with the formatting.

You can’t use Markdown syntax inside block-level HTML tags. For example, <p>italic and **bold**</p> won’t work.
Markdown Guide book cover
Take your Markdown skills to the next level.

Learn Markdown in 60 pages. Designed for both novices and experts, The Markdown Guide book is a comprehensive reference that has everything you need to get started and master Markdown syntax.
Want to learn more Markdown?

Don't stop now! 🚀 Star the GitHub repository and then enter your email address below to receive new Markdown tutorials via email. No spam!

    Overview
    Headings
    Paragraphs
    Line Breaks
    Emphasis
    Blockquotes
    Lists
    Code
    Horizontal Rules
    Links
    Images
        Linking Images
    Escaping Characters
    HTML

Thank you [JetBrains]([https://duckduckgo.com](https://www.jetbrains.com/community/opensource/?utm_campaign=opensource&utm_content=approved&utm_medium=email&utm_source=newsletter&utm_term=jblogo#support)) for supporting this project!

## Build prerequisites

-   rpm: required to build rpm package
-   libarchive-tools: contains bsdtar, which is required to build pacman package.

**Build prerequisites on Ubuntu:**

-   Install Node.js LTS
-   Install Visual Studio Code
-   Install rpm (required to build rpm package) and libarchive-tools (contains bsdtar, which is required to build pacman package): `sudo apt install rpm libarchive-tools`

Follow the build instructions below to start or build Dopamine for your platform.

**Build prerequisites on Manjaro:**

-   Install Node.js LTS:
    -   `yay -S nvm`
    -   `nvm install 14`
-   Install Visual Studio Code: `yay -S visual-studio-code-bin`
-   Install rpm (required to build rpm package): `sudo pacman -S rpm-tools`

Follow the build instructions below to start or build Dopamine for your platform.

**Build prerequisites on Windows:**

-   Download and install Node.js LTS from https://nodejs.org (During the installation, select all features and check the box to install **Tools for Native Modules**).
-   After the installation of Node.js, restart computer to ensure that npm is added to the path.
-   Download and install Visual Studio Code from https://code.visualstudio.com/
-   Download the Dopamine source code
-   Open Visual Studio Code and open the "dopamine" folder (the folder containing package.json)

Follow the build instructions below to start or build Dopamine for your platform.

**Build prerequisites on MacOS:**

-   Install Node.js LTS from https://nodejs.org (During the installation, select all features and check the box to install Tools for Native Modules).
-   Make sure npm is accessible via the console
    -   Press command + space and search for console
    -   Write `npm --v` and press enter, this should give you the version number if npm is properly installed.
-   Download and install Visual Studio Code from https://code.visualstudio.com/
-   Download the Dopamine source code
-   Open Visual Studio Code and open the "dopamine" folder (the folder containing package.json)

## Build instructions

Due to the native dependency better-sqlite3, this project cannot be built for all platforms on GNU/Linux. The GNU/Linux packages must be built on GNU/Linux, the Windows package must be built on Windows and the MacOS package must be built on MacOS.

```bash
$ git clone https://github.com/digimezzo/dopamine.git
$ cd dopamine
$ npm install                # Install dependencies
$ npm start                  # Start Dopamine
$ npm run electron:windows   # Build for Windows
$ npm run electron:linux     # Build for Linux
$ npm run electron:mac       # Build for Mac
```

## Pacman installation notes

The pacman package can be installed using this command (replace x.y.z with the correct version number):

`$ sudo pacman -U Dopamine-x.y.z.pacman`

If you're getting an error concerning a missing package libappindicator-sharp, use this command to perform the installation instead (replace x.y.z with the correct version number):

`$ sudo pacman -U Dopamine-x.y.z.pacman --assume-installed libappindicator-sharp`
