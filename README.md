# commuter

A router that does the right thing.

**Note:** Nothing is solid here; this is a work in progress.

## API

```javascript

// with a URL string
var router = commuter()
  , url = '/path/:title'

router.add(url, onRoute)

router('/path/some-title')

function onRoute(u) {
  console.log(this.params.title) // 'some-title'
}

// with a request object
var router = commuter()
  , url = '/path/:title'

router.add(url, onRoute)

// ... assuming req.url is '/path/some-title'
router(req, res)

function onRoute(req, res) {
  console.log(this.params.title) // 'some-title'
}
```

## License

MIT. See [LICENSE](./LICENSE) for details.
