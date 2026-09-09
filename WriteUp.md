# Write-up

> This is the skeleton - replace everything in blockquotes with your own words
> and delete the prompts as you go. Aim for **~300 words** across the four
> questions; the route reference below can be as long as it needs to be.
>
> Write it like you're handing the work to a teammate. We'd rather read an
> honest "I ran out of time on X and here's what I'd do" than a polished list of
> accomplishments. **Submit this even if you didn't finish** - see CHALLENGE.md.

## 1. What did you build for Part B, and why that?

> I built a write UI for restaurants and visits, a visits API, and a restaurant detail page showing visit and spending history. My goal was to turn the project into something the user could actually interact with and would want to interact with.

> POST, PUT, and DELETE all worked, but the app itself could only read, which isn't useful. So I started with a form that creates restaurants and shows the API's validation errors in the UI. From there I tackled visits, since tracking Brennen's spending is the point of the app. I built the visits API, then a page listing a restaurant's visits alongside its total and average spend, plus a form to log one. The home page got the same treatment, with average per visit, spending over the last seven days, and lifetime total. Restaurant cards link to the detail page, and there's a back button.


## 2. What did you decide, and what did you rule out?

> For fetching one restaurant's visits I added a nested route, GET /api/restaurants/:id/visits, over a query parameter on /api/visits or fetching everything and filtering in JavaScript. 

> I compute the aggregates in JavaScript rather than in SQL. I already had the visits array on the page, the math is a few lines of reduce, and it avoided a stats endpoint with its own row mappers. The home page pulls every visit to calculate three numbers, which isn’t great, but at this size the simpler version seemed like the better option.

> When a visit references a restaurant that doesn't exist, I let the foreign key constraint reject it and map that to a 409, rather than checking first. It's one query instead of two, but the cost is a vaguer message, since the handler only sees an error code. I didn’t use 404 because the URL is /api/visits, and that resource exists fine, and I didn’t use 400 because even something like restaurantId: 99999 is a valid positive integer.

> I kept ON DELETE CASCADE. Changing it meant a second migration, but I also think it's right: I don’t know why someone would delete a restaurant, but keeping its spending data seems weirder than losing it


## 3. Where did you cut corners?

> Something like /restaurants/99999 returns a 404 from the API, but getRestaurant doesn't check res.ok, so the error object renders as a card with every field blank

> I wasn’t able to make it possible to edit and delete entries from the UI because of time. The endpoints exist and work by curl but nothing in the app calls them.

> Error messages are pretty brief. "Invalid Name" doesn't tell the caller whether the problem was the type or the length.

> Four near-identical "optional string" checks in the validators that a small helper would be better.


---

## Part B: routes

> Every endpoint you added, with its request and response shapes, so we can
> exercise it without reverse-engineering your code. Add or remove rows as
> needed; delete this section if your Part B added no routes.

| Method and path | What it does | Success | Errors |
| --------------- | ------------ | ------- | ------ |
| `GET /api/visits` | All visits, newest first by date | `200` + array of visits | — |
| `POST /api/visits` | Create a visit | `201` + the created visit | `400` on invalid body, `409` if `restaurantId` doesn't exist |
| `GET /api/visits/:id` | One visit | `200` + the visit | `404` if no such visit or the id isn't a positive integer |
| `PUT /api/visits/:id` | Replace a visit | `200` + the updated visit | `400` on invalid body, `404` if no such visit, `409` if `restaurantId` doesn't exist |
| `DELETE /api/visits/:id` | Delete a visit | `204`, no body | `404` if no such visit |
| `GET /api/restaurants/:id/visits` | That restaurant's visits, newest first | `200` + array (empty if none) | `404` if the id isn't a positive integer |


**`POST /api/visits`**

```jsonc
// request
{
    "restaurantId":3,
    "date":"2026-01-15",
    "amountSpent":23.50,
    "notes":"great pad thai"
}

// 201 response
{
    "id": 4,
    "restaurantId": 3,
    "date": "2026-01-15",
    "amountSpent": 23.5,
    "notes": "great pad thai",
    "createdAt": "2026-09-09T09:25:43.122Z"
}

```

## Schema changes

> none

## How I verified this

> I verified every endpoint by curl against a running database, plus clicking through the UI by hand: adding a restaurant and a visit through the forms, confirming the stats recalculate, triggering validation errors to check they render, and navigating into a restaurant and back.
> For the UI, I checked the result when entering a restaurant with no name, only name, non numerical rating, and rating out of range. I also checked the result when entering a visit with no date, only date, non numerical amount spent, and negative amount spent.

**Part A** - the contract table in CHALLENGE.md, every row including the error
cases:

```bash
# e.g.
curl -i http://localhost:3000/api/restaurants          # 200 + array
curl -i http://localhost:3000/api/restaurants/99999    # 404
curl -i http://localhost:3000/api/restaurants/abc      # 404
curl -i -X POST http://localhost:3000/api/restaurants \
  -H 'Content-Type: application/json' \
  -d '{"name":"Out Of Range","rating":6}'              # 400

curl -i -X POST http://localhost:3000/api/restaurants \
  -H 'Content-Type: application/json' -d '{}'                  # 400 missing name
curl -i -X POST http://localhost:3000/api/restaurants \
  -H 'Content-Type: application/json' -d 'not json'            # 400 malformed body
curl -i -X PUT http://localhost:3000/api/restaurants/99999 \
  -H 'Content-Type: application/json' -d '{"name":"Ghost"}'    # 404
curl -i -X DELETE http://localhost:3000/api/restaurants/3      # 204, empty body
curl -i -X DELETE http://localhost:3000/api/restaurants/3      # 404, already gone

```

**Part B** - the equivalent cases for what you built:

```bash
curl -i http://localhost:3000/api/visits                       # 200 + array
curl -i -X POST http://localhost:3000/api/visits \
  -H 'Content-Type: application/json' \
  -d '{"restaurantId":3,"date":"2026-01-15","amountSpent":23.50,"notes":"good"}'
                                                               # 201 + created visit
curl -i -X POST http://localhost:3000/api/visits \
  -H 'Content-Type: application/json' -d '{"date":"2026-01-15"}'
                                                               # 400 missing restaurantId
curl -i -X POST http://localhost:3000/api/visits \
  -H 'Content-Type: application/json' -d '{"restaurantId":3,"date":"hello"}'
                                                               # 400 bad date format
curl -i -X POST http://localhost:3000/api/visits \
  -H 'Content-Type: application/json' -d '{"restaurantId":99999,"date":"2026-01-15"}'
                                                               # 409 no such restaurant
curl -i -X PUT http://localhost:3000/api/visits/1 \
  -H 'Content-Type: application/json' \
  -d '{"restaurantId":3,"date":"2026-02-01","amountSpent":31.00}'
                                                               # 200 + updated visit
curl -i -X PUT http://localhost:3000/api/visits/99999 \
  -H 'Content-Type: application/json' -d '{"restaurantId":3,"date":"2026-02-01"}'
                                                               # 404
curl -i -X DELETE http://localhost:3000/api/visits/1           # 204, empty body
curl -i -X DELETE http://localhost:3000/api/visits/1           # 404, already gone
curl -i http://localhost:3000/api/restaurants/3/visits         # 200 + array
curl -i http://localhost:3000/api/restaurants/abc/visits       # 404
curl -i http://localhost:3000/api/restaurants/99999/visits     # 200 + empty array
```

## Known issues / what I'd do next

> See "Where did you cut corners?" above. In short: the read helpers in apiClient.ts don't check res.ok, so an API error renders as a blank page rather than a failure. That's the first thing I'd fix.
> The seven-day filter’s cutoff is built with toISOString(), so it's off in certain time zones. It's a very minor problem, but I'd try and find a solution.
> I'd want to implement a way to delete and edit restaurant and visit entries. I'd also want to make the app prettier because it's kind of ugly right now, and the actual format and structure of the app could be a lot better. 
> Some other things that I thought would've been cool to implement were a search bar to find restaurants, a separate page with all visits (newest at the top), and adding a rating field to visits, so either the rating of the restaurant is changed by avg of all the visits there, or there's a separate field for restaurants called visit_rating or something.
