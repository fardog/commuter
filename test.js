var test = require('tape')
  , commuter = require('./index')

test('routes on a request-like object', function(t) {
  t.plan(1)

  var router = commuter()
    , req = {url: '/path', method: 'GET'}

  router.get(req.url, onRoute)

  router(req)

  function onRoute() {
    t.ok(true)

    t.end()
  }
})

test('passes through any additional parameters provided', function(t) {
  t.plan(1)

  var router = commuter()
    , req = {url: '/path', method: 'GET'}
    , res = {ok: function() {}}

  router.get(req.url, onRoute)

  router(req, res)

  function onRoute(request, response) {
    t.strictEqual(res, response)

    t.end()
  }
})

test('calls error function on no match', function(t) {
  t.plan(1)

  var router = commuter(onError)
    , url = '/path'
    , req = {url: '/boop', method: 'GET'}

  router.get(url, noop)

  router(req)

  function onError(r) {
    t.strictEqual(r, req)
  }
})

test('throws error if no error function provided', function(t) {
  t.plan(1)

  var router = commuter()
    , url = '/path'
    , req = {url: '/boop', method: 'GET'}

  router.get(url, noop)

  try {
    router(req)
  } catch(e) {
    t.ok(e)

    t.end()
  }
})

test('places parameters on the request object', function(t) {
  t.plan(1)

  var router = commuter()
    , url = '/admin/:panel'
    , req = {url: '/admin/home', method: 'GET'}

  router.get(url, onRoute)

  router(req)

  function onRoute(r) {
    t.equal('home', r.params.panel)

    t.end()
  }
})

test('routes on expected sub-routes', function(t) {
  t.plan(2)

  var router = commuter()
    , subRouter = commuter()
    , req = {url:'/admin/section/home', method: 'GET'}
    , res = {ok: function() {}}

  router.get('/admin*', subRouter)
  subRouter.get('/section/:panel', onRoute)

  router(req, res)

  function onRoute(request, response) {
    t.equal(request.params.panel, 'home')
    t.strictEqual(response, res)

    t.end()
  }
})

function noop() {
  //
}
