import { Client, defaultExchanges, subscriptionExchange } from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const endPoint = "react.eogresources.com/graphql"

const client = new Client({
  url: `https://${endPoint}`,
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription(operation) {
        return new SubscriptionClient(`wss://${endPoint}`, { reconnect: true }).request(operation);
      },
    }),
  ],
});

export default client;