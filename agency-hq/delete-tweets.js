import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
  appKey: '3T1BhphSUhxaYeenADG6fpvLv',
  appSecret: 'FliOBJ7AVkMw6ejLVOnaNWaNfTrCsTcNQRJWL2WYrRH0WUQOK5',
  accessToken: '2021913052577447936-WYgimbzFjXRhpT1CAeLFuHRDc3FxzL',
  accessSecret: 'x35C1mbIfFqM9vFm6NRkWvtdYhJ8tXTjkZGXSc4FiKWUK',
});

const tweetIds = [
  '2031914464015237384', // Random test tweet
  '2031914521863078242', // Main post with hashtag (to redo cleanly)
  // Add any other IDs you want to delete
];

async function deleteTweets() {
  for (const id of tweetIds) {
    try {
      await client.v2.deleteTweet(id);
      console.log('Deleted:', id);
    } catch (error) {
      console.error('Error deleting', id, ':', error.response?.data || error.message);
    }
  }
}

deleteTweets();