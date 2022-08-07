import axios from 'axios';
import { alphaAPIKey } from '../utils/env.dev.js';

// Price fetching for all assets
async function fetchPrice(assets) {
  let fetchSuccess = true;
  if (assets?.length > 0) {
    await Promise.all(
      assets.map(async (asset) => {
        // Convert Date object in date to String if date exists
        if (asset.date) {
          asset.date = asset.date.toISOString();
        }

        if (asset.type === 'stocks') {
          await axios
            .get(
              `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${asset.symbol}&apikey=${alphaAPIKey}`
            )
            .then((res) => {
              if (!res.data['Global Quote']) {
                asset.price = NaN;
              } else {
                asset.price = res.data['Global Quote']['05. price'];
              }
            })
            .catch((err) => {
              console.log(err);
              fetchSuccess = false;
            });
          // Possible use better error handling
        } else {
          await axios
            .get(
              `https://api.coingecko.com/api/v3/coins/${asset.api_id}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`
            )
            .then((res) => {
              asset.price = res.data.market_data.current_price.sgd;
            })
            .catch((err) => {
              console.log(err);
              fetchSuccess = false;
            });
        }
      })
    );
  }
  return { assetsWithPrice: assets, fetchSuccess };
}

export { fetchPrice };
