"use server"
const submit = async (data: FormData) => {
    console.log(data.get('email'))
  
}

export {
    submit
}