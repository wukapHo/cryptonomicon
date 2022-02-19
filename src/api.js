const API_KEY = '01cc57dbd6f92665196c81d27c44abbf0ba27846387d09ad352a8242a91c7ea2';

const tickersHandlers = new Map();
const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`,
);

const AGGREGATE_INDEX = '5';

socket.addEventListener('message', (e) => {
  const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice } = JSON.parse(e.data);
  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return;
  }

  const handlers = tickersHandlers.get(currency) ?? [];
  handlers.forEach((fn) => fn(newPrice));
});

function sendToWebSocket(message) {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }

  socket.addEventListener('open', () => {
    socket.send(stringifiedMessage);
  }, { once: true });
}

function subscribeToTickerOnWs(ticker) {
  sendToWebSocket({
    action: 'SubAdd',
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}

function unsubscribeFromTickerOnWs(ticker) {
  sendToWebSocket({
    action: 'SubRemove',
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  subscribeToTickerOnWs(ticker);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
  unsubscribeFromTickerOnWs(ticker);
};

// export async function getCoinList() {
//   return fetch('https://min-api.cryptocompare.com/data/all/coinlist?summary=true')
//     .then((res) => res.json());
// }
