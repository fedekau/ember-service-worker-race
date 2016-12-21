import { addFetchListener } from 'ember-service-worker/service-worker';

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

addFetchListener(function(event) {
  const cachedVersion = caches.match(event.request);
  const fetchedVersion = fetch(event.request);

  return raceToSuccess([ cachedVersion, fetchedVersion ]);
});
