# Ember Service Worker Race

**WARNING: Test this in your local/staging environment before using it in
production**

_An Ember Service Worker plugin that races between cache and network and
returns the first one to resolve, also when the fetch resolves it
updates the cache._

## Installation

```
ember install ember-service-worker-race
```

## Authors

* [Federico Kauffman](http://github.com/fedekau)

## Versioning

This library follows [Semantic Versioning](http://semver.org)

## Inspiration
  * [The offline cookbook](https://jakearchibald.com/2014/offline-cookbook/)
  * [Supercharged: Live Coding Session (Chrome Dev Summit 2016)](https://www.youtube.com/watch?v=X8EQSy-ajo4)

## License

[Licensed under the MIT license](http://www.opensource.org/licenses/mit-license.php)
