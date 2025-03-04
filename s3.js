"use strict";

class S3
{
  constructor(endpoint = process.env.S3_URL, region = process.env.S3_REGION, key = process.env.S3_KEY, secret = process.env.S3_SECRET, proxy = process.env.PROXY)
  {
    this.aws = require('@aws-sdk/client-s3');
    const { addProxyToClient } = require('aws-sdk-v3-proxy');
    const s3base = new this.aws.S3
    ({
      endpoint: endpoint,
      region: region,
      credentials:
      {
       accessKeyId: key,
       secretAccessKey: secret
      }
    });
    if (proxy)
      this.s3 = addProxyToClient(s3base, { httpProxy: proxy });
  }

  async list(bucket = process.env.S3_BUCKET)
  {
    return await this.s3.send(new this.aws.ListObjectsV2Command({Bucket:bucket}));
  };

  async add(key, body, bucket = process.env.S3_BUCKET)
  {
    return await this.s3.send(new this.aws.PutObjectCommand({Bucket:bucket, Key:key, Body:body}));
  };

  async remove(key, bucket = process.env.S3_BUCKET)
  {
    return await this.s3.send(new this.aws.DeleteObjectCommand({Bucket:bucket, Key:key}));
  };

  async get(key, bucket = process.env.S3_BUCKET)
  {
    const response = await this.s3.send(new this.aws.GetObjectCommand({Bucket:bucket, Key:key}));
    return new Promise((resolve, reject) =>
    {
      let data = [];
      response.Body.once('error', err => reject(err));
      response.Body.on('data', chunk => data.push(chunk));
      response.Body.once('end', () => resolve(data.join('')));
    });
  };
}

module.exports = S3;