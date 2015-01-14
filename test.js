var test = require('tape')
  , commuter = require('./index')

test('routes on strings', function(t) {
  t.plan(1)

  var router = commuter()
    , url = '/path'

  router.add(url, onRoute)

  router(url)

  function onRoute(u) {
    t.equal(u, url)

    t.end()
  }
})

test('routes on a request-like object', function(t) {
  t.plan(2)

  var router = commuter()
    , req = {url: '/path'}
    , res = {ok: function() {}}

  router.add(req.url, onRoute)

  router(req, res)

  function onRoute(request, response) {
    t.strictEqual(req, request)
    t.strictEqual(res, response)

    t.end()
  }
})

test('result object should be on `this`', function(t) {
  t.plan(2)

  var router = commuter()
    , url = '/path'

  router.add(url, onRoute)

  router(url)

  function onRoute(u) {
    t.equal(u, url)
    t.equal(this.route, url)

    t.end()
  }
})

test('calls error function on no match', function(t) {
  t.plan(1)

  var router = commuter(onError)
    , url = '/path'
    , badUrl = '/boop'

  router.add(url, noop)

  router(badUrl)

  function onError(u) {
    t.equal(u, badUrl)
  }
})

test('throws error if no error function provided', function(t) {
  t.plan(1)

  var router = commuter()
    , url = '/path'
    , badUrl = '/boop'

  router.add(url, noop)

  try {
    router(badUrl)
  } catch(e) {
    t.ok(e)

    t.end()
  }

})

function noop() {
  //
}
