# commuter

A minimal, composable router with sub-routes.

## Example

```javascript
var commuter = require('commuter')

var router = commuter()

router.get('/post/:slug', onRoute)

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
  , subrouter = commuter()

router.get('/post*', subrouter)
subrouter.get('/view/:title', onRoute)

// later, a GET request with url '/post/view/some-title'
router(req, res)

function onRoute(req, res) {
  console.log(req.params.title) // 'some-title' 
  console.log(req.url) // '/post/view/some-title'

  // handle route...
}
```

## License

MIT. See [LICENSE](./LICENSE) for details.
