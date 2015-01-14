var Routes = require('routes')
  , extend = require('xtend')

module.exports = createRouter

function createRouter(noMatch, _verbs) {
  var routers = {}
    , verbs = _verbs || ['get', 'post', 'put', 'patch', 'delete']
    , routeFn

  verbs.push('any')

  routeFn = function() {
    var args = [].slice.call(arguments)
      , req = args[0]
      , route = req.splats && req.splats.length ?
          req.splats[req.splats.length - 1] :
          req.url
      , method = req.method ? req.method.toLowerCase() : 'any'
      , result

    result = routers[method].match(route)

    if(!result) {
      result = routers.any.match(route)
    }

    if(result) {
      args[0] = extend(req, result)
      result.fn.apply(null, args)
    } else {
      if(typeof noMatch === 'function') {
        noMatch.apply(null, args)

        return
      }

      throw new Error('No match for route: ' + route)
    }
  }

  verbs.forEach(function(verb) {
    routers[verb] = Routes()
    routeFn[verb] = function(pattern, handler) {
      routers[verb].addRoute(pattern, handler)
    }
  })

  return routeFn
}
