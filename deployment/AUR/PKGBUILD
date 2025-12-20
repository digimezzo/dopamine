# Maintainer: Digimezzo <digimezzo@outlook.com>
_pkgname=Dopamine
__pkgname=dopamine
pkgname=dopamine-official
pkgver=3.0.1
pkgrel=3
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
source=("${_pkgname}-${pkgver}.AppImage::https://github.com/digimezzo/${__pkgname}/releases/download/v${pkgver//_/-}/${_pkgname}-${pkgver}.AppImage"
	"${__pkgname}.desktop")
sha256sums=('72b396d48f1837bf8eca89607a256f059f19b30d113548e8ce6bc68103b5ca60'
		'e0ac0b0c4deaaa288eb712492661fc0d22614277f2d3fd6953d45a23c9a4890d')

prepare() {
    chmod u+x      ${srcdir}/${_pkgname}-${pkgver}.AppImage

    ${srcdir}/${_pkgname}-${pkgver}.AppImage --appimage-extract
}

package() {
    find           ${srcdir}/squashfs-root/locales/ -type d -exec chmod 755 {} +
    find           ${srcdir}/squashfs-root/resources/ -type d -exec chmod 755 {} +

    install -d     ${pkgdir}/opt/${__pkgname}
    cp -r          ${srcdir}/squashfs-root/*                       ${pkgdir}/opt/${__pkgname}

    # remove broken or unused files and directories
    rm -r          ${pkgdir}/opt/${__pkgname}/usr/
    rm             ${pkgdir}/opt/${__pkgname}/AppRun
    rm             ${pkgdir}/opt/${__pkgname}/${__pkgname}.desktop
    rm             ${pkgdir}/opt/${__pkgname}/${__pkgname}.png

    find           ${srcdir}/squashfs-root/usr/share/icons/ -type d -exec chmod 755 {} +

    install -d     ${pkgdir}/usr/share/icons
    cp -r          ${srcdir}/squashfs-root/usr/share/icons/hicolor ${pkgdir}/usr/share/icons/hicolor

    install -d     ${pkgdir}/usr/bin
    ln -s          ../../opt/${__pkgname}/${__pkgname}                ${pkgdir}/usr/bin/${__pkgname}

    install -Dm644 ${srcdir}/${__pkgname}.desktop                   ${pkgdir}/usr/share/applications/${__pkgname}.desktop
}
