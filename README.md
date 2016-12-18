# avanza-exporter

Exports your current holdings with Avanza as Prometheus metrics.

Uses [fhqvst/avanza](https://github.com/fhqvst/avanza) for interacting with Avanza

Run:
```
npm install
EXCH_AZ_USERNAME=your_username EXCH_AZ_PASSWORD=your_password node index.js
```

With docker:
```
docker run -d \
  --env EXCH_AZ_USERNAME=your_username \
  --env EXCH_AZ_PASSWORD=your_password \
  -p 8582:8582 \
  bonan/avanza-exporter
```


Four different metrics are exported:

```
# Last price per stock/fund (in SEK)
stock_rate{code="GOOG",exchange="avanza",name="Alphabet Inc Class C",type="stock"}
# Amount of stocks you have
stock_amount{code="GOOG",exchange="avanza",name="Alphabet Inc Class C",type="stock"}
# Value of your investment (in SEK)
stock_value{code="GOOG",exchange="avanza",name="Alphabet Inc Class C",type="stock"}
# Amount of money deposited
stock_cash{code="CASH",exchange="avanza",name="Cash deposit"}
```
