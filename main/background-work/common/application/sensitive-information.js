class SensitiveInformation {
    static lastfmApiKey = process.env.LASTFM_API_KEY || '';
}

exports.SensitiveInformation = SensitiveInformation;
