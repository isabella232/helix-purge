/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
const { equal } = require('assert');
const { fetch } = require('@adobe/helix-fetch').context({
  maxCacheSize: 0,
  httpsProtocols:
  /* istanbul ignore next */
    process.env.HELIX_FETCH_FORCE_HTTP1 ? ['http1'] : ['http2', 'http1'],
});

async function commence(log) {
  try {
    const [mdres, htmlres] = await Promise.all([
      fetch('https://main--helix-purge--adobe.hlx.page/OK.html'),
      fetch('https://main--helix-purge--adobe.hlx.page/ok.html'),
    ]);

    const mdtext = (await mdres.text()).replace(/<meta.*/, '');
    const htmltext = (await htmlres.text()).replace(/<meta.*/, '');

    equal(
      mdtext,
      htmltext,
      'Pipeline and static are in sync',
    );
    equal(mdres.status, 200, 'Pipeline works');
    equal(htmlres.status, 200, 'Static works');

    return true;
  } catch (err) {
    log.error('unable to verify pre-flight response, helix-pages may be down', err);
    return false;
  }
}

module.exports = commence;
