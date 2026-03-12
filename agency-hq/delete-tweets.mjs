import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
  appKey: '3T1BhphSUhxaYeenADG6fpvLv',
  appSecret: 'FliOBJ7AVkMw6ejLVOnaNWaNfTrCsTcNQRJWL2WYrRH0WUQOK5',
  accessToken: '2021913052577447936-WYgimbzFjXRhpT1CAeLFuHRDc3FxzL',
  accessSecret: 'x35C1mbIfFqM9vFm6NRkWvtdYhJ8tXTjkZGXSc4FiKWUK',
});

const tweetsToDelete = [
  '2031914464015237384', // Random test tweet
  // The duplicate tweets - need to find their IDs
];

async function deleteTweets() {
  for (const id of tweetsToDelete) {
    try {
      await client.v2.deleteTweet(id);
      console.log('Deleted:', id);
    } catch (error) {
      console.error('Error deleting', id, ':', error.response?.data || error.message);
    }
  }
}

deleteTweets();