import axios from "axios";

export async function GET(req: Request) {
    try {
      const url = new URL(req.url);
      const href = url.searchParams.get('url');
      if(!href) {
          return new Response(
             JSON.stringify({
                success: 0,
                message: 'No Url provided.'
             }),
             { status: 400 }
          );
      }
  
      const res = await axios.get(href,{
         headers: {
            'User-Agent' : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
         }
      });
      const titleMatch = res.data.match(/<title>(.*?)<\/title>/);
      const title = titleMatch ? titleMatch[1] : '';
  
      const descriptionMatch = res.data.match(/<meta name="description" content="(.*?)"/);
      const description = descriptionMatch ? descriptionMatch[1] : '';
  
      const imageMatch = res.data.match(/<meta property="og:image" content="(.*?)"/);
      const imageUrl = imageMatch ? imageMatch[1] : '';
      return new Response(
         JSON.stringify({
            success: 1,
            meta: {
              title,
              description,
              image: {
                  url: imageUrl,
              }
            }
         }),
      );
    } catch (error) {
         console.error('Error fetching metadata: ',error);
         return new Response(
            JSON.stringify({
               success: 0,
               message: "Failed to fetch metadata",
            }),
            { status: 500 }
         );
    }
}