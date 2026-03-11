import { TwitterApi } from 'twitter-api-v2';

async function verify() {
  try {
    const twitter = new TwitterApi({
      appKey: 'Yz4LzEmkC9GH2Q4X5bliryc6R',
      appSecret: '3cHmLHmZoxm3ESXIemtpNqKbqlMCNU8xmqq5sv1a1yy3Qa9xbf',
      accessToken: '2021913052577447936-kWWpf5JFNm5O6cChpHs7KvW2qgtbyd',
      accessSecret: 'mDRv2DvbjEMdcPKCsBXbsamMnXmC1RZ4mZ6zICRG0iv8A',
    });

    const me = await twitter.v2.me();
    const tweets = await twitter.v2.userTimeline(me.data.id, { max_results: 5 });
    console.log('Remaining tweets:', tweets.data?.length || 0);
    if (tweets.data) {
      console.log('Tweet:', tweets.data[0].text);
    }
  } catch (error) {
    console.error('Error:', error.data || error.message);
  }
}

verify();