```bash
                      __                        __                   __                                                    _     __
   ____   ____   ____/ /  ___          _____   / /  __  __   _____  / /_  ___    _____         ___    ____ ___   ____ _   (_)   / /
  / __ \ / __ \ / __  /  / _ \ ______ / ___/  / /  / / / /  / ___/ / __/ / _ \  / ___/ ______ / _ \  / __ `__ \ / __ `/  / /   / /
 / / / // /_/ // /_/ /  /  __//_____// /__   / /  / /_/ /  (__  ) / /_  /  __/ / /    /_____//  __/ / / / / / // /_/ /  / /   / /
/_/ /_/ \____/ \__,_/   \___/        \___/  /_/   \__,_/  /____/  \__/  \___/ /_/            \___/ /_/ /_/ /_/ \__,_/  /_/   /_/
```
[![Build Status](https://travis-ci.org/sunNode/node-cluster-email.svg?branch=master)](https://travis-ci.org/sunNode/node-cluster-email)


A module for taking advantage of the built-in cluster module in node v0.8 and above.send email if cluster exception,you will recieve a detail email about worker exception.

## Installation
```bash
npm install https://github.com/sunNode/node-cluster-email
```


## Usage
Initialize mail plugin with the given email(s), with the given options.

 Options:

  - `from` sender email
  - `timeout` sendmail timeout in milliseconds
  - `subject` defaulting to "cluster({worker}) exception: {message}"
  - `template` function called with local variables (usually jade / ejs template etc)

## Example

```bash
const cluster = require('cluster')
const cpu = require ('os').cpus().length
const mail = require('node-cluster-mail')

/**
 * [if description]
 * @param  {[type]} cluster.isMaster [description]
 * @return {[type]}                  [description]
 */
if (cluster.isMaster) {
  // Fork workers.
  for (let i = 0; i < cpu; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    mail('phonenix@gmail.com',{'from':'phonenix-test@gmail.com','cc':'phonenix-test2@gmail.com'})
    console.log('worker ' + worker.process.pid + ' died');
  });

  cluster.on('fork', function(worker) {
  console.log(`workers: ${worker.id} worker.process.pid :${worker.process.pid}`)
});
} else {
  // Workers can share any TCP connection
  // In this service its a restify server
  require('./app')
}
```
   



## License 

MIT License

Copyright (c) 2016 Jack Sun

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


