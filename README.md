![Dopamine](Dopamine.full.png)

# Dopamine

Dopamine is an audio player which tries to make organizing and listening to music as simple and pretty as possible. This version is written using Electron, Angular and Typescript. The original Dopamine (for Windows), which is written in WPF and C#, remains available <a href="https://github.com/digimezzo/dopamine-windows">here</a>.

Dopamine icons created by <a href="https://www.itssharl.ee/">Sharlee</a>.

[![Release](https://img.shields.io/github/release/digimezzo/dopamine-electron.svg?style=flat-square)](https://github.com/digimezzo/dopamine-electron/releases/latest)
[![Issues](https://img.shields.io/github/issues/digimezzo/dopamine-electron.svg?style=flat-square)](https://github.com/digimezzo/dopamine-electron/issues)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=MQALEWTEZ7HX8)

<a href='https://ko-fi.com/S6S11K63U' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://az743702.vo.msecnd.net/cdn/kofi1.png?v=2' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

## About this repository

The code in this repository is the base for Dopamine 3. It is still work in progress and building it, doesn't yet provide you with a functional audio player. The code of Dopamine 2 can be found <a href="https://github.com/digimezzo/dopamine-windows">here</a>.

## Build prerequisites

- wine: required to build Windows package
- rpm: required to build rpm package
- libarchive-tools: contains bsdtar, which is required to build pacman package.

**To install the prerequisites on Ubuntu:**

sudo apt install wine rpm libarchive-tools

## Build instructions

```bash
$ git clone https://github.com/digimezzo/dopamine.git
$ cd knowte
$ npm install            # Download dependencies
$ npm start              # Start Dopamine
$ npm run electron:windows   # Build for Windows
$ npm run electron:linux     # Build for Linux
$ npm run electron:mac       # Build for Mac
```
