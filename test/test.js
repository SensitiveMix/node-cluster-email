/**
 * Created by sunNode on 16/12/17.
 */
const should = require('should');
const mail = require('../lib/node-cluster-email')
const http = require('http')
const cluster = require('cluster')
const cpu = require('os').cpus().length

let email = new mail({'emails': 'sunjser@gmail.com'})

describe('cluster email test', function () {
    it('send email if fork a child_process', function (done) {
        if (cluster.isMaster) {
            // Fork workers.
            for (let i = 0; i < cpu; i++) {

                cluster.fork();
            }
            email.clusterMailGenerate()

            cluster.on('exit', function (worker, code, signal) {
                console.log('worker ' + worker.process.pid + ' died');

            });

            cluster.on('fork', function (worker) {
                email.mailGenerate(worker, {worker_process_id: worker.process.pid, message: 'connect error'})
                console.log(`workers: ${worker.id} worker.process.pid :${worker.process.pid}`)

            });
            done()
        } else {
            // Workers can share any TCP connection
            // In this service its a restify server
        }
    });
});
