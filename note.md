## useSession

const {update} = useSession();
call update when you need to forcefully update the session on the client
like for ex when you've registered in the server side route and you have sign ined from signIn
from auth.ts or server file then you need to manually update the session on client.
