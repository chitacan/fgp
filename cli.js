#!/usr/bin/env node
require('colors');
const {EOL} = require('os');
const meow = require('meow');
const ora = require('ora');
const got = require('got');
const log = require('log-update');

const cli = meow([
  'Usage',
  '  $ geoip <domain_or_ip>',
  '',
  'Options',
  '  -v, --verbose Output more information'
], {
  alias: {
    v: 'verbose'
  }
});

const spinner = ora('Loading...').start();

got(`freegeoip.net/json/${cli.input[0]}`, {json: true})
  .then(({body, headers}) => {
    spinner.stop();
    let output = [
      '',
      '            ip  '.grey + body.ip,
      '  country code  '.grey + body.country_code,
      '  country name  '.grey + body.country_name,
      '   region code  '.grey + body.region_code,
      '   region name  '.grey + body.region_name,
      '          city  '.grey + body.city,
      '      zip code  '.grey + body.zip_code,
      '     time zone  '.grey + body.time_zone,
      '           lat  '.grey + body.latitude,
      '           lon  '.grey + body.longitude,
      '    metro code  '.grey + body.metro_code,
      ''
    ];
    const verbose = [
      '    rate limit  '.grey + `${headers['x-ratelimit-remaining']}/${headers['x-ratelimit-limit']}`,
      '         reset  '.grey + `${headers['x-ratelimit-reset']}s`,
      '    google map  '.grey + `https://www.google.com/maps/search/?api=1&query=${body.latitude},${body.longitude}`,
      ''
    ];
    if (cli.flags.verbose) {
      output = output.concat(verbose);
    }
    log(output.join(EOL));
  })
  .catch(err => {
    spinner.fail(err.response.body);
  });

