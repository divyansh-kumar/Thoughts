import query from '../../../utils/db';
export async function GET() {
  

  try {
    const result = await query(`
      SELECT title, description, image_url, created_at 
      FROM posts 
      ORDER BY created_at DESC
    `)
    
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } 
}