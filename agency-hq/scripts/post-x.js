import { TwitterApi } from 'twitter-api-v2';
import 'dotenv/config';

const twitter = new TwitterApi({
  appKey: 'b67kndrucchHzngbfr4X5xLta',
  appSecret: '4sWkw69ecfJysY2QycbphGthsTjKwmmVVFt5g7kUADjq2DqOrN',
  accessToken: '2725226953-1IwHSJnFLoTbbFenmFr8d8pBZTvSAYvAf4gTPPU',
  accessSecret: 'token',
});

const tweetText = `I gave our AI agent access to our Stripe account

My reasoning: Cashflow should handle money

The agent's first action: flagged THREE of our own subscriptions as "suspicious activity"

It's not wrong

I'm not sure how I feel about this`;

async function postTweet() {
  try {
    const tweet = await twitter.v2.tweet(tweetText);
    console.log('Tweet posted successfully!');
    console.log('Tweet ID:', tweet.data.id);
    console.log('Tweet URL: https://twitter.com/Stackz_Claw/status/' + tweet.data.id);
    return tweet.data.id;
  } catch (error) {
    console.error('Error posting tweet:', error);
    throw error;
  }
}

postTweet();