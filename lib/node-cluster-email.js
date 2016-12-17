/** Copyright(c) 2016 JACK <sunjser@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

const Email = require('email').Email
const jade = require('jade')
const fs = require('fs')

/**
 * Initialize mail plugin with the given `email(s)`,
 * with the given `options`.
 *
 * Options:
 *
 *    - `from` sender email
 *    - `timeout` sendmail timeout in milliseconds
 *    - `subject` defaulting to " cluster({worker}) exception: {message}"
 *    - `template` function called with local variables (usually jade / ejs template etc)
 *
 * @param {String|Array} email(s)
 * @param {Object} options
 * @return {Function}
 * @api public
 */
class mail {
    constructor(opt) {
        this.emails = opt.emails
        this.options = opt.options
    }

    /**
     * init
     */
    clusterMailGenerate() {
        // options
        let options = this.options || {};
        let emails = this.emails || [];
        if ('string' == typeof emails) emails = [emails];
        if (!emails.length) throw new Error('email(s) required');

        // defaults
        options.to = emails;
        options.from = options.from || 'mail@cluster.com';
        options.subject = options.subject || 'cluster({worker}) exception: {message}';
        options.template = options.template || this.template();

        mail.enableInWorker = true;
        this.options = options
        this.emails = emails
    }


    mailGenerate(worker, msg) {
        this.send(worker, msg, this.options, msg);
        return mail;
    }

    /**
     * Send `err` notification for the given `worker`.
     *
     * @param {Worker} worker
     * @param {Error} err
     * @param {Object} options
     * @param {Object} data
     * @api private
     */
    send(worker, err, options, data) {
        options = this.clone(options);

        // subject
        options.subject = options.subject
            .replace('{worker}', worker.id)
            .replace('{message}', err.message);

        // body
        options.bodyType = 'html';
        options.body = options.template({
            worker: worker
            , error: err
            , data: data
        });

        // send
        var email = new Email(options);
        email.send(function (err) {
            if (err) console.error(err.stack || err.message);
        });
    }


    /**
     * Clone the given `obj`.
     *
     * @param {Object} obj
     * @return {Object}
     * @api private
     */

    clone(obj) {
        var ret = {};
        for (var key in obj) ret[key] = obj[key];
        return ret;
    }

    /**
     * Read / compile default template.
     */

    template() {
        var str = fs.readFileSync(__dirname + '/email-temple.jade', 'utf8');
        return jade.compile(str);
    }
}


/**
 * Library version.
 */

exports.version = '0.1.4';


/**
 * Expose the plugin.
 */

exports = module.exports = mail;



