import React from 'react';
import API from '../api';
import * as priceengine from './priceengine';

//carousel default settings
export const CarouselDefaultSettings = {
  dots: false,
  arrows: true,
  infinite: false,
  autoplay: false,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 6
};

//an axios utility get call
export const get = (url, asyncFunc) => {
  return dispatch => {
    API.get(url)
            .then(response => {
              dispatch(asyncFunc(response.data));
            });
  };
};

//async action return type
export const async = (type, payload) => {
  return {
    type: type,
    payload: payload
  };
};

//time out promise for contract calls
export const timeoutCall = function (ms, promise) {
  // Create a promise that rejects in <ms> milliseconds
  let timeout = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      reject('Timed out in ' + ms + 'ms.');
    }, ms);
  });

  // Returns a race between our timeout and the passed in promise
  return Promise.race([
    promise,
    timeout
  ])
};

export const isNull = (object) => {
  return object === undefined || object === null;
};

export const nonNull = (object) =>{
  return !isNull(object);
};

export const dispatcher = (dispatch, type, value, error) =>{
  if (nonNull(error)) {
    dispatch(async(type, error));
  } else {
    dispatch(async(type, value));
  }
};

// Generate unique IDs for use as pseudo-private/protected names.
// Similar in concept to
// <http://wiki.ecmascript.org/doku.php?id=strawman:names>.
//
// The goals of this function are twofold:
//
// * Provide a way to generate a string guaranteed to be unique when compared
//   to other strings generated by this function.
// * Make the string complex enough that it is highly unlikely to be
//   accidentally duplicated by hand (this is key if you're using `id`
//   as a private/protected name on an object).
//
// Use:
//
//     var privateName = id();
//     var o = { 'public': 'foo' };
//     o[privateName] = 'bar';
export const id =  () => {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

export const renderCoinAvatars = (coinIds) => {
  let coins = [];

  for (let i = 0; i < coinIds.length; i++){
    coins.push(<img className="avatar dash-logo" key={`coin-${coinIds[i]}`} alt="dash-logo"
                    src={process.env.PUBLIC_URL + `/coin-svg/${priceengine.getCoinSymbol(coinIds[i]).toLowerCase()}.svg`} />)
  }
  return coins;
};