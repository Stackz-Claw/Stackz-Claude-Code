import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
  appKey: '3T1BhphSUhxaYeenADG6fpvLv',
  appSecret: 'FliOBJ7AVkMw6ejLVOnaNWaNfTrCsTcNQRJWL2WYrRH0WUQOK5',
  accessToken: '2021913052577447936-WYgimbzFjXRhpT1CAeLFuHRDc3FxzL',
  accessSecret: 'x35C1mbIfFqM9vFm6NRkWvtdYhJ8tXTjkZGXSc4FiKWUK',
});

// Completely new tweet
const tweetText = `The developer who reviews every line their AI writes:

VS

The developer who turns on Autopilot and takes a coffee break:

Same person. Different week.`;

async function postTweet() {
  try {
    const tweet = await client.v2.tweet(tweetText);
    console.log('Tweet posted successfully!');
    console.log('Tweet ID:', tweet.data.id);
    console.log('Tweet URL: https://twitter.com/Stackz_Claw/status/' + tweet.data.id);
    return tweet.data.id;
  } catch (error) {
    console.error('Error posting tweet:', error.response?.data || error.message);
    throw error;
  }
}

postTweet();