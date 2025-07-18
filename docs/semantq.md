
Section::Dynamic Routing 

Semantiq enables Dynamic routes that carry resource parameters, e.g.g
user/:12/profile

in this case Semantiq will route to user/profile and make parameter 12 available via the componentDataId variable - 

// so you don't need to declare the componentDataId variable - just use it - Semantiq takes care of that   

e.g. to get user data in the given example:

const userId=componentDataId;

async function getUser() {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, email')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('An error occurred:', error);
    return null;
  }

  return data;
}




