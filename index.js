var Routes = require('routes')
  , url = require('url')

module.exports = createRouter

function createRouter(noMatch) {
  var router = Routes()
    , routeFn

  routeFn = function() {
    var args = [].slice.call(arguments)
      , route = args[0].url || args[0]
      , result

    result = router.match(route)

    if(result) {
      result.fn.apply(result, args)
    } else {
      if(typeof noMatch === 'function') {
        noMatch(route)

        return
      }

      throw new Error('No match for route: ' + route)
    }
  }

  routeFn.add = function(pattern, handler) {
    router.addRoute(pattern, handler)
  }

  return routeFn
}
