# Maintainer: Digimezzo <digimezzo@outlook.com>
_productname=Dopamine
_executablename=dopamine
pkgname=dopamine-official
pkgver=3.0.2
pkgrel=1
pkgdesc="The audio player that keeps it simple"
arch=('x86_64')
url="https://digimezzo.github.io/site/"
license=('GPL3')
provides=(${pkgname})
conflicts=(${pkgname})
replaces=(${pkgname})
depends=()
makedepends=('coreutils')
backup=()
options=(!strip)
source=("${_productname}-${pkgver}.AppImage::https://github.com/digimezzo/${_executablename}/releases/download/v${pkgver//_/-}/${_productname}-${pkgver}.AppImage"
	"${_executablename}.desktop")
sha256sums=('09bdcac2a7f83d05be6d0a27b0f7400b3a7b8295539b40e947cc0e710d6a6451'
		'e0ac0b0c4deaaa288eb712492661fc0d22614277f2d3fd6953d45a23c9a4890d')

prepare() {
    chmod u+x      ${srcdir}/${_productname}-${pkgver}.AppImage

    ${srcdir}/${_productname}-${pkgver}.AppImage --appimage-extract
}

package() {
    find           ${srcdir}/squashfs-root/locales/ -type d -exec chmod 755 {} +
    find           ${srcdir}/squashfs-root/resources/ -type d -exec chmod 755 {} +

    install -d     ${pkgdir}/opt/${_executablename}
    cp -r          ${srcdir}/squashfs-root/*                       ${pkgdir}/opt/${_executablename}

    # remove broken or unused files and directories
    rm -r          ${pkgdir}/opt/${_executablename}/usr/
    rm             ${pkgdir}/opt/${_executablename}/AppRun
    rm             ${pkgdir}/opt/${_executablename}/${_executablename}.desktop
    rm             ${pkgdir}/opt/${_executablename}/${_executablename}.png

    find           ${srcdir}/squashfs-root/usr/share/icons/ -type d -exec chmod 755 {} +

    install -d     ${pkgdir}/usr/share/icons
    cp -r          ${srcdir}/squashfs-root/usr/share/icons/hicolor ${pkgdir}/usr/share/icons/hicolor

    install -d     ${pkgdir}/usr/bin
    ln -s          ../../opt/${_executablename}/${_executablename}                ${pkgdir}/usr/bin/${_executablename}

    install -Dm644 ${srcdir}/${_executablename}.desktop                   ${pkgdir}/usr/share/applications/${_executablename}.desktop
}
