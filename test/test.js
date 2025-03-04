"use strict";

const test = require('node:test');
const assert = require('node:assert').strict;

const S3 = require('../s3.js');

const s3 = new S3();

test.describe("s3 test", () =>
{
  test.it('list add get delete test', async () =>
  {
    const reslist = await s3.list();
    assert.ok(reslist.content === undefined);
    const resadd = await s3.add('test','content test');
    assert.equal(resadd.$metadata.httpStatusCode, 200);
    const resget = await s3.get('test');
    assert.equal(resget, 'content test');
    const resdelete = await s3.remove('test');
    assert.equal(resdelete.$metadata.httpStatusCode, 204);
  });
});
