export async function onRequest(context) {

  const url = new URL(context.request.url);
  const target = url.searchParams.get("url");

  if (!target) {
    return new Response("Missing url parameter", { status: 400 });
  }

  try {

    const response = await fetch(target);

    const headers = new Headers(response.headers);

    headers.delete("x-frame-options");
    headers.delete("content-security-policy");

    return new Response(response.body, {
      status: response.status,
      headers
    });

  } catch (err) {
    return new Response("Proxy error", { status: 500 });
  }

}
