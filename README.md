![Dopamine](Dopamine.full.png)

# Dopamine

Dopamine is an audio player which tries to make organizing and listening to music as simple and pretty as possible. This version is written using Electron, Angular and Typescript. The original Dopamine (for Windows), which is written in WPF and C#, remains available <a href="https://github.com/digimezzo/dopamine-windows">here</a>.

Dopamine icons created by <a href="https://www.itssharl.ee/">Sharlee</a>.

[![Release](https://img.shields.io/github/release/digimezzo/dopamine.svg?style=flat-square)](https://github.com/digimezzo/dopamine/releases/latest)
[![Issues](https://img.shields.io/github/issues/digimezzo/dopamine.svg?style=flat-square)](https://github.com/digimezzo/dopamine/issues)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=MQALEWTEZ7HX8)

<a href='https://ko-fi.com/S6S11K63U' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://az743702.vo.msecnd.net/cdn/kofi1.png?v=2' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

## About this repository

The code in this repository is the base for Dopamine 3. It is still work in progress and building it, doesn't yet provide you with a functional audio player. The code of Dopamine 2 can be found <a href="https://github.com/digimezzo/dopamine-windows">here</a>.

```diff
- Dopamine 3 is in very very early development. The code in this repository does NOT produce a working auido player. If you want an audio player, try Dopamine 2 instead: https://www.digimezzo.com/content/software/dopamine/
```

## Build prerequisites for GNU/Linux

- rpm: required to build rpm package
- libarchive-tools: contains bsdtar, which is required to build pacman package.

**To install the prerequisites on Ubuntu:**

`sudo apt install wine rpm libarchive-tools`

## Build prerequisites for Windows

Open a PowerShell prompt as Administrator and run this command to instal the Windows build tools:

`npm install --global --production windows-build-tools --vs2015`

## Build instructions

Due to the native dependency better-sqlite3, this project cannot be built for all platforms on GNU/Linux. The GNU/Linux packages must be built on GNU/Linux. The Windows package must be built on Windows. For mac, you're on your own. I have no means to test it out.

```bash
$ git clone https://github.com/digimezzo/dopamine.git
$ cd dopamine
$ npm install                # Install dependencies
$ npm run rebuild-sqlite     # Rebuild better-sqlite3 for the version of node.js which is used by Electron
$ npm start                  # Start Dopamine
$ npm run electron:windows   # Build for Windows
$ npm run electron:linux     # Build for Linux
$ npm run electron:mac       # Build for Mac
```

## Pacman installation notes

The pacman package contains a dependency to package libappindicator-sharp, which is no longer distributed with Arch Linux. I cannot remove this dependency for now, because it is an issue in electron-builder (the packaging tool which is used in this project). It is, however, possible to install Knowte on Arch Linux or Manjaro using this command (replace x.y.z with the correct version number): 

`$ sudo pacman -U Knowte-x.y.z.pacman --assume-installed libappindicator-sharp`
