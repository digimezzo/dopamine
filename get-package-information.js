function getName(){
    return require('./package.json').name;
}

function getFullVersion() {
    const version = require('./package.json').version;
    const versionSuffix = require('./package.json').versionSuffix;

    if(versionSuffix === ""){
        return version;
    }

    return version + "-" + versionSuffix;
}

function getCopyright(){
    return require('./package.json').copyright;
}

module.exports.getName = getName;
module.exports.getFullVersion = getFullVersion;
module.exports.getCopyright = getCopyright;