const buildFetch = (headers: Headers, method: "get" | "post" = "get", body?: { [key: string]: string | number }) => {
  const requestOptions = {
    method,
    headers,
    body: JSON.stringify(body),
  };
  return (endpoint: string) => fetch(`http://ingress-nginx-controller.ingress-nginx.svc.cluster.local${endpoint}`, requestOptions);
};

export default buildFetch;
