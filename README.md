![Dopamine](Dopamine.full.png)

# Dopamine

Dopamine is an audio player which tries to make organizing and listening to music as simple and pretty as possible. This version is written using Electron, Angular and Typescript. The original Dopamine (for Windows), which is written in WPF and C#, remains available <a href="https://github.com/digimezzo/dopamine-windows">here</a>.

Dopamine icons created by <a href="https://www.itssharl.ee/">Sharlee</a>.

[![Release](https://img.shields.io/github/release/digimezzo/dopamine.svg?style=flat-square)](https://github.com/digimezzo/dopamine/releases/latest)
[![Issues](https://img.shields.io/github/issues/digimezzo/dopamine.svg?style=flat-square)](https://github.com/digimezzo/dopamine/issues)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=MQALEWTEZ7HX8)

<a href='https://ko-fi.com/S6S11K63U' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://az743702.vo.msecnd.net/cdn/kofi1.png?v=2' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

## About this repository

**IMPORTANT: the code in this repository is the base for Dopamine 3. It is still work in progress and building it, does NOT provide you with a functional audio player. If you want a functional audio player, try <a href="https://www.digimezzo.com/content/software/dopamine/">Dopamine 2</a> instead. The source code of Dopamine 2 can be found <a href="https://github.com/digimezzo/dopamine-windows">here</a>.**

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

-   Download and install Node.js LTS from https://nodejs.org (During the installation, select all features and check the box to install Tools for Native Modules).
-   After the installation of Node.js, restart computer to ensure that npm is added to the path.
-   Download and install Visual Studio Code from https://code.visualstudio.com/
-   Download the Dopamine source code
-   Open Visual Studio Code and open the "dopamine" folder (the folder containing package.json)

Follow the build instructions below to start or build Dopamine for your platform.

## Build instructions

Due to the native dependency better-sqlite3, this project cannot be built for all platforms on GNU/Linux. The GNU/Linux packages must be built on GNU/Linux. The Windows package must be built on Windows. For mac, you're on your own. I have no means to test it out.

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

The pacman package contains a dependency to package libappindicator-sharp, which is no longer distributed with Arch Linux. I cannot remove this dependency for now, because it is an issue in electron-builder (the packaging tool which is used in this project). It is, however, possible to install Dopamine on Arch Linux or Manjaro using this command:

`$ sudo pacman -U Dopamine-3.0.0-preview.1 --assume-installed libappindicator-sharp`
