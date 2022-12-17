const buildFetch = (headers: Headers, method: "get" | "post" = "get", requestOptions?: RequestInit) => {
  const options = {
    ...requestOptions,
    method,
    headers,
    next: { revalidate: 10 },
  } as RequestInit;
  return <T>(endpoint: string) => fetch(`http://ingress-nginx-controller.ingress-nginx.svc.cluster.local${endpoint}`, options).then((res) => res.json()) as Promise<T>;
};

export default buildFetch;
