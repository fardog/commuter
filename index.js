var url = require('url')

var Routes = require('routes')
var extend = require('deep-extend')

module.exports = createRouter

function createRouter (defaultRoute, _root, _verbs) {
  var routers = {}
  var root = _root || ''
  var verbs = _verbs || ['get', 'post', 'put', 'patch', 'delete']
  var routeFn

  verbs.push('any')

  routeFn = function () {
    var args = [].slice.call(arguments)
    var req = args[0]
    var route = req.splats && req.splats.length ?
      req.splats[req.splats.length - 1] :
      url.parse(req.url).pathname
    var method = req.method ? req.method.toLowerCase() : 'any'
    var result

    if (root.length && route.indexOf(root) === 0) {
      route = route.slice(root.length, route.length)
    }

    if (routers[method]) {
      result = routers[method].match(route)
    }

    if (!result) {
      result = routers.any.match(route)
    }

    if (result) {
      args[0] = extend(req, result)
      result.fn.apply(null, args)
    } else {
      if (typeof defaultRoute === 'function') {
        defaultRoute.apply(null, args)

        return
      }

      throw new Error('No match for route: ' + route)
    }
  }

  verbs.forEach(function (verb) {
    routers[verb] = Routes()
    routeFn[verb] = function (pattern, handler) {
      routers[verb].addRoute(pattern, handler)
    }
  })

  return routeFn
}
