const fs = require('fs');
const path = require('path');
const assert = require('assert');
const FormData = require('form-data');
const axios = require('axios');

module.exports = (call) => ({
  upload: async (filepath, title_ = null, filename_ = null) => {
    // prepare
    const basename = path.basename(filepath);
    const title = title_ === null ? basename : title_;
    const filename = filename_ === null ? basename : filename_;
    const stat = fs.statSync(filepath);

    // get upload information
    const getUploadUrlResponse = await call('files.getUploadURL', { filename, length: stat.size });
    assert(getUploadUrlResponse.ok === true, getUploadUrlResponse);

    // upload
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filepath));
    const requestParams = {
      method: 'post',
      url: getUploadUrlResponse.upload_url,
      data: formData,
      headers: {
        // eslint-disable-next-line no-underscore-dangle
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        ...formData.getHeaders()
      }
    };
    const { data } = await axios(requestParams);
    assert(data === `OK - ${stat.size}`);

    // complete upload
    const completeUploadResponse = await call('files.completeUpload', {
      files: JSON.stringify([{ id: getUploadUrlResponse.file, title }])
    });
    assert(completeUploadResponse.ok === true, completeUploadResponse);
    assert(completeUploadResponse.files.length === 1, completeUploadResponse);
    return completeUploadResponse.files[0].id;
  }
  // share: async (name, id) => {
  //   const channel = await channelMeta(name);
  //   return call('files.share', {
  //     files: id,
  //     broadcast: false,
  //     blocks: JSON.stringify([{
  //       type: 'rich_text',
  //       elements: [
  //         {
  //           type: 'rich_text_section',
  //           elements: [
  //             {
  //               type: 'text',
  //               text: 'test'
  //             }]
  //         }
  //       ]
  //     }]),
  //     resharing_aware: true,
  //     channel: channel.id
  //   });
  // }
});
