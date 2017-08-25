const qs = (data) => {
    let results = [];
    for (const name in data)
        results.push(`${name}=${encodeURIComponent(data[name])}`);
    return results.join("&");
}

export default (options) => {
  const request = new XMLHttpRequest();
  let aborted = false;
  request.onreadystatechange = () => {
    if (request.readyState !== 4 || aborted) {
      return;
    }

    if (request.status === 200 && !request._hasError && options.success) {
      try {
        options.success(JSON.parse(request.responseText));
      } catch (e) {
        options.error(request, e);
      }
    } else if (options.error) {
      options.error(request, request._response);
    }
  };

  request.open(options.type, options.url);
  request.setRequestHeader('content-type', options.contentType);

  request.send(options.data && qs(options.data));

  return {
    abort: (reason) => {
      aborted = true;
      return request.abort(reason);
    }
  };
}
