## useSession

const {update} = useSession();
call update when you need to forcefully update the session on the client
like for ex when you've registered in the server side route and you have sign ined from signIn
from auth.ts or server file then you need to manually update the session on client.


## issues

1. when active tool is hand tool and when we select a shape then it doesnt work properly and sometimes the shape may get deleted.


## cors
server setting:
1. dont use forward slash after origin urls, the origin has to be exact like https://google.com not http://google.com/
2. always set up the cors middleware before any route handler or any other middleware in the file.
client setting:
1. send credentials: "include" options.