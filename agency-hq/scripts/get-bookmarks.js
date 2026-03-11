import { TwitterApi } from 'twitter-api-v2';

const twitter = new TwitterApi({
  clientId: 'Yz4LzEmkC9GH2Q4X5bliryc6R',
  clientSecret: '3cHmLHmZoxm3ESXIemtpNqKbqlMCNU8xmqq5sv1a1yy3Qa9xbf',
});

// OAuth 2.0 user context with refresh
const oauth2User = twitter.oauth2;

async function getBookmarks() {
  try {
    // Use refresh token to get access token with user context
    const { client: refreshedClient, accessToken, refreshToken: newRefreshToken } =
      await oauth2User.refreshOAuth2TokenWithRefreshToken('h4dCOnACYPc_g72gNZdKo8DV9AsbRRDSp5McTh4J2vOEINYtZS');

    console.log('Token refreshed successfully!\n');

    // Get bookmarks with the refreshed client
    const bookmarks = await refreshedClient.v2.bookmarks({
      max_results: 25,
      'tweet.fields': ['created_at', 'public_metrics', 'text'],
    });

    console.log(`Found ${bookmarks.meta?.result_count || 0} bookmarks:\n`);

    if (bookmarks.data && bookmarks.data.length > 0) {
      bookmarks.data.forEach((tweet, i) => {
        const text = tweet.text || '';
        const metrics = tweet.public_metrics || {};
        console.log(`${i + 1}. ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
        console.log(`   ❤️ ${metrics.like_count || 0} | 🔁 ${metrics.retweet_count || 0} | 💬 ${metrics.reply_count || 0}\n`);
      });
    } else {
      console.log("No bookmarks found.");
    }

  } catch (error) {
    console.error('Error:', error.data || error.message || error);
  }
}

getBookmarks();