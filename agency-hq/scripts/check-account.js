import { TwitterApi } from 'twitter-api-v2';

const twitter = new TwitterApi({
  appKey: 'Yz4LzEmkC9GH2Q4X5bliryc6R',
  appSecret: '3cHmLHmZoxm3ESXIemtpNqKbqlMCNU8xmqq5sv1a1yy3Qa9xbf',
  accessToken: '2021913052577447936-kWWpf5JFNm5O6cChpHs7KvW2qgtbyd',
  accessSecret: 'mDRv2DvbjEMdcPKCsBXbsamMnXmC1RZ4mZ6zICRG0iv8A',
});

async function checkAccount() {
  try {
    const me = await twitter.v2.me();
    console.log('Account:', me.data);
  } catch (error) {
    console.error('Error:', error.data || error.message);
  }
}

checkAccount();