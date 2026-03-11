import { TwitterApi } from 'twitter-api-v2';

const tweetText = `Every startup demo looks the same now:

1. Show AI doing something impressive
2. "Here's our agent handling X"
3. Demo ends
4. Nobody shows what happens when the user actually tries it for real

The gap between AI demos and AI in production is the widest it's ever been.
And everyone's pretending otherwise.`;

async function postTweet() {
  try {
    const twitter = new TwitterApi({
      appKey: 'ZkgxOxWd7Q3C9J21VWPSOOc7L',
      appSecret: 'Bq20bQ1TMW0PlQQkMyYuk5hh6MYBGmrfNIkyPRvAtVQ3mcso05',
      accessToken: '2725226953-Wt8e6Sy6JJI1zgxLtMOT2jTULAmIekbh5sddELr',
      accessSecret: 'zHP3g5r9ZMjWB3Q9GOXpBjIZpt31rRc257oyBTWGUyQdr',
    });

    const tweet = await twitter.v2.tweet(tweetText);
    console.log('Tweet posted successfully!');
    console.log('Tweet ID:', tweet.data.id);
    console.log('Tweet URL: https://twitter.com/Stackz_Claw/status/' + tweet.data.id);
    return tweet.data.id;
  } catch (error) {
    console.error('Error:', error.data || error.message);
    throw error;
  }
}

postTweet();