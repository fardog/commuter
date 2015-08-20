var test = require('tape')
var commuter = require('./index')

test('routes on a request-like object', function (t) {
  t.plan(1)

  var router = commuter()
  var req = {url: '/path', method: 'GET'}

  router.get(req.url, onRoute)

  router(req)

  function onRoute () {
    t.ok(true)

    t.end()
  }
})

test('routes on a querystring path', function (t) {
  t.plan(1)

  var router = commuter()
  var req = {url: '/path?something=true', method: 'GET'}

  router.get('/path', onRoute)

  router(req)

  function onRoute () {
    t.ok(true)

    t.end()
  }
})

test('passes through any additional parameters provided', function (t) {
  t.plan(2)

  var router = commuter()
  var req = {url: '/path', method: 'GET'}
  var res = {ok: function () {}}
  var superflous = {}

  router.get(req.url, onRoute)

  router(req, res, superflous)

  function onRoute (request, response, unnecessary) {
    t.strictEqual(res, response)
    t.strictEqual(superflous, unnecessary)

    t.end()
  }
})

test('calls error function on no match', function (t) {
  t.plan(1)

  var router = commuter(onError)
  var url = '/path'
  var req = {url: '/boop', method: 'GET'}

  router.get(url, noop)

  router(req)

  function onError (r) {
    t.strictEqual(r, req)
  }
})

test('throws error if no error function provided', function (t) {
  t.plan(1)

  var router = commuter()
  var url = '/path'
  var req = {url: '/boop', method: 'GET'}

  router.get(url, noop)

  try {
    router(req)
  } catch(e) {
    t.ok(e)

    t.end()
  }
})

test('places parameters on the request object', function (t) {
  t.plan(1)

  var router = commuter()
  var url = '/admin/:panel'
  var req = {url: '/admin/home', method: 'GET'}

  router.get(url, onRoute)

  router(req)

  function onRoute (r) {
    t.equal('home', r.params.panel)

    t.end()
  }
})

test('routes on expected sub-routes', function (t) {
  t.plan(2)

  var router = commuter()
  var subRouter = commuter()
  var req = {url: '/admin/section/home', method: 'GET'}
  var res = {ok: function () {}}

  router.get('/admin*', subRouter)
  subRouter.get('/section/:panel', onRoute)

  router(req, res)

  function onRoute (request, response) {
    t.equal(request.params.panel, 'home')
    t.strictEqual(response, res)

    t.end()
  }
})

test('routes on expected sub-routes with query params', function (t) {
  t.plan(2)

  var router = commuter()
  var subRouter = commuter()
  var req = {url: '/admin/section/home?something=true', method: 'GET'}
  var res = {ok: function () {}}

  router.get('/admin*', subRouter)
  subRouter.get('/section/:panel', onRoute)

  router(req, res)

  function onRoute (request, response) {
    t.equal(request.params.panel, 'home')
    t.strictEqual(response, res)

    t.end()
  }
})

test('strips root from url when provided', function (t) {
  t.plan(1)

  var router = commuter(null, '/strip')
  var req = {url: '/strip/admin/section/home', method: 'GET'}

  router.get('/admin*', onRoute)

  router(req)

  function onRoute (request) {
    t.ok(request)

    t.end()
  }
})

test('root url does not affect sub-routes', function (t) {
  t.plan(2)

  var router = commuter(null, '/strip')
  var subRouter = commuter()
  var req = {url: '/strip/admin/section/home', method: 'GET'}
  var res = {ok: function () {}}

  router.get('/admin*', subRouter)
  subRouter.get('/section/:panel', onRoute)

  router(req, res)

  function onRoute (request, response) {
    t.equal(request.params.panel, 'home')
    t.strictEqual(response, res)

    t.end()
  }
})

test('arbitrary verbs can be defined', function (t) {
  t.plan(1)

  var router = commuter(null, null, ['leap'])
  var req = {url: '/path', method: 'leap'}

  router.leap(req.url, onRoute)

  router(req)

  function onRoute () {
    t.ok(true)

    t.end()
  }
})

test('"any" route is always present', function (t) {
  t.plan(1)

  var router = commuter(null, null, ['leap'])
  var req = {url: '/path', method: 'wut'}

  router.any(req.url, onRoute)

  router(req)

  function onRoute () {
    t.ok(true)

    t.end()
  }
})

test('latest defined parameter takes precedence', function (t) {
  t.plan(2)

  var router = commuter()
  var subRouter = commuter()
  var req = {url: '/admin/item/go/section/home', method: 'GET'}
  var res = {ok: function () {}}

  router.get('/admin/:panel/:section/*', subRouter)
  subRouter.get('section/:section', onRoute)

  router(req, res)

  function onRoute (request, response) {
    t.equal(request.params.panel, 'item')
    t.equal(request.params.section, 'home')

    t.end()
  }
})

function noop () {
  //
}
