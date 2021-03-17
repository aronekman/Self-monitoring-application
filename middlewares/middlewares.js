import { send } from '../deps.js';

const errorMiddleware = async(context, next) => {
    try {
      await next();
    } catch (e) {
      console.log(e);
    }
}

const logMIddleware = async({request, session}, next) => {
  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let id = 'anonymous'
  if (await session.get('authenticated')) {
    id = (await session.get('user')).id
  } 
  console.log(`${time}, ${request.method}, ${request.url.pathname}, ${id}`);
  await next()
}

const limitAccessMiddleware = async(context, next) => { 
  if (context.request.url.pathname == '/' || context.request.url.pathname.startsWith('/auth') || context.request.url.pathname.startsWith('/api')) {
    await next()
  } else {
    if (await context.session.get('authenticated')) {
      await next()
    } else {
      context.response.redirect('/auth/login')
    }
  }
}

const serveStaticFilesMiddleware = async(context, next) => {
  if (context.request.url.pathname.startsWith('/static')) {
    const path = context.request.url.pathname.substring(7);
  
    await send(context, path, {
      root: `${Deno.cwd()}/static`
    });
  
  } else {
    await next();
  }
}

export { errorMiddleware, logMIddleware, limitAccessMiddleware, serveStaticFilesMiddleware }