# Maintainer: SL_Pirate <isiraherath626@gmail.com>
# Contributor: Fabio Loli <fabio.loli@disroot.org>
# Contributor: Digimezzo <digimezzo@outlook.com>

_pkgname=Dopamine
__pkgname=dopamine
pkgname=dopamine-appimage-preview
__pkgver=3.0.0-preview
prevver=19
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
sha512sums=('c27e980de4fb9e9a4a7b714c65c35aef9fe37e13f4589e5c1160e927df4dd9e0370999995d092b7009829bc1e410cd7fbfbd4f3fb11ffa05d5c5cfb1657ba793')
sha512sums_x86_64=('61cbd5936f3bb1f80fb7df38dab1c1e53686f41e6688a4d62dea30ccc70b8fb8102fca9f3cf7cf1780c82389836be642c36f29b6e07b1e14a0996f3aacab5176')

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
