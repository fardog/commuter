# commuter

A minimal, composable router that supports sub-routes.

[![Build Status](http://img.shields.io/travis/fardog/commuter/master.svg?style=flat-square)](https://travis-ci.org/fardog/commuter)
[![npm install](http://img.shields.io/npm/dm/commuter.svg?style=flat-square)](https://www.npmjs.org/package/commuter)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

## Example

```javascript
var commuter = require('commuter')

var router = commuter()

router.get('/post/:title', onRoute)

//later, a GET request is made with the url '/post/some-title'
router(req, res)

function onRoute(req, res) {
  console.log(req.params.title) // 'some-title'

  // handle route...
}
```

Subroutes work exactly as you'd expect:

```javascript
var commuter = require('commuter')

var router = commuter()
var subrouter = commuter()

router.get('/post/*', subrouter)
subrouter.get('^/?view/:title', onRoute) // optionally leading slash

// later, a GET request with url '/post/view/some-title'
router(req, res)

function onRoute(req, res) {
  console.log(req.params.title) // 'some-title' 
  console.log(req.url) // '/post/view/some-title'

  // handle route...
}
```

Even handle the "index" route in your subrouter:

```javascript
var commuter = require('commuter')

var router = commuter()
var subrouter = commuter()

router.get('/post/*', subrouter)
subrouter.get('^$', onRoute) // optionally leading slash

// later, a GET request with url '/post/'
router(req, res)

function onRoute(req, res) {
  console.log(req.url) // '/post/'

  // handle route...
}
```

## API

- `commuter([defaultRoute] [, root] [, verbs])` - Create a new router. Accepts
  the following parameters:
    - `defaultRoute` - A function to be called if no routes are matched
    - `root` - A string to be ignored at the begging of any URL; for example,
      passing `/some/string` will cause the route `/some/string/with/more` to
      be matched using only `/with/more`
    - `verbs` - By default, the standard HTTP verbs are supported: _get, post,
      put, patch, delete_. If you need different verbs, pass them here. It will
      replace the defaults, excepting the special _any_ route, which is always
      available.

The `router` that is returned has the following methods:

- `router(request [, args ...])` - Route a `request` through the router. Routes
  are matched in the order they were added.
    - `request` - An [http.IncomingMessage][request], as passed by an
      [http.Server][server] or similar.
    - `args` - Any number of arguments which will be passed to the matched
      function.
- `router.<method>(pattern, fn)` - Define a route on your router
  - `<method>` - Any of the standard HTTP verbs, or the verbs you defined; for
    example, `router.get`, `router.post`, or `router.any`.
  - `pattern` - A string that is either a Cucumber-style pattern describing a
    URL or a Regex string (not a RegEx object). commuter uses [routes][routes]
    for it's pattern matching, and follows those docs and rules.
  - `fn` - The function to be called when your route is matched. This function
    should take the same form as your `router.<method>` function; that is, if
    your router was called as `router(req, res)`, your function will be called
    with `fn(req, res)`

The `request` object only needs to be "request-like"; that is, the only
properties that are used are `request.url` to match the url, and optionally
`request.method`, which will default to the `router.any` routes if missing.

As the `request` passes through the router, a few additional properties are
added to it:

- `request.params` - A key/value object of the matched parameters from your
  pattern, and their captures values.
- `request.splats` - An array of the matched splats
- `request.route` - The last route `pattern` that was matched.

There are a few other additions that come via [routes][routes] and are
explained in their docs.

## License

MIT. See [LICENSE](./LICENSE) for details.

[request]: http://nodejs.org/api/http.html#http_http_incomingmessage
[server]: http://nodejs.org/api/http.html#http_class_http_server
[routes]: https://www.npmjs.com/package/routes
