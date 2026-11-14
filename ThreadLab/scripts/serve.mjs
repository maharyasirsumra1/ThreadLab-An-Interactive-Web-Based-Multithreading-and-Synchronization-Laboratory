/* Zero-dependency development-only static file server. No backend or API routes. */
import {createServer} from 'node:http';
import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const types={'.html':'text/html;charset=utf-8','.css':'text/css;charset=utf-8','.js':'text/javascript;charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.json':'application/json;charset=utf-8','.ico':'image/x-icon'};
const port=Number(process.env.PORT||5500);
createServer(async(req,res)=>{
  try{
    if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);return res.end('Method not allowed')}
    let target=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    target=path.resolve(root,'.'+target);
    if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403);return res.end('Forbidden')}
    let info=await stat(target).catch(()=>null);
    if(info?.isDirectory()){target=path.join(target,'index.html');info=await stat(target).catch(()=>null)}
    if(!info?.isFile()){res.writeHead(404);return res.end('Not found')}
    res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});
    if(req.method==='HEAD')return res.end();
    createReadStream(target).pipe(res);
  }catch{res.writeHead(400);res.end('Invalid request')}
}).listen(port,'127.0.0.1',()=>console.log(`ThreadLab ready: http://localhost:${port}/`));
