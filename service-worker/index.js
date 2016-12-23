import { addFetchListener, PROJECT_REVISION } from 'ember-service-worker/service-worker';

const CACHE_KEY_PREFIX = 'esw-race-';
const CACHE_NAME = `${CACHE_KEY_PREFIX}${PROJECT_REVISION}`;

function invertPromise(promise) {
  return new Promise(
    (resolve, reject) =>
      promise.then(reject, resolve)
  );
}

function raceToSuccess(promises) {
  return invertPromise(
    Promise.all(
      promises.map(invertPromise)));
}

function updateCache(fetchPromise, event) {
  return new Promise((resolve, reject) => {
    try {
      fetchPromise.then((response) => {
        caches.open(CACHE_NAME).then((cache) => {
          console.log('Cache was updated', event.request, response);
          cache.put(event.request, response);
          resolve();
        });
      });
    } catch(_) { reject(); }
  });
}

function fetchCacheRace(fetchedVersion, cachedVersion) {
  return new Promise((resolve, reject) => {
      try {
        raceToSuccess([ cachedVersion, fetchedVersion.catch(_ => cachedVersion) ]).then((response) => {
          if (!response) {
            fetchedVersion.then((r) => {
              return resolve(r);
            });
          } else {
            return resolve(response);
          }
        });

      } catch(_) {
        return reject(new Response(null, {status: 404}));
      }
    });
}

addFetchListener(function(event) {
  const cachedVersion = caches.match(event.request);
  const fetchedVersion = fetch(event.request);
  const fetchedVersionCopy = fetchedVersion.then(response => response.clone());

  event.waitUntil(updateCache(fetchedVersionCopy, event));

  return fetchCacheRace(fetchedVersion, cachedVersion);
});

