
import { PubSub } from 'graphql-subscriptions';
import * as MESSAGE_EVENTS from './message';
import * as MATCH_EVENTS from './match';
export const EVENTS = {
  MESSAGE: MESSAGE_EVENTS,
  MATCH: MATCH_EVENTS
};
export default new PubSub();