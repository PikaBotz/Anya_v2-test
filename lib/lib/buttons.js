const Config = require('../../config');

const buttons = async (message, number) => {

function getId() {
    const regex = /_ID: ([A-Za-z0-9]+)_/;
    const match = message.match(regex);
    return match ? match[1] : null;
}

    let cmd;
    const prefix = Config.prefa;
    const id = getId();

    /**
     * return the desired value of cmd ('body' in index)
     * return _404 {String} as invalid number
     */
    switch (id.toLowerCase().split("qa")[1]) {

        /**
         * alive;
         */
        case '01':
            if (/1/.test(number)) {
                cmd = `${prefix}allmenu`;
            } else if (/2/.test(number)) {
                cmd = `${prefix}listmenu`;
            } else cmd = `_404`;
            break;

        /**
         * animewall
         */
        case '02':
            cmd = `${prefix}animewall`;
            break;

        /**
         * if the id (eg: QA69) is invalid
         * return __404 {String} as invalid id
         */
        default:
            cmd = `__404`;
            break;

    }
    return cmd;
}

module.exports = { buttons };