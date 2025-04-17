// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_ANON_KEY!
// );

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData();
//     const image = formData.get('image');

//     if (!image) {
//       return new Response('No image provided', { status: 400 });
//     }

//     // Call external API to cartoonify image
//     const response = await fetch('YOUR_CARTOONIFY_API_ENDPOINT', {
//       method: 'POST',
//       body: formData,
//       headers: {
//         'Authorization': `Bearer ${process.env.CARTOONIFY_API_KEY}`,
//       },
//     });

//     const data = await response.json();

//     // Save to database
//     const { data: generation, error } = await supabase
//       .from('generations')
//       .insert({
//         user_id: request.headers.get('user-id'),
//         original_image: image,
//         cartoon_image: data.url,
//       })
//       .select()
//       .single();

//     if (error) throw error;

//     return Response.json({ url: data.url });
//   } catch (error) {
//     console.error('Error processing image:', error);
//     return new Response('Error processing image', { status: 500 });
//   }
// }