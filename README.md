# Making concurrent API calls in Node

### Concept:

This is an example demonstrating how to make concurrent API calls in Node. It uses Express with async library, fetching a list of photos from the NASA public API(https://api.nasa.gov/planetary/apod).

### Query Params:

A query param is used for querying how many photos the backend is supposed to return. For instance, if the given days is equal to 6, the backend will make 6 concurrent calls to the NASA public API, with the dates range from the current Date, dating back to the number of days specified. Suppose the current date is 2020-12-23, the querrying array will be:

```
[
  '2020-12-18',
  '2020-12-19',
  '2020-12-20',
  '2020-12-21',
  '2020-12-22',
  '2020-12-23'
]
```

NASA API will return photo of each date in the list to the backend, and the backend will merge them into an array of object then return to the frontend.

### Endpoint

```
/api/photos
```

example:

```
/api/photos?days=6
```

result:

```
{
    "items": 6,
    "photos": [...]
}

```

### Making concurrent API calls with async.parallel

```
server.get("/api/photos", (req, res) => {
  const days = req.query.days
  const dates = generateCurrentWeek(days)

  const functionArray = dates.map((date) => {
    return async function () {
      const data = await axios.get(`${URL}?api_key=${api_key}&date=${date}`)
      return data.data
    }
  })

  async.parallel(functionArray, (err, result) => {
    res.status(200).json({ items: result.length, photos: result })
  })
})
```
