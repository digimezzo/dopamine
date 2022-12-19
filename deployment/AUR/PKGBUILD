# Maintainer: SL_Pirate <isiraherath626@gmail.com>
# Contributor: Fabio Loli <fabio.loli@disroot.org>
# Contributor: Digimezzo <digimezzo@outlook.com>

_pkgname=Dopamine
__pkgname=dopamine
pkgname=dopamine-appimage-preview
__pkgver=3.0.0-preview
prevver=18
_pkgver=${__pkgver}.${prevver}
pkgver=${_pkgver//-/.}
pkgrel=1
pkgdesc="The audio player that keeps it simple"
arch=('x86_64')
url="https://digimezzo.github.io/site/"
license=('GPL3')
depends=(alsa-lib gtk3 nss)
provides=(dopamine)
conflicts=(dopamine)
options=(!strip)
source_x86_64=(https://github.com/digimezzo/dopamine/releases/download/v${__pkgver}${prevver}/Dopamine-${__pkgver}.${prevver}.AppImage)
source=("dopamine.desktop")
sha512sums=('772e3bcb8788ba35abd0069db1fc7b3629898d27015e1ba0d220766c4bd9fa36b96f9e2dd93781b11191d9017018970e955665cc688afa32566b3e66456c9237')
sha512sums_x86_64=('4c89612b1d88b6e589b7e17f9bbeaf352277710526a051f94f8826bfa92403182ce4b7db87c968dd1d911e8dd4c496539d17af068c60fd32a2b28d998ab37822')

prepare() {
    chmod u+x      ${srcdir}/${_pkgname}-${_pkgver}.AppImage

    ${srcdir}/${_pkgname}-${_pkgver}.AppImage --appimage-extract
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
