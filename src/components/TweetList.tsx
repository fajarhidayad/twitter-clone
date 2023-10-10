import { AppRouter } from '@/server/routers/_app';
import { inferRouterOutputs } from '@trpc/server';
import Loading from './Loading';
import TweetBox from './TweetBox';

type Tweet = inferRouterOutputs<AppRouter>['tweet']['getAll'][0];

const TweetList = ({ tweets }: { tweets: Tweet[] | undefined }) => {
  if (!tweets) return <Loading />;

  return (
    <div className="py-3">
      <ul>
        {tweets.map((tweet) => {
          if (tweet.retweetFromId) {
            return (
              <TweetBox
                key={tweet.id}
                tweet={tweet.retweetFrom}
                retweetUser={{
                  name: tweet.author.name,
                  username: tweet.author.username,
                  tweetId: tweet.id,
                }}
                retweetUserId={tweet.retweetFrom?.retweets[0]?.authorId}
              />
            );
          } else {
            return <TweetBox key={tweet.id} tweet={tweet} />;
          }
        })}
      </ul>
    </div>
  );
};

export default TweetList;
