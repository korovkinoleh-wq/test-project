export async function onRequestGet() {
  try {
    const response = await fetch('https://api.alternative.me/fng/?limit=1', {
      headers: {
        'User-Agent': 'LP-Analytics/1.0',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'upstream_failed', status: response.status }), {
        status: 502,
        headers: { 'content-type': 'application/json; charset=UTF-8' }
      });
    }

    const data = await response.json();
    const item = data?.data?.[0];

    return new Response(JSON.stringify({
      value: item?.value ?? null,
      classification: item?.value_classification ?? null,
      timestamp: item?.timestamp ?? null,
      source: 'Alternative.me'
    }), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=UTF-8',
        'cache-control': 'public, max-age=300'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'fetch_failed' }), {
      status: 502,
      headers: { 'content-type': 'application/json; charset=UTF-8' }
    });
  }
}
