# URL Shortener Microservice


### POST API

1. I can POST a URL to `[url]/api/shorturl/new` and I will receive a shortened URL in the JSON response. Example : `{"original_url":"https://www.google.com","short_url":2}`
2. If I pass an invalid URL that doesn't follow the valid `http(s)://www.example.com(/more/routes)` format, the JSON response will contain an error like `{"error":"invalid URL"}`. 
3. When I visit the shortened URL, it will redirect me to my original link.


#### Creation Example:

POST [url]/api/shorturl/new - body (urlencoded) :  url=https://www.google.com

#### Usage:

[url]/api/shorturl/2

#### Will redirect to:

https://www.google.com
