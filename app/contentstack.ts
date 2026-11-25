import Contentstack, { Region } from 'contentstack'
import { Entry } from "./interface";

// contentstack >= 3.27 calls Node's built-in fetch, which ignores the SDK's
// `timeout: 30000` option (node-fetch v2 honoured it). Give every request its
// own 30 s abort signal so a stalled call still fails at 30 s.
// Set it on each request's option object (fresh per call) rather than via
// .fetch({ signal }), which the SDK deep-merges into the shared Stack options.
const REQUEST_TIMEOUT_MS = 30000;

const Stack = Contentstack.Stack({
  api_key: process.env.CONTENTSTACK_API_KEY as string,
  delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN as string,
  environment: process.env.CONTENTSTACK_ENVIRONMENT as string,
  region: 'eu' as Region,
  plugins: [
    {
      onRequest(_stack, request) {
        return {
          ...request,
          option: { ...request.option, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) },
        };
      },
    },
  ],
});
export async function fetchEntries(): Promise<Entry> {
  const result: Entry = await Stack
    .ContentType(process.env.CONTENTSTACK_CONTENT_TYPE as string)
    .Entry(process.env.CONTENTSTACK_ENTRY_UID as string)
    .toJSON().fetch();
  return result;
}

export async function fetchAsset(): Promise<any> {
  try{
    const result = await Stack.Assets(process.env.CONTENTSTACK_ASSET_UID as string).toJSON().fetch();
    return result;
  }catch(e){
    return {}
  }
}
