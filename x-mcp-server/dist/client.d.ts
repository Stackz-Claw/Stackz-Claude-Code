/**
 * Twitter API Client - Multi-account management
 */
import TwitterApi, { v2 } from 'twitter-api-v2';
export declare class TwitterClient {
    private accounts;
    private defaultAccount;
    constructor();
    private initializeAccounts;
    private addAccount;
    getClient(accountId?: number): TwitterApi;
    getReadOnlyClient(): v2.TwitterApi | null;
    getMe(accountId?: number): Promise<any>;
    postTweet(text: string, accountId?: number, replyTo?: string): Promise<any>;
    searchTweets(query: string, maxResults?: number, accountId?: number): Promise<any>;
    getTimeline(accountId?: number, maxResults?: number): Promise<any>;
    getMentions(accountId?: number, maxResults?: number): Promise<any>;
    getProfile(accountId?: number): Promise<any>;
    followUser(targetUsername: string, accountId?: number): Promise<any>;
    likeTweet(tweetId: string, accountId?: number): Promise<any>;
    retweet(tweetId: string, accountId?: number): Promise<any>;
    getUserByUsername(username: string): Promise<any>;
    getBookmarks(accountId?: number, maxResults?: number): Promise<any>;
    getBookmarksWithMedia(accountId?: number, maxResults?: number): Promise<any>;
    getActiveAccounts(): number[];
}
export declare const twitterClient: TwitterClient;
//# sourceMappingURL=client.d.ts.map